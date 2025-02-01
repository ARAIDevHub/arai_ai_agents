import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { DEFAULT_DECIMALS, PumpFunSDK } from "../../src";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  getOrCreateKeypair,
  getSPLBalance,
  printSOLBalance,
  printSPLBalance,
} from "../util";

// Directory where keypair files will be stored
const KEYS_FOLDER = __dirname + "/.keys";
// Defines acceptable price slippage of 1% (100 basis points)
const SLIPPAGE_BASIS_POINTS = 100n;

const main = async () => {
  console.log("🚀 Starting PumpFun basic example...");
  // Load environment variables from root .env file
  dotenv.config({ path: path.resolve(__dirname, "../../../../../.env") });

  // Validate that required Helius RPC URL is present
  console.log("Environment variables loaded:", {
    HELIUS_RPC_URL: process.env.HELIUS_RPC_URL || "not found"
  });

  // Exit if Helius RPC URL is missing
  if (!process.env.HELIUS_RPC_URL) {
    console.error("Please set HELIUS_RPC_URL in .env file");
    console.error(
      "Example: HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=<your api key>"
    );
    console.error("Get one at: https://www.helius.dev");
    return;
  }

  // Initialize connection to Solana network via Helius RPC
  console.log("📡 Connecting to Helius RPC...");
  let connection = new Connection(process.env.HELIUS_RPC_URL || "");
  console.log("\n")

  // Create a temporary wallet - this is only used for SDK initialization
  // Actual transactions will use the testAccount
  let wallet = new NodeWallet(new Keypair());
  console.log("Wallet:", wallet); 
  console.log("Wallet's public key:", wallet.publicKey.toBase58());
  console.log("\n")
  
  // Initialize Anchor provider with our connection and wallet
  // Uses 'finalized' commitment for maximum transaction certainty
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });

  // Generate or load existing keypairs for our test account and token mint
  console.log("🔑 Setting up test account and mint...");
  console.log("\n")

  // testAccount will be used to sign transactions and hold tokens
  const testAccount = getOrCreateKeypair(KEYS_FOLDER, "test-account");
  // mint keypair represents the token we'll create
  const mint = getOrCreateKeypair(KEYS_FOLDER, "mint");
  console.log("Test Account:", testAccount.publicKey.toBase58());
  console.log("\n")

  console.log("Mint Address:", mint.publicKey.toBase58());
  console.log("\n")
  
  // Display current SOL balance of test account
  await printSOLBalance(
    connection,
    testAccount.publicKey,
    "Test Account keypair"
  );

  // Initialize PumpFun SDK with our provider
  console.log("🛠 Initializing PumpFun SDK...");
  let sdk = new PumpFunSDK(provider);

  // Fetch and display global PumpFun protocol state
  let globalAccount = await sdk.getGlobalAccount();
  console.log("📊 Global Account State:", globalAccount);

  // Verify test account has SOL balance for transactions
  let currentSolBalance = await connection.getBalance(testAccount.publicKey);
  if (currentSolBalance == 0) {
    console.log(
      "Please send some SOL to the test-account:",
      testAccount.publicKey.toBase58()
    );
    return;
  }

  console.log(await sdk.getGlobalAccount());
  console.log("\n")
  
  // Check if a bonding curve already exists for this mint
  console.log("🔍 Checking if bonding curve exists for mint...");
  console.log("\n")
  let boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
  
  if (!boundingCurveAccount) {
    // If no bonding curve exists, create one and perform initial token purchase
    console.log("📝 Creating new bonding curve and buying initial tokens...");
    
    // Define metadata for the new token
    let tokenMetadata = {
      name: "TST-7",
      symbol: "TST-7",
      description: "TST-7: This is a test token",
      file: await fs.openAsBlob(path.join(__dirname, "random.png")), // Token image
    };
    console.log("Token Metadata:", tokenMetadata);

    // Create bonding curve and execute first buy
    // Amount: 0.0001 SOL
    // Parameters: 250k unit limit, 250k lamports per unit price
    let createResults = await sdk.createAndBuy(
      testAccount,
      mint,
      tokenMetadata,
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

    if (createResults.success) {
      // If creation successful, display results and fetch updated state
      console.log("✅ Create and buy transaction successful!");
      console.log("\n")
      console.log("Transaction Results:", createResults);
      console.log("\n")
      console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
      console.log("\n")
      boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
      console.log("Bonding curve after create and buy", boundingCurveAccount);
      console.log("\n")
      printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
    }
  } else {
    // If bonding curve exists, display current state
    console.log("📈 Found existing bonding curve:");
    console.log(boundingCurveAccount);
    console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
    printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
  }

  if (boundingCurveAccount) {
    // Execute an additional token purchase if bonding curve exists
    console.log("💰 Executing buy transaction...");
    let buyResults = await sdk.buy(
      testAccount,
      mint.publicKey,
      BigInt(0.0001 * LAMPORTS_PER_SOL), // Buy amount: 0.0001 SOL
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

    if (buyResults.success) {
      // If buy successful, display results and updated balances
      console.log("✅ Buy transaction successful!");
      console.log("Buy Results:", buyResults);
      printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
      console.log("Bonding curve after buy", await sdk.getBondingCurveAccount(mint.publicKey));
    } else {
      console.log("❌ Buy transaction failed");
    }
  }
};

export async function createTokenWithParams() {
  // ... existing main() function code ...
}

// Only run main() directly if this file is being executed directly
if (require.main === module) {
  console.log("🏁 Starting main execution...");
  main().catch((error) => {
    console.error("❌ Error in main execution:", error);
  });
}
