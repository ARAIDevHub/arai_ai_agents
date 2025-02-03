import express from 'express';
import cookieFunRoutes from './routes/cookie.fun';
// Import future API routes here
// import otherApiRoutes from './routes/other.api';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// API Routes
app.use('/api/cookie-fun', cookieFunRoutes);
// Add future API routes here
// app.use('/api/other-service', otherApiRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 