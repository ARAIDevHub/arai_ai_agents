export interface TokenMetadata {
    name: string;
    symbol: string;
    description: string;
    uri?: string;
    file?: File | Buffer;
    website?: string;
    twitter?: string;
    telegram?: string;
}

export interface CreateTokenParams {
    tokenName: string;
    tokenSymbol: string;
    tokenDescription: string;
    solAmount: string;
    image: File;
    website?: string;
    xLink?: string;
    telegram?: string;
    walletAddress: string;
} 