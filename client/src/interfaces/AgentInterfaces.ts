export interface AgentDetails {
  id?: string | number;
  name: string;
  personality: string[];
  communication_style: string[];
  backstory: string;
  universe: string;
  topic_expertise: string[];
  hashtags: string[];
  emojis: string[];
}

export interface ProfileImage {
  details: {
    url: string;
    image_id: string;
    generationId: string;
  };
  [key: string]: unknown;
}

export interface GeneratedImage {
  url: string;
  id: string;
  generationId: string;
}

export interface GenerationsByPk {
  id: string;
  prompt?: string;
  generated_images: GeneratedImage[];
}

export interface ProfileImageOption {
  generations_by_pk: GenerationsByPk;
}

export interface Agent {
  id?: string | number;
  name?: string;
  avatar?: string;
  shortDescription?: string;
  tags?: string[];
  personality?: string[];
  communicationStyle?: string[];
  emojis?: string[];
  hashtags?: string[];
  universe?: string;
  backstory?: string;
  concept?: string;
  role?: string;
  isLoading?: boolean;
  leonardoResponse?: any;
  leonardoImage?: any;
  topic_expertise?: string[];
  agent?: {
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
      messages_sent: number;
      total_interactions: number;
      current_episode_number: number;
      current_post_number: number;
      current_season_number: number;
      post_every_x_minutes: number;
    };
    seasons: any[];
    profile_image: ProfileImage;
    profile_image_options: ProfileImageOption[];
    master_file_path?: string;
  };
  isExample?: boolean;
}

export function createBlankAgent(): Agent {
  return {
    id: '',
    name: '',
    avatar: '',
    agent: {
      concept: '',
      agent_details: {
        backstory: '',
        communication_style: [],
        emojis: [],
        hashtags: [],
        name: '',
        personality: [],
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
        messages_sent: 0,
        total_interactions: 0,
        current_episode_number: 0,
        current_post_number: 0,
        current_season_number: 0,
        post_every_x_minutes: 0
      },
      seasons: [],
      profile_image: {
        details: {
          url: '',
          image_id: '',
          generationId: ''
        }
      },
      profile_image_options: [] as ProfileImageOption[]
    }
  };
}

export interface RandomAgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent | null) => void;
  onAddAgent: (agent: Agent) => void;
  isUserAgent: boolean;
  setRandomAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  generateRandomAgentData: () => Promise<Agent>;
  isLoadedAgent: boolean;
  onRegenerate: (agentId: string) => Promise<void>;
  isLoading?: boolean;
} 