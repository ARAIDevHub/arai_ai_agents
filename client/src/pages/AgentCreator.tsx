import React, { useState, ChangeEvent, useEffect } from "react";
import { createAgent, createRandomAgent } from "../api/agentsAPI";
import {
  GeneratedImage,
  ProfileImageOption,
  Agent
} from "../interfaces/AgentInterfaces";
import useCharacters from "../hooks/useCharacters";
import { useAgent } from '../context/AgentContext'; // Import the useAgent hook
import { handleDraftChange, handleDraftKeyDown, handleTraitDraftChange, handleTraitDraftKeyDown } from "../utils/AgentCreatorUtils/agentUtils";
import GenerateAgentSection from '../components/GenerateAgentSection';
import FullAgentCreationContent from '../components/AgentCreatorComponents/FullAgentCreationContent'; // Import the new component


/**
 * AgentCreator Component
 * A form-based interface for creating and editing AI agents with various attributes
 * including personality traits, communication style, and profile images.
 */
const AgentCreator: React.FC = () => {
  const { state, dispatch } = useAgent(); // Use the context to get state and dispatch

  /**
   * Main UI state management
   * activeTab controls which section of the form is visible:
   * - basic: name, universe, expertise
   * - personality: personality traits, backstory
   * - style: communication style, hashtags, emojis
   * - concept: concept description
   */
  const [activeTab, setActiveTab] = useState<"basic" | "personality" | "style" | "concept">(
    "basic"
  );

  // Define the type for submenu tabs
  type SubmenuTab = { id: "create" | "generate"; label: string };

  const subMenuTabs: SubmenuTab[] = [
    { id: 'generate', label: 'Generate Agent' },
    { id: 'create', label: 'Create Agent' }
  ];

  /**
   * Core agent state
   * Maintains the complete agent object including:
   * - agent_details: main characteristics and traits
   * - profile_image: currently selected image
   * - profile_image_options: available image choices
   * - selectedImage: index of chosen image
   * - seasons: associated seasons/episodes
   */
  const [agent, setAgent] = useState<{
    agent_details: {
      name: string;
      personality: string[];
      communication_style: string[];
      backstory: string;
      universe: string;
      topic_expertise: string[];
      hashtags: string[];
      emojis: string[];
    };
    profile_image: {
      details: {
        url: string;
        image_id: string;
        generationId: string;
      };
    };
    profile_image_options: ProfileImageOption[];
    selectedImage: number | undefined;
    seasons: any[];
    concept: string;
  }>({
    agent_details: {
      name: "",
      personality: [],
      communication_style: [],
      backstory: "",
      universe: "",
      topic_expertise: [],
      hashtags: [],
      emojis: []
    },
    profile_image: {
      details: {
        url: "",
        image_id: "",
        generationId: "",
      },
    },
    profile_image_options: [],
    selectedImage: undefined,
    seasons: [],
    concept: "",
  });

  // The fetched characters
  const { characters, loading, error } = useCharacters();

  /**
   * Draft field management
   * Maintains temporary states for text fields before they're committed to the main agent state
   * Prevents immediate updates and allows for Enter-to-commit functionality
   */
  const [draftFields, setDraftFields] = useState({
    name: "",
    universe: "",
    backstory: "",
    imageDescription: "",
    concept: "",
  });

  /**
   * Synchronization Effects
   * Keep draft states in sync with the main agent state
   * Ensures drafts are updated when agent data changes
   */
  useEffect(() => {
    console.log("Syncing draftFields with agent state", agent);
    setDraftFields({
      name: agent.agent_details.name || "",
      universe: agent.agent_details.universe || "",
      backstory: agent.agent_details.backstory || "",
      imageDescription:
        agent.profile_image_options?.[0]?.generations_by_pk?.prompt || "",
      concept: agent?.concept || "",
    });
  }, [agent]);

  /**
   * Draft traits management
   * Handles temporary states for array-based fields (traits, hashtags, etc.)
   * Stores them as comma-separated strings until committed
   */
  const [draftTraits, setDraftTraits] = useState<{
    topic_expertise: string;
    personality: string;
    communication_style: string;
    hashtags: string;
    emojis: string;
  }>({
    topic_expertise: "",
    personality: "",
    communication_style: "",
    hashtags: "",
    emojis: "",
  });

  /**
   * Synchronization Effects
   * Keep draft states in sync with the main agent state
   * Ensures drafts are updated when agent data changes
   */
  useEffect(() => {
    setDraftTraits({
      topic_expertise: agent.agent_details.topic_expertise.join(", "),
      personality: agent.agent_details.personality.join(", "),
      communication_style: agent.agent_details.communication_style.join(", "),
      hashtags: agent.agent_details.hashtags.join(", "),
      emojis: agent.agent_details.emojis.join(" "),
    });
  }, [agent]);

  /**
   * Profile Image Management
   * Handles initialization and updates of the agent's profile image
   * Sets default placeholder if no images are available
   */
  useEffect(() => {
    if (agent.profile_image_options.length > 0) {
      const selectedImageIndex = agent.selectedImage !== undefined ? agent.selectedImage : 0;
      const selectedImage =
        agent.profile_image_options[0]?.generations_by_pk?.generated_images?.[selectedImageIndex] ??
        ({
          url: "https://via.placeholder.com/400x400?text=Brain+Placeholder",
          id: "",
          generationId: "",
        } as GeneratedImage);

      setAgent((prev) => ({
        ...prev,
        profile_image: {
          details: {
            url: selectedImage.url,
            image_id: selectedImage.id,
            generationId: selectedImage.generationId,
          },
        },
      }));
    } else {
      setAgent((prev) => ({
        ...prev,
        profile_image: {
          details: {
            url: "https://via.placeholder.com/400x400?text=Brain+Placeholder",
            image_id: "",
            generationId: "",
          },
        },
      }));
    }
  }, [agent.profile_image_options, agent.selectedImage]);

  // Add state for loading progress near other state declarations
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Add a new state for tracking image generation
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedCharacterIndex, setSelectedCharacterIndex] =
    useState<number>(-1);

  // Define the type for draft fields
  type DraftField = "concept" | "name" | "universe" | "backstory" | "imageDescription";

  // Add state to manage the active submenu
  const [activeSubmenu, setActiveSubmenu] = useState<'create' | 'generate'>('generate');


  // Add state to store the list of agents
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    console.log("Agent state initialized:", agent);
  }, []);

  /**
   * Form Submission Handler
   * Processes the final agent data and sends it to the server
   * Shows success message on completion
   */
  const handleSubmitCreateAgent = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    type AgentState = typeof agent;

    const updatedAgent: AgentState = {
      ...agent,
      agent_details: {
        ...agent.agent_details,
        name: draftFields.name || agent.agent_details.name,
        universe: draftFields.universe || agent.agent_details.universe,
        backstory: draftFields.backstory || agent.agent_details.backstory,
        personality: draftTraits.personality
          ? draftTraits.personality
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
          : agent.agent_details.personality,
        communication_style: draftTraits.communication_style
          ? draftTraits.communication_style
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
          : agent.agent_details.communication_style,
        topic_expertise: draftTraits.topic_expertise
          ? draftTraits.topic_expertise
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
          : agent.agent_details.topic_expertise,
        hashtags: draftTraits.hashtags
          ? draftTraits.hashtags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
          : agent.agent_details.hashtags,
        emojis: draftTraits.emojis
          ? draftTraits.emojis.split(" ").filter(Boolean)
          : agent.agent_details.emojis,
      },
      concept: draftFields.concept || agent.concept,
      profile_image: agent.profile_image,
      profile_image_options: agent.profile_image_options.map((option, index) =>
        index === 0
          ? {
            ...option,
            generations_by_pk: {
              ...option.generations_by_pk,
              prompt:
                draftFields.imageDescription ||
                option.generations_by_pk?.prompt,
            },
          }
          : option
      ),
      selectedImage: agent.selectedImage,
      seasons: agent.seasons,
    };

    try {
      await createAgent(updatedAgent);

      setAgent(updatedAgent);
      setAgents((prevAgents) => [...prevAgents, updatedAgent as Agent]);
      console.log("Submit create agent", agent)
    } catch (error) {
      console.error("[AgentCreator] - Error creating agent:", error);
    }
  };

  /**
   * Character Selection Handler
   * Populates the form with data from an existing character
   * Updates both main agent state and draft states
   */
  const handleCharacterSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    setSelectedCharacterIndex(selectedIndex);
    const char = characters[selectedIndex];
    if (!char?.agent?.agent_details) return;

    // Dispatch the selected agent to the global state
    dispatch({ type: 'SET_AGENT', payload: char.agent.agent_details.name });

    const profileImageUrl = char.agent?.profile_image?.details?.url || "";
    const profileImageOptions = char.agent?.profile_image_options || [];
    const generatedImages = profileImageOptions[0]?.generations_by_pk?.generated_images || [];

    const imageIndex = generatedImages.findIndex(
      (img: { url: string }) => img.url === profileImageUrl
    ) || 0;

    // Update local state
    setAgent({
      agent_details: {
        name: char.agent.agent_details.name || "",
        personality: char.agent.agent_details.personality || [],
        communication_style: char.agent.agent_details.communication_style || [],
        backstory: char.agent.agent_details.backstory || "",
        universe: char.agent.agent_details.universe || "",
        topic_expertise: char.agent.agent_details.topic_expertise || [],
        hashtags: char.agent.agent_details.hashtags || [],
        emojis: char.agent.agent_details.emojis || [],
      },
      concept: char.agent.concept || "",
      profile_image: char.agent.profile_image_options || [],
      profile_image_options: char.agent.profile_image_options || [],
      selectedImage: char.agent.profile_image_options?.[0]?.generations_by_pk
        ?.generated_images?.length
        ? imageIndex
        : undefined,
      seasons: char.agent.seasons || [],
    });

    // Sync local drafts
    setDraftFields({
      name: char.agent.agent_details.name || "",
      universe: char.agent.agent_details.universe || "",
      backstory: char.agent.agent_details.backstory || "",
      imageDescription:
        char.agent.profile_image_options?.[0]?.generations_by_pk?.prompt || "",
      concept: char.agent.concept || "",
    });

    setDraftTraits({
      topic_expertise: (char.agent.agent_details.topic_expertise || []).join(", "),
      personality: (char.agent.agent_details.personality || []).join(", "),
      communication_style: (char.agent.agent_details.communication_style || []).join(", "),
      hashtags: (char.agent.agent_details.hashtags || []).join(", "),
      emojis: (char.agent.agent_details.emojis || []).join(" "),
    });
  };

  useEffect(() => {
    if (state.selectedAgent) {
      const index = characters.findIndex(
        (char) => char.agent.agent_details.name === state.selectedAgent
      );
      if (index !== -1 && index !== selectedCharacterIndex) {
        setSelectedCharacterIndex(index);
        // Avoid calling handleCharacterSelect if it causes state updates
        // handleCharacterSelect({ target: { value: index.toString() } } as ChangeEvent<HTMLSelectElement>);
      }
    }
  }, [state.selectedAgent, characters]);

  // Wrapper function to return the correct handler
  const getDraftChangeHandler = (field: string) => handleDraftChange(setDraftFields)(field as DraftField);
  const getDraftKeyDownHandler = (field: string) => handleDraftKeyDown(setAgent, draftFields, setDraftFields)(field);

  // Ensure setActiveTab is used with the correct type
  const handleTabChange = (tab: "concept" | "personality" | "basic" | "style") => {
    setActiveTab(tab);
  };

  const handleGenerateAgent = async (concept: string) => {
    console.log("Generating agent with concept:", concept);
    try {
      const agentData = await createRandomAgent(concept);
      console.log("Received response from createRandomAgent:", agentData);

      if (!agentData || !agentData.agent || !agentData.agent.agent_details) {
        console.error("Unexpected agentData structure:", agentData);
        return;
      }

      setAgent(agentData.agent);
      setActiveSubmenu('create'); // Switch to 'create' to show the rest of the page
    } catch (error) {
      console.error("Error generating agent:", error);
    } finally {
      dispatch({ type: 'SET_GENERATING_AGENT', payload: false }); // Reset generating state
    }
  };

  // Function to render the content based on the active submenu
  const renderSubmenuContent = () => {
    console.log("Rendering submenu content");
    console.log("Active submenu:", activeSubmenu);
    switch (activeSubmenu) {
      case 'generate':
        console.log("Case Rendering generate content");
        return <GenerateAgentSection onGenerate={handleGenerateAgent} />
      case 'create':
        console.log("Case Rendering create content");
        return (
          <FullAgentCreationContent
            agent={agent}
            draftFields={draftFields}
            draftTraits={draftTraits}
            loadingProgress={loadingProgress}
            isGenerating={isGenerating}
            handleDraftChange={getDraftChangeHandler}
            handleDraftKeyDown={getDraftKeyDownHandler}
            handleTraitDraftChange={handleTraitDraftChange(setDraftTraits)}
            handleTraitDraftKeyDown={handleTraitDraftKeyDown(setAgent, draftTraits)}
            handleSubmitCreateAgent={handleSubmitCreateAgent}
            handleTabChange={handleTabChange}
            handleCharacterSelect={handleCharacterSelect}
            characters={characters}
            loading={loading}
            error={error}
            selectedCharacterIndex={selectedCharacterIndex}
            setAgent={setAgent}
            setLoadingProgress={setLoadingProgress}
            setIsGenerating={setIsGenerating}
            setDraftFields={setDraftFields}
            setDraftTraits={setDraftTraits}
            activeTab={activeTab}
          />
        );
    }
  };

  return (
    <div className="border-b border-orange-500/30">
      <div className="flex p-4 gap-4">
        {subMenuTabs.map(submenuTab => (
          <button
            key={submenuTab.id}
            onClick={() => setActiveSubmenu(submenuTab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeSubmenu === submenuTab.id
              ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white'
              : 'text-gray-400 hover:text-cyan-400'
              }`}
          >
            {submenuTab.label}
          </button>
        ))}
      </div>
      {renderSubmenuContent()}
    </div>
  );
};

export default AgentCreator;
