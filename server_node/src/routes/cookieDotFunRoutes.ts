import axios, { AxiosResponse } from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
    // Generic response type for Cookie.fun API responses
    // Contains dynamic fields based on the endpoint
    [key: string]: any;
}

interface PaginationParams {
    page?: number;      // Page number for paginated requests
    pageSize?: number;  // Number of items per page
    interval?: string;  // Time interval for data (_3Days or _7Days)
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

/**
 * Router Handlers
 * These functions handle HTTP requests to our server endpoints.
 * They act as middleware between client requests and our helper functions.
 * These are sending data from the Cookie.fun API to the client.
 * Responsibilities:
 * 1. Parse request parameters
 * 2. Call appropriate helper function
 * 3. Handle errors and send responses
 */

/**
 * GET /twitter/:username
 * Retrieves agent data for a specific Twitter username
 * @param username - Twitter username from URL parameter
 * @param interval - Optional query parameter for time interval
 */
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

/**
 * GET /contract/:address
 * Retrieves agent data for a specific contract address
 * @param address - Contract address from URL parameter
 * @param interval - Optional query parameter for time interval
 */
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

/**
 * GET /agents/paged
 * Retrieves a paginated list of agents
 * @param page - Page number
 * @param pageSize - Number of items per page
 * @param interval - Time interval for data
 */
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

/**
 * GET /agents/all
 * Retrieves ALL agents by handling pagination automatically
 * WARNING: This is a heavy operation that may take several seconds
 * @param interval - Time interval for data (_3Days or _7Days)
 */
router.get('/agents/all', async (req, res) => {
    try {
        console.log("[cookieDotFunRoutes - router - getAllAgentsPaged] Request received");
        const interval = req.query.interval as string;

        const dataDirPath = path.join(__dirname, '../../data');
        const jsonFilePath = path.join(dataDirPath, 'allAgents.json');

        if (fs.existsSync(jsonFilePath)) {
            const fileData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
            const timestamp = new Date(fileData.timestamp);
            const now = new Date();
            const hoursSinceUpdate = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

            if (hoursSinceUpdate < 6) {
                console.log("✅ Using cached data from:", jsonFilePath);
                res.json(fileData); // ✅ DO NOT `return res.json()`
                return;
            } else {
                console.log("🔄 Cached data is outdated, fetching new data...");
            }
        } else {
            console.log("⚠️ No cached data found, fetching fresh data...");
        }

        const data = await getAllAgentsPaged({ interval });

        const responseWithTimestamp = {
            timestamp: new Date().toISOString(),
            ...data
        };

        fs.writeFileSync(jsonFilePath, JSON.stringify(responseWithTimestamp, null, 2));
        console.log("✅ New data cached successfully.");

        res.json(responseWithTimestamp); // ✅ DO NOT `return res.json()`
    } catch (error) {
        console.error('❌ Error fetching all agents:', error);
        res.status(500).json({ error: 'Failed to fetch all agents' }); // ✅ No return needed
    }
});


/**
 * Helper Functions
 * These functions handle the actual API calls to Cookie.fun
 * They abstract away the API communication details from the route handlers
 * Responsibilities:
 * 1. Validate parameters
 * 2. Make API requests
 * 3. Return formatted responses
 */

/**
 * Fetches agent data by Twitter username from Cookie.fun API
 * @param twitterUsername - Twitter username to look up
 * @param interval - Time interval for data (_3Days or _7Days)
 * @returns Promise<AgentResponse> - API response data
 */
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

/**
 * Fetches agent data by contract address from Cookie.fun API
 * @param contractAddress - Contract address to look up
 * @param interval - Time interval for data (_3Days or _7Days)
 * @returns Promise<AgentResponse> - API response data
 */
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

/**
 * Fetches a single page of agents from Cookie.fun API
 * @param params - Pagination parameters (page, pageSize, interval)
 * @returns Promise<AgentResponse> - API response data
 */
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

/**
 * Fetches ALL agents by automatically handling pagination
 * WARNING: This can be a heavy operation depending on the total number of agents
 * @param params - Pagination parameters (pageSize, interval)
 * @returns Promise<AgentResponse> - Combined response with all agents
 */
export async function getAllAgentsPaged(params: PaginationParams = {}): Promise<AgentResponse> {
    console.log("[cookieDotFunRoutes - getAllAgentsPaged] ");
    const pageSize = 25 // Maxing out to loop through all pages
    const interval = params.interval || '_7Days';
    const maxPages = 300; // Current amount of pages is 277
    const rateLimit = 250; // Milliseconds between requests to avoid rate limiting
    
    if (interval !== '_3Days' && interval !== '_7Days') {
        throw new Error('Invalid interval must be _3Days or _7Days');
    }

    let allAgentsData: any[] = [];
    let currentPage = 1;
    let hasMoreData = true;

    while (hasMoreData && currentPage <= maxPages) {
        try {
            console.log("[cookieDotFunRoutes - getAllAgentsPaged] currentPage", currentPage);
            const response = await getAgentsPaged({ 
                page: currentPage, 
                pageSize, 
                interval 
            });
            const agentsData = response.ok.data || [];

            if (!agentsData.length || agentsData.length === 0) {
                console.log("[cookieDotFunRoutes - getAgentsPaged] No more data");
                hasMoreData = false;
                continue;
            }

            allAgentsData = allAgentsData.concat(agentsData);
            currentPage++;

            await new Promise(resolve => setTimeout(resolve, rateLimit));
        } catch (error) {
            console.error(`Error fetching page ${currentPage}:`, error);
            // Write what we have so far before stopping
            try {
                const dataDirPath = path.join(__dirname, '../../data');
                const jsonFilePath = path.join(dataDirPath, 'allAgents.json');
                if (!fs.existsSync(dataDirPath)) {
                    fs.mkdirSync(dataDirPath, { recursive: true });
                }
                fs.writeFileSync(jsonFilePath, JSON.stringify(allAgentsData, null, 2));
                console.log('Partial data written to file before error');
            } catch (writeError) {
                console.error('Error writing to file:', writeError);
            }
            hasMoreData = false;
        }
    }

    if (currentPage > maxPages) {
        console.warn('Reached maximum page limit');
    }

    console.log(`Processed ${currentPage - 1} pages`);

    return {
        success: true,
        partialData: false,
        lastSuccessfulPage: currentPage - 1,
        data: allAgentsData,
        totalCount: allAgentsData.length,
        pageSize,
        currentPage: currentPage - 1
    };
}

export { router };