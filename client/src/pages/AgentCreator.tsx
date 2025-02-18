import React, { useState, ChangeEvent, useEffect, KeyboardEvent } from "react";
import { Brain, Wand2, MessageSquare, Save, RefreshCcw, Sparkles } from "lucide-react";
import { createAgent, getCharacters } from "../api/agentsAPI";
import {
  GeneratedImage,
  ProfileImageOption,
} from "../interfaces/AgentInterfaces";
import TraitButtons from "../components/TraitButtons"; // We'll still use your TraitButtons
import useCharacters from "../hooks/useCharacters";
import { inconsistentImageLambda } from "../api/leonardoApi";
import LoadingBar from "../components/LoadingBar";
import { useAgent } from '../context/AgentContext'; // Import the useAgent hook
import AgentForm from "../components/AgentCreatorComponents/AgentForm";
import { handleDraftChange, handleDraftKeyDown, handleTraitDraftChange, handleTraitDraftKeyDown } from "../utils/AgentCreatorUtils/agentUtils";

const LEONARDO_MODEL_ID = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
const LEONARDO_STYLE_UUID = "b2a54a51-230b-4d4f-ad4e-8409bf58645f";


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
      concept: string;
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
  }>({
    agent_details: {
      name: "",
      personality: [],
      communication_style: [],
      backstory: "",
      universe: "",
      topic_expertise: [],
      hashtags: [],
      emojis: [],
      concept: "",
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

  // State to manage the visibility of the success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Add state for loading progress near other state declarations
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Add a new state for tracking image generation
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedCharacterIndex, setSelectedCharacterIndex] =
    useState<number>(-1);

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

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setAgent(updatedAgent);
    } catch (error) {
      console.error("[AgentCreator] - Error creating agent:", error);
    }
  };

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 8) Load characters
  // ──────────────────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const charactersData = await getCharacters();
        if (!Array.isArray(charactersData)) {
          console.error(
            "[AgentCreator] - Expected array of characters, received:",
            typeof charactersData
          );
          return;
        }

        const processed = charactersData.map((char) => {
          const agentProfileImageOptions = char.agent.profile_image_options;
          const agentConcept = char.concept;
          const { agent } = char;
          if (!agent) return { agent: {} };

          const {
            agent_details: {
              name = "",
              personality = [],
              communication_style = [],
              backstory = "",
              universe = "",
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
                personality,
                communication_style,
                backstory,
                universe,
                topic_expertise,
                hashtags,
                emojis,
              },
              ai_model,
              connectors,
              profile_image: agentProfileImageOptions || [],
              seasons,
              tracker,
            },
            concept: agentConcept || "",
          };
        });
      } catch (error) {
        console.error("[AgentCreator] - Error loading characters:", error);
      }
    };

    loadCharacters();
  }, []);

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
        handleCharacterSelect({ target: { value: index.toString() } } as ChangeEvent<HTMLSelectElement>);
      }
    }
  }, [state.selectedAgent, characters]);

  // Wrapper function to return the correct handler
  const getDraftChangeHandler = (field: keyof typeof draftFields) => handleDraftChange(setDraftFields)(field);
  const getDraftKeyDownHandler = (field: keyof typeof draftFields) => handleDraftKeyDown(setAgent, draftFields)(field);

  //
  // ──────────────────────────────────────────────────────────────────────────────
  // 10) Render
  // ──────────────────────────────────────────────────────────────────────────────
  //
  return (
    
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-md shadow-lg">
            Agent successfully saved!
          </div>
        </div>
      )}

      <div className="flex-grow flex">
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
                  agent.selectedImage !== undefined &&
                  agent.profile_image?.details?.url &&
                  loadingProgress === 0
                    ? `url(${agent.profile_image.details.url})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {loadingProgress > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                  <div className="w-3/4">
                    <LoadingBar progress={loadingProgress} />
                  </div>
                </div>
              )}
              {agent.selectedImage === undefined && loadingProgress === 0 && (
                <Brain className="w-32 h-32 text-cyan-400" />
              )}
              <button
                className={`absolute bottom-4 right-4 px-4 py-2 rounded-md bg-gradient-to-r 
                           from-orange-600 to-red-600 text-white flex items-center
                           ${
                             isGenerating
                               ? "opacity-50 cursor-not-allowed"
                               : "hover:from-orange-700 hover:to-red-700"
                           }`}
                onClick={async () => {
                  if (isGenerating) return; // Prevent multiple clicks while generating

                  try {
                    setIsGenerating(true);
                    let prompt =
                      agent.profile_image_options?.[0]?.generations_by_pk
                        ?.prompt ||
                      draftFields.imageDescription ||
                      "";

                    setLoadingProgress(10);

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

                    setLoadingProgress(50);
                    const imageUrl =
                      imageResponse.generations_by_pk.generated_images[0].url;

                    setLoadingProgress(90);
                    setAgent((prev) => ({
                      ...prev,
                      profile_image: {
                        details: {
                          url: imageUrl,
                          image_id:
                            imageResponse.generations_by_pk.generated_images[0]
                              .id,
                          generationId: imageResponse.generations_by_pk.id,
                        },
                      },
                      profile_image_options: [
                        {
                          generations_by_pk: {
                            ...imageResponse.generations_by_pk,
                            prompt,
                          },
                        },
                      ],
                    }));

                    setLoadingProgress(100);
                    setTimeout(() => setLoadingProgress(0), 500);
                  } catch (error) {
                    console.error("[AgentCreator] - Error generating new image:", error);
                    setLoadingProgress(0);
                  } finally {
                    setIsGenerating(false);
                  }
                }}
                disabled={isGenerating}
              >
                <RefreshCcw
                  className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
                />
                {isGenerating ? "Generating..." : "Regenerate All"}
              </button>
            </div>

            {/* Image Selection Grid */}
            <div className="grid grid-cols-4 gap-4">
              {agent.profile_image_options?.[0]?.generations_by_pk?.generated_images?.map(
                (image: GeneratedImage, index: number) => (
                  <div
                    key={index}
                    className={`relative aspect-square bg-gradient-to-br from-slate-900/80 
                              via-cyan-900/20 to-orange-900/20 rounded-lg cursor-pointer 
                              ${
                                agent.selectedImage === index
                                  ? "ring-2 ring-orange-500"
                                  : ""
                              }`}
                    onClick={async () => {

                      try {
                        setLoadingProgress(30);

                        setLoadingProgress(70);

                        setAgent((prev) => ({
                          ...prev,
                          selectedImage: index,
                          profile_image: {
                            details: {
                              url: image?.url || "",
                              image_id: image?.id || "",
                              generationId: image?.generationId || "",
                            },
                          },
                        }));

                        setLoadingProgress(100);
                        setTimeout(() => setLoadingProgress(0), 500);
                      } catch (error) {
                        console.error("[AgentCreator] - Error loading image:", error);
                        setLoadingProgress(0);
                      }
                    }}
                    style={{
                      backgroundImage: image?.url ? `url(${image.url})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {agent.selectedImage === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Character Info Card */}
            <div className="p-4 rounded-lg bg-slate-900/80 border border-orange-500/30">
              <div className="mb-4">
                <div className="text-lg font-semibold text-orange-400">
                  Image Generation Description
                </div>
                <textarea
                  value={draftFields.imageDescription || ""}
                  onChange={getDraftChangeHandler("imageDescription")}
                  onKeyDown={getDraftKeyDownHandler("imageDescription")}
                  placeholder="Enter image generation description (Press Enter to commit)"
                  rows={3}
                  className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/80 border border-orange-500/30">
              <div className="mb-4">
                <div className="text-lg font-semibold text-orange-400">
                  Agent Name
                </div>
                <div className="text-gray-100">{agent.agent_details.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-6">
          <AgentForm
            draftFields={draftFields}
            draftTraits={draftTraits}
            handleDraftChange={getDraftChangeHandler}
            handleDraftKeyDown={getDraftKeyDownHandler}
            handleTraitDraftChange={handleTraitDraftChange(setDraftTraits)}
            handleTraitDraftKeyDown={handleTraitDraftKeyDown(setAgent, draftTraits)}
            handleDeleteTrait={(field: string, value: string) => {
              setAgent((prev) => ({
                ...prev,
                agent_details: {
                  ...prev.agent_details,
                  [field]: prev.agent_details[field].filter(
                    (trait: string) => trait !== value
                  ),
                },
              }));
            }}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            agent={agent}
          />

          <button
            type="button"
            onClick={(e) =>
              handleSubmitCreateAgent(
                e as unknown as React.FormEvent<HTMLFormElement>
              )
            }
            className="mt-6 w-full px-4 py-2 rounded-md bg-gradient-to-r 
                         from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 
                         text-gray-100 transition-all duration-300 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Agent
          </button>

          {/* Character Selection */}
          <div className="mt-6 p-4 bg-slate-900/80 rounded-lg border border-orange-500/30">
            <label className="text-sm text-gray-100 block mb-2">
              Select Existing Character
            </label>
            {loading ? (
              <div className="text-gray-100">Loading characters...</div>
            ) : error ? (
              <div className="text-red-400">
                No Existing Agents - {error.message}
              </div>
            ) : (
              <>
                <select
                  className="w-full px-3 py-2 rounded-md bg-slate-900/80 border 
                           border-orange-500/30 text-gray-100 focus:ring-2 
                           focus:ring-orange-500/50 focus:outline-none"
                  onChange={handleCharacterSelect}
                  value={selectedCharacterIndex}
                >
                  <option value={-1}>-- Select a Character --</option>
                  {characters.map((char, index) => (
                    <option key={index} value={index}>
                      {char.agent?.agent_details?.name || "Unnamed Character"}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCreator;
