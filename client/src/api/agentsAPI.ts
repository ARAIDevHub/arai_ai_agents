const BASE_URL = "http://localhost:3000/api"; // Changed from 8080 to 3000

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
  console.group('Token Creation');
  console.log('Starting token creation with params:', params);
  
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
    const response = await fetch(`${BASE_URL}/create-token`, {
      method: "POST",
      body: formData,
    });

    // Log the raw response for debugging
    console.log('[agentsAPI] - Raw response:', response);
    
    let data;
    const textResponse = await response.text();
    console.log('[agentsAPI] - Response text:', textResponse);

    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('[agentsAPI] - JSON parse error:', parseError);
      throw new Error('Invalid response from server');
    }

    console.log('[agentsAPI] - Parsed response data:', data);

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