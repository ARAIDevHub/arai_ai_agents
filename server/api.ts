import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createTokenWithParams } from './packages/pumpfun/example/basic/createToken';
import path from 'path';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

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

    // Create a temporary file path for the image
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
      website: req.body.website || ''
    });

    // Clean up temporary file
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.json(result);
  } catch (error) {
    console.error('Token creation error:', error);
    // Type guard to safely handle the error
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