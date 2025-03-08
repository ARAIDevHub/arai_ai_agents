// const BASE_URL_TOKENS = `http://localhost:3001/api/token`;
const BASE_URL_TOKENS = `${(import.meta as any).env.VITE_NODE_API_URL}/api/token`;

// PumpFun API

// Update the createToken interface and function
interface TokenCreationParams {
    name: string;
    symbol: string;
    description: string;
    unitLimit: number;
    unitPrice: number;
    initialBuyAmount: number;
    website?: string;
    xLink?: string;
    telegram?: string;
    image?: File | null;
  }
  
  export async function createToken(params: TokenCreationParams, encryptedWalletRows: string) {
    
    try {
      const formData = new FormData();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'image' && value instanceof File) {
            formData.append('file', value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      formData.append('encryptedWalletRows', encryptedWalletRows);
      //Full formData:
      const response = await fetch(`${BASE_URL_TOKENS}/create-token`, {
        method: "POST",
        body: formData,
      });
  
      // Log the raw response for debugging
      console.log('[tokenAPI] - Raw response:', response);
      
      let data;
      const textResponse = await response.text();
  
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('[tokenAPI] - JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }
  
  
      if (!response.ok) {
        throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
      }
      
      // If we got here, the request was successful
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Token created successfully'
      };
      
    } catch (error) {
      console.error('Error during token creation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Token creation failed'
      };
    } finally {
      console.groupEnd();
    }
  }
  