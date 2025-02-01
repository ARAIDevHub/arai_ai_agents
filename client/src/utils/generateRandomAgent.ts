import { createRandomAgent } from '../api/agentsAPI';

export async function generateRandomAgent(concept?: string) {
  try {
    const randomAgent = await createRandomAgent(concept);
    return randomAgent;
  } catch (error) {
    console.error('Error creating random agent:', error);
  }
}
