import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

// Load env variables before other imports, pointing to the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import { router as cookieFunRoutes } from './routes/cookieDotFunRoutes';
// Import future API routes here
// import otherApiRoutes from './routes/other.api';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: '*'
}));

// API Routes
app.use('/api/cookie-fun', cookieFunRoutes);
// Add future API routes here
// app.use('/api/other-service', otherApiRoutes);

// Error handling middleware - Fixed unused parameters warning
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 