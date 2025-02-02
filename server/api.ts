import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createTokenWithParams } from './packages/pumpfun/example/basic/createToken';
import path from 'path';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Keypair } from '@solana/web3.js';

// Update the interface to match the full returned object
interface TokenCreationResult {
  testAccount: Keypair;
  mint: Keypair;
  tokenMetadata: {
    name: string;
    symbol: string;
    description: string;
    twitter?: string;
    telegram?: string;
    website?: string;
    file: Blob;
  };
  buyAmount: bigint;
  slippageBasisPoints: bigint;
  unitLimit?: number;
  unitPrice?: number;
}

const app = express();
const upload = multer({ dest: 'temp/' });

// Configure CORS and JSON parsing
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

// Token creation endpoints (TypeScript)
app.post('/api/create-token', upload.single('file'), async (req, res) => {
  try {
    console.log('=== Starting Token Creation Process ===');
    console.log('Received file:', req.file);
    console.log('Received body:', req.body);

    const imagePath = req.file ? req.file.path : path.join(__dirname, 'packages/pumpfun/example/basic/random.png');

    const result = await createTokenWithParams({
      name: req.body.name,
      symbol: req.body.symbol,
      description: req.body.description,
      unitLimit: parseFloat(req.body.unitLimit) || 1000000,
      unitPrice: parseFloat(req.body.unitPrice) || 0,
      initialBuyAmount: parseFloat(req.body.initialBuyAmount) || 0,
      imagePath,
      twitter: req.body.twitter || '',
      telegram: req.body.telegram || '',
      website: req.body.website || '',
      wallet: req.body.wallet,
    }) as TokenCreationResult;

    // Clean up temporary file
    if (!result) {
      throw new Error('Token creation failed - no result returned');
    }

    // Update the serialization to use the public secretKey property
    const serializedResult = {
      testAccount: Buffer.from(result.testAccount.secretKey).toString('base64'),
      mint: Buffer.from(result.mint.secretKey).toString('base64'),
      tokenMetadata: {
        ...result.tokenMetadata,
        file: await result.tokenMetadata.file.slice().arrayBuffer().then(buffer => 
          Buffer.from(buffer).toString('base64')
        )
      },
      buyAmount: result.buyAmount.toString(),
      slippageBasisPoints: result.slippageBasisPoints.toString(),
      unitLimit: result.unitLimit,
      unitPrice: result.unitPrice
    };

    console.log("[api.ts] - Sending keypair data to client");
    res.json(serializedResult);
  } catch (error) {
    console.error('[api.ts] - Token creation error:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Proxy other requests to Python API
app.use('/api/agents', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true
}));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`TypeScript API running on port ${PORT}`);
}); 