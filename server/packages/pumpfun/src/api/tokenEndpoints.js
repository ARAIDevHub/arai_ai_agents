"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pumpfun_1 = require("../pumpfun");
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const nodewallet_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
const SLIPPAGE_BASIS_POINTS = 100n;
// Prepare token endpoint with file upload
router.post('/prepare-token', upload.single('file'), async (req, res) => {
    try {
        const { tokenName, tokenSymbol, tokenDescription, solAmount, website, xLink, telegram, } = req.body;
        if (!req.file) {
            throw new Error('No image file provided');
        }
        if (!process.env.HELIUS_RPC_URL) {
            throw new Error("HELIUS_RPC_URL not configured");
        }
        // Initialize SDK
        const connection = new web3_js_1.Connection(process.env.HELIUS_RPC_URL);
        const wallet = new nodewallet_1.default(new web3_js_1.Keypair());
        const provider = new anchor_1.AnchorProvider(connection, wallet, {
            commitment: "finalized"
        });
        const sdk = new pumpfun_1.PumpFunSDK(provider);
        // Create token metadata
        const tokenMetadata = {
            name: tokenName,
            symbol: tokenSymbol,
            description: tokenDescription,
            file: req.file.buffer,
            website: website || "",
            twitter: xLink || "",
            telegram: telegram || ""
        };
        // Upload metadata to IPFS
        const metadataResponse = await sdk.createTokenMetadata(tokenMetadata);
        if (!metadataResponse || !metadataResponse.url) {
            throw new Error("Failed to upload metadata to IPFS");
        }
        res.json({
            success: true,
            metadata: {
                ...tokenMetadata,
                uri: metadataResponse.url
            },
            solAmount: BigInt(parseFloat(solAmount) * web3_js_1.LAMPORTS_PER_SOL).toString(),
            slippage: SLIPPAGE_BASIS_POINTS.toString(),
            unitParams: {
                unitLimit: 250000,
                unitPrice: 250000,
            }
        });
    }
    catch (error) {
        console.error('Error preparing token:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
// Verify transaction endpoint
router.get('/verify-transaction/:signature', async (req, res) => {
    try {
        const { signature } = req.params;
        const connection = new web3_js_1.Connection(process.env.HELIUS_RPC_URL);
        const status = await connection.getSignatureStatus(signature);
        res.json({
            success: status?.value?.confirmationStatus === 'finalized',
            status: status?.value
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
exports.default = router;
