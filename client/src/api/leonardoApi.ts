import { defaultGenerationConfig, consistentGenerationConfig } from './leonardoApiConfig';

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
    
    const initialResponse = await response.json();
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

      const imageData = await imageResponse.json();
      
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
