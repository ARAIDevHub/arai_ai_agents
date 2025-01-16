import React, { useEffect } from 'react';
import { getCharacters } from '../api/agentsAPI';
import { Agent } from '../interfaces/AgentInterfaces';

interface CharacterLoaderProps {
  setCharacters: React.Dispatch<React.SetStateAction<Agent[]>>;
}

const CharacterLoader: React.FC<CharacterLoaderProps> = ({ setCharacters }) => {
  useEffect(() => {
    const loadCharacters = async () => {
      console.log('[loadCharacters] Loading characters...');
      try {
        const charactersData = await getCharacters();
        console.log('Raw characters data:', charactersData);
        if (!Array.isArray(charactersData)) {
          console.error('Expected array of characters, received:', typeof charactersData);
          return;
        }

        const processed = charactersData.map(char => {
          const { agent, concept = '' } = char;
          if (!agent) return { agent: {}, concept };

          const {
            agent_details: {
              name = '',
              personality = [],
              communication_style = [],
              backstory = '',
              universe = '',
              topic_expertise = [],
              hashtags = [],
              emojis = [],
            } = {},
            ai_model = {},
            connectors = {},
            seasons = [],
            tracker = {},
          } = agent;

          return {
            agent: {
              agent_details: {
                name,
                personality: Array.isArray(personality) ? personality : [],
                communication_style: Array.isArray(communication_style)
                  ? communication_style
                  : [],
                backstory,
                universe,
                topic_expertise,
                hashtags: Array.isArray(hashtags) ? hashtags : [],
                emojis: Array.isArray(emojis) ? emojis : [],
              },
              ai_model,
              connectors,
              seasons,
              tracker,
            },
            concept,
          };
        });

        console.log('Processed characters:', processed);
        setCharacters(processed as Agent[]);
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };

    loadCharacters();
  }, [setCharacters]);

  return null; // This component does not render anything
};

export default CharacterLoader; 