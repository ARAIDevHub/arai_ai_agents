"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const web3_js_1 = require("@solana/web3.js");
const src_1 = require("../../src");
const nodewallet_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet"));
const anchor_1 = require("@coral-xyz/anchor");
const util_1 = require("../util");
const KEYS_FOLDER = __dirname + "/.keys";
const SLIPPAGE_BASIS_POINTS = 100n;
//create token example:
//https://solscan.io/tx/bok9NgPeoJPtYQHoDqJZyRDmY88tHbPcAk1CJJsKV3XEhHpaTZhUCG3mA9EQNXcaUfNSgfPkuVbEsKMp6H7D9NY
//devnet faucet
//https://faucet.solana.com/
/**
 * Main function that demonstrates the PumpFun SDK functionality
 * - Creates/loads a test account
 * - Creates a new token or interacts with existing one
 * - Performs buy and sell operations
 */
const main = async () => {
    console.log("🚀 Starting PumpFun basic example...");
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../../../.env") });
    console.log("Environment variables loaded:", {
        HELIUS_RPC_URL: process.env.HELIUS_RPC_URL || "not found"
    });
    if (!process.env.HELIUS_RPC_URL) {
        console.error("Please set HELIUS_RPC_URL in .env file");
        console.error("Example: HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=<your api key>");
        console.error("Get one at: https://www.helius.dev");
        return;
    }
    console.log("📡 Connecting to Helius RPC...");
    let connection = new web3_js_1.Connection(process.env.HELIUS_RPC_URL || "");
    console.log("\n");
    let wallet = new nodewallet_1.default(new web3_js_1.Keypair()); //note this is not used
    console.log("Wallet:", wallet);
    console.log("Wallet's public key:", wallet.publicKey.toBase58());
    console.log("\n");
    const provider = new anchor_1.AnchorProvider(connection, wallet, {
        commitment: "finalized",
    });
    console.log("🔑 Setting up test account and mint...");
    console.log("\n");
    const testAccount = (0, util_1.getOrCreateKeypair)(KEYS_FOLDER, "test-account");
    const mint = (0, util_1.getOrCreateKeypair)(KEYS_FOLDER, "mint");
    console.log("Test Account:", testAccount.publicKey.toBase58());
    console.log("\n");
    console.log("Mint Address:", mint.publicKey.toBase58());
    console.log("\n");
    await (0, util_1.printSOLBalance)(connection, testAccount.publicKey, "Test Account keypair");
    console.log("🛠 Initializing PumpFun SDK...");
    let sdk = new src_1.PumpFunSDK(provider);
    let globalAccount = await sdk.getGlobalAccount();
    console.log("📊 Global Account State:", globalAccount);
    let currentSolBalance = await connection.getBalance(testAccount.publicKey);
    if (currentSolBalance == 0) {
        console.log("Please send some SOL to the test-account:", testAccount.publicKey.toBase58());
        return;
    }
    console.log(await sdk.getGlobalAccount());
    console.log("\n");
    //Check if mint already exists
    console.log("🔍 Checking if bonding curve exists for mint...");
    console.log("\n");
    let boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
    if (!boundingCurveAccount) {
        console.log("📝 Creating new bonding curve and buying initial tokens...");
        let tokenMetadata = {
            name: "TST-7",
            symbol: "TST-7",
            description: "TST-7: This is a test token",
            file: await fs_1.default.openAsBlob(path_1.default.join(__dirname, "random.png")),
        };
        console.log("Token Metadata:", tokenMetadata);
        let createResults = await sdk.createAndBuy(testAccount, mint, tokenMetadata, BigInt(0.0001 * web3_js_1.LAMPORTS_PER_SOL), SLIPPAGE_BASIS_POINTS, {
            unitLimit: 250000,
            unitPrice: 250000,
        });
        if (createResults.success) {
            console.log("✅ Create and buy transaction successful!");
            console.log("\n");
            console.log("Transaction Results:", createResults);
            console.log("\n");
            console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
            console.log("\n");
            boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
            console.log("Bonding curve after create and buy", boundingCurveAccount);
            console.log("\n");
            (0, util_1.printSPLBalance)(connection, mint.publicKey, testAccount.publicKey);
        }
    }
    else {
        console.log("📈 Found existing bonding curve:");
        console.log(boundingCurveAccount);
        console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
        (0, util_1.printSPLBalance)(connection, mint.publicKey, testAccount.publicKey);
    }
    if (boundingCurveAccount) {
        console.log("💰 Executing buy transaction...");
        let buyResults = await sdk.buy(testAccount, mint.publicKey, BigInt(0.0001 * web3_js_1.LAMPORTS_PER_SOL), SLIPPAGE_BASIS_POINTS, {
            unitLimit: 250000,
            unitPrice: 250000,
        });
        if (buyResults.success) {
            console.log("✅ Buy transaction successful!");
            console.log("Buy Results:", buyResults);
            (0, util_1.printSPLBalance)(connection, mint.publicKey, testAccount.publicKey);
            console.log("Bonding curve after buy", await sdk.getBondingCurveAccount(mint.publicKey));
        }
        else {
            console.log("❌ Buy transaction failed");
        }
        //sell all tokens
        let currentSPLBalance = await (0, util_1.getSPLBalance)(connection, mint.publicKey, testAccount.publicKey);
        console.log("💎 Current SPL Balance:", currentSPLBalance);
        if (currentSPLBalance) {
            console.log("💱 Executing sell all transaction...");
            let sellResults = await sdk.sell(testAccount, mint.publicKey, BigInt(currentSPLBalance * Math.pow(10, src_1.DEFAULT_DECIMALS)), SLIPPAGE_BASIS_POINTS, {
                unitLimit: 250000,
                unitPrice: 250000,
            });
            if (sellResults.success) {
                console.log("✅ Sell transaction successful!");
                console.log("Sell Results:", sellResults);
                await (0, util_1.printSOLBalance)(connection, testAccount.publicKey, "Test Account keypair");
                (0, util_1.printSPLBalance)(connection, mint.publicKey, testAccount.publicKey, "After SPL sell all");
                console.log("Bonding curve after sell", await sdk.getBondingCurveAccount(mint.publicKey));
            }
            else {
                console.log("❌ Sell transaction failed");
            }
        }
    }
};
console.log("🏁 Starting main execution...");
main().catch((error) => {
    console.error("❌ Error in main execution:", error);
});
