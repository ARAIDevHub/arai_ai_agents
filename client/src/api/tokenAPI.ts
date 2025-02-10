const BASE_URL_TOKENS = `http://localhost:3001/api/token`;

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
  
  export async function createToken(params: TokenCreationParams) {
    console.group('[tokenAPI] - Token Creation');
    console.log('[tokenAPI] - Starting token creation with params:', params);
    
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
  
      console.log('Making API request...');
      const response = await fetch(`${BASE_URL_TOKENS}/create-token`, {
        method: "POST",
        body: formData,
      });
  
      // Log the raw response for debugging
      console.log('[tokenAPI] - Raw response:', response);
      
      let data;
      const textResponse = await response.text();
      console.log('[tokenAPI] - Response text:', textResponse);
  
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('[tokenAPI] - JSON parse error:', parseError);
        throw new Error('Invalid response from server');
      }
  
      console.log('[tokenAPI] - Parsed response data:', data);
  
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
  