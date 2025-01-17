const BASE_URL = 'http://localhost:8080/api'; // Your Flask API base URL

// Function to get all agents
export async function getAgents() {
  const response = await fetch(`${BASE_URL}/agents`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to create a new agent
export async function createAgent(agentData: any) {
  // console.log('[Client - agentsApi] - agentData', agentData);
  // If the agentData comes in as an Agent object, we need to drill down into the agent one level
  // This allows us to process both Agent and non-agent type objects
  if (agentData.agent) {
    agentData = agentData.agent;
  }
  
  const response = await fetch(`${BASE_URL}/agents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to get all characters
export async function getCharacters() {
  const response = await fetch(`${BASE_URL}/characters`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log("[agentsApi] - response", response);  
  console.log("[agentsApi] - data", data);  
  
  // Return the data directly
  return data; // Returns an array of the characters
}

// ... other API call functions related to agents (e.g., getAgentById, updateAgent, deleteAgent) 