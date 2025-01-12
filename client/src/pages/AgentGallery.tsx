import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  PlusCircle,
  CheckCircle,
  RefreshCcw,
} from 'lucide-react';
import image1 from '../assets/agent-images/agent1.jpg';
import image2 from '../assets/agent-images/agent2.jpg';
import image3 from '../assets/agent-images/agent3.jpg';
import image4 from '../assets/agent-images/agent4.jpg';

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
  onAdd?: (agent: Agent) => void; // Optional onAdd prop for random agents
  isUserAgent?: boolean; // Flag to indicate if it's a user agent
  onRegenerate?: (agentId: number) => void; // Optional onRegenerate prop
}

const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onSelect,
  onAdd,
  isUserAgent,
  onRegenerate,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative">
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
      {/* Regenerate icon */}
      {!isUserAgent && (
        <button
          className="absolute bottom-2 right-2 p-2 bg-gray-700 rounded-full hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onRegenerate && onRegenerate(agent.id);
          }}
        >
          <RefreshCcw className="w-4 h-4 text-gray-300" />
        </button>
      )}
    </div>
  );
};

const AgentGallery: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'random', or 'yourAgents'
  const [randomAgents, setRandomAgents] = useState<Agent[]>([]);
  const [yourAgents, setYourAgents] = useState<Agent[]>([]);

  const agentImages = [image1, image2, image3, image4];

  const generateRandomAgent = (): Agent => {
    const names = [
      'Empress',
      'Lovers',
      'Magician',
      'Hermit',
      'Hierophant',
      'The Chariot',
      'Strength',
      'The Wheel',
      'Justice',
      'The Hanged Man',
    ];
    const roles = [
      "Nature's Guardian",
      'Harmony Weaver',
      'Mystic Seer',
      'Wise Wanderer',
      'Spiritual Guide',
      'Divine Messenger',
      'Inner Power',
      'Karmic Cycle',
      'Cosmic Balance',
      'Spiritual Surrender',
    ];
    const personalities = [
      'Warm, nurturing',
      'Balanced, intuitive',
      'Mysterious, insightful',
      'Solitary, contemplative',
      'Traditional, knowledgeable',
      'Dynamic, purposeful',
      'Courageous, determined',
      'Cyclical, transformative',
      'Fair, objective',
      'Sacrificial, enlightened',
    ];
    const communicationStyles = [
      'Speaks with gentle wisdom',
      'Communicates through heart-centered wisdom',
      'Speaks in riddles and metaphors',
      'Shares wisdom through silence and observation',
      'Conveys knowledge through teachings and rituals',
      'Speaks with clarity and direction',
      'Expresses with passion and conviction',
      'Communicates through symbols and omens',
      'Speaks with truth and integrity',
      'Shares insights from higher realms',
    ];
    const abilities = [
      ['Nature attunement', 'Growth facilitation', 'Abundance manifestation'],
      ['Relationship guidance', 'Choice illumination', 'Soul connection'],
      ['Divination', 'Energy manipulation', 'Reality crafting'],
      ['Introspection', 'Spiritual insight', 'Pathfinding'],
      ['Sacred knowledge', 'Ritual mastery', 'Blessing bestowal'],
      ['Guidance', 'Protection', 'Swift action'],
      ['Inner strength', 'Courage', 'Resilience'],
      ['Fate reading', 'Destiny shaping', 'Karma balancing'],
      ['Truth seeking', 'Equilibrium restoration', 'Moral compass'],
      ['Spiritual awakening', 'Letting go', 'Higher perspective'],
    ];
    const tags = [
      ['#nature', '#nurture', '#abundance'],
      ['#harmony', '#choice', '#connection'],
      ['#mystic', '#insight', '#manifestation'],
      ['#wisdom', '#solitude', '#enlightenment'],
      ['#spirituality', '#tradition', '#guidance'],
      ['#divine', '#purpose', '#action'],
      ['#strength', '#courage', '#innerpower'],
      ['#karma', '#destiny', '#transformation'],
      ['#justice', '#balance', '#truth'],
      ['#surrender', '#awakening', '#higherconsciousness'],
    ];

    const randomIndex = Math.floor(Math.random() * names.length);

    return {
      id: Date.now(), // Unique ID for each random agent
      name: names[randomIndex],
      avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
      role: roles[randomIndex],
      shortDescription: '...', // You can add short descriptions if needed
      tags: tags[randomIndex],
      personality: personalities[randomIndex],
      communicationStyle: communicationStyles[randomIndex],
      abilities: abilities[randomIndex],
    };
  };

  const handleAddAgent = (agent: Agent) => {
    setYourAgents((prevAgents) => [...prevAgents, agent]);
    setRandomAgents((prevAgents) => prevAgents.filter((a) => a.id !== agent.id));
  };

  const handleRegenerateAgent = (agentId: number) => {
    setRandomAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === agentId ? generateRandomAgent() : agent
      )
    );
  };

  const handleRegenerateAll = () => {
    const newRandomAgents = [...Array(3)].map(() => generateRandomAgent());
    setRandomAgents(newRandomAgents);
  };

  // Initial agents (3 random, 5 your agents)
  const initialRandomAgents = [...Array(3)].map(() => generateRandomAgent());
  const initialYourAgents = [...Array(5)].map(() => {
    const agent = generateRandomAgent();
    return { ...agent, id: agent.id + 1000 }; // Ensure unique IDs
  });

  useEffect(() => {
    setRandomAgents(initialRandomAgents);
    setYourAgents(initialYourAgents);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${
                filter === 'all' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                filter === 'random' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
              onClick={() => setFilter('random')}
            >
              Random
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                filter === 'yourAgents' ? 'bg-purple-600' : 'bg-gray-700'
              }`}
              onClick={() => setFilter('yourAgents')}
            >
              Your Agents
            </button>
          </div>
          <h1 className="text-2xl font-bold">Mystic Agents Gallery</h1>
          {(filter === 'all' || filter === 'random') && (
            <button
              className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700"
              onClick={handleRegenerateAll}
            >
              Regenerate All
            </button>
          )}
        </header>

        {/* Agents Section */}
        <div>
          {/* All Agents */}
          {filter === 'all' && (
            <>
              <h2 className="text-xl font-semibold mb-4">Random Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {randomAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    onAdd={handleAddAgent}
                    isUserAgent={false}
                    onRegenerate={handleRegenerateAgent}
                  />
                ))}
              </div>
              <h2 className="text-xl font-semibold mt-8 mb-4">Your Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {yourAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    onAdd={handleAddAgent}
                    isUserAgent={true}
                  />
                ))}
              </div>
            </>
          )}

          {/* Random Agents */}
          {filter === 'random' && (
            <>
              <h2 className="text-xl font-semibold mb-4">Random Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {randomAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    onAdd={handleAddAgent}
                    isUserAgent={false}
                    onRegenerate={handleRegenerateAgent}
                  />
                ))}
              </div>
            </>
          )}

          {/* Your Agents */}
          {filter === 'yourAgents' && (
            <>
              <h2 className="text-xl font-semibold mb-4">Your Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {yourAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    onAdd={handleAddAgent}
                    isUserAgent={true}
                  />
                ))}
              </div>
            </>
          )}
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