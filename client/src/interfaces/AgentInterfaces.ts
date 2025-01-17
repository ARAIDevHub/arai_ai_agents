export interface AgentDetails {
  backstory: string;
  communication_style: string[];
  emojis: string[];
  hashtags: string[];
  name: string;
  personality: string[];
  selectedImage?: number;  // Added for image selection
  topic_expertise: string[];
  universe: string;
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
    concept: string;
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
    tracker: {
      current_episode_number: number;
      current_post_number: number;
      current_season_number: number;
      post_every_x_minutes: number;
    };
    seasons: any[];
    profile_image: Record<string, any>;
    profile_image_options: any[];
  };
}

function createBlankAgent(): Agent {
  return {
    agent: {
      concept: '',
      agent_details: {
        backstory: '',
        communication_style: [],
        emojis: [],
        hashtags: [],
        name: '',
        personality: [],
        selectedImage: undefined,  // Optional field
        topic_expertise: [],
        universe: ''
      },
      ai_model: {
        memory_store: '',
        model_name: '',
        model_type: ''
      },
      connectors: {
        discord: false,
        telegram: false,
        twitter: false
      },
      tracker: {
        current_episode_number: 0,
        current_post_number: 0,
        current_season_number: 0,
        post_every_x_minutes: 0
      },
      seasons: [],
      profile_image: {},
      profile_image_options: []
    }
  };
} 