import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCcw,
} from 'lucide-react';
import { Agent, GenerationsByPk } from '../interfaces/AgentInterfaces';
import useCharacters from '../hooks/useCharacters';
import RandomAgentCard from '../components/RandomAgentCard'; // Import the new component
import LoadedAgentCard from '../components/LoadedAgentCard'; // Import the new component
import { generateSingleImage } from '../api/leonardoApi';
import { createBlankAgent } from '../utils/agentUtils';
import { createAgent } from '../api/agentsAPI';
import { generateRandomAgent } from '../utils/generateRandomAgent';
import imageTraits from '../assets/generate-random-agents/imageTraits.json';
import characterConcepts from '../assets/generate-random-agents/characterConcepts.json';

// Helper function to get random trait
const getRandomTrait = (traitArray: string[]): string => {
  return traitArray[Math.floor(Math.random() * traitArray.length)];
};

const modelId = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
const styleUUID = "b2a54a51-230b-4d4f-ad4e-8409bf58645f";

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
    return 'https://via.placeholder.com/400x400?text=Image+Load+Failed';
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
    if the profession was a Dr. then the name could be Dr. Name`
  ];
  const conceptFormat2 = [
    `Create a meme of someone well known and famous. It could be a president like Trump or Biden, or a celebrity like Beyonce or Elon Musk. The meme should be a funny and clever meme that captures the essence of the person and the profession. For example, if the person was a president then the meme could be a picture of the president with the caption "I'm the president and I'm here to help you"
     This famous person could also be a historical figure like Cleopatra or Genghis Khan. Or a famous artist like Michelangelo or Van Gogh. Or a famous scientist like Einstein or Tesla. Or a famous athlete like Michael Jordan or Serena Williams.
    `
  ];

  // 80% chance of conceptFormat1, 20% chance of conceptFormat2
  return Math.random() < 0.7 ? getRandomTrait(conceptFormats) : getRandomTrait(conceptFormat2);
};

const AgentGallery: React.FC = () => {
  const { characters: loadedAgents, loading, error } = useCharacters();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState('all'); // 'all', 'random', or 'yourAgents'
  const [randomAgents, setRandomAgents] = useState<Agent[]>([]);
  const [yourAgents, setYourAgents] = useState<Agent[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const initialMount = useRef(true);
 
  // Define generateRandomAgentData inside AgentGallery so it's accessible to child components
  const generateRandomAgentData = async (): Promise<Agent> => {
    try {
      const concept = generateCharacterConcept();
      console.log("[generateRandomAgentData] Generated concept:", concept);

      const newRandomAgentData = await generateRandomAgent(concept);
      const agentObject = newRandomAgentData.agent;
      const agentDetails = agentObject.agent_details;

      return {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: agentDetails.name || '',
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

  const handleAddAgent = (agent: Agent, leonardoResponse: any) => {
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
    console.log("[handleAddAgent] - Saving agent with concept:", agent.concept);

    // populate our concept
    newAgent.agent.concept = agent.concept || '';
    console.log(" newAgent.concept", newAgent.agent.concept || 'no concept');
    console.log("[handleAddAgent] - New agent with  newAgent.agent.concept concept:",  newAgent.agent.concept);

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

    console.log("[handleAddAgent] - New agent with image data:", newAgent);

    // Call our api to save the new agent
    const newAgentResponse = createAgent(newAgent);
    console.log("[handleAddAgent] - New agent response:", newAgentResponse);

    setYourAgents((prevAgents) => [...prevAgents, agent]);
  };

  const generateNewAgent = async () => {
    setIsGenerating(true);
    
    try {
      // Show initial loading state for 3 agents
      const loadingAgents = Array(3).fill(null).map(() => ({
        id: Math.floor(Math.random() * 1000000).toString(),
        name: 'Generating Agent...',
        avatar: 'https://via.placeholder.com/400x400?text=Generating+Agent',
        shortDescription: 'Loading...',
        tags: [],
        personality: [],
        communicationStyle: [],
        emojis: [],
        isLoading: true
      } as Agent));

      setRandomAgents(loadingAgents);

      // Generate 3 agents concurrently
      const agentPromises = loadingAgents.map(async (loadingAgent) => {
        // Get the agent data first
        const newAgent = await generateRandomAgentData();
        
        // Update loading state to show we're generating the image
        setRandomAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === loadingAgent.id 
              ? { ...newAgent, id: loadingAgent.id, avatar: 'https://via.placeholder.com/400x400?text=Generating+Image', isLoading: true }
              : agent
          )
        );

        // Generate images for each agent
        const [mainImage, alternateImage] = await Promise.all([
          // Main character image
          (async () => {
            const prompt = `Generate a character portrait of ${newAgent.name} with ${getRandomTrait(imageTraits.hairStyles)} ${getRandomTrait(imageTraits.hairColors)} hair, ${getRandomTrait(imageTraits.eyeColors)} eyes, wearing ${getRandomTrait(imageTraits.clothingStyles)} style clothing. Their personality can be described as ${newAgent.personality?.join(', ') || 'unknown'} and their communication style is ${newAgent.communicationStyle?.join(', ') || 'unknown'}. Scene: ${getRandomTrait(imageTraits.backgrounds)}. Make sure to create an image with only one character.`;
            console.log("[generateNewAgent] - Prompt:", prompt);
            
            return generateSingleImage(
              prompt,
              modelId,
              styleUUID
            );
          })(),
          
          // Optional: Generate an alternate image concurrently
          (async () => {
            const alternatePrompt = `Alternative portrait of ${newAgent.name} in a different style.`;
            return generateSingleImage(
              alternatePrompt,
              "e71a1c2f-4f80-4800-934f-2c68979d8cc8",
              "b2a54a51-230b-4d4f-ad4e-8409bf58645f"
            );
          })()
        ]);

        if (!mainImage?.generations_by_pk?.generated_images?.[0]) {
          throw new Error('No image data received');
        }
        
        const imageObject = mainImage.generations_by_pk.generated_images[0];
        const loadedImageUrl = await loadImageWithFallback(imageObject.url);
        
        return { 
          ...newAgent,
          id: loadingAgent.id,
          avatar: loadedImageUrl, 
          leonardoImage: imageObject,
          leonardoResponse: mainImage,
          alternateImage: alternateImage?.generations_by_pk?.generated_images?.[0]?.url,
          isLoading: false 
        };
      });

      // Wait for all agents to be generated
      const completedAgents = await Promise.all(agentPromises);
      setRandomAgents(completedAgents);

    } catch (error) {
      console.error('[AgentGallery] Error generating agents:', error);
      const errorAgents = Array(3).fill(null).map(() => ({
        id: Math.floor(Math.random() * 1000000).toString(),
        name: 'Error',
        avatar: 'https://via.placeholder.com/400x400?text=Generation+Failed',
        shortDescription: 'Failed to generate agent',
        tags: [],
        personality: [],
        communicationStyle: [],
        emojis: [],
        isLoading: false
      } as Agent));
      setRandomAgents(errorAgents);
    } finally {
      setIsGenerating(false);
    }
  };

  // Update the handleSingleAgentRegeneration function
  const handleSingleAgentRegeneration = async (agentId: string): Promise<void> => {
    const modelId = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
    const styleUUID = "b2a54a51-230b-4d4f-ad4e-8409bf58645f";
    
    try {
      // Show loading state immediately with loading name
      setRandomAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId
            ? { 
                ...agent, 
                name: 'Loading Agent...', // Add loading name
                isLoading: true, 
                avatar: 'https://via.placeholder.com/400x400?text=Generating+Agent',
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
      console.log("[handleSingleAgentRegeneration] New agent concept:", newAgentData.concept);

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
                avatar: 'https://via.placeholder.com/400x400?text=Generating+Image', 
                isLoading: true 
              }
            : agent
        )
      );

      const prompt = `Generate an anime character portrait of ${newAgent.name} with ${getRandomTrait(imageTraits.hairStyles)} ${getRandomTrait(imageTraits.hairColors)} hair, ${getRandomTrait(imageTraits.eyeColors)} eyes, wearing ${getRandomTrait(imageTraits.clothingStyles)} style clothing. Their personality can be described as ${newAgent.personality?.join(', ') || 'unknown'}. Scene: ${getRandomTrait(imageTraits.backgrounds)}. Style: high quality, detailed anime art, character portrait`;

      const imageResponse = await generateSingleImage(prompt, modelId, styleUUID);
      if (!imageResponse?.generations_by_pk?.generated_images?.[0]?.url) {
        throw new Error('No image URL received');
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
                avatar: 'https://via.placeholder.com/400x400?text=Image+Generation+Failed',
                isLoading: false
              }
            : agent
        )
      );
    }
  };

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      generateNewAgent();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-md text-white ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-md text-white ${
                filter === 'random' 
                  ? 'bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
              onClick={() => setFilter('random')}
            >
              Random
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-md text-white ${
                filter === 'yourAgents' 
                  ? 'bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
              onClick={() => setFilter('yourAgents')}
            >
              Your Agents
            </button>
          </div>
          {/* <h1 className="text-2xl font-bold text-center flex-grow text-white">ARAI AI Agents Gallery</h1> */}
          {(filter === 'all' || filter === 'random') && (
            <button
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 rounded-md text-white flex items-center gap-2"
              onClick={generateNewAgent}
            >
              <RefreshCcw className="w-4 h-4" />
              Regenerate All
            </button>
          )}
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
                    onSelect={setSelectedAgent}
                    onAddAgent={(agent) => handleAddAgent(agent, agent.leonardoResponse)}
                    isUserAgent={false}
                    setRandomAgents={setRandomAgents}
                    generateRandomAgentData={generateRandomAgentData}
                    isLoadedAgent={true}
                    onRegenerate={handleSingleAgentRegeneration}
                    isLoading={agent.isLoading}
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
                    key={agent.agent?.id || Math.random().toString()}
                    agent={agent}
                    onSelect={setSelectedAgent}
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
                    key={agent.agent?.id || Math.random().toString()}
                    agent={agent}
                    onSelect={setSelectedAgent}
                  />
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AgentGallery;