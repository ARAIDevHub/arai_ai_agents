import React, { useState } from 'react';
import { Heart, MessageCircle, Sparkles, CheckCircle } from 'lucide-react';
import { Agent } from '../interfaces/AgentInterfaces';

// Define the props for AgentCard
interface AgentCardProps {
  agent: Agent,
  onSelect: (agent: Agent) => Promise<void>;
  isSelected: boolean;
}

const LoadedAgentCard: React.FC<AgentCardProps> = ({ agent, onSelect, isSelected }) => {
  const agentData = agent.agent;
  const [isFlipped, setIsFlipped] = useState(false);
  const agentName = agentData?.agent_details?.name || 'Unknown Agent';
  const agentPersonality = agentData?.agent_details?.personality || [];
  const agentCommunicationStyle = agentData?.agent_details?.communication_style || [];
  const agentHashtags = agentData?.agent_details?.hashtags || [];
  const agentEmojis = agentData?.agent_details?.emojis || [];
  const agentTopicExpertise = agentData?.agent_details?.topic_expertise || [];
  const profileImageUrl = agentData?.profile_image?.details?.url || "";
  const [isSelecting, setIsSelecting] = useState(false);

  const handleCardClick = async () => {
    try {
      await onSelect(agent);
    } catch (error) {
      console.error('[LoadedAgentCard] Error selecting agent:', error);
    }
  };

    return (
    <div className="relative">
      <div
        className="perspective w-64 h-[500px]"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={handleCardClick}
      >
        <div
          className={`relative w-full h-full duration-500 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-slate-900/80 rounded-lg overflow-hidden shadow-xl border border-orange-500/30">
              <div className="relative h-[400px]">
                <img
                  src={profileImageUrl || 'https://via.placeholder.com/400x400?text=Loading...'}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-16" />
              </div>
              <div className={`h-[100px] p-4 bg-slate-900/80 transition-opacity duration-200 ${
                isFlipped ? 'opacity-0' : 'opacity-100'
              }`}>
                <h3 className="text-xl font-bold text-gray-100 mb-1">
                  {agentName}
                </h3>
                <p className="text-orange-300 text-sm">{agentName}</p>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-slate-900/80 rounded-lg p-4 shadow-xl border border-orange-500/30">
                {/* Header with small image */}
                <div className="flex gap-4 mb-4">
                  <img
                  src={profileImageUrl || 'https://via.placeholder.com/400x400?text=Loading...'}
                  alt=""
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-100 truncate">
                      {agentName}
                    </h3>
                    <p className="text-orange-400 text-sm truncate">
                      {Array.isArray(agentTopicExpertise) ? agentTopicExpertise[0] : agentTopicExpertise} Expert
                    </p>
                  </div>
                </div>
              <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2 pb-16">
                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <Heart className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="font-medium">Personality</span>
                  </div>
                  <p className="text-gray-400 text-sm break-words line-clamp-3">
                    {Array.isArray(agentPersonality) ? agentPersonality.join(', ') : agentPersonality}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <MessageCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="font-medium">Communication Style</span>
                  </div>
                  <p className="text-gray-400 text-sm break-words line-clamp-3">
                    {Array.isArray(agentCommunicationStyle) ? agentCommunicationStyle.join(', ') : agentCommunicationStyle}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <Sparkles className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="font-medium">Emojis</span>
                  </div>
                  <p className="text-gray-400 text-sm break-words line-clamp-2">
                    {Array.isArray(agentEmojis) ? agentEmojis.join(' ') : agentEmojis}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap">
                  {(Array.isArray(agentHashtags) ? agentHashtags.slice(0, 4) : []).map((hashtag) => (
                    <span
                      key={hashtag}
                      className="px-2 py-1 bg-orange-900/50 rounded-full text-xs text-orange-300 truncate max-w-[150px]"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Action button  - Update once we have a global Store and s*/}
              <div className="absolute bottom-2 left-4 right-4">
                <div className="bg-slate-900 rounded-md">
                  <div className="relative px-4 py-2">
                    <button
                      className={`w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 rounded-md 
                                  flex items-center justify-center gap-2 text-white
                                  ${isSelecting || isSelected ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-700 hover:to-orange-700'}`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (isSelecting || isSelected) return;
                        setIsSelecting(true);
                        try {
                          await onSelect(agent);
                        } finally {
                          setIsSelecting(false);
                        }
                      }}
                      disabled={isSelecting || isSelected}
                    >
                      <CheckCircle className={`w-4 h-4 ${isSelecting ? 'animate-spin' : ''}`} />
                      {isSelected ? 'Selected' : isSelecting ? 'Selecting...' : 'Select Agent'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadedAgentCard;
