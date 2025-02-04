import { CookieFunResponse, PaginationParams } from '../interfaces/cookie.FunInterfaces';

const BASE_URL_COOKIE_FUN = `${import.meta.env.VITE_API_BASE_URL}/cookie-fun`;


// Add these new functions
export async function getCookieFunAgentsPaged(params: PaginationParams = {}): Promise<CookieFunResponse> {
  console.log("[getCookieFunAgentsPaged] params:", params);
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      pageSize: (params.pageSize || 25).toString(),
      interval: params.interval || '_7Days'
    });
  
    const response = await fetch(`${BASE_URL_COOKIE_FUN}/agents/paged?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
  
  export async function getCookieFunAgentByTwitter(
    username: string, 
    interval: string = '_7Days'
  ): Promise<CookieFunResponse> {
    console.log("[getCookieFunAgentByTwitter] username:", username);
    const response = await fetch(`${BASE_URL_COOKIE_FUN}/twitter/${username}?interval=${interval}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
  
  export async function getCookieFunAgentByContract(
    address: string,
    interval: string = '_7Days'
  ): Promise<CookieFunResponse> {
    console.log("[getCookieFunAgentByContract] address:", address);
    const response = await fetch(`${BASE_URL_COOKIE_FUN}/contract/${address}?interval=${interval}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
  
  export async function getCookieFunAllAgents(
    interval: string = '_7Days'
  ): Promise<CookieFunResponse> {
    console.log("[getCookieFunAllAgents] interval:", interval);
    const response = await fetch(`${BASE_URL_COOKIE_FUN}/agents/all?interval=${interval}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
  