import { useState, useEffect } from 'react';
import { getCharacters } from '../api/agentsAPI';

interface AgentDetails {
  name: string;
  personality: string[];
  communication_style: string[];
  backstory: string;
  universe: string;
  topic_expertise: string[];
  hashtags: string[];
  emojis: string[];
  selectedImage?: number;
}

interface Agent {
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

interface UseCharactersReturn {
  characters: Agent[];
  selectedCharacter: Agent | null;
  setSelectedCharacter: (character: Agent | null) => void;
  loading: boolean;
  error: Error | null;
  handleCharacterSelect: (character: Agent) => void;
}

const useCharacters = (): UseCharactersReturn => {
  const [characters, setCharacters] = useState<Agent[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleCharacterSelect = (character: Agent) => {
    const details = character.agent?.agent_details;
    
    if (!details) {
      console.error('Selected character has invalid data structure');
      return;
    }

    // Update the selected character
    setSelectedCharacter({
      ...character,
      agent: {
        ...character.agent,
        agent_details: {
          name: details.name,
          personality: Array.isArray(details.personality) ? details.personality : [],
          communication_style: Array.isArray(details.communication_style) ? details.communication_style : [],
          backstory: details.backstory || '',
          universe: details.universe || '',
          topic_expertise: Array.isArray(details.topic_expertise) ? details.topic_expertise : [],
          hashtags: Array.isArray(details.hashtags) ? details.hashtags : [],
          emojis: Array.isArray(details.emojis) ? details.emojis : [],
          selectedImage: undefined
        }
      }
    });

    console.log("[handleCharacterSelect] Selected character:", details.name);
  };

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      try {
        const charactersData = await getCharacters();
        console.log('Raw characters data:', charactersData);

        if (!Array.isArray(charactersData)) {
          throw new Error(`Expected array of characters, received: ${typeof charactersData}`);
        }

        const processedCharacters = charactersData.map(char => {
          const { agent, concept = '' } = char;
          const {
            agent_details: {
              name = '',
              personality = [],
              communication_style = [],
              backstory = '',
              universe = '',
              topic_expertise = [],
              hashtags = [],
              emojis = []
            } = {}
          } = agent || {};

          return {
            agent: {
              agent_details: {
                name,
                personality: Array.isArray(personality) ? personality : [],
                communication_style: Array.isArray(communication_style) ? communication_style : [],
                backstory,
                universe,
                topic_expertise: Array.isArray(topic_expertise) ? topic_expertise : [],
                hashtags: Array.isArray(hashtags) ? hashtags : [],
                emojis: Array.isArray(emojis) ? emojis : []
              },
              ai_model: agent?.ai_model || {
                memory_store: '',
                model_name: '',
                model_type: ''
              },
              connectors: agent?.connectors || {
                discord: false,
                telegram: false,
                twitter: false
              },
              seasons: agent?.seasons || [],
              tracker: agent?.tracker || {
                current_episode_number: 0,
                current_post_number: 0,
                current_season_number: 0,
                post_every_x_minutes: 0
              }
            },
            concept
          };
        });

        console.log('Processed characters:', processedCharacters);
        setCharacters(processedCharacters);

        // If there are characters, set the first one as default
        if (processedCharacters.length > 0) {
          handleCharacterSelect(processedCharacters[0]);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred while loading characters');
        setError(error);
        console.error('Error loading characters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, []);

  return {
    characters,
    selectedCharacter,
    setSelectedCharacter,
    loading,
    error,
    handleCharacterSelect
  };
};

export default useCharacters;