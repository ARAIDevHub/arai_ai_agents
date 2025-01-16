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

export interface ProfileImage {
  details: {
    url: string;
    image_id: string;
    generationId: string;
  };
  payload: any;
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
    profile_image: ProfileImage[];
    profile_image_options: any[];
    seasons: any[];
    tracker: {
      current_episode_number: number;
      current_post_number: number;
      current_season_number: number;
      post_every_x_minutes: number;
    };
  };
  concept: string;
  selectedImage?: number;
} 