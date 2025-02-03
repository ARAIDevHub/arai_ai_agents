import axios, { AxiosResponse } from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../../../.env');
const COOKIE_FUN_API_KEY = dotenv.config({ path: envPath }).parsed?.COOKIE_FUN_API_KEY || '';
if (!COOKIE_FUN_API_KEY) {
    throw new Error('Missing required environment variable: COOKIE_FUN_API_KEY');
}
console.log('COOKIE_FUN_API_KEY:', COOKIE_FUN_API_KEY);
// Create router
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

// Verify the environment variable
if (!process.env.COOKIE_FUN_API_KEY) {
    console.error('COOKIE_FUN_API_KEY is not set in environment variables');
    throw new Error('Missing required environment variable: COOKIE_FUN_API_KEY');
}

// Create axios instance with default configuration
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-api-key': `${COOKIE_FUN_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

// Route handlers
router.get('/twitter/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { interval } = req.query;
        const data = await getAgentByTwitter(username, interval as string);
        res.json(data);
    } catch (error) {
        console.error('Error fetching Twitter data:', error);
        res.status(500).json({ error: 'Failed to fetch agent data by Twitter username' });
    }
});

router.get('/contract/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const { interval } = req.query;
        const data = await getAgentByContract(address, interval as string);
        res.json(data);
    } catch (error) {
        console.error('Error fetching contract data:', error);
        res.status(500).json({ error: 'Failed to fetch agent data by contract address' });
    }
});

router.get('/agents/paged', async (req, res) => {
    try {
        const { page, pageSize, interval } = req.query;
        const data = await getAgentsPaged({ 
            page: Number(page), 
            pageSize: Number(pageSize), 
            interval: interval as string 
        });
        res.json(data);
    } catch (error) {
        console.error('Error fetching paged agents:', error);
        res.status(500).json({ error: 'Failed to fetch paged agents' });
    }
});

// Helper functions
export async function getAgentByTwitter(
    twitterUsername: string, 
    interval?: string
): Promise<AgentResponse> {
    if (interval !== '_3Days' && interval !== '_7Days') {
        throw new Error('Invalid interval must be _3Days or _7Days');
    }
    const response: AxiosResponse<AgentResponse> = await api.get(
        `/agents/twitterUsername/${twitterUsername}`,
        { params: interval ? { interval } : {} }
    );
    return response.data;
}

export async function getAgentByContract(
    contractAddress: string, 
    interval?: string
): Promise<AgentResponse> {

    if (interval !== '_3Days' && interval !== '_7Days') {
        throw new Error('Invalid interval must be _3Days or _7Days');
    }
    const response: AxiosResponse<AgentResponse> = await api.get(
        `/agents/contractAddress/${contractAddress}`,
        { params: interval ? { interval } : {} }
    );
    return response.data;
}

export async function getAgentsPaged(params: PaginationParams = {}): Promise<AgentResponse> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 25;
    const interval = params.interval || '_7Days';
    
    if (interval !== '_3Days' && interval !== '_7Days') {
        throw new Error('Invalid interval must be _3Days or _7Days');
    }

    const response: AxiosResponse<AgentResponse> = await api.get(
        '/agents/agentsPaged',
        { params: { page, pageSize, interval } }
    );
    return response.data;
}

export { router };