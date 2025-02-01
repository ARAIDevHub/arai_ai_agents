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

const KEYS_FOLDER = __dirname + "/.keys";
const SLIPPAGE_BASIS_POINTS = 100n;

//create token example:
//https://solscan.io/tx/bok9NgPeoJPtYQHoDqJZyRDmY88tHbPcAk1CJJsKV3XEhHpaTZhUCG3mA9EQNXcaUfNSgfPkuVbEsKMp6H7D9NY
//devnet faucet
//https://faucet.solana.com/

const main = async () => {
  console.log("🚀 Starting PumpFun basic example...");
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });

  console.log("Environment variables loaded:", {
    HELIUS_RPC_URL: process.env.HELIUS_RPC_URL || "not found"
  });

  if (!process.env.HELIUS_RPC_URL) {
    console.error("Please set HELIUS_RPC_URL in .env file");
    console.error(
      "Example: HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=<your api key>"
    );
    console.error("Get one at: https://www.helius.dev");
    return;
  }

  console.log("📡 Connecting to Helius RPC...");
  let connection = new Connection(process.env.HELIUS_RPC_URL || "");
  console.log("\n")


  let wallet = new NodeWallet(new Keypair()); //note this is not used
  console.log("Wallet:", wallet); 
  console.log("Wallet's public key:", wallet.publicKey.toBase58());
  console.log("\n")
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });

  console.log("🔑 Setting up test account and mint...");
  console.log("\n")

  const testAccount = getOrCreateKeypair(KEYS_FOLDER, "test-account");
  const mint = getOrCreateKeypair(KEYS_FOLDER, "mint");
  console.log("Test Account:", testAccount.publicKey.toBase58());
  console.log("\n")

  console.log("Mint Address:", mint.publicKey.toBase58());
  console.log("\n")
  await printSOLBalance(
    connection,
    testAccount.publicKey,
    "Test Account keypair"
  );

  console.log("🛠 Initializing PumpFun SDK...");
  let sdk = new PumpFunSDK(provider);

  let globalAccount = await sdk.getGlobalAccount();
  console.log("📊 Global Account State:", globalAccount);

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
  //Check if mint already exists
  console.log("🔍 Checking if bonding curve exists for mint...");
  console.log("\n")
  let boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
  if (!boundingCurveAccount) {
    console.log("📝 Creating new bonding curve and buying initial tokens...");
    let tokenMetadata = {
      name: "TST-7",
      symbol: "TST-7",
      description: "TST-7: This is a test token",
      file: await fs.openAsBlob(path.join(__dirname, "random.png")),
    };
    console.log("Token Metadata:", tokenMetadata);

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
    console.log("📈 Found existing bonding curve:");
    console.log(boundingCurveAccount);
    console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
    printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
  }

  if (boundingCurveAccount) {
    console.log("💰 Executing buy transaction...");
    let buyResults = await sdk.buy(
      testAccount,
      mint.publicKey,
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      },
    );

    if (buyResults.success) {
      console.log("✅ Buy transaction successful!");
      console.log("Buy Results:", buyResults);
      printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
      console.log("Bonding curve after buy", await sdk.getBondingCurveAccount(mint.publicKey));
    } else {
      console.log("❌ Buy transaction failed");
    }

    //sell all tokens
    let currentSPLBalance = await getSPLBalance(
      connection,
      mint.publicKey,
      testAccount.publicKey
    );
    console.log("💎 Current SPL Balance:", currentSPLBalance);
    if (currentSPLBalance) {
      console.log("💱 Executing sell all transaction...");
      let sellResults = await sdk.sell(
        testAccount,
        mint.publicKey,
        BigInt(currentSPLBalance * Math.pow(10, DEFAULT_DECIMALS)),
        SLIPPAGE_BASIS_POINTS,
        {
          unitLimit: 250000,
          unitPrice: 250000,
        },
      );
      if (sellResults.success) {
        console.log("✅ Sell transaction successful!");
        console.log("Sell Results:", sellResults);
        await printSOLBalance(
          connection,
          testAccount.publicKey,
          "Test Account keypair"
        );

        printSPLBalance(connection, mint.publicKey, testAccount.publicKey, "After SPL sell all");
        console.log("Bonding curve after sell", await sdk.getBondingCurveAccount(mint.publicKey));
      } else {
        console.log("❌ Sell transaction failed");
      }
    }
  }
};

console.log("🏁 Starting main execution...");
main().catch((error) => {
  console.error("❌ Error in main execution:", error);
});
