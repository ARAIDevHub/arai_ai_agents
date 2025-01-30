import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle,
  RefreshCcw,
} from 'lucide-react';
import { Agent } from '../interfaces/AgentInterfaces';
import LoadingBar from './LoadingBar';

// Define the props for AgentCard
interface RandomAgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => Promise<void>;
  onAddAgent: (agent: Agent) => void;
  isUserAgent: boolean;
  setRandomAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  generateRandomAgentData: () => Promise<Agent>;
  isLoadedAgent: boolean;
  onRegenerate: (agentId: string) => Promise<void>;
  isLoading?: boolean;
  isExample?: boolean;
}

const RandomAgentCard: React.FC<RandomAgentCardProps> = ({
  agent,
  onSelect,
  onAddAgent,
  isUserAgent,
  onRegenerate,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const agentName = agent.name || 'Unknown Agent';
  const agentPersonality = Array.isArray(agent.personality) ? agent.personality : [];
  const agentCommunicationStyle = Array.isArray(agent.communicationStyle) ? agent.communicationStyle : [];
  const agentEmojis = Array.isArray(agent.emojis) ? agent.emojis : [];
  const agentTags = Array.isArray(agent.tags) ? agent.tags : [];
  const profileImageUrl = agent.avatar || "";
  const [showNewContent, setShowNewContent] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const backImageUrl = agent.backgroundImageUrl;
  console.log("RandomAgent backImageUrl", backImageUrl);

  useEffect(() => {
    let intervalId: number | undefined;
    
    if (agent.isLoading || isRegenerating) {
      // Reset states when loading starts
      setLoadingProgress(0);
      setShowNewContent(false);
      
      // Immediately start filling to 30%
      setLoadingProgress(30);
      
      // Start progress up to 90%
      intervalId = window.setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 90) {
            return Math.min(prev + 1, 90);
          }
          return prev;
        });
      }, 30);
    } else if (loadingProgress > 0) {
      // When regeneration is complete, quickly fill to 100%
      if (intervalId !== undefined) clearInterval(intervalId);
      setLoadingProgress(100);
      
      // Show new content after progress bar completes
      const timeout = setTimeout(() => {
        setLoadingProgress(0);
        setShowNewContent(true);
      }, 500);
      
      return () => clearTimeout(timeout);
    }

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [agent.isLoading, isRegenerating]);

  const addButton = agent.isExample ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelect(agent);
      }}
      className="opacity-50 cursor-not-allowed bg-gray-500 text-white px-4 py-2 rounded"
    >
      Example Agent
    </button>
  ) : isAdded ? (
    <button
      className="opacity-50 cursor-not-allowed bg-green-600 text-white px-4 py-2 rounded"
      disabled
      onClick={(e) => e.stopPropagation()}
    >
      Added ✓
    </button>
  ) : (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        if (isRegenerating) return;
        setIsRegenerating(true);
        try {
          await onAddAgent(agent);
          setIsAdded(true);
        } finally {
          setIsRegenerating(false);
        }
      }}
      disabled={isRegenerating}
      className={`bg-gradient-to-r from-cyan-600 to-orange-600 text-white px-4 py-2 rounded
                  ${isRegenerating ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-700 hover:to-orange-700'}`}
    >
      {isRegenerating ? 'Adding...' : 'Add Agent'}
    </button>
  );

  const selectButton = (
    <button
      className={`w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 rounded-md 
                  flex items-center justify-center gap-2 text-white
                  ${isSelecting ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-700 hover:to-orange-700'}`}
      onClick={async (e) => {
        e.stopPropagation();
        if (isSelecting) return;
        setIsSelecting(true);
        try {
          await onSelect(agent);
        } finally {
          setIsSelecting(false);
        }
      }}
      disabled={isSelecting}
    >
      <CheckCircle className={`w-4 h-4 ${isSelecting ? 'animate-spin' : ''}`} />
      {isSelecting ? 'Selecting...' : 'Select Agent'}
    </button>
  );

  return (
    <div className="relative">
      {/* <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs rounded px-2">
        {isUserAgent ? 'Loaded Agent' : 'Randomly Generated'}
      </div> */}
      <div
        className="perspective w-64 h-[500px]"
        onMouseEnter={() => !isRegenerating && setIsFlipped(true)}
        onMouseLeave={() => !isRegenerating && setIsFlipped(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (!isRegenerating) {
            onSelect(agent);
          }
        }}
      >
        <div
          className={`relative w-full h-full duration-500 preserve-3d ${
            isFlipped && !isRegenerating ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-slate-900/80 rounded-lg overflow-hidden shadow-xl border border-orange-500/30">
              <div className="relative h-[400px]">
                {(!showNewContent || agent.isLoading || isRegenerating || loadingProgress > 0) ? (
                  <div className="w-full h-full bg-slate-900/80 flex items-center justify-center">
                    <div className="w-3/4">
                      <LoadingBar progress={loadingProgress} />
                    </div>
                  </div>
                ) : (
                  <img
                    src={agent.avatar || ''}
                    alt={agent.avatar ? '' : 'Please regenerate again'}
                    className="w-full h-full object-cover"
                    style={{ display: agent.avatar ? 'block' : 'none' }}
                  />
                )}
                {!agent.avatar && (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Please regenerate again
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-16" />
              </div>
              {/* Only show name and role when not flipped */}
              <div className={`h-[100px] p-4 bg-slate-900/80 transition-opacity duration-200 ${
                isFlipped ? 'opacity-0' : 'opacity-100'
              }`}>
                <h3 className="text-xl font-bold text-gray-100 mb-1 truncate">
                  {agentName}
                </h3>
                <p className="text-orange-300 text-sm truncate">{agent.role}</p>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-slate-900/80 rounded-lg p-4 shadow-xl border border-orange-500/30 flex flex-col relative">
              {/* Add background image with opacity */}
              {backImageUrl && (
                <img
                  src={backImageUrl}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              {/* Header with small image */}
              <div className="flex gap-4 mb-4 relative z-10">
                <img
                  src={profileImageUrl}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <h3 className="text-xl font-bold text-gray-100 truncate">
                    {agentName}
                  </h3>
                  <p className="text-orange-400 text-sm truncate">{agent.role}</p>
                </div>
              </div>

              {/* Content sections with better overflow handling */}
              <div className="space-y-4 overflow-y-auto flex-grow mb-4 pr-2">
                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <Heart className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="font-medium">Personality</span>
                  </div>
                  <p className="text-gray-400 text-sm break-words line-clamp-3">
                    {agentPersonality.join(', ')}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <MessageCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="font-medium">Communication Style</span>
                  </div>
                  <p className="text-gray-400 text-sm break-words line-clamp-3">
                    {agentCommunicationStyle.join(', ')}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="font-medium">Emojis</span>
                  </div>
                  <p className="text-gray-400 text-sm break-words line-clamp-2">
                    {agentEmojis.join(' ')}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {agentTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-900/50 rounded-full text-xs text-orange-300 truncate max-w-[150px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action button - with solid background */}
              <div className="absolute bottom-2 left-4 right-4">
                {/* Solid background container */}
                <div className="bg-slate-900 rounded-md"> {/* Removed opacity, added rounded corners */}
                  <div className="relative px-4 py-2"> {/* Added some vertical padding */}
                    {isUserAgent ? selectButton : addButton}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regenerate button below the card */}
      {!isUserAgent && (
        <div className="mt-2 w-64 mx-auto">
          <button
            data-agent-id={agent.id}
            className={`w-full mt-2 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 rounded-md 
                        flex items-center justify-center gap-2 text-white
                        ${isRegenerating ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-700 hover:to-orange-700'}`}
            onClick={async (e) => {
              e.stopPropagation();
              if (isRegenerating) return;
              setIsRegenerating(true);
              try {
                await onRegenerate(agent.id?.toString() || Math.random().toString());
              } finally {
                setIsRegenerating(false);
              }
            }}
            disabled={isRegenerating}
          >
            <RefreshCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RandomAgentCard; 