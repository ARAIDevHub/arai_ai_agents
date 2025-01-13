export interface AgentDetails {
  backstory: string;
  communication_style: string[];
  emojis: string[];
  hashtags: string[];
  name: string;
  personality: string[];
  topic_expertise: string[];
  universe: string;
  selectedImage?: number;  // Added for image selection
}

export interface Agent {
  agent: {
    agent_details: AgentDetails;
    ai_model: {
      memory_store: string;
      model_name: string;
      model_type: string;
    };
    connectors: {
      discord: boolean;
      telegram: boolean;
      twitter: boolean;
    };
    seasons: any[]; // Adjust as needed
    tracker: {
      current_episode_number: number;
      current_post_number: number;
      current_season_number: number;
      post_every_x_minutes: number;
    };
  };
  concept: string;
} 