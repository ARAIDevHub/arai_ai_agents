import React, { useState, useEffect, useRef } from 'react';
import { Agent, GenerationsByPk } from '../interfaces/AgentInterfaces';
import useCharacters from '../hooks/useCharacters';
import RandomAgentCard from '../components/RandomAgentCard'; // Import the new component
import LoadedAgentCard from '../components/LoadedAgentCard'; // Import the new component
import { inconsistentImageLambda } from '../api/leonardoApi';
import { createBlankAgent } from '../utils/agentUtils';
import { createAgent } from '../api/agentsAPI';
import { generateRandomAgent } from '../utils/generateRandomAgent';
import imageTraits from '../assets/generate-random-agents/imageTraits.json';
import characterConcepts from '../assets/generate-random-agents/characterConcepts.json';
import famousFigures from '../assets/generate-random-agents/famousFigures.json';
import LunaQuantumchef from '../assets/example-agents/Luna_Quantumchef_master.json';
import CosmicCurator from '../assets/example-agents/Cosmic_Curator_master.json';
import GavelGlitch from '../assets/example-agents/Gavel_Glitch_master.json';

const LEONARDO_MODEL_ID = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
const LEONARDO_STYLE_UUID = "b2a54a51-230b-4d4f-ad4e-8409bf58645f";



// Helper function to get random trait
const getRandomTrait = (traitArray: string[]): string => {
  return traitArray[Math.floor(Math.random() * traitArray.length)];
};

// Add a utility function to handle image loading
const loadImageWithFallback = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit', // Don't send cookies
      headers: {
        'Accept': 'image/*'
      }
    });

    if (!response.ok) {
      throw new Error('Image failed to load');
    }

    return url;
  } catch (error) {
    console.error('[AgentGallery] Error loading image:', error);
    return 'Error loading image. Regenerate again';
  }
};

// Add this helper function near the top with other utility functions
const generateCharacterConcept = (): string => {
  const profession = getRandomTrait(characterConcepts.professions);
  const personality = getRandomTrait(characterConcepts.personalities);
  const origin = getRandomTrait(characterConcepts.origins);
  const power = getRandomTrait(characterConcepts.specialPowers);
  const goal = getRandomTrait(characterConcepts.goals);

  // Randomly choose between different concept formats
  const conceptFormats = [
    `A ${personality} ${profession} who ${power} and is ${origin}`,
    `${profession} ${origin}, who ${power} while ${goal}`,
    `A ${personality} individual ${origin} working as a ${profession}, with the ability to ${power}`,
    `An extraordinary ${profession} ${origin} on a mission of ${goal}`,
    `A remarkable ${personality} being who ${power}, working as a ${profession} while ${goal}`,
    `Create a name and try to incorporate the ${profession} into the name. For example,
    if the profession was a Dr. then the name could be Dr.{Name} `
  ];
  const conceptFormat2 = [
    `Create a parody meme of ${getRandomFamousPerson()}. The meme should be a funny and clever meme that captures the essence of the person and their achievements. Make it witty and memorable while staying respectful. Include their most iconic features, expressions, or famous quotes if applicable.
    Make sure to use their name as part of their agent name. It is best to make a variation of their name. For example, if the person is Elon Musk, then the agent name could be Elon Musk Jr., Elon Gate, Trump Bot, Trump Tron, etc. Make something unique and memorable that could go viral within the first 24 hours of being posted.`
  ];

  // 80% chance of conceptFormat1, 20% chance of conceptFormat2
  return Math.random() < 0.35 ? getRandomTrait(conceptFormats) : getRandomTrait(conceptFormat2);
};

// Add this helper function near other utility functions
const getRandomFamousPerson = (): string => {
  const categories = Object.keys(famousFigures);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const figures = famousFigures[randomCategory as keyof typeof famousFigures];
  return figures[Math.floor(Math.random() * figures.length)];
};

// Add this function to convert master JSON to Agent type
const convertMasterJsonToAgent = (masterJson: any): Agent => {
  return {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: masterJson.agent.agent_details.name || '',
    avatar: masterJson.agent.profile_image?.details?.url || '',
    shortDescription: masterJson.agent.agent_details.backstory || '',
    tags: masterJson.agent.agent_details.hashtags || [],
    personality: masterJson.agent.agent_details.personality || [],
    communicationStyle: masterJson.agent.agent_details.communication_style || [],
    emojis: masterJson.agent.agent_details.emojis || [],
    universe: masterJson.agent.agent_details.universe || '',
    backstory: masterJson.agent.agent_details.backstory || '',
    topic_expertise: masterJson.agent.agent_details.topic_expertise || [],
    isExample: true // Add this flag to identify example agents
  };
};

const AgentGallery: React.FC = () => {
  // Add selected agent state
  // const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { characters: loadedAgents } = useCharacters();
  const [filter, setFilter] = useState('all');
  const [randomAgents, setRandomAgents] = useState<Agent[]>([]);
  const initialMount = useRef(true);

  // Define generateRandomAgentData inside AgentGallery so it's accessible to child components
  const generateRandomAgentData = async (): Promise<Agent> => {
    try {
      const concept = generateCharacterConcept();

      const newRandomAgentData = await generateRandomAgent(concept);
      const agentObject = newRandomAgentData.agent;
      const agentDetails = agentObject.agent_details;

      return {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: agentDetails.name.replace('_', ' ') || '',
        avatar: '',
        shortDescription: '...',
        tags: agentDetails.hashtags || [],
        personality: agentDetails.personality || [],
        communicationStyle: agentDetails.communication_style || [],
        emojis: agentDetails.emojis || [],
        universe: agentDetails.universe || '',
        backstory: agentDetails.backstory || '',
        concept: concept,
        topic_expertise: agentDetails.topic_expertise || []
      };
    } catch (error) {
      console.error("[generateRandomAgentData] Error:", error);
      throw error;
    }
  };

  const handleAddAgent = async (agent: Agent, leonardoResponse: any) => {
    try {
      // Create a new blank agent with proper initialization
      const newAgent = createBlankAgent();

      if (!newAgent.agent) {
        console.error("[handleAddAgent] - New agent object is not properly initialized");
        return;
      }

      // Ensure agent.agent_details exists before accessing
      if (!newAgent.agent.agent_details) {
        console.error("[handleAddAgent] - Agent details are not properly initialized");
        return;
      }

      // Log the concept being saved

      // populate our concept
      newAgent.agent.concept = agent.concept || '';

      // populate our agent details
      const agentDetails = newAgent.agent.agent_details;
      agentDetails.name = agent?.name || '';
      agentDetails.personality = agent?.personality || [];
      agentDetails.communication_style = agent?.communicationStyle || [];
      agentDetails.emojis = agent?.emojis || [];
      agentDetails.hashtags = agent?.hashtags || [];
      agentDetails.universe = agent?.universe || '';
      agentDetails.topic_expertise = agent?.topic_expertise || [];
      agentDetails.backstory = agent?.backstory || '';

      // Ensure profile_image_options array exists and has at least one element
      if (!newAgent.agent.profile_image_options) {
        newAgent.agent.profile_image_options = [];
      }
      if (newAgent.agent.profile_image_options.length === 0) {
        newAgent.agent.profile_image_options.push({ generations_by_pk: {} as GenerationsByPk });
      }

      // Ensure profile_image exists and has details
      if (!newAgent.agent.profile_image) {
        newAgent.agent.profile_image = {
          details: {
            url: '',
            image_id: '',
            generationId: ''
          }
        };
      }

      // Populate the image data
      if (leonardoResponse?.generations_by_pk) {
        const generation_by_pk = leonardoResponse.generations_by_pk;
        newAgent.agent.profile_image_options[0].generations_by_pk = generation_by_pk;

        if (generation_by_pk.generated_images?.[0]) {
          const imageDetails = newAgent.agent.profile_image.details;
          imageDetails.url = generation_by_pk.generated_images[0].url;
          imageDetails.image_id = generation_by_pk.generated_images[0].id;
          imageDetails.generationId = generation_by_pk.id;
        }
      }

      // Call our api to save the new agent
      const newAgentResponse = await createAgent(newAgent);

      return newAgentResponse;
    } catch (error) {
      console.error("[handleAddAgent] Error:", error);
      throw error;
    }
  };

  // Update the handleSingleAgentRegeneration function
  const handleSingleAgentRegeneration = async (agentId: string): Promise<void> => {

    try {
      // Show loading state immediately with loading name
      setRandomAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId
            ? {
              ...agent,
              name: 'Generating Agent...', // Add loading name
              isLoading: true,
              personality: [],
              communicationStyle: [],
              emojis: [],
              hashtags: []
            }
            : agent
        )
      );

      const currentAgent = randomAgents.find(agent => agent.id === agentId);
      if (!currentAgent) return;

      // Generate new agent data
      const newAgentData = await generateRandomAgentData();

      const newAgent = {
        ...newAgentData,
        id: currentAgent.id
      };

      // Update UI to show we're now generating the image
      setRandomAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId
            ? {
              ...newAgent,
              isLoading: true
            }
            : agent
        )
      );

      // Incorporate the concept into the prompt
      const prompt = `Generate an anime character portrait of ${newAgent.name} with ${getRandomTrait(imageTraits.hairStyles)} ${getRandomTrait(imageTraits.hairColors)} hair, ${getRandomTrait(imageTraits.eyeColors)} eyes, wearing ${getRandomTrait(imageTraits.clothingStyles)} style clothing. Their personality can be described as ${newAgent.personality?.join(', ') || 'unknown'}. Scene: ${getRandomTrait(imageTraits.backgrounds)}. Style: high quality, detailed anime art, character portrait. Concept: ${newAgent.concept} `;

      const payload = {
        prompt: prompt,
        modelId: LEONARDO_MODEL_ID,
        styleUUID: LEONARDO_STYLE_UUID,
        num_images: 4
      };
      const imageResponse = await inconsistentImageLambda(
        payload
      );

      if (
        !imageResponse?.generations_by_pk?.generated_images?.[0]
          ?.url
      ) {
        throw new Error("No image URL received");
      }

      const imageUrl = imageResponse.generations_by_pk.generated_images[0].url;
      const loadedImageUrl = await loadImageWithFallback(imageUrl);

      // Update with all necessary data for saving
      setRandomAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId
            ? {
              ...newAgent,
              avatar: loadedImageUrl,
              isLoading: false,
              leonardoResponse: imageResponse,  // Add the full Leonardo response
              leonardoImage: imageResponse.generations_by_pk.generated_images[0] // Add the image data
            }
            : agent
        )
      );

    } catch (error) {
      console.error('[AgentGallery] Error regenerating single agent:', error);
      setRandomAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId
            ? {
              ...agent,
              isLoading: false
            }
            : agent
        )
      );
    }
  };

  // Add handleSelectAgent function
  const handleSelectAgent = async (agent: Agent) => {
    console.log("[handleSelectAgent] Selecting agent:", agent);
    try {

      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      return Promise.resolve();
    } catch (error) {
      console.error('[handleSelectAgent] Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      // Load example agents instead of generating new ones
      const exampleAgents = [
        convertMasterJsonToAgent(LunaQuantumchef),
        convertMasterJsonToAgent(CosmicCurator),
        convertMasterJsonToAgent(GavelGlitch)
      ];
      setRandomAgents(exampleAgents);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-md text-white ${filter === 'all'
                  ? 'bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700'
                  : 'text-gray-300 hover:text-cyan-400'
                }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-md text-white ${filter === 'random'
                  ? 'bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700'
                  : 'text-gray-300 hover:text-cyan-400'
                }`}
              onClick={() => setFilter('random')}
            >
              Random
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-md text-white ${filter === 'yourAgents'
                  ? 'bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700'
                  : 'text-gray-300 hover:text-cyan-400'
                }`}
              onClick={() => setFilter('yourAgents')}
            >
              Your Agents
            </button>
          </div>

        </header>

        {/* Agents Section */}
        <div>
          {(filter === 'all' || filter === 'random') && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-white">Random Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {randomAgents.map((agent) => (
                  <RandomAgentCard
                    key={agent.id}
                    agent={agent}
                    onSelect={handleSelectAgent}
                    onAddAgent={async (agent) => await handleAddAgent(agent, agent.leonardoResponse)}
                    isUserAgent={false}
                    setRandomAgents={setRandomAgents}
                    generateRandomAgentData={generateRandomAgentData}
                    isLoadedAgent={true}
                    onRegenerate={handleSingleAgentRegeneration}
                    isLoading={agent.isLoading}
                    isExample={agent.isExample}
                  />
                ))}
              </div>
            </>
          )}

          {filter === 'all' && (
            <>
              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">Your Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {loadedAgents.map((agent) => (
                  <LoadedAgentCard
                    key={Math.random().toString()}
                    agent={agent}
                    onSelect={handleSelectAgent}
                  />
                ))}
              </div>
            </>
          )}

          {/* Your Agents filter section */}
          {filter === 'yourAgents' && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-white">Your Agents</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {loadedAgents.map((agent) => (
                  <LoadedAgentCard
                    key={Math.random().toString()}
                    agent={agent}
                    onSelect={handleSelectAgent}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Optionally add a visual indicator for selected agent */}
        {/* {selectedAgent && (
          <div className="fixed bottom-4 right-4 bg-gradient-to-r from-cyan-600 to-orange-600 text-white px-6 py-3 rounded-md shadow-lg">
            Selected: {selectedAgent.agent?.agent_details?.name || selectedAgent.name}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AgentGallery;