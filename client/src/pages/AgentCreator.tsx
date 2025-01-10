import React, { useState, ChangeEvent, useEffect } from 'react';
import { Brain, Wand2, MessageSquare, Save, Sparkles, RefreshCcw } from 'lucide-react';
import { createAgent, getCharacters } from '../api/agentsAPI'; // Import the API functions
import agent1 from '../assets/agent-images/agent1.jpg';
import agent2 from '../assets/agent-images/agent2.jpg';
import agent3 from '../assets/agent-images/agent3.jpg';
import agent4 from '../assets/agent-images/agent4.jpg';

interface AgentDetails {
  backstory: string;
  communication_style: string[];
  emojis: string[];
  hashtags: string[];
  name: string;
  personality: string[];
  topic_expertise: string[];
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

interface TraitButtonsProps {
  field: keyof AgentDetails;
  options: string[];
}

const agentImages = [agent1, agent2, agent3, agent4];

const AgentCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'style'>('basic');
  const [agent, setAgent] = useState<AgentDetails>({
    name: '',
    personality: [],
    communication_style: [],
    backstory: '',
    universe: '',
    topic_expertise: [],
    hashtags: [],
    emojis: [],
  });
  const [characters, setCharacters] = useState<Agent[]>([]); // State to hold fetched characters

  const mockImages = [0, 1, 2, 3];

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
  const handleTraitButtonsClick = (field: keyof AgentDetails, value: string): void => {
    setAgent(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Component to render suggestion chips for a given field with provided options
  const TraitButtons: React.FC<TraitButtonsProps> = ({ field, options }) => (
    console.log("[SuggestionChips] field:", field, "options:", options),
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <button
          key={index}
          className="px-3 py-1 rounded-full bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-200 
                     border border-orange-500/30 transition-all duration-300 flex items-center"
          onClick={() => handleTraitButtonsClick(field, option)}
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
        personality: [],
        communication_style: [],
        backstory: '',
        universe: '',
        topic_expertise: [],
        hashtags: [],
        emojis: [],
      });
    } catch (error) {
      console.error("Error creating agent:", error);
    }
  };

  // Function to load characters from the server and set them in the state
  useEffect(() => {
    const loadCharacters = async () => {
      console.log("[loadCharacters] Loading characters...");
      try {
        const charactersData = await getCharacters();
        console.log('Raw characters data:', charactersData);

        if (!Array.isArray(charactersData)) {
          console.error('Expected array of characters, received:', typeof charactersData);
          return;
        }

        // Map the raw data to a simpler structure we need
        const processedCharacters = charactersData.map(char => {
          const { agent } = char;
          const {
            agent_details: {
              name = '',
              personality = [],
              communication_style = [],
              backstory = '',
              universe = '',
              topic_expertise = [],
              hashtags = [],
              emojis = []
            } = {} // Default empty object if agent_details is undefined
          } = agent || {}; // Default empty object if agent is undefined

          return {
            agent: {
              agent_details: {
                name,
                personality: Array.isArray(personality) ? personality : [],

                communication_style: Array.isArray(communication_style) ? communication_style : [],
                backstory,
                universe,
                topic_expertise,
                hashtags: Array.isArray(hashtags) ? hashtags : [],
                emojis: Array.isArray(emojis) ? emojis : []
              }
            }
          };
        });

        console.log('Processed characters:', processedCharacters);
        setCharacters(processedCharacters);

        // If there are characters, set the first one as default
        if (processedCharacters.length > 0) {
          const firstChar = processedCharacters[0].agent.agent_details;
          setAgent({
            name: firstChar.name,
            personality: firstChar.personality,
            communication_style: firstChar.communication_style,
            backstory: firstChar.backstory,
            universe: firstChar.universe,
            topic_expertise: firstChar.topic_expertise,
            hashtags: firstChar.hashtags,
            emojis: firstChar.emojis
          });
        }

      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };

    loadCharacters();
  }, []);

  // New function to handle character selection
  const handleCharacterSelect = (character: Agent) => {
    const details = character.agent?.agent_details;
    
    if (!details) {
      console.error('Selected character has invalid data structure');
      return;
    }

    setAgent({
      name: details.name,
      personality: Array.isArray(details.personality) ? details.personality : [],
      communication_style: details.communication_style,
      backstory: details.backstory,
      universe: details.universe, 
      topic_expertise: Array.isArray(details.topic_expertise) ? details.topic_expertise : [],
      hashtags: Array.isArray(details.hashtags) ? details.hashtags : [],
      emojis: Array.isArray(details.emojis) ? details.emojis : []
    });
    console.log("[handleCharacterSelect] The current agent is :", agent); 
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Left Panel */}
      <div className="w-1/2 p-6 border-r border-orange-500/20">
        <div className="h-full flex flex-col space-y-6">
          {/* Main Character Image */}
          <div className="relative aspect-square rounded-lg bg-gradient-to-br from-slate-900/80 
                         via-cyan-900/20 to-orange-900/20 border border-orange-500/20 flex items-center justify-center">
            <Brain className="w-32 h-32 text-cyan-400" />
            <button className="absolute bottom-4 right-4 px-4 py-2 rounded-md bg-gradient-to-r 
                              from-orange-600 to-red-600 text-white flex items-center">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Generate New
            </button>
          </div>

          {/* Image Selection Grid */}
          <div className="grid grid-cols-4 gap-4">
            {mockImages.map((_, index) => (
              <div 
                key={index}
                className={`aspect-square bg-gradient-to-br from-slate-900/80 via-cyan-900/20 
                           to-orange-900/20 rounded-lg cursor-pointer ${
                           agent.selectedImage === index ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => setAgent({...agent, selectedImage: index})}
              />
            ))}
          </div>

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
        <div className="flex gap-4 mb-6 bg-slate-900/50 p-2 rounded-lg">
          {[
            { id: 'basic' as const, icon: Brain, label: 'Basic Info' },
            { id: 'personality' as const, icon: Wand2, label: 'Personality' },
            { id: 'style' as const, icon: MessageSquare, label: 'Style' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-white
                         ${activeTab === id ? 'bg-gradient-to-r from-cyan-600 to-orange-600' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

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
                  <TraitButtons field="personality" options={agent.personality} />
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
                  <TraitButtons field="communication_style" options={suggestions.communication_styles} />
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
        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-orange-500/20">
          <label className="text-sm text-cyan-200 block mb-2">
            Select Existing Character
          </label>
          <select
            onChange={(e) => {
              const selected = characters.find(
                c => c.agent?.agent_details?.name === e.target.value
              );
              if (selected) handleCharacterSelect(selected);
            }}
            className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                       text-white focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
          >
            <option value="">-- Select a Character --</option>
            {characters.map((char, idx) => (
              <option 
                key={idx} 
                value={char.agent?.agent_details?.name}
              >
                {char.agent?.agent_details?.name || 'Unnamed Character'}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AgentCreator;