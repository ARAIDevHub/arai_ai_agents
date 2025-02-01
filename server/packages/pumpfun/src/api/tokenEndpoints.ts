import express, { Request, Response } from 'express';
import { PumpFunSDK } from '../pumpfun';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import multer from 'multer';
import { TokenMetadata } from '../types';

const router = express.Router();
const upload = multer();
const SLIPPAGE_BASIS_POINTS = 100n;

interface CreateTokenRequest {
    tokenName: string;
    tokenSymbol: string;
    tokenDescription: string;
    solAmount: string;
    image: string;
    website?: string;
    xLink?: string;
    telegram?: string;
    walletAddress: string;
}

// Prepare token endpoint with file upload
router.post('/prepare-token', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const {
            tokenName,
            tokenSymbol,
            tokenDescription,
            solAmount,
            website,
            xLink,
            telegram,
        } = req.body;

        if (!req.file) {
            throw new Error('No image file provided');
        }

        if (!process.env.HELIUS_RPC_URL) {
            throw new Error("HELIUS_RPC_URL not configured");
        }

        // Initialize SDK
        const connection = new Connection(process.env.HELIUS_RPC_URL);
        const wallet = new NodeWallet(new Keypair());
        const provider = new AnchorProvider(connection, wallet, {
            commitment: "finalized"
        });
        
        const sdk = new PumpFunSDK(provider);

        // Create token metadata
        const tokenMetadata: TokenMetadata = {
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
            solAmount: BigInt(parseFloat(solAmount) * LAMPORTS_PER_SOL).toString(),
            slippage: SLIPPAGE_BASIS_POINTS.toString(),
            unitParams: {
                unitLimit: 250000,
                unitPrice: 250000,
            }
        });

    } catch (error: any) {
        console.error('Error preparing token:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Verify transaction endpoint
router.get('/verify-transaction/:signature', async (req: Request, res: Response) => {
    try {
        const { signature } = req.params;
        const connection = new Connection(process.env.HELIUS_RPC_URL!);
        
        const status = await connection.getSignatureStatus(signature);
        
        res.json({
            success: status?.value?.confirmationStatus === 'finalized',
            status: status?.value
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router; 