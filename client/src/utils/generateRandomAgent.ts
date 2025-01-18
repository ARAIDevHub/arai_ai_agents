import { createRandomAgent } from '../api/agentsAPI';

export async function generateRandomAgent() {
  try {
    console.log('Requesting a new random agent...');
    const randomAgent = await createRandomAgent();
    console.log('Random agent created:', randomAgent);
  } catch (error) {
    console.error('Error creating random agent:', error);
  }
}

// Call the function to test it
generateRandomAgent();