import React, {
  useState,
  ChangeEvent,
  useEffect,
  KeyboardEvent,
  CSSProperties,
} from 'react';
import {
  Brain,
  Wand2,
  MessageSquare,
  Save,
  Sparkles,
  RefreshCcw,
} from 'lucide-react';
import { createAgent, getCharacters } from '../api/agentsAPI';
import agent1 from '../assets/agent-images/agent1.jpg';
import agent2 from '../assets/agent-images/agent2.jpg';
import agent3 from '../assets/agent-images/agent3.jpg';
import agent4 from '../assets/agent-images/agent4.jpg';
import { AgentDetails, Agent } from '../interfaces/AgentInterfaces';
import TraitButtons from '../components/TraitButtons';

const agentImages = [agent1, agent2, agent3, agent4];

const AgentCreator: React.FC = () => {
  console.log('[AgentCreator] Rendering...'); // Keep your console logs

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 1) States
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const [activeTab, setActiveTab] = useState<'basic' | 'personality' | 'style'>(
    'basic'
  );

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

  const [characters, setCharacters] = useState<Agent[]>([]);
  console.log('[AgentCreator] Current agent:', agent);

  // Testing area state
  const [testInput, setTestInput] = useState<string>('');

  // ──────────────────────────────────────────────────────────────────────────────
  // 2) Local "draft" states for each text field
  //    so we only commit to `agent` on Enter.
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const [draftFields, setDraftFields] = useState<{
    name: string;
    universe: string;
    backstory: string;
  }>({
    name: '',
    universe: '',
    backstory: '',
  });

  // Keep local drafts in sync if `agent` changes (e.g. selecting a character)
  useEffect(() => {
    setDraftFields({
      name: agent.name || '',
      universe: agent.universe || '',
      backstory: agent.backstory || '',
    });
  }, [agent]);

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 3) Testing Area: same logic as before
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const handleTestInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTestInput(e.target.value);
  };

  const handleTestInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Processed input:', testInput);
      setTestInput('');
    }
  };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 4) Reusable <Input> & <Textarea> components
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const Input: React.FC<{
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    style?: CSSProperties;
    className?: string;
  }> = ({ style, className, ...props }) => (
    <input
      {...props}
      style={style}
      className={`w-full px-3 py-2 rounded-md bg-slate-900/50 
                  border border-orange-500/20 text-white 
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50
                  ${className ?? ''}`}
    />
  );

  const Textarea: React.FC<{
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
  }> = ({ className, ...props }) => (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-md bg-slate-900/50 
                  border border-orange-500/20 text-white 
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50
                  ${className ?? ''}`}
    />
  );

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 5) onChange -> local draft, onKeyDown -> commit on Enter for name/universe/backstory
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const handleDraftChange =
    (field: keyof typeof draftFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraftFields((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleDraftKeyDown =
    (field: keyof typeof draftFields) =>
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log(`[handleDraftKeyDown] Committing ${field}:`, draftFields[field]);
        setAgent((prev) => ({
          ...prev,
          [field]: draftFields[field], // commit local text to agent
        }));
      }
    };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 6) Trait fields => update agent on every keystroke
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const handleTraitChange =
    (field: keyof AgentDetails) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      const separator = field === 'emojis' ? ' ' : ',';
      setAgent((prev) => ({
        ...prev,
        [field]: value
          .split(separator)
          .map((item) => item.trim())
          .filter((item) => item !== ''),
      }));
    };

  // Deleting a trait
  const handleDeleteTrait = (field: keyof AgentDetails, value: string) => {
    console.log('[handleDeleteTrait - Called] Field:', field);
    setAgent((prev) => {
      const updatedAgent = {
        ...prev,
        [field]: prev[field].filter((trait: string) => trait !== value),
      };
      console.log('Updated agent after deletion:', updatedAgent);
      return updatedAgent;
    });
  };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 7) Submit form
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('[handleSubmit] Submitting agent:', agent);
    try {
      const newAgent = await createAgent(agent);
      console.log('Agent created:', newAgent);

      // Reset agent
      setAgent({
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

      // Reset local drafts
      setDraftFields({
        name: '',
        universe: '',
        backstory: '',
      });
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 8) Load characters on mount
  // ──────────────────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    const loadCharacters = async () => {
      console.log('[loadCharacters] Loading characters...');
      try {
        const charactersData = await getCharacters();
        console.log('Raw characters data:', charactersData);

        if (!Array.isArray(charactersData)) {
          console.error('Expected array of characters, received:', typeof charactersData);
          return;
        }

        const processedCharacters = charactersData.map((char) => {
          const { agent, concept = '' } = char;
          console.log('Mapping a character:', char);

          if (!agent) {
            return { agent: {}, concept };
          }

          const {
            agent_details: {
              name = '',
              personality = [],
              communication_style = [],
              backstory = '',
              universe = '',
              topic_expertise = [],
              hashtags = [],
              emojis = [],
            } = {},
            ai_model = {
              memory_store: '',
              model_name: '',
              model_type: '',
            },
            connectors = {
              discord: false,
              telegram: false,
              twitter: false,
            },
            seasons = [],
            tracker = {
              current_episode_number: 0,
              current_post_number: 0,
              current_season_number: 0,
              post_every_x_minutes: 0,
            },
          } = agent || {};

          return {
            agent: {
              agent_details: {
                name,
                personality: Array.isArray(personality) ? personality : [],
                communication_style: Array.isArray(communication_style)
                  ? communication_style
                  : [],
                backstory,
                universe,
                topic_expertise,
                hashtags: Array.isArray(hashtags) ? hashtags : [],
                emojis: Array.isArray(emojis) ? emojis : [],
              },
              ai_model,
              connectors,
              seasons,
              tracker,
            },
            concept,
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

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 9) Handle character selection
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const handleCharacterSelect = (character: Agent) => {
    console.log('[handleCharacterSelect] selected character:', character);

    const details = character.agent?.agent_details;
    if (!details) {
      console.error('Selected character has invalid data structure');
      return;
    }

    setAgent({
      name: details.name || '',
      personality: Array.isArray(details.personality) ? details.personality : [],
      communication_style: details.communication_style || [],
      backstory: details.backstory || '',
      universe: details.universe || '',
      topic_expertise: Array.isArray(details.topic_expertise)
        ? details.topic_expertise
        : [],
      hashtags: Array.isArray(details.hashtags) ? details.hashtags : [],
      emojis: Array.isArray(details.emojis) ? details.emojis : [],
      selectedImage: undefined,
    });

    // Also sync local drafts
    setDraftFields({
      name: details.name || '',
      universe: details.universe || '',
      backstory: details.backstory || '',
    });

    console.log('[handleCharacterSelect] The current agent is :', details);
  };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 10) Render
  // ──────────────────────────────────────────────────────────────────────────────
  //
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Left Panel */}
      <div className="w-1/2 p-6 border-r border-orange-500/20">
        <div className="h-full flex flex-col space-y-6">
          {/* Main Character Image */}
          <div
            className="relative aspect-square rounded-lg bg-gradient-to-br from-slate-900/80 
                        via-cyan-900/20 to-orange-900/20 border border-orange-500/20 
                        flex items-center justify-center"
            style={{
              backgroundImage:
                agent.selectedImage !== undefined
                  ? `url(${agentImages[agent.selectedImage]})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Only show Brain icon if no image is selected */}
            {agent.selectedImage === undefined && (
              <Brain className="w-32 h-32 text-cyan-400" />
            )}
            <button
              className="absolute bottom-4 right-4 px-4 py-2 rounded-md bg-gradient-to-r 
                         from-orange-600 to-red-600 text-white flex items-center"
              onClick={() => {
                console.log('[Generate New] Clicked');
              }}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Generate New
            </button>
          </div>

          {/* Testing Area */}
          <div>
            <label className="text-sm text-cyan-200 block mb-2">Testing Area</label>
            <textarea
              value={testInput}
              onChange={handleTestInputChange}
              onKeyDown={handleTestInputKeyDown}
              placeholder="Enter test input here and press Enter"
              rows={4}
              className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                         text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          {/* Image Selection Grid */}
          <div className="grid grid-cols-4 gap-4">
            {agentImages.map((image, index) => (
              <div
                key={index}
                className={`aspect-square bg-gradient-to-br from-slate-900/80 
                            via-cyan-900/20 to-orange-900/20 rounded-lg cursor-pointer 
                            ${agent.selectedImage === index ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => {
                  console.log('[ImageSelection] Clicked index:', index);
                  setAgent((prev) => ({ ...prev, selectedImage: index }));
                }}
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
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
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 p-6">
        <div className="flex gap-4 mb-6 bg-slate-900/50 p-2 rounded-lg">
          {([
            { id: 'basic' as const, icon: Brain, label: 'Basic Info' },
            { id: 'personality' as const, icon: Wand2, label: 'Personality' },
            { id: 'style' as const, icon: MessageSquare, label: 'Style' },
          ]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                console.log('[TabSwitch] to:', id);
                setActiveTab(id);
              }}
              className={`flex-1 flex items-center justify-center px-4 py-2 
                          rounded-md text-white ${
                            activeTab === id
                              ? 'bg-gradient-to-r from-cyan-600 to-orange-600'
                              : ''
                          }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Agent Name => local draft */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Agent Name
                  </label>
                  <textarea
                    value={draftFields.name}
                    onChange={handleDraftChange('name')}
                    onKeyDown={handleDraftKeyDown('name')}
                    placeholder="Enter agent name"
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                      text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                  
                </div>

                {/* Universe => local draft */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Universe
                  </label>
                  <textarea
                    value={draftFields.universe}
                    onChange={handleDraftChange('universe')}
                    onKeyDown={handleDraftKeyDown('universe')}
                    placeholder="Enter universe"
                    rows={5}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                      text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"                  />
                </div>

                {/* Topic Expertise => trait (updates on keystroke) */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Topic Expertise
                  </label>
                  <TraitButtons
                    field="topic_expertise"
                    options={agent.topic_expertise}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Textarea
                    value={
                      Array.isArray(agent.topic_expertise)
                        ? agent.topic_expertise.join(', ')
                        : ''
                    }
                    onChange={handleTraitChange('topic_expertise')}
                    placeholder="Describe agent topic expertise"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 'personality' && (
              <div className="space-y-6">
                {/* Personality => trait */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Personality Type
                  </label>
                  <TraitButtons
                    field="personality"
                    options={agent.personality}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Textarea
                    value={
                      Array.isArray(agent.personality)
                        ? agent.personality.join(', ')
                        : ''
                    }
                    onChange={handleTraitChange('personality')}
                    placeholder="Describe agent personality"
                    rows={3}
                  />
                </div>

                {/* Backstory => local draft */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Backstory
                  </label>
                  <Textarea
                    value={draftFields.backstory}
                    onChange={handleDraftChange('backstory')}
                    onKeyDown={handleDraftKeyDown('backstory')}
                    placeholder="Enter agent backstory"
                    rows={5}
                  />
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6">
                {/* Communication Style => trait */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Communication Style
                  </label>
                  <TraitButtons
                    field="communication_style"
                    options={agent.communication_style}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Textarea
                    value={
                      Array.isArray(agent.communication_style)
                        ? agent.communication_style.join(', ')
                        : ''
                    }
                    onChange={handleTraitChange('communication_style')}
                    placeholder="Describe communication style"
                    rows={3}
                  />
                </div>

                {/* Hashtags => trait */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Hashtags
                  </label>
                  <TraitButtons
                    field="hashtags"
                    options={agent.hashtags}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Input
                    value={agent.hashtags.join(', ')}
                    onChange={handleTraitChange('hashtags')}
                    placeholder="#arai"
                  />
                </div>

                {/* Emojis => trait */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Emojis
                  </label>
                  <TraitButtons
                    field="emojis"
                    options={agent.emojis}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <Input
                    value={agent.emojis.join(' ')}
                    onChange={handleTraitChange('emojis')}
                    placeholder="✨"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 w-full px-4 py-2 rounded-md bg-gradient-to-r 
                       from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 
                       text-white transition-all duration-300 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Agent
          </button>
        </form>

        {/* Character Selection */}
        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-orange-500/20">
          <label className="text-sm text-cyan-200 block mb-2">
            Select Existing Character
          </label>
          <select
            onChange={(e) => {
              const selected = characters.find(
                (c) => c.agent?.agent_details?.name === e.target.value
              );
              if (selected) handleCharacterSelect(selected);
            }}
            className="w-full px-3 py-2 rounded-md bg-slate-900/50 border 
                       border-orange-500/20 text-white focus:ring-2 
                       focus:ring-orange-500/50 focus:outline-none"
          >
            <option value="">-- Select a Character --</option>
            {characters.map((char, idx) => (
              <option key={idx} value={char.agent?.agent_details?.name}>
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
