import { PumpFunSDK as OriginalSDK } from "pumpdotfun-sdk";

interface SDKOptions {
  apiEndpoint?: string;
}

export class CustomPumpFunSDK extends OriginalSDK {
  private apiEndpoint: string;

  constructor(provider: any, options: SDKOptions = {}) {
    super(provider);
    this.apiEndpoint = options.apiEndpoint || 'https://pump.fun';
  }

  // Override the createTokenMetadata method to use the custom endpoint
  async createTokenMetadata(metadata: any) {
    const response = await fetch(`${this.apiEndpoint}/api/ipfs`, {
      method: 'POST',
      body: metadata,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create token metadata: ${response.statusText}`);
    }
    
    return await response.json();
  }
} 