import { LambdaPayload } from "../interfaces/LeonardoInterfaces"; 

const getInconsistentImageLambdaUrl = `${(import.meta as any).env.VITE_PYTHON_API_URL}/getImageInconsistent`

// Function to call the AWS Lambda
export async function inconsistentImageLambda(payload: LambdaPayload): Promise<any> {
  const url = getInconsistentImageLambdaUrl;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)

    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Lambda:', error);
    throw error;
  }
}
