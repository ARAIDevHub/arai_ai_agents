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

// Define the props for AgentCard
interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  onAdd?: (agent: Agent) => void; // Optional onAdd prop for random agents
  isUserAgent?: boolean; // Flag to indicate if it's a user agent
  setRandomAgents: React.Dispatch<React.SetStateAction<Agent[]>>; // Add setRandomAgents prop
  generateRandomAgent: () => Agent; // Add generateRandomAgent prop
  isLoadedAgent?: boolean; // New prop to indicate if the agent is loaded
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
      className="w-full mt-2 py-2 bg-purple-600 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
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

const RandomAgentCard: React.FC<AgentCardProps> = ({
  agent,
  onSelect,
  onAdd,
  isUserAgent,
  setRandomAgents,
  generateRandomAgent,
  isLoadedAgent,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false); // State to track regeneration

  const handleRegenerate = () => {
    setIsRegenerating(true); // Show placeholder

    // Simulate regeneration delay (remove in actual implementation)
    setTimeout(() => {
      setRandomAgents((prevAgents: Agent[]) =>
        prevAgents.map((a: Agent) =>
          a.id === agent.id ? generateRandomAgent() : a
        )
      );
      setIsRegenerating(false); // Hide placeholder
    }, 500); // Adjust delay as needed
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
              <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-purple-500/30">
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
                  <p className="text-purple-300 text-sm">{agent.role}</p>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
              <div className="w-full h-full bg-gray-800 rounded-lg p-4 shadow-xl border border-purple-500/30">
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
                    <p className="text-purple-400 text-sm">{agent.role}</p>
                  </div>
                </div>

                {/* Content sections */}
                <div className="space-y-4 overflow-auto max-h-[350px] pr-2">
                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-1">
                      <Heart className="w-4 h-4 text-purple-400" />
                      <span className="font-medium">Personality</span>
                    </div>
                    <p className="text-gray-400 text-sm">{agent.personality}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-1">
                      <MessageCircle className="w-4 h-4 text-purple-400" />
                      <span className="font-medium">Communication</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {agent.communicationStyle}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="font-medium">Abilities</span>
                    </div>
                    <ul className="text-gray-400 text-sm pl-4 list-disc space-y-1">
                      {agent.abilities.map((ability, index) => (
                        <li key={index}>{ability}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tags at bottom */}
                <div className="absolute bottom-12 left-4 right-4">
                  <div className="flex gap-2 flex-wrap">
                    {agent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-900/50 rounded-full text-xs text-purple-300"
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
                      className="w-full px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2"
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
                      className="w-full px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
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