import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import { router as cookieFunRoutes } from './routes/cookieDotFunRoutes';
import { router as tokenRoutes } from './routes/tokenRoutes';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://arai-react-client:5173'],
  credentials: true
}));
app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Health check endpoint for testing
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI?.split('@')[1] // Log only the host part for security
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cookie-fun', cookieFunRoutes);
app.use('/api/token', tokenRoutes);

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.path);
  res.status(404).json({ message: `Route ${req.path} not found` });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;