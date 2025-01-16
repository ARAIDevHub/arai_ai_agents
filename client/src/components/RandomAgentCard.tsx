import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  PlusCircle,
  CheckCircle,
  RefreshCcw,
} from 'lucide-react';
import { Agent } from '../interfaces/AgentInterfaces';
import { generateSingleImage } from '../api/leonardoApi';

// Define the props for AgentCard
interface RandomAgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  onAdd?: (agent: Agent) => void; // Optional onAdd prop for random agents
  isUserAgent?: boolean; // Flag to indicate if it's a user agent
  setRandomAgents: React.Dispatch<React.SetStateAction<Agent[]>>; // Add setRandomAgents prop
  generateRandomAgent: () => Agent; // Add generateRandomAgent prop
  isLoadedAgent?: boolean; // New prop to indicate if the agent is loaded
  generateImage?: (prompt: string, modelId: string, styleUUID: string) => Promise<any>; // Add new prop for image generation
}

// Regenerate Button Component
interface RegenerateButtonProps {
  onRegenerate: () => void;
}

const RegenerateButton: React.FC<RegenerateButtonProps> = ({
  onRegenerate,
}) => {
  return (
    <button
      className="w-full mt-2 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 rounded-md hover:from-cyan-700 hover:to-orange-700 flex items-center justify-center gap-2 text-white"
      onClick={(e) => {
        e.stopPropagation();
        onRegenerate();
      }}
    >
      <RefreshCcw className="w-4 h-4" />
      Regenerate
    </button>
  );
};

const RandomAgentCard: React.FC<RandomAgentCardProps> = ({
  agent,
  onSelect,
  onAdd,
  isUserAgent,
  setRandomAgents,
  generateRandomAgent,
  isLoadedAgent,
  generateImage,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false); // State to track regeneration
  console.log('[RandomAgentCard] - agent:', agent);
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    
    try {
      const newAgent = generateRandomAgent();
      
      // Generate image using Leonardo API
      if (generateImage) {
        // Using the anime model and style from leonard_anime_styles.json
        const modelId = "e71a1c2f-4f80-4800-934f-2c68979d8cc8"; // Leonardo Anime XL
        const styleUUID = "b2a54a51-230b-4d4f-ad4e-8409bf58645f"; // Anime General
        
        // Create prompt based on agent characteristics
        const prompt = `Generate an anime character portrait of ${newAgent.name}, who is a ${newAgent.role}. 
                       Their personality can be described as ${newAgent.personality}. 
                       Style: high quality, detailed anime art, character portrait`;
        
        const imageResponse = await generateImage(prompt, modelId, styleUUID);
        
        // Update the agent's avatar with the new generated image
        if (imageResponse?.generations_by_pk?.generated_images?.[0]?.url) {
          newAgent.avatar = imageResponse.generations_by_pk.generated_images[0].url;
        }
      }

      setRandomAgents((prevAgents: Agent[]) => {
        // Check if the new agent's name or ID already exists
        while (prevAgents.some(a => a.name === newAgent.name || a.id === newAgent.id)) {
          Object.assign(newAgent, generateRandomAgent());
        }
        
        // Replace the current agent with the new one while maintaining max 3 agents
        const updatedAgents = prevAgents.map((a: Agent) =>
          a.id === agent.id ? { ...newAgent, id: newAgent.id } : a
        );
        return updatedAgents.slice(0, 3);
      });

    } catch (error) {
      console.error('Error generating new agent or image:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="relative">
      {/* Display if the agent is loaded or randomly generated */}
      <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs rounded px-2">
        {isLoadedAgent ? 'Loaded Agent' : 'Randomly Generated'}
      </div>
      {agent.placeholder ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/75">
          <p className="text-white">Regenerating...</p>
        </div>
      ) : (
        <div
          className="perspective w-64 h-[500px]"
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(agent);
          }}
        >
          <div
            className={`relative w-full h-full duration-500 preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden">
              <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-orange-500/30">
                {/* Image container - 80% of card height */}
                <div className="relative h-[400px]">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-16" />
                </div>

                {/* Title area - 20% of card height */}
                <div className="h-[100px] p-4 bg-gray-800/95">
                  <h3 className="text-xl font-bold text-gray-100 mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-orange-300 text-sm">{agent.role}</p>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-gray-800 rounded-lg p-4 shadow-xl border border-orange-500/30">
                {/* Header with small image */}
                <div className="flex gap-4 mb-4">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">
                      {agent.name}
                    </h3>
                    <p className="text-orange-400 text-sm">{agent.role}</p>
                  </div>
                </div>

                {/* Content sections */}
                <div className="space-y-4 overflow-auto max-h-[350px] pr-2">
                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-1">
                      <Heart className="w-4 h-4 text-orange-400" />
                      <span className="font-medium">Personality</span>
                    </div>
                    <p className="text-gray-400 text-sm">{agent.personality}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-1">
                      <MessageCircle className="w-4 h-4 text-orange-400" />
                      <span className="font-medium">Communication Style</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {agent.communicationStyle}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-1">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span className="font-medium">Emojis</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {Array.isArray(agent.emojis) ? agent.emojis.join(' ') : agentEmojis}
                  </p>
                  </div>
                </div>

                {/* Tags at bottom */}
                <div className="absolute bottom-12 left-4 right-4">
                  <div className="flex gap-2 flex-wrap">
                    {agent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-900/50 rounded-full text-xs text-orange-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button at bottom */}
                <div className="absolute bottom-2 left-4 right-4">
                  {isUserAgent ? (
                    <button
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 rounded-md hover:from-cyan-700 hover:to-orange-700 flex items-center justify-center gap-2 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(agent);
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Select Agent
                    </button>
                  ) : (
                    <button
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 rounded-md hover:from-cyan-700 hover:to-orange-700 flex items-center justify-center gap-2 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdd && onAdd(agent);
                      }}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Agent
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate button below the card */}
      {!isUserAgent && (
        <div className="mt-2 w-64 mx-auto">
          <RegenerateButton onRegenerate={handleRegenerate} />
        </div>
      )}

      {/* Placeholder while regenerating */}
      {isRegenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/75">
          <p className="text-white">Regenerating...</p>
        </div>
      )}
    </div>
  );
};

export default RandomAgentCard; 