import React, { useState, ChangeEvent } from 'react';
import { Brain, Wand2, MessageSquare, Save, Sparkles, RefreshCcw } from 'lucide-react';

interface Agent {
  name: string;
  personality: string;
  communication_style: string;
  backstory: string;
  universe: string;
  topic_expertise: string;
  hashtags: string;
  emojis: string;
  selectedImage: number;
}

interface SuggestionChipsProps {
  field: keyof Agent;
  options: string[];
}

const AgentCreator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'style'>('basic');
  const [agent, setAgent] = useState<Agent>({
    name: '',
    personality: '',
    communication_style: '',
    backstory: '',
    universe: '',
    topic_expertise: '',
    hashtags: '',
    emojis: '',
    selectedImage: 0,
  });

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
  const handleSuggestionClick = (field: keyof Agent, value: string): void => {
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
  const handleInputChange = (field: keyof Agent) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setAgent({ ...agent, [field]: e.target.value });
  };

  // Function to handle form submission, send agent data to the server, and reset the form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(`handleSubmit Event - Sending agent data to the server `);
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newAgent = await response.json();
      console.log("Agent created:", newAgent);
      // Reset the form
      setAgent({
        name: '',
        personality: '',
        communication_style: '',
        backstory: '',
        universe: '',
        topic_expertise: '',
        hashtags: '',
        emojis: '',
        selectedImage: 0,
      });
    } catch (error) {
      console.error("Error creating agent:", error);
    }
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
                  <SuggestionChips field="universe" options={suggestions.universes} />
                  <Input
                    value={agent.universe}
                    onChange={handleInputChange('universe')}
                    placeholder="Enter or select universe"
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
                    value={agent.hashtags}
                    onChange={handleInputChange('hashtags')}
                    placeholder="ai agent custom (without #)"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Emojis</label>
                  <Input
                    value={agent.emojis}
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
      </div>
    </div>
  );
};

export default AgentCreator;