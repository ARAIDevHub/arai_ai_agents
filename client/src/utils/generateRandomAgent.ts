import { createRandomAgent } from '../api/agentsAPI';

export async function generateRandomAgent(concept?: string) {
  try {
    console.log('Requesting a new random agent...');
    const randomAgent = await createRandomAgent(concept);
    console.log('Random agent created:', randomAgent);
    return randomAgent;
  } catch (error) {
    console.error('Error creating random agent:', error);
  }
}
