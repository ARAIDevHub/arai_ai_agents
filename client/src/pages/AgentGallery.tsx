import React, { useState, useEffect, useRef } from 'react';
import {
  RefreshCcw,
} from 'lucide-react';
import { Agent } from '../interfaces/AgentInterfaces';
import useCharacters from '../hooks/useCharacters';
import RandomAgentCard from '../components/RandomAgentCard'; // Import the new component
import LoadedAgentCard from '../components/LoadedAgentCard'; // Import the new component
import { generateSingleImage } from '../api/leonardoApi';
import { createBlankAgent } from '../utils/agentUtils';
import { createAgent } from '../api/agentsAPI';
// Import the JSON files
import names from '../assets/generate-random-agents/names.json';
import personalities from '../assets/generate-random-agents/personalities.json';
import communicationStyles from '../assets/generate-random-agents/communicationStyles.json';
import emojis from '../assets/generate-random-agents/emojis.json';
import hashtags from '../assets/generate-random-agents/hashtags.json';
import { generateRandomAgent } from '../utils/generateRandomAgent';


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
      const newRandomAgentData = await generateRandomAgent();
      const agentObject = newRandomAgentData.agent;
      const agentDetails = agentObject.agent_details;

      return {
        id: Math.floor(Math.random() * 1000000),
        name: agentDetails.name || '',
        avatar: '',
        shortDescription: '...',
        tags: agentDetails.hashtags || [],
        personality: agentDetails.personality || [],
        communicationStyle: agentDetails.communication_style || [],
        emojis: agentDetails.emojis || [],
        universe: agentDetails.universe || '',
        backstory: agentDetails.backstory || '',
      };
    } catch (error) {
      console.error("[generateRandomAgentData] Error:", error);
      throw error;
    }
  };

  const handleAddAgent = (agent: Agent, leonardoResponse: any) => {
    // Step 1 Create a new blank agent
    const newAgent = createBlankAgent();
    console.log("[handleAddAgent] - Creating a new blank agent to populate the agent details", newAgent);
    console.log("[handleAddAgent] - Creating a new agent with the following details", agent);
    console.log("[handleAddAgent] - Leonardo response object:", leonardoResponse); // Log the full response object

    // Step 2 Populate the new agent with the details from the leonardo response
    // populate our concept
    newAgent.concept = agent.concept;

    // populate our agent details
    newAgent.agent.agent_details.name = agent?.name || '';
    newAgent.agent.agent_details.personality = agent?.personality || [];
    newAgent.agent.agent_details.communication_style = agent?.communicationStyle || [];
    newAgent.agent.agent_details.emojis = agent?.emojis || [];
    newAgent.agent.agent_details.hashtags = agent?.hashtags || [];
    newAgent.agent.agent_details.universe = agent?.universe || '';
    newAgent.agent.agent_details.topic_expertise = agent.agent_details?.topicExpertise || []; // Need to randomly generate this
    newAgent.agent.agent_details.backstory = agent?.backstory || ''; // Need to randomly generate this

    // Populate the image data
    console.log("[handleAddAgent] - Leonardo response object:", leonardoResponse);
    const generation_by_pk = leonardoResponse.generations_by_pk;
    newAgent.agent.profile_image_options[0].generations_by_pk = generation_by_pk;
    // Break down the generation_by_pk object for details to populate the Profile Image 
    newAgent.agent.profile_image.details.url = generation_by_pk.generated_images[0].url;
    newAgent.agent.profile_image.details.image_id = generation_by_pk.generated_images[0].id;
    newAgent.agent.profile_image.details.generationId = generation_by_pk.id;

    console.log("[handleAddAgent] - New agent with image data:", newAgent);

    // Call our api to save the new agent
    const newAgentResponse = createAgent(newAgent);
    console.log("[handleAddAgent] - New agent response:", newAgentResponse);

    setYourAgents((prevAgents) => [...prevAgents, agent]);
    // setRandomAgents((prevAgents) => prevAgents.filter((a) => a.id !== agent.id));
  };

  const generateNewAgent = async () => {
    setIsGenerating(true);
    
    try {
      // Show initial loading state before any operations start
      setRandomAgents([{
        id: Math.floor(Math.random() * 1000000),
        name: 'Generating Agent...',
        avatar: 'https://via.placeholder.com/400x400?text=Generating+Agent',
        shortDescription: 'Loading...',
        tags: [],
        personality: [],
        communicationStyle: [],
        emojis: [],
        isLoading: true
      } as Agent]);

      // Get the agent data first
      const newAgent = await generateRandomAgentData();
      
      // Update loading state to show we're generating the image
      setRandomAgents([{ 
        ...newAgent, 
        avatar: 'https://via.placeholder.com/400x400?text=Generating+Image',
        isLoading: true 
      }]);

      // Now run both image generations concurrently
      const [mainImage, alternateImage] = await Promise.all([
        // Main character image
        (async () => {
          const prompt = `Generate a character portrait of ${newAgent.name}. 
                         Their personality can be described as ${newAgent.personality.join(', ')} 
                         and their communication style is ${newAgent.communicationStyle.join(', ')}. 
                         Make sure to create an image with only one character.`;
          
          return generateSingleImage(
            prompt,
            "e71a1c2f-4f80-4800-934f-2c68979d8cc8",
            "b2a54a51-230b-4d4f-ad4e-8409bf58645f"
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
      
      const completedAgent = { 
        ...newAgent, 
        avatar: loadedImageUrl, 
        leonardoImage: imageObject,
        leonardoResponse: mainImage,
        alternateImage: alternateImage?.generations_by_pk?.generated_images?.[0]?.url,
        isLoading: false 
      };

      setRandomAgents([completedAgent]);

    } catch (error) {
      console.error('[AgentGallery] Error generating agents:', error);
      setRandomAgents([{
        id: Math.floor(Math.random() * 1000000),
        name: 'Error',
        avatar: 'https://via.placeholder.com/400x400?text=Generation+Failed',
        shortDescription: 'Failed to generate agent',
        tags: [],
        personality: [],
        communicationStyle: [],
        emojis: [],
        isLoading: false
      } as Agent]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add this function to handle single agent regeneration
  const handleSingleAgentRegeneration = async (agentId: number): Promise<void> => {
    const modelId = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
    const styleUUID = "b2a54a51-230b-4d4f-ad4e-8409bf58645f";
    
    try {
      const currentAgent = randomAgents.find(agent => agent.id === agentId);
      if (!currentAgent) return;

      const newAgentData = await generateRandomAgentData(); // Await the Promise
      const newAgent = {
        ...newAgentData,
        id: currentAgent.id
      };

      setRandomAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId 
            ? { ...newAgent, avatar: '', isLoading: true }
            : agent
        )
      );

      const prompt = `Generate an anime character portrait of ${newAgent.name}. 
                     Their personality can be described as ${newAgent.personality.join(', ')}. 
                     Style: high quality, detailed anime art, character portrait`;

      const imageResponse = await generateSingleImage(prompt, modelId, styleUUID);
      if (!imageResponse?.generations_by_pk?.generated_images?.[0]?.url) {
        throw new Error('No image URL received');
      }

      const imageUrl = imageResponse.generations_by_pk.generated_images[0].url;
      const loadedImageUrl = await loadImageWithFallback(imageUrl);

      setRandomAgents(prevAgents =>
        prevAgents.map(agent =>
          agent.id === agentId
            ? { ...newAgent, avatar: loadedImageUrl, isLoading: false }
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
                    key={agent.id}
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
                    key={agent.id}
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