import { defaultGenerationConfig, consistentGenerationConfig } from './leonardoApiConfig';

const getInconsistentImageLambdaUrl = "https://46i9cnowhh.execute-api.us-east-1.amazonaws.com/getImageInconsistent"
// const lambdaUrl = "https://xiwoegqejhpkrpukie2hwclwnm0nfnod.lambda-url.us-east-1.on.aws/"
// Define the payload type for better type-checking
interface LambdaPayload {
  prompt: string;
  modelId: string;
  styleUUID: string;
  num_images: number;
}

// Function to call the AWS Lambda
export async function inconsistentImageLambda(payload: LambdaPayload): Promise<any> {
  const url = getInconsistentImageLambdaUrl;

  console.log("[LeonardoApi - inconsistentImageLambda] Calling Lambda...");
  console.log("[LeonardoApi - inconsistentImageLambda] Payload:",  payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: "CHAD"
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lambda response:', data);
    return data;
  } catch (error) {
    console.error('Error calling Lambda:', error);
    throw error;
  }
}

// Common headers for all API requests
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY || ""}`,
  Accept: "application/json",
};

/**
 * Generate multiple inconsistent images from a prompt.
 */
export async function generateImageInconsistent(
  prompt: string,
  modelId: string,
  styleUUID: string,
  numImages: number
): Promise<any> {
  const url = "https://cloud.leonardo.ai/api/rest/v1/generations";
  const payload = {
    ...defaultGenerationConfig,
    modelId,
    prompt,
    num_images: numImages,
    styleUUID,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating inconsistent images:", error);
    throw error;
  }
}

// Define the expected structure of the initial response
interface InitialResponse {
  sdGenerationJob: {
    generationId: string;
  };
}

export async function generateSingleImage(
  prompt: string,
  modelId: string,
  styleUUID: string,
): Promise<any> {
  console.log("[LeonardoApi] Generating single image...");
  const url = "https://cloud.leonardo.ai/api/rest/v1/generations";
  const payload = {
    ...defaultGenerationConfig,
    modelId,
    prompt,
    num_images: 1,
    styleUUID,
  };

  try {
    // Initial generation request
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Use type assertion to specify the expected type
    const initialResponse = await response.json() as InitialResponse;
    const generationId = initialResponse.sdGenerationJob.generationId;

    // Poll for the generated image
    let attempts = 0;
    const maxAttempts = 10;
    const delayMs = 5000;
    console.log('[LeonardoApi - generateSingleImage] Polling for generated image...');

    while (attempts < maxAttempts) {
      const imageResponse = await fetch(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        { headers }
      );
      
      if (!imageResponse.ok) {
        throw new Error(`HTTP error! status: ${imageResponse.status}`);
      }

      // Define the expected structure of the image data response
      interface ImageData {
        generations_by_pk?: {
          generated_images?: { url: string }[];
        };
      }

      // Use type assertion to specify the expected type
      const imageData = await imageResponse.json() as ImageData;
      
      if (imageData.generations_by_pk?.generated_images?.[0]?.url) {
        return imageData;
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
      console.log("LeonardoApi - generateSingleImage - Attempts:", attempts);
      attempts++;
    }

    throw new Error('Image generation timed out');
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

/**
 * Generate multiple consistent images from a prompt.
 */
export async function generateImageConsistent(
  prompt: string,
  modelId: string,
  styleUUID: string,
  numImages: number
): Promise<any> {
  const url = "https://cloud.leonardo.ai/api/rest/v1/generations";
  const payload = {
    ...consistentGenerationConfig,
    modelId,
    prompt,
    num_images: numImages,
    styleUUID,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating consistent images:", error);
    throw error;
  }
}

/**
 * Get the URL of a generated image by its generation ID.
 */
export async function getImageUrl(generationId: string): Promise<any> {
  const url = `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`;

  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching image URL:", error);
    throw error;
  }
}

/**
 * Get the list of available models.
 */
export async function getModels(): Promise<any> {
  const url = "https://cloud.leonardo.ai/api/rest/v1/platformModels";

  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

/**
 * Get the styles available for a specific model.
 */
export async function getModelStyles(modelId: string): Promise<any> {
  const url = `https://cloud.leonardo.ai/api/rest/v1/platformModels/${modelId}/styles`;

  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching model styles:", error);
    throw error;
  }
}

/**
 * Get the list of elements.
 */
export async function getElements(): Promise<any> {
  const url = "https://cloud.leonardo.ai/api/rest/v1/elements";

  try {
    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching elements:", error);
    throw error;
  }
}
