import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { DEFAULT_DECIMALS, PumpFunSDK } from "./src";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  getOrCreateKeypair,
  getSPLBalance,
  printSOLBalance,
  printSPLBalance,
} from "./example/util";
import CryptoJS from 'crypto-js';
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import fetch from 'node-fetch';

// Directory where keypair files will be stored
const KEYS_FOLDER = __dirname + "/.keys";
// Defines acceptable price slippage of 1% (100 basis points)
const SLIPPAGE_BASIS_POINTS = 100n;

// Define an interface for the token creation parameters
interface TokenCreationParams {
  name: string;
  symbol: string;
  description: string;
  unitLimit: number;
  unitPrice: number;
  initialBuyAmount: number;
  imagePath?: string;
  twitter?: string;
  telegram?: string;
  website?: string;
}

// Function to download image from URL and save it locally
async function downloadImage(url: string, outputPath: string): Promise<void> {
  console.log(`🔍 [downloadImage] Fetching image from URL: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${url}`);
  }
  console.log(`✅ [downloadImage] Image fetched successfully from URL: ${url}`);
  const buffer = await response.buffer();
  fs.writeFileSync(outputPath, buffer);
  console.log(`📥 [downloadImage] Image downloaded and saved to ${outputPath}`);
}

// Modify the main function to accept parameters
export async function createTokenWithParams(params: TokenCreationParams, encryptedWalletRows: string) {
  console.log("🚀 [createToken.ts] Starting PumpFun token creation with params:", params);

  // Get the secret key from the environment variables
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error("Secret key is not set");
  }

  // Decrypt the encryptedWalletRows
  const decryptedWalletRowsString = CryptoJS.AES.decrypt(encryptedWalletRows, secretKey).toString(CryptoJS.enc.Utf8);

  let decryptedWalletRows;
  try {
    decryptedWalletRows = JSON.parse(decryptedWalletRowsString);
  } catch (error: any) {
    throw new Error("Failed to parse decrypted wallet rows: " + error.message);
  }

  if (!Array.isArray(decryptedWalletRows) || decryptedWalletRows.length === 0 || !decryptedWalletRows[0].privateKey) {
    throw new Error("Decrypted wallet rows are not in the expected format or are empty");
  }

  // Create a dev wallet from the first row
  const devWallet = Keypair.fromSecretKey(bs58.decode(decryptedWalletRows[0].privateKey));
  const initialBuyAmount = decryptedWalletRows[0].buyAmount;

  const buyAmount = BigInt(decryptedWalletRows[0].buyAmount * LAMPORTS_PER_SOL);

  // Load environment variables from root .env file
  dotenv.config({ path: path.resolve(__dirname, "../../../../../.env") });

  if (!process.env.HELIUS_RPC_URL) {
    throw new Error("Please set HELIUS_RPC_URL in .env file");
  }

  // Initialize connection to Solana network via Helius RPC
  console.log("📡 [createToken.ts] Connecting to Helius RPC...");
  let connection = new Connection(process.env.HELIUS_RPC_URL || "");

  let wallet = new NodeWallet(new Keypair());
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });

  // Create a new keypair each time
  const mint = Keypair.generate();
  console.log("🔑 [createToken.ts] The mint address is", mint.publicKey.toBase58())

  
  // Initialize PumpFun SDK
  console.log("🛠 [createToken.ts] Initializing PumpFun SDK...");
  let sdk = new PumpFunSDK(provider);

  // Verify test account has sufficient SOL balance
  console.log("💰 [createToken.ts] Checking SOL balance...");
  let currentSolBalance = await connection.getBalance(devWallet.publicKey);
  console.log(`Current SOL balance: ${currentSolBalance / LAMPORTS_PER_SOL} SOL`);
  const MINIMUM_SOL_BALANCE = 0.01 * LAMPORTS_PER_SOL; // 0.05 SOL
  if (currentSolBalance < MINIMUM_SOL_BALANCE) {
    throw new Error(
      `Insufficient SOL balance. Please send at least 0.01 SOL to: ${devWallet.publicKey.toBase58()}`
    );
  }

  // Check for existing bonding curve
  let boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
  console.log("🔍 [createToken.ts] Checking for existing bonding curve...");
  console.log(`Bounding curve account: ${boundingCurveAccount ? "exists" : "does not exist"}`);


  
  if (!boundingCurveAccount) {
    let imagePath = params.imagePath;
    if (imagePath && imagePath.startsWith('http')) {
      const outputPath = path.join(__dirname, 'downloaded_image.jpg');
      console.log(`🔍 [createToken.ts] Image path is a URL, downloading image...`);
      await downloadImage(imagePath, outputPath);
      imagePath = outputPath;
    }

    // Create token metadata using passed parameters
    let tokenMetadata = {
      name: params.name,
      symbol: params.symbol,
      description: "Created with ARAI AI Agents - " + params.description,
      twitter: params.twitter || "",
      telegram: params.telegram || "",
      website: params.website || "",
      file: new Blob([fs.readFileSync(params.imagePath || path.join(__dirname, "random.png"))]),
    };
    console.log("🔍 [createToken.ts] Creating token metadata...");
    console.log(`Token metadata: ${JSON.stringify(tokenMetadata, null, 2)}`);
    // Calculate buy amount in lamports
    // const buyAmount = BigInt(params.initialBuyAmount * LAMPORTS_PER_SOL);
    // console.log("🔍 [createToken.ts] Calculating buy amount...");
    // console.log(`Buy amount: ${buyAmount} lamports`);

    console.log("Creating the buy with the following parameters:")
    console.log("Dev wallet:", devWallet)
    console.log("Mint:", mint)
    console.log("Token metadata:", tokenMetadata)
    console.log("Buy amount:", buyAmount)
    console.log("Slippage basis points:", SLIPPAGE_BASIS_POINTS)
    

    // Create bonding curve with passed parameters
    let createResults = await sdk.createAndBuy(
      devWallet,
      mint,
      tokenMetadata,
      buyAmount,
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: params.unitLimit,
        unitPrice: params.unitPrice,
      },
    );

    if (createResults.success) {

      console.log("💰 [createToken.ts] Token creation success:", createResults.success);
      console.log("💰 [createToken.ts] Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
      return {
        success: true,
        mintAddress: mint.publicKey.toBase58(),
        transaction: createResults,
        url: `https://pump.fun/${mint.publicKey.toBase58()}`
      };
    } else {
      throw new Error("Token creation failed");
    }
  } else {
    console.log("💰 [createToken.ts]  Executing buy transaction...");
    let buyResults = await sdk.buy(
      devWallet,
      mint.publicKey,
      BigInt(initialBuyAmount * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

    if (buyResults.success) {
      console.log("✅ Buy transaction successful!");
      console.log("Buy Results:", buyResults);
      await printSPLBalance(connection, mint.publicKey, devWallet.publicKey);
      console.log("Bonding curve after buy", await sdk.getBondingCurveAccount(mint.publicKey));
      
      // Return the buy results
      return {
        success: true,
        mintAddress: mint.publicKey.toBase58(),
        transaction: buyResults,
        url: `https://pump.fun/${mint.publicKey.toBase58()}`
      };
    } else {
      console.log("❌ Buy transaction failed");
      throw new Error("Buy transaction failed");
    }
  }
}

// Keep the original main() for direct script execution
const main = async () => {
  // Use default parameters when running directly
  console.log("🏁 Starting main execution...");
};

// Only run main() directly if this file is being executed directly
if (require.main === module) {
  console.log("🏁 Starting main execution...");
  main().catch((error) => {
    console.error("❌ Error in main execution:", error);
  });
}