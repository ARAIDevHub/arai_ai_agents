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
import agentsData from '../assets/agents.json'; // Import the JSON file
import { Agent } from '../interfaces/AgentInterfaces';
import useCharacters from '../hooks/useCharacters';
import RandomAgentCard from '../components/RandomAgentCard'; // Import the new component
import LoadedAgentCard from '../components/LoadedAgentCard'; // Import the new component

// // Define the Agent type
// interface Agent {
//   id: number;
//   name: string;
//   avatar: string;
//   role: string;
//   shortDescription?: string; // Optional property
//   tags: string[];
//   personality: string;
//   communicationStyle: string;
//   abilities: string[];
//   placeholder?: boolean; // Add optional placeholder property
// }

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

const AgentGallery: React.FC = () => {
  const { characters: loadedAgents, loading, error } = useCharacters();
  console.log('[AgentGallery] - loaded agents:', loadedAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'random', or 'yourAgents'
  const [randomAgents, setRandomAgents] = useState<Agent[]>([]);
  const [yourAgents, setYourAgents] = useState<Agent[]>([]);

  const agentImages = [image1, image2, image3, image4];

  // Define generateRandomAgent inside AgentGallery so it's accessible to child components
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
      'The Wheel',
      'Justice',
      'The Hanged Man',
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

  const handleRegenerateAll = () => {
    // Set all random agents to a placeholder state
    setRandomAgents(randomAgents.map(agent => ({
      ...agent,
      placeholder: true
    })));

    // Simulate regeneration delay (remove in actual implementation)
    setTimeout(() => {
      const newRandomAgents = [...Array(3)].map(() => generateRandomAgent());
      setRandomAgents(newRandomAgents);
    }, 500); // Adjust delay as needed
  };

  useEffect(() => {
    // Load agents from JSON
    const randomAgents = [...Array(3)].map((_, index) => {
      const randomIndex = Math.floor(Math.random() * agentsData.length);
      const agent = agentsData[randomIndex];
      return {
        ...agent,
        id: Date.now() + index, // Ensure unique IDs by adding index
        avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
      }; // Ensure unique IDs
    });

    const yourAgents = [...Array(5)].map((_, index) => {
      const agent = agentsData[index % agentsData.length]; // Cycle through agents
      return {
        ...agent,
        id: Date.now() + index + 1000, // Ensure unique IDs by adding index
        avatar: agentImages[Math.floor(Math.random() * agentImages.length)],
      }; // Ensure unique IDs
    });

    setRandomAgents(randomAgents);
    setYourAgents(yourAgents);
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
          <h1 className="text-2xl font-bold text-center flex-grow">Mystic Agents Gallery</h1>
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
                  <RandomAgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    onAdd={handleAddAgent}
                    isUserAgent={false}
                    setRandomAgents={setRandomAgents}
                    generateRandomAgent={generateRandomAgent}
                    isLoadedAgent={true}
                  />
                ))}
              </div>
              <h2 className="text-xl font-semibold mt-8 mb-4">Your Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {loadedAgents.map((agent) => (
                   <LoadedAgentCard
                  //  key={agent.id}
                   agent={agent}
                   onSelect={setSelectedAgent}
                  //  onAdd={handleAddAgent}
                  //  isUserAgent={false}
                  //  setRandomAgents={setRandomAgents}
                  //  generateRandomAgent={generateRandomAgent}
                  //  isLoadedAgent={true}
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
                  <RandomAgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={setSelectedAgent}
                    onAdd={handleAddAgent}
                    isUserAgent={false}
                    setRandomAgents={setRandomAgents}
                    generateRandomAgent={generateRandomAgent}
                    isLoadedAgent={true}
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
                {loadedAgents.map((agent) => (
          <LoadedAgentCard
          key={agent.id}
          agent={agent}
          onSelect={setSelectedAgent}
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