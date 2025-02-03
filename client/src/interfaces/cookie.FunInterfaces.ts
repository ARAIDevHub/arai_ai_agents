// Add these new interfaces
export interface CookieFunResponse {
    [key: string]: any;
}
  
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    interval?: string;
}