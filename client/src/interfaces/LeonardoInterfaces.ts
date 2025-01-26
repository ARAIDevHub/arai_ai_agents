// Define the payload type for better type-checking
export interface LambdaPayload {
    prompt: string;
    modelId: string;
    styleUUID: string;
    num_images: number;
  }
  
