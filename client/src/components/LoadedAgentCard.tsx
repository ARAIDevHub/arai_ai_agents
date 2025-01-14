import React, { useState } from 'react';
import { Heart, MessageCircle, Sparkles, CheckCircle } from 'lucide-react';
import { Agent } from '../interfaces/AgentInterfaces';
import image1 from '../assets/agent-images/agent1.jpg';
import image2 from '../assets/agent-images/agent2.jpg';
import image3 from '../assets/agent-images/agent3.jpg';
import image4 from '../assets/agent-images/agent4.jpg';



// Define the props for AgentCard
interface AgentCardProps {
  agent : object, // TODO: change to Agent
  // onSelect: (agent: Agent) => void;
  onSelect: (agent: object) => void;

}

const LoadedAgentCard: React.FC<AgentCardProps> = ({ agent, onSelect }) => {
  const agentImages = [image1, image2, image3, image4];
  console.log('[LoadedAgentCard] - agent:', agent);  
  agent = agent.agent
  // console.log('[LoadedAgentCard] - agent.agent_details.name:', agent.agent_details.name);
  const [isFlipped, setIsFlipped] = useState(false);
  const agentName = agent.agent_details?.name || 'Unknown Agent';
  const agentPersonality = agent.agent_details?.personality || [];
  const agentCommunicationStyle = agent.agent_details?.communication_style || [];
  const agentBackstory = agent.agent_details?.backstory || 'No backstory available';
  const agentHashtags = agent.agent_details?.hashtags || [];
  const agentEmojis = agent.agent_details?.emojis || [];
  const agentTopicExpertise = agent.agent_details?.topic_expertise || [];
  const concept = agent.concept || 'No concept available';

  console.log('[LoadedAgentCard] - agentName:', agentName);
  console.log('[LoadedAgentCard] - agentPersonality:', agentPersonality);
  console.log('[LoadedAgentCard] - agentCommunicationStyle:', agentCommunicationStyle);
  console.log('[LoadedAgentCard] - agentAbilities:', agentBackstory);
  console.log('[LoadedAgentCard] - agentHashtags:', agentHashtags);
  console.log('[LoadedAgentCard] - agentEmojis:', agentEmojis);
  console.log('[LoadedAgentCard] - concept:', concept);

  return (
    <div className="relative">
      {/* Label to indicate it's a loaded agent */}
      <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs rounded px-2">
        Loaded Agent
      </div>
      <div
        className="perspective w-64 h-[500px]"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => onSelect(agent)}
      >
        <div
          className={`relative w-full h-full duration-500 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-orange-500/30">
              <div className="relative h-[400px]">
                <img
                  src={agentImages[Math.floor(Math.random() * 4)]}
                  alt={agentName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-16" />
              </div>
              <div className="h-[100px] p-4 bg-gray-800/95">
                <h3 className="text-xl font-bold text-gray-100 mb-1">
                  {agentName}
                </h3>
                <p className="text-orange-300 text-sm">{agentName}</p>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <div className="w-full h-full bg-gray-800 rounded-lg p-4 shadow-xl border border-orange-500/30">
                {/* Header with small image */}
                <div className="flex gap-4 mb-4">
                  <img
                  src={agentImages[Math.floor(Math.random() * 4)]}
                  alt={agentName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">
                      {agentName}
                    </h3>
                    <p className="text-orange-400 text-sm">{Array.isArray(agentTopicExpertise) ? agentTopicExpertise[0] : agentTopicExpertise} Expert</p>
                  </div>
                </div>
              <div className="space-y-4 overflow-auto max-h-[350px] pr-2">
                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <Heart className="w-4 h-4 text-orange-400" />
                    <span className="font-medium">Personality</span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {Array.isArray(agentPersonality) ? agentPersonality.join(', ') : agentPersonality}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <MessageCircle className="w-4 h-4 text-orange-400" />
                    <span className="font-medium">Communication Style</span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {Array.isArray(agentCommunicationStyle) ? agentCommunicationStyle.join(', ') : agentCommunicationStyle}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-300 mb-1">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span className="font-medium mb-2">Emojis</span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {Array.isArray(agentEmojis) ? agentEmojis.join(' ') : agentEmojis}
                  </p>
                </div>
              </div>
              {/* Tags */}
              <div className="relative">
                <div className="flex gap-2 flex-wrap">
                  {(Array.isArray(agentHashtags) ? agentHashtags.slice(0, 4) : []).map((hashtag) => (
                    <span
                      className="px-2 py-1 bg-orange-900/50 rounded-full text-xs text-orange-300"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Action button */}
              <div className="absolute bottom-2 left-4 right-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadedAgentCard;
