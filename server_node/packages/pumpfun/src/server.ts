import express from 'express';
import cors from 'cors';
import tokenEndpoints from './api/tokenEndpoints';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api', tokenEndpoints);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 