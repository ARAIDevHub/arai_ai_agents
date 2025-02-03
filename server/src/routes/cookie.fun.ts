import express from 'express';
import axios, { AxiosResponse } from 'axios';

const router = express.Router();

// Types
interface AgentResponse {
    // Add specific response type fields here based on the actual API response
    [key: string]: any;
}

interface PaginationParams {
    page?: number;
    pageSize?: number;
    interval?: string;
}

// API Configuration
const BASE_URL = "https://api.cookie.fun/v2";

// Create axios instance with default configuration
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_COOKIE_FUN_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

// Route handlers
router.get('/twitter/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { interval } = req.query;
        const response: AxiosResponse<AgentResponse> = await api.get(
            `/agents/twitterUsername/${username}`,
            { params: interval ? { interval } : {} }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch agent data by Twitter username' });
    }
});

router.get('/contract/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { interval } = req.query;
        const response: AxiosResponse<AgentResponse> = await api.get(
            `/agents/contractAddress/${address}`,
            { params: interval ? { interval } : {} }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch agent data by contract address' });
    }
});

router.get('/agents', async (req, res) => {
    try {
        const { page = 1, pageSize = 10, interval } = req.query;
        const response: AxiosResponse<AgentResponse> = await api.get(
            '/agents/agentsPaged',
            { params: { page, pageSize, interval } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch paged agents data' });
    }
});

export default router;