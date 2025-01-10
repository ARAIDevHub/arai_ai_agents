import React, { useState, ChangeEvent, useEffect } from 'react';
import { Brain, Wand2, MessageSquare, Save, Sparkles } from 'lucide-react';
import { createAgent, getCharacters } from '../api/agentsAPI'; // Import the API functions

interface AgentDetails {
  backstory: string;
  communication_style: string | string[]; // Adjusted to handle both string and array
  emojis: string[];
  hashtags: string[];
  name: string;
  personality: string | string[]; // Adjusted to handle both string and array
  topic_expertise: string;
  universe: string;
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

interface SuggestionChipsProps {
  field: keyof AgentDetails;
  options: string[];
}

const AgentCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'style'>('basic');
  const [agent, setAgent] = useState<AgentDetails>({
    name: '',
    personality: '',
    communication_style: '',
    backstory: '',
    universe: '',
    topic_expertise: '',
    hashtags: [],
    emojis: [],
  });
  const [characters, setCharacters] = useState<Agent[]>([]); // State to hold fetched characters

  const suggestions = {
    personalities: [
      "Wise Mentor",
      "Quirky Inventor",
      "Strategic Advisor",
      "Creative Muse",
      "Technical Expert"
    ],
    universes: [
      "Cyberpunk Future",
      "Medieval Fantasy",
      "Modern Corporate",
      "Space Exploration",
      "Steampunk Era"
    ],
    communication_styles: [
      "Professional & Concise",
      "Friendly & Casual",
      "Academic & Detailed",
      "Witty & Humorous",
      "Socratic & Inquisitive"
    ]
  };

  // Function to handle suggestion chip clicks and update the agent's field with the selected value
  const handleSuggestionClick = (field: keyof AgentDetails, value: string): void => {
    setAgent(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Component to render suggestion chips for a given field with provided options
  const SuggestionChips: React.FC<SuggestionChipsProps> = ({ field, options }) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <button
          key={index}
          className="px-3 py-1 rounded-full bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-200 
                     border border-orange-500/30 transition-all duration-300 flex items-center"
          onClick={() => handleSuggestionClick(field, option)}
        >
          <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
          {option}
        </button>
      ))}
    </div>
  );

  // Input component for text input fields with styling
  const Input: React.FC<{
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }> = ({ ...props }) => (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
    />
  );

  // Textarea component for multi-line text input fields with styling
  const Textarea: React.FC<{
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
  }> = ({ ...props }) => (
    <textarea
      {...props}
      className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
    />
  );

  // Function to handle input changes and update the agent's corresponding field
  const handleInputChange = (field: keyof AgentDetails) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setAgent({ ...agent, [field]: e.target.value });
  };

  // Function to handle form submission, send agent data to the server, and reset the form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newAgent = await createAgent(agent); // Use the API function here
      console.log("Agent created:", newAgent);
      // Reset the form
      setAgent({
        name: '',
        personality: '',
        communication_style: '',
        backstory: '',
        universe: '',
        topic_expertise: '',
        hashtags: [],
        emojis: [],
      });
    } catch (error) {
      console.error("Error creating agent:", error);
    }
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const characters = await getCharacters(); // Call getCharacters on load
        setCharacters(characters); // Store fetched characters in state
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchCharacters();
  }, []); // Empty dependency array to run on mount

  // New function to handle character selection
  const handleCharacterSelect = (character: Agent) => {
    const agentDetails = character.agent.agent_details; // Access agent details
    setAgent({
      name: agentDetails.name,
      personality: Array.isArray(agentDetails.personality) ? agentDetails.personality.join(', ') : agentDetails.personality,
      communication_style: agentDetails.communication_style,
      backstory: agentDetails.backstory,
      universe: agentDetails.universe,
      topic_expertise: agentDetails.topic_expertise,
      hashtags: agentDetails.hashtags,
      emojis: agentDetails.emojis,
    }); // Update agent state with selected character's details
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Left Panel */}
      <div className="w-1/2 p-6 border-r border-orange-500/20">
        <div className="h-full flex flex-col space-y-6">
          {/* Character Info Card */}
          <div className="p-4 rounded-lg bg-slate-900/50 border border-orange-500/20">
            <div className="mb-4">
              <div className="text-lg font-semibold text-orange-400">Agent Name</div>
              <div className="text-gray-300">{agent.name}</div>
            </div>
            <div className="mb-4">
              <div className="text-lg font-semibold text-orange-400">Personality</div>
              <div className="text-gray-300">{agent.personality}</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-400">Communication Style</div>
              <div className="text-gray-300">{agent.communication_style}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Agent Name</label>
                  <Input
                    value={agent.name}
                    onChange={handleInputChange('name')}
                    placeholder="Enter agent name"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Universe</label>
                  <Input
                    value={agent.universe}
                    onChange={handleInputChange('universe')}
                    placeholder="Enter universe"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Topic Expertise</label>
                  <Input
                    value={agent.topic_expertise}
                    onChange={handleInputChange('topic_expertise')}
                    placeholder="Enter expertise areas"
                  />
                </div>
              </div>
            )}

            {activeTab === 'personality' && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Personality Type</label>
                  <SuggestionChips field="personality" options={suggestions.personalities} />
                  <Textarea
                    value={agent.personality}
                    onChange={handleInputChange('personality')}
                    placeholder="Describe agent personality"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Backstory</label>
                  <Textarea
                    value={agent.backstory}
                    onChange={handleInputChange('backstory')}
                    placeholder="Enter agent backstory"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Communication Style</label>
                  <SuggestionChips field="communication_style" options={suggestions.communication_styles} />
                  <Textarea
                    value={agent.communication_style}
                    onChange={handleInputChange('communication_style')}
                    placeholder="Describe communication style"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Hashtags</label>
                  <Input
                    value={agent.hashtags.join(', ')} // Join hashtags for display
                    onChange={handleInputChange('hashtags')}
                    placeholder="ai agent custom (without #)"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Emojis</label>
                  <Input
                    value={agent.emojis.join(' ')} // Join emojis for display
                    onChange={handleInputChange('emojis')}
                    placeholder="🤖 ✨ 💡"
                  />
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="mt-6 w-full px-4 py-2 rounded-md bg-gradient-to-r from-cyan-600 
                            to-orange-600 hover:from-cyan-700 hover:to-orange-700 text-white 
                            transition-all duration-300 flex items-center justify-center">
            <Save className="w-4 h-4 mr-2" />
            Save Agent
          </button>
        </form>

        {/* Character Selection Section */}
        <div className="w-1/2 p-6">
          <label className="text-sm text-cyan-200 block mb-2">Select Existing Character</label>
          <select
            onChange={(e) => {
              const selectedCharacter = characters.find(c => c.agent.agent_details.name === e.target.value);
              if (selectedCharacter) handleCharacterSelect(selectedCharacter);
            }}
            className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 text-white"
          >
            <option value="">-- Select a Character --</option>
            {characters.map((character, index) => (
              <option key={index} value={character.agent.agent_details.name}>{character.agent.agent_details.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AgentCreator;