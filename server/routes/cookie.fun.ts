import axios, { AxiosResponse } from 'axios';

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

/**
 * Get agent data by Twitter username
 * @param twitterUsername - Twitter username to query
 * @param interval - Optional time interval for data
 */
export const getAgentByTwitter = async (
    twitterUsername: string, 
    interval?: string
): Promise<AgentResponse> => {
    const response: AxiosResponse<AgentResponse> = await api.get(
        `/agents/twitterUsername/${twitterUsername}`,
        { params: interval ? { interval } : {} }
    );
    return response.data;
};

/**
 * Get agent data by contract address
 * @param contractAddress - Contract address to query
 * @param interval - Optional time interval for data
 */
export const getAgentByContract = async (
    contractAddress: string, 
    interval?: string
): Promise<AgentResponse> => {
    const response: AxiosResponse<AgentResponse> = await api.get(
        `/agents/contractAddress/${contractAddress}`,
        { params: interval ? { interval } : {} }
    );
    return response.data;
};

/**
 * Get paginated list of agents
 * @param params - Pagination parameters including page, pageSize, and interval
 */
export const getAgentsPaged = async (params: PaginationParams = {}): Promise<AgentResponse> => {
    const defaultParams: PaginationParams = {
        page: 1,
        pageSize: 10,
        ...params
    };

    const response: AxiosResponse<AgentResponse> = await api.get(
        '/agents/agentsPaged',
        { params: defaultParams }
    );
    console.log(response.data);
    return response.data;
};

// Example usage:
const main = async () => {
    console.log('Starting API calls');
    try {
        // const twitterData = await getAgentByTwitter('example_user', '1d');
        // const contractData = await getAgentByContract('0x123...abc', '7d');
        const pagedData = await getAgentsPaged({ interval: '30d', page: 1, pageSize: 20 });
        
        console.log('API calls successful');
    } catch (error) {
        console.error('API Error:', error);
    }
};
