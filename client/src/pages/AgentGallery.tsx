import React, { useState } from 'react';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';

// Define the Agent type
interface Agent {
  id: number;
  name: string;
  avatar: string;
  role: string;
  shortDescription?: string; // Optional property
  tags: string[];
  personality: string;
  communicationStyle: string;
  abilities: string[];
}

// Define the props for AgentCard
interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
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
            <div className="absolute bottom-4 left-4 right-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentGallery: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const agents: Agent[] = [
    {
      id: 1,
      name: "The Empress",
      avatar: "/api/placeholder/400/400",
      role: "Nature's Guardian",
      shortDescription: "Nurturing guide of growth and abundance",
      tags: ["#nature", "#nurture", "#abundance"],
      personality: "Warm, nurturing, and connected to the natural world",
      communicationStyle: "Speaks with gentle wisdom and natural metaphors",
      abilities: [
        "Nature attunement",
        "Growth facilitation",
        "Abundance manifestation",
      ],
    },
    {
      id: 2,
      name: "The Lovers",
      avatar: "/api/placeholder/400/400",
      role: "Harmony Weaver",
      tags: ["#harmony", "#choice", "#connection"],
      personality: "Balanced, intuitive, and deeply connected",
      communicationStyle: "Communicates through heart-centered wisdom",
      abilities: [
        "Relationship guidance",
        "Choice illumination",
        "Soul connection",
      ],
    },
    // Add more agents to fill the grid...
  ];

  // Duplicate agents to fill the grid
  const displayAgents: Agent[] = [...Array(12)].map((_, i) => ({
    ...agents[i % agents.length],
    id: i + 1,
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Mystic Agents Gallery</h1>
          <button className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700">
            Create Agent
          </button>
        </header>

        <div className="flex flex-wrap gap-6 justify-center">
          {displayAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onSelect={setSelectedAgent}
            />
          ))}
        </div>

        {/* Display the selected agent's name */}
        {selectedAgent && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold">Selected Agent:</h2>
            <p>{selectedAgent.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentGallery;