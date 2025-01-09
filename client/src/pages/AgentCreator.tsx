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
  level: number;
  experience: number;
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
    level: 1,
    experience: 0
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

  const handleSuggestionClick = (field: keyof Agent, value: string): void => {
    setAgent(prev => ({
      ...prev,
      [field]: value,
      experience: prev.experience + 10
    }));
  };

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

  const handleInputChange = (field: keyof Agent) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setAgent({ ...agent, [field]: e.target.value });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Left Panel */}
      <div className="w-1/2 p-6 border-r border-orange-500/20">
        <div className="h-full flex flex-col space-y-6">
          {/* Level Badge */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 
                         rounded-lg self-end">
            Level {agent.level}
          </div>

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
          <div className="flex flex-col items-center space-y-4 rounded-lg p-6 bg-gradient-to-br 
                         from-slate-900/80 via-cyan-900/20 to-orange-900/20 border border-orange-500/20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-orange-400 
                          to-red-400 bg-clip-text text-transparent">
              {agent.name || 'New Agent'}
            </h2>
            <div className="text-2xl">{agent.emojis}</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {agent.hashtags.split(' ').filter(Boolean).map((tag, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-gradient-to-r 
                                       from-cyan-600 to-orange-600 text-white text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-6 overflow-y-auto">
        {/* Tabs */}
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

        <button className="mt-6 w-full px-4 py-2 rounded-md bg-gradient-to-r from-cyan-600 
                          to-orange-600 hover:from-cyan-700 hover:to-orange-700 text-white 
                          transition-all duration-300 flex items-center justify-center">
          <Save className="w-4 h-4 mr-2" />
          Save Agent
        </button>
      </div>
    </div>
  );
};

export default AgentCreator;