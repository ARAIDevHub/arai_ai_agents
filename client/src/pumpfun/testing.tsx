// npm i pumpdotfun-sdk

import dotenv from "dotenv";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { DEFAULT_DECIMALS, PumpFunSDK } from "pumpdotfun-sdk";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  getOrCreateKeypair,
  getSPLBalance,
  printSOLBalance,
  printSPLBalance,
} from "./util";

dotenv.config();

const KEYS_FOLDER = __dirname + "/.keys";
const SLIPPAGE_BASIS_POINTS = 100n;

const getProvider = () => {
  if (!process.env.HELIUS_RPC_URL) {
    throw new Error("Please set HELIUS_RPC_URL in .env file");
  }

  const connection = new Connection(process.env.HELIUS_RPC_URL || "");
  const wallet = new NodeWallet(new Keypair());
  return new AnchorProvider(connection, wallet, { commitment: "finalized" });
};

const createAndBuyToken = async (sdk, testAccount, mint) => {
  const tokenMetadata = {
    name: "TST-7",
    symbol: "TST-7",
    description: "TST-7: This is a test token",
    filePath: "example/basic/random.png",
  };

  const createResults = await sdk.createAndBuy(
    testAccount,
    mint,
    tokenMetadata,
    BigInt(0.0001 * LAMPORTS_PER_SOL),
    SLIPPAGE_BASIS_POINTS,
    {
      unitLimit: 250000,
      unitPrice: 250000,
    }
  );

  if (createResults.success) {
    console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
    printSPLBalance(sdk.connection, mint.publicKey, testAccount.publicKey);
  } else {
    console.log("Create and Buy failed");
  }
};

const buyTokens = async (sdk, testAccount, mint) => {
  const buyResults = await sdk.buy(
    testAccount,
    mint.publicKey,
    BigInt(0.0001 * LAMPORTS_PER_SOL),
    SLIPPAGE_BASIS_POINTS,
    {
      unitLimit: 250000,
      unitPrice: 250000,
    }
  );

  if (buyResults.success) {
    printSPLBalance(sdk.connection, mint.publicKey, testAccount.publicKey);
    console.log("Bonding curve after buy", await sdk.getBondingCurveAccount(mint.publicKey));
  } else {
    console.log("Buy failed");
  }
};

const sellTokens = async (sdk, testAccount, mint) => {
  const currentSPLBalance = await getSPLBalance(
    sdk.connection,
    mint.publicKey,
    testAccount.publicKey
  );
  console.log("currentSPLBalance", currentSPLBalance);

  if (currentSPLBalance) {
    const sellResults = await sdk.sell(
      testAccount,
      mint.publicKey,
      BigInt(currentSPLBalance * Math.pow(10, DEFAULT_DECIMALS)),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 250000,
        unitPrice: 250000,
      }
    );

    if (sellResults.success) {
      await printSOLBalance(sdk.connection, testAccount.publicKey, "Test Account keypair");
      printSPLBalance(sdk.connection, mint.publicKey, testAccount.publicKey, "After SPL sell all");
      console.log("Bonding curve after sell", await sdk.getBondingCurveAccount(mint.publicKey));
    } else {
      console.log("Sell failed");
    }
  }
};

const main = async () => {
  try {
    const provider = getProvider();
    const sdk = new PumpFunSDK(provider);
    const connection = provider.connection;

    const testAccount = getOrCreateKeypair(KEYS_FOLDER, "test-account");
    const mint = getOrCreateKeypair(KEYS_FOLDER, "mint");

    await printSOLBalance(connection, testAccount.publicKey, "Test Account keypair");

    const globalAccount = await sdk.getGlobalAccount();
    console.log(globalAccount);

    const currentSolBalance = await connection.getBalance(testAccount.publicKey);
    if (currentSolBalance === 0) {
      console.log("Please send some SOL to the test-account:", testAccount.publicKey.toBase58());
      return;
    }

    console.log(await sdk.getGlobalAccount());

    let bondingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
    if (!bondingCurveAccount) {
      await createAndBuyToken(sdk, testAccount, mint);
      bondingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
    }

    if (bondingCurveAccount) {
      await buyTokens(sdk, testAccount, mint);
      await sellTokens(sdk, testAccount, mint);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

main();