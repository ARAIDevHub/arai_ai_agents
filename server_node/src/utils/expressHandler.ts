import express from 'express';
import cors from 'cors';
import { router as cookieFunRoutes } from '../routes/cookieDotFunRoutes';
import { router as tokenRoutes } from '../routes/tokenRoutes';
import authRoutes from '../routes/authRoutes';

export const setupExpressServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors({
    origin: '*'
  }));

  // API Routes
  app.use('/api/cookie-fun', cookieFunRoutes);
  app.use('/api/token', tokenRoutes);
  app.use('/api/auth', authRoutes);

  // Error handling middleware
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.group('[server] - Error Handling Middleware');
    console.error(err.stack);
    console.groupEnd();
    res.status(500).json({ error: 'Something went wrong!' });
  });

  return app;
}; 