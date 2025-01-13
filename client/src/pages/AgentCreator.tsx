import React, {
  useState,
  ChangeEvent,
  useEffect,
  KeyboardEvent,
} from 'react';
import {
  Brain,
  Wand2,
  MessageSquare,
  Save,
  RefreshCcw,
} from 'lucide-react';
import { createAgent, getCharacters } from '../api/agentsAPI';
import agent1 from '../assets/agent-images/agent1.jpg';
import agent2 from '../assets/agent-images/agent2.jpg';
import agent3 from '../assets/agent-images/agent3.jpg';
import agent4 from '../assets/agent-images/agent4.jpg';
import { AgentDetails, Agent } from '../interfaces/AgentInterfaces';
import TraitButtons from '../components/TraitButtons'; // We'll still use your TraitButtons
import CharacterLoader from '../components/CharacterLoader';

const agentImages = [agent1, agent2, agent3, agent4];

const AgentCreator: React.FC = () => {
  console.log('[AgentCreator] Rendering...'); // Keep your console logs

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 1) States
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const [activeTab, setActiveTab] =
    useState<'basic' | 'personality' | 'style'>('basic');

  // The main agent object
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
  console.log('[AgentCreator] Current agent:', agent);

  // The fetched characters
  const [characters, setCharacters] = useState<Agent[]>([]);

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 2) Local Drafts for “normal” fields (name, universe, backstory)
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

  // Keep them in sync if agent changes
  useEffect(() => {
    setDraftFields({
      name: agent.name || '',
      universe: agent.universe || '',
      backstory: agent.backstory || '',
    });
  }, [agent]);

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 3) Local Drafts for trait fields => single “draftTraits” object
  // ──────────────────────────────────────────────────────────────────────────────
  //
  // We'll unify the logic for topic_expertise, personality, communication_style,
  // hashtags, and emojis. We'll store them all as strings. On Enter, we'll parse
  // them into arrays and commit to agent.
  //
  const [draftTraits, setDraftTraits] = useState<{
    topic_expertise: string;
    personality: string;
    communication_style: string;
    hashtags: string;
    emojis: string;
  }>({
    topic_expertise: '',
    personality: '',
    communication_style: '',
    hashtags: '',
    emojis: '',
  });

  // Whenever agent changes, rebuild the draft strings
  useEffect(() => {
    setDraftTraits({
      topic_expertise: agent.topic_expertise.join(', '),
      personality: agent.personality.join(', '),
      communication_style: agent.communication_style.join(', '),
      hashtags: agent.hashtags.join(', '),
      // For emojis, join by space
      emojis: agent.emojis.join(' '),
    });
  }, [agent]);



  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 5) “Normal” fields => commit on Enter
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const handleDraftChange =
    (field: keyof typeof draftFields) =>
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setDraftFields(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleDraftKeyDown =
    (field: keyof typeof draftFields) =>
    (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log(`[handleDraftKeyDown] Committing ${field}:`, draftFields[field]);
        setAgent(prev => ({
          ...prev,
          [field]: draftFields[field],
        }));
      }
    };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 6) Trait fields => single “draftTraits” + commit on Enter
  // ──────────────────────────────────────────────────────────────────────────────
  //
  const handleTraitDraftChange =
    (field: keyof typeof draftTraits) =>
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setDraftTraits(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleTraitDraftKeyDown =
    (field: keyof typeof draftTraits) =>
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        console.log(`[handleTraitDraftKeyDown] Committing trait field: ${field}`);
        // If field is "emojis", we split by space; otherwise, by comma
        const separator = field === 'emojis' ? ' ' : ',';
        const arrayValue = draftTraits[field]
          .split(separator)
          .map(item => item.trim())
          .filter(Boolean);

        setAgent(prev => ({
          ...prev,
          [field]: arrayValue,
        }));
      }
    };

  // Deleting a single trait
  const handleDeleteTrait = (field: keyof AgentDetails, value: string) => {
    console.log('[handleDeleteTrait - Called] Field:', field, 'Value:', value);
    setAgent(prev => {
      const updatedAgent = {
        ...prev,
        [field]: Array.isArray(prev[field])
  ? prev[field].filter((trait: string) => trait !== value)
  : [],
      };
      console.log('Updated agent after deletion:', updatedAgent);
      return updatedAgent;
    });
  };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 7) Submit
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

      // Reset local fields
      setDraftFields({ name: '', universe: '', backstory: '' });
      setDraftTraits({
        topic_expertise: '',
        personality: '',
        communication_style: '',
        hashtags: '',
        emojis: '',
      });
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 8) Load characters
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

        const processed = charactersData.map(char => {
          const { agent, concept = '' } = char;
          console.log('Mapping a character:', char);
          if (!agent) return { agent: {}, concept };

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
            ai_model = {},
            connectors = {},
            seasons = [],
            tracker = {},
          } = agent;

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

        console.log('Processed characters:', processed);
        setCharacters(processed as Agent[]);
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };

    loadCharacters();
  }, []);

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 9) Select a character
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
      personality: details.personality || [],
      communication_style: details.communication_style || [],
      backstory: details.backstory || '',
      universe: details.universe || '',
      topic_expertise: details.topic_expertise || [],
      hashtags: details.hashtags || [],
      emojis: details.emojis || [],
      selectedImage: undefined,
      seasons: character.agent?.seasons || [],
      concept: character.concept || '',
    });

    // Also sync local drafts
    setDraftFields({
      name: details.name || '',
      universe: details.universe || '',
      backstory: details.backstory || '',
    });
    setDraftTraits({
      topic_expertise: (details.topic_expertise || []).join(', '),
      personality: (details.personality || []).join(', '),
      communication_style: (details.communication_style || []).join(', '),
      hashtags: (details.hashtags || []).join(', '),
      emojis: (details.emojis || []).join(' '),
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
      <CharacterLoader setCharacters={setCharacters} />
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
                    placeholder="Enter agent name (Press Enter to commit)"
                    rows={2}
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
                    placeholder="Enter universe (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Topic Expertise => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Topic Expertise
                  </label>
                  <TraitButtons
                    field="topic_expertise"
                    options={agent.topic_expertise}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.topic_expertise}
                    onChange={handleTraitDraftChange('topic_expertise')}
                    onKeyDown={handleTraitDraftKeyDown('topic_expertise')}
                    placeholder="Comma-separated (e.g. 'AI, Robotics, Music') (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'personality' && (
              <div className="space-y-6">
                {/* Personality => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Personality
                  </label>
                  <TraitButtons
                    field="personality"
                    options={agent.personality}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.personality}
                    onChange={handleTraitDraftChange('personality')}
                    onKeyDown={handleTraitDraftKeyDown('personality')}
                    placeholder="Comma-separated personality traits (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Backstory => local draft */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Backstory
                  </label>
                  <textarea
                    value={draftFields.backstory}
                    onChange={handleDraftChange('backstory')}
                    onKeyDown={handleDraftKeyDown('backstory')}
                    placeholder="Enter agent backstory (Press Enter to commit)"
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6">
                {/* Communication Style => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Communication Style
                  </label>
                  <TraitButtons
                    field="communication_style"
                    options={agent.communication_style}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.communication_style}
                    onChange={handleTraitDraftChange('communication_style')}
                    onKeyDown={handleTraitDraftKeyDown('communication_style')}
                    placeholder="Comma-separated (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Hashtags => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Hashtags
                  </label>
                  <TraitButtons
                    field="hashtags"
                    options={agent.hashtags}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.hashtags}
                    onChange={handleTraitDraftChange('hashtags')}
                    onKeyDown={handleTraitDraftKeyDown('hashtags')}
                    placeholder="Comma-separated #tags (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Emojis => local draft => commit on Enter => splitted by space */}
                <div>
                  <label className="text-sm text-cyan-200 block mb-2">
                    Emojis
                  </label>
                  <TraitButtons
                    field="emojis"
                    options={agent.emojis}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.emojis}
                    onChange={handleTraitDraftChange('emojis')}
                    onKeyDown={handleTraitDraftKeyDown('emojis')}
                    placeholder="Split by space (e.g. '✨ 🚀') (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
                               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)} 
            className="mt-6 w-full px-4 py-2 rounded-md bg-gradient-to-r 
                       from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 
                       text-white transition-all duration-300 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Agent
          </button>

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