import React, { useState } from 'react';
import { Brain, Wand2, MessageSquare, Settings, Save, Sparkles, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const AgentCreator = () => {
  const [agent, setAgent] = useState({
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

  const handleSuggestionClick = (field, value) => {
    setAgent(prev => ({
      ...prev,
      [field]: value,
      experience: prev.experience + 10
    }));
  };

  const SuggestionChips = ({ field, options }) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          className="bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-200 border-orange-500/30 
                     transition-all duration-300"
          onClick={() => handleSuggestionClick(field, option)}
        >
          <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
          {option}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50 relative overflow-hidden">
      {/* Nebula Effect Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-orange-500/5 to-transparent" />
      
      {/* Left Panel - Character Preview */}
      <div className="w-1/2 p-6 border-r border-orange-500/20 relative z-10">
        <div className="h-full flex flex-col space-y-6">
          {/* Level Badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 
                         text-white px-4 py-2 rounded-bl-lg rounded-tr-lg animate-pulse">
            Level {agent.level}
          </div>

          {/* Main Character Image */}
          <div className="relative aspect-square rounded-lg flex-shrink-0 
                        bg-gradient-to-br from-slate-900/80 via-cyan-900/20 to-orange-900/20
                        border border-orange-500/20">
            <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
              <Brain className="w-32 h-32 animate-pulse" />
            </div>
            <Button 
              className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-600 to-red-600 
                         hover:from-orange-700 hover:to-red-700 border-none"
              onClick={() => {/* Trigger AI image generation */}}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>

          {/* Image Selection Grid */}
          <div className="grid grid-cols-4 gap-4">
            {mockImages.map((img, index) => (
              <div 
                key={index}
                className={`aspect-square bg-gradient-to-br from-slate-900/80 via-cyan-900/20 to-orange-900/20
                           rounded-lg cursor-pointer transition-all duration-300
                           ${agent.selectedImage === index ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => setAgent({...agent, selectedImage: index})}
              />
            ))}
          </div>

          {/* Character Info Card */}
          <div className="flex flex-col items-center space-y-4 rounded-lg p-6
                         bg-gradient-to-br from-slate-900/80 via-cyan-900/20 to-orange-900/20
                         border border-orange-500/20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-orange-400 to-red-400 
                          bg-clip-text text-transparent">
              {agent.name || 'New Agent'}
            </h2>
            <div className="text-2xl">{agent.emojis}</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {agent.hashtags.split(' ').filter(Boolean).map((tag, i) => (
                <Badge key={i} className="bg-gradient-to-r from-cyan-600 to-orange-600">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Settings */}
      <div className="w-1/2 p-6 overflow-y-auto relative z-10">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 gap-4 bg-slate-900/50 p-2 mb-6 rounded-lg">
            <TabsTrigger value="basic" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-orange-600">
              <Brain className="w-4 h-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="personality" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-orange-600">
              <Wand2 className="w-4 h-4 mr-2" />
              Personality
            </TabsTrigger>
            <TabsTrigger value="style" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-orange-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Style
            </TabsTrigger>
          </TabsList>

          <div className="space-y-6">
            <TabsContent value="basic">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Agent Name</label>
                  <Input 
                    value={agent.name}
                    onChange={(e) => setAgent({...agent, name: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="Enter agent name"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Universe</label>
                  <SuggestionChips field="universe" options={suggestions.universes} />
                  <Input 
                    value={agent.universe}
                    onChange={(e) => setAgent({...agent, universe: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="Enter or select universe"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Topic Expertise</label>
                  <Input 
                    value={agent.topic_expertise}
                    onChange={(e) => setAgent({...agent, topic_expertise: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="Enter expertise areas"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personality">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Personality Type</label>
                  <SuggestionChips field="personality" options={suggestions.personalities} />
                  <Textarea 
                    value={agent.personality}
                    onChange={(e) => setAgent({...agent, personality: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="Describe agent personality"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Backstory</label>
                  <Textarea 
                    value={agent.backstory}
                    onChange={(e) => setAgent({...agent, backstory: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="Enter agent backstory"
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style">
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Communication Style</label>
                  <SuggestionChips field="communication_style" options={suggestions.communication_styles} />
                  <Textarea 
                    value={agent.communication_style}
                    onChange={(e) => setAgent({...agent, communication_style: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="Describe communication style"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Hashtags</label>
                  <Input 
                    value={agent.hashtags}
                    onChange={(e) => setAgent({...agent, hashtags: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="ai agent custom (without #)"
                  />
                </div>

                <div>
                  <label className="text-sm text-cyan-200 block mb-2">Emojis</label>
                  <Input 
                    value={agent.emojis}
                    onChange={(e) => setAgent({...agent, emojis: e.target.value})}
                    className="bg-slate-900/50 border-orange-500/20 text-white"
                    placeholder="🤖 ✨ 💡"
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-cyan-600 to-orange-600 
                       hover:from-cyan-700 hover:to-orange-700 text-white transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Agent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentCreator;