import React, { useState, ChangeEvent, useEffect } from 'react';
import { Brain, Wand2, MessageSquare, Save, Sparkles, RefreshCcw } from 'lucide-react';
import { createAgent, getCharacters } from '../api/agentsAPI'; // Import the API functions
import agent1 from '../assets/agent-images/agent1.jpg';
import agent2 from '../assets/agent-images/agent2.jpg';
import agent3 from '../assets/agent-images/agent3.jpg';
import agent4 from '../assets/agent-images/agent4.jpg';
import { AgentDetails, Agent } from '../interfaces/AgentInterfaces'; // Import the interfaces
import TraitButtons from '../components/TraitButtons'; // Import the new TraitButtons component

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
    selectedImage: undefined,
  });
  const [characters, setCharacters] = useState<Agent[]>([]); // State to hold fetched characters

  // Input component for text input fields with styling
  const Input: React.FC<{
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    style?: React.CSSProperties;
  }> = ({ style, ...props }) => (
    <input
      {...props}
      style={style}
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
    const value = e.target.value;
    
    // Handle array fields
    if (field === 'personality' || field === 'communication_style' || field === 'topic_expertise') {
      setAgent(prev => ({
        ...prev,
        [field]: value.split(',').map(item => item.trim()).filter(item => item !== '')
      }));
    } else {
      setAgent(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
        selectedImage: undefined,  // Reset image selection

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
          const { agent, concept = '' } = char; // Add concept with default empty string
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
            } = {},
            // Add missing required fields with default values
            ai_model = {
              memory_store: '',
              model_name: '',
              model_type: ''
            },
            connectors = {
              discord: false,
              telegram: false,
              twitter: false
            },
            seasons = [],
            tracker = {
              current_episode_number: 0,
              current_post_number: 0,
              current_season_number: 0,
              post_every_x_minutes: 0
            }
          } = agent || {};
  
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
              },
              ai_model,
              connectors,
              seasons,
              tracker
            },
            concept
          };
        });
  
        console.log('Processed characters:', processedCharacters);
        setCharacters(processedCharacters);
  
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };
  
    loadCharacters();
  }, []);

  // New function to handle character selection
  const handleCharacterSelect = (character: Agent) => {
    const agent = character.agent?.agent_details;
    
    if (!agent) {
      console.error('Selected character has invalid data structure');
      return;
    }

    setAgent({
      name: agent.name,
      personality: Array.isArray(agent.personality) ? agent.personality : [],
      communication_style: agent.communication_style,
      backstory: agent.backstory,
      universe: agent.universe, 
      topic_expertise: Array.isArray(agent.topic_expertise) ? agent.topic_expertise : [],
      hashtags: Array.isArray(agent.hashtags) ? agent.hashtags : [],
      emojis: Array.isArray(agent.emojis) ? agent.emojis : [],
      selectedImage: undefined  // Reset image selection when changing characters

    });
    console.log("[handleCharacterSelect] The current agent is :", agent); 
  };

  // Function to handle deleting a trait from the agent's field
  const handleDeleteTrait = (field: keyof AgentDetails, value: string) => {
    setAgent(prev => {
      const updatedAgent = {
        ...prev,
        [field]: prev[field].filter((trait: string) => trait !== value) // Remove the trait
      };
      console.log("Updated agent after deletion:", updatedAgent); // Log the updated agent
      return updatedAgent; // Return the updated agent state
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Left Panel */}
      <div className="w-1/2 p-6 border-r border-orange-500/20">
        <div className="h-full flex flex-col space-y-6">
          {/* Main Character Image */}
          <div className="relative aspect-square rounded-lg bg-gradient-to-br from-slate-900/80 
                          via-cyan-900/20 to-orange-900/20 border border-orange-500/20 flex items-center justify-center"
               style={{ 
                 backgroundImage: agent.selectedImage !== undefined ? `url(${agentImages[agent.selectedImage]})` : 'none', 
                 backgroundSize: 'cover', 
                 backgroundPosition: 'center' 
               }}>
            {/* Only show Brain icon when no image is selected */}
            {agent.selectedImage === undefined && (
              <Brain className="w-32 h-32 text-cyan-400" />
            )}
            <button className="absolute bottom-4 right-4 px-4 py-2 rounded-md bg-gradient-to-r 
                              from-orange-600 to-red-600 text-white flex items-center">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Generate New
            </button>
          </div>

          {/* Image Selection Grid */}
          <div className="grid grid-cols-4 gap-4">
            {agentImages.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square bg-gradient-to-br from-slate-900/80 via-cyan-900/20 
                            to-orange-900/20 rounded-lg cursor-pointer ${
                              agent.selectedImage === index ? 'ring-2 ring-orange-500' : ''
                            }`}
                onClick={() => setAgent({ ...agent, selectedImage: index })}
                style={{ 
                  backgroundImage: `url(${image})`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ))}
          </div>

          {/* Character Info Card */}
          <div className="p-4 rounded-lg bg-slate-900/50 border border-orange-500/20">
            <div className="mb-4">
              <div className="text-lg font-semibold text-orange-400">Agent Name</div>
              <div className="text-gray-300">{agent.name}</div>
            </div>
            {/* <div className="mb-4">
              <div className="text-lg font-semibold text-orange-400">Personality</div>
              <div className="text-gray-300">{agent.personality}</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-400">Communication Style</div>
              <div className="text-gray-300">{agent.communication_style}</div>
            </div> */}
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

        {/* <form onSubmit={handleSubmit}> */}
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
                    style={{ height: '50px' }}
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Topic Expertise</label>
                  <TraitButtons 
                    field="topic_expertise" 
                    options={agent.topic_expertise} 
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Textarea
                    value={Array.isArray(agent.topic_expertise) ? agent.topic_expertise.join(', ') : ''}
                    onChange={handleInputChange('topic_expertise')}
                    placeholder="Describe agent topic_expertise"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 'personality' && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Personality Type</label>
                  <TraitButtons 
                    field="personality" 
                    options={agent.personality} 
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Textarea
                    value={Array.isArray(agent.personality) ? agent.personality.join(', ') : ''}
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
                  <TraitButtons 
                    field="communication_style" 
                    options={agent.communication_style} 
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Textarea
                    value={Array.isArray(agent.communication_style) ? agent.communication_style.join(', ') : ''}
                    onChange={handleInputChange('communication_style')}
                    placeholder="Describe communication style"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Hashtags</label>
                  <TraitButtons 
                    field="hashtags" 
                    options={agent.hashtags} 
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Input
                    value={agent.hashtags.join(', ')} // Join hashtags for display
                    onChange={handleInputChange('hashtags')}
                    placeholder="#arai"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Emojis</label>
                  <TraitButtons 
                    field="emojis" 
                    options={agent.emojis} 
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Input
                    value={agent.emojis.join(' ')} // Join emojis for display
                    onChange={handleInputChange('emojis')}
                    placeholder="✨"
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
        {/* </form> */}

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