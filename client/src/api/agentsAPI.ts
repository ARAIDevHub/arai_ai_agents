const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/cookie-fun`;

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
  // If the agentData comes in as an Agent object, we need to drill down into the agent one level
  // This allows us to process both Agent and non-agent type objects
  if (agentData.agent) {
    agentData = agentData.agent;
  }

  const response = await fetch(`${BASE_URL}/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

  // Return the data directly
  return data; // Returns an array of the characters
}

// Function to create a random agent
export async function createRandomAgent(concept?: string) {
  const response = await fetch(`${BASE_URL}/agents/random`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ concept }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to send a chat message to an agent
export async function sendChatMessage(
  masterFilePath: string,
  message: string,
  chatHistory: any
) {
  const response = await fetch(`${BASE_URL}/agents/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: message,
      master_file_path: masterFilePath,
      chat_history: chatHistory,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to get chat history for an agent
export async function getChatHistory(masterFilePath: string) {
  const response = await fetch(
    `${BASE_URL}/agents/chat-history?master_file_path=${encodeURIComponent(
      masterFilePath
    )}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to create a new season
export async function createSeason(
  masterFilePath: string,
  numberOfEpisodes: number = 3
) {
  const response = await fetch(`${BASE_URL}/agents/seasons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      master_file_path: masterFilePath,
      number_of_episodes: numberOfEpisodes,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to create posts for episodes
export async function createEpisodePosts(
  masterFilePath: string,
  numberOfPosts: number = 6
) {
  const response = await fetch(`${BASE_URL}/agents/episodes/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      master_file_path: masterFilePath,
      number_of_posts: numberOfPosts,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}


// Function to start the post manager
export async function startPostManager(agentName: string) {
  const response = await fetch(`${BASE_URL}/start-post-manager/twitter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_name: agentName }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to post to twitter
export async function postToTwitter(masterData: any, content: string) {
  const response = await fetch(`${BASE_URL}/post-to-twitter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      master_data: masterData,
      content: content
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function updateSeasons(agentName: string, seasons: any[]) {
  const response = await fetch(`${BASE_URL}/agents/update-seasons`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_name: agentName,
      seasons: seasons,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Add these new interfaces
interface CookieFunResponse {
  [key: string]: any;
}

interface PaginationParams {
  page?: number;
  pageSize?: number;
  interval?: string;
}

// Add these new functions
export async function getCookieFunAgentsPaged(params: PaginationParams = {}): Promise<CookieFunResponse> {
  const queryParams = new URLSearchParams({
    page: (params.page || 1).toString(),
    pageSize: (params.pageSize || 25).toString(),
    interval: params.interval || '_7Days'
  });

  const response = await fetch(`${BASE_URL}/agents/paged?${queryParams}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function getCookieFunAgentByTwitter(
  username: string, 
  interval: string = '_7Days'
): Promise<CookieFunResponse> {
  const response = await fetch(`${BASE_URL}/twitter/${username}?interval=${interval}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function getCookieFunAgentByContract(
  address: string,
  interval: string = '_7Days'
): Promise<CookieFunResponse> {
  const response = await fetch(`${BASE_URL}/contract/${address}?interval=${interval}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
