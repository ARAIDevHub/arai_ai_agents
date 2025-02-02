"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenWithParams = createTokenWithParams;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const web3_js_1 = require("@solana/web3.js");
const src_1 = require("../../src");
const nodewallet_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet"));
const anchor_1 = require("@coral-xyz/anchor");
const util_1 = require("../util");
// Directory where keypair files will be stored
const KEYS_FOLDER = __dirname + "/.keys";
// Defines acceptable price slippage of 1% (100 basis points)
const SLIPPAGE_BASIS_POINTS = 100n;
// Modify the main function to accept parameters
async function createTokenWithParams(params) {
    console.log("🚀 Starting PumpFun token creation with params:", params);
    // Load environment variables from root .env file
    dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../../../.env") });
    if (!process.env.HELIUS_RPC_URL) {
        throw new Error("Please set HELIUS_RPC_URL in .env file");
    }
    // Initialize connection to Solana network via Helius RPC
    console.log("📡 Connecting to Helius RPC...");
    let connection = new web3_js_1.Connection(process.env.HELIUS_RPC_URL || "");
    let wallet = new nodewallet_1.default(new web3_js_1.Keypair());
    const provider = new anchor_1.AnchorProvider(connection, wallet, {
        commitment: "finalized",
    });
    // Generate or load existing keypairs
    console.log("🔑 Setting up test account and mint...");
    const testAccount = (0, util_1.getOrCreateKeypair)(KEYS_FOLDER, "test-account");
    const mint = (0, util_1.getOrCreateKeypair)(KEYS_FOLDER, "mint");
    // Initialize PumpFun SDK
    console.log("🛠 Initializing PumpFun SDK...");
    let sdk = new src_1.PumpFunSDK(provider);
    // Verify test account has sufficient SOL balance
    console.log("Checking SOL balance...");
    let currentSolBalance = await connection.getBalance(testAccount.publicKey);
    console.log(`Current SOL balance: ${currentSolBalance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
    const MINIMUM_SOL_BALANCE = 0.01 * web3_js_1.LAMPORTS_PER_SOL; // 0.05 SOL
    if (currentSolBalance < MINIMUM_SOL_BALANCE) {
        throw new Error(`Insufficient SOL balance. Please send at least 0.01 SOL to: ${testAccount.publicKey.toBase58()}`);
    }
    // Check for existing bonding curve
    let boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
    console.log("Checking for existing bonding curve...");
    console.log(`Bounding curve account: ${boundingCurveAccount ? "exists" : "does not exist"}`);
    if (!boundingCurveAccount) {
        // Create token metadata using passed parameters
        let tokenMetadata = {
            name: params.name,
            symbol: params.symbol,
            description: params.description,
            twitter: params.twitter || "",
            telegram: params.telegram || "",
            website: params.website || "",
            file: await fs_1.default.openAsBlob(params.imagePath || path_1.default.join(__dirname, "random.png")),
        };
        console.log("Creating token metadata...");
        console.log(`Token metadata: ${JSON.stringify(tokenMetadata, null, 2)}`);
        // Calculate buy amount in lamports
        const buyAmount = BigInt(params.initialBuyAmount * web3_js_1.LAMPORTS_PER_SOL);
        console.log("Calculating buy amount...");
        console.log(`Buy amount: ${buyAmount} lamports`);
        // Create bonding curve with passed parameters
        let createResults = await sdk.createAndBuy(testAccount, mint, tokenMetadata, buyAmount, SLIPPAGE_BASIS_POINTS, {
            unitLimit: params.unitLimit,
            unitPrice: params.unitPrice,
        });
        console.log("Token creation results:", createResults);
        console.log("Token creation success:", createResults.success);
        console.log("Success:", `https://pump.fun/${mint.publicKey.toBase58()}`);
        if (createResults.success) {
            return {
                success: true,
                mintAddress: mint.publicKey.toBase58(),
                transaction: createResults,
                url: `https://pump.fun/${mint.publicKey.toBase58()}`
            };
        }
        else {
            throw new Error("Token creation failed");
        }
    }
    else {
        console.log("💰 Executing buy transaction...");
        let buyResults = await sdk.buy(testAccount, mint.publicKey, BigInt(params.initialBuyAmount * web3_js_1.LAMPORTS_PER_SOL), SLIPPAGE_BASIS_POINTS, {
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
    }
}
// Keep the original main() for direct script execution
const main = async () => {
    // Use default parameters when running directly
    console.log("🏁 Starting main execution...");
    await createTokenWithParams({
        name: "TST-7",
        symbol: "TST-7",
        description: "TST-7: This is a test token",
        unitLimit: 250000,
        unitPrice: 250000,
        initialBuyAmount: 0.0001
    });
};
// Only run main() directly if this file is being executed directly
if (require.main === module) {
    console.log("🏁 Starting main execution...");
    main().catch((error) => {
        console.error("❌ Error in main execution:", error);
    });
}
