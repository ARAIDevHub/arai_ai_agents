import React, { useState, ChangeEvent, useEffect, KeyboardEvent } from "react";
import { Brain, Wand2, MessageSquare, Save, RefreshCcw } from "lucide-react";
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
   */
  const [activeTab, setActiveTab] = useState<"basic" | "personality" | "style">(
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
  });

  /**
   * Synchronization Effects
   * Keep draft states in sync with the main agent state
   * Ensures drafts are updated when agent data changes
   */
  useEffect(() => {
    setDraftFields({
      name: agent.agent_details.name || "",
      universe: agent.agent_details.universe || "",
      backstory: agent.agent_details.backstory || "",
      imageDescription:
        agent.profile_image_options?.[0]?.generations_by_pk?.prompt || "",
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
      const firstImage =
        agent.profile_image_options[0]?.generations_by_pk
          ?.generated_images?.[0] ??
        ({
          url: "https://via.placeholder.com/400x400?text=Brain+Placeholder",
          id: "",
          generationId: "",
        } as GeneratedImage);

      setAgent((prev) => ({
        ...prev,
        selectedImage:
          prev.selectedImage !== undefined ? prev.selectedImage : 0,
        profile_image: {
          details: {
            url: firstImage.url,
            image_id: firstImage.id,
            generationId: firstImage.generationId,
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
  }, [agent.profile_image_options]);

  /**
   * Field Update Handlers
   * Manages updates to regular text fields (name, universe, backstory)
   * Commits changes when Enter is pressed
   */
  const handleDraftChange =
    (field: keyof typeof draftFields) =>
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setDraftFields((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleDraftKeyDown =
    (field: keyof typeof draftFields) =>
    (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (field === "imageDescription") {
          setAgent((prev) => {
            const newImageOption: ProfileImageOption = {
              generations_by_pk: {
                prompt: draftFields[field],
                generated_images: [],
              },
            };

            return {
              ...prev,
              profile_image_options: prev.profile_image_options?.length
                ? prev.profile_image_options.map((option, index) =>
                    index === 0
                      ? {
                          ...option,
                          generations_by_pk: {
                            ...option.generations_by_pk,
                            prompt: draftFields[field],
                          },
                        }
                      : option
                  )
                : [newImageOption],
            };
          });
        } else {
          setAgent((prev) => ({
            ...prev,
            agent_details: {
              ...prev.agent_details,
              [field]: draftFields[field],
            },
          }));
        }
      }
    };

  /**
   * Trait Field Handlers
   * Manages updates to array-based fields (personality, hashtags, etc.)
   * Splits input by commas (or spaces for emojis) and commits on Enter
   */
  const handleTraitDraftChange =
    (field: keyof typeof draftTraits) =>
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setDraftTraits((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleTraitDraftKeyDown =
    (field: keyof typeof draftTraits) =>
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // If field is "emojis", we split by space; otherwise, by comma
        const separator = field === "emojis" ? " " : ",";
        const arrayValue = draftTraits[field]
          .split(separator)
          .map((item) => item.trim())
          .filter(Boolean);

        setAgent((prev) => ({
          ...prev,
          agent_details: {
            ...prev.agent_details,
            [field]: arrayValue,
          },
        }));
      }
    };

  // Deleting a single trait
  type TraitField =
    | "personality"
    | "communication_style"
    | "topic_expertise"
    | "hashtags"
    | "emojis";

  const handleDeleteTrait = (field: TraitField, value: string) => {
    setAgent((prev) => ({
      ...prev,
      agent_details: {
        ...prev.agent_details,
        [field]: prev.agent_details[field].filter(
          (trait: string) => trait !== value
        ),
      },
    }));
  };

  // State to manage the visibility of the success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Add state for loading progress near other state declarations
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Add a new state for tracking image generation
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedCharacterIndex, setSelectedCharacterIndex] =
    useState<number>(-1);

  // Set the selectedCharacterIndex based on the context's selected agent
  useEffect(() => {
    if (characters.length > 0 && state.selectedAgent) {
      const index = characters.findIndex(
        (char) => char.agent.agent_details.name === state.selectedAgent
      );
      setSelectedCharacterIndex(index);
    }
  }, [characters, state.selectedAgent]);

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
        concept: agent.agent_details.concept,

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
      console.error("Error creating agent:", error);
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
            "Expected array of characters, received:",
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
      console.log("Processed characters:", processed);
      } catch (error) {
        console.error("Error loading characters:", error);
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
        concept: char.agent.agent_details.concept || "",
      },
      profile_image: char.agent.profile_image_options || [],
      profile_image_options: char.agent.profile_image_options || [],
      selectedImage: char.agent.profile_image_options?.[0]?.generations_by_pk
        ?.generated_images?.length
        ? 0
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
    });

    setDraftTraits({
      topic_expertise: (char.agent.agent_details.topic_expertise || []).join(", "),
      personality: (char.agent.agent_details.personality || []).join(", "),
      communication_style: (char.agent.agent_details.communication_style || []).join(", "),
      hashtags: (char.agent.agent_details.hashtags || []).join(", "),
      emojis: (char.agent.agent_details.emojis || []).join(" "),
    });
  };

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
                    console.error("Error generating new image:", error);
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
                        console.error("Error loading image:", error);
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
                  onChange={handleDraftChange("imageDescription")}
                  onKeyDown={handleDraftKeyDown("imageDescription")}
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
          <div className="flex gap-4 mb-6 bg-slate-900/80 p-2 rounded-lg">
            {[
              { id: "basic" as const, icon: Brain, label: "Basic Info" },
              { id: "personality" as const, icon: Wand2, label: "Personality" },
              { id: "style" as const, icon: MessageSquare, label: "Style" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                }}
                className={`flex-1 flex items-center justify-center px-4 py-2 
                            rounded-md text-gray-100 ${
                              activeTab === id
                                ? "bg-gradient-to-r from-cyan-600 to-orange-600"
                                : ""
                            }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="space-y-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                {/* Agent Name => local draft */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Agent Name
                  </label>
                  <textarea
                    value={draftFields.name}
                    onChange={handleDraftChange("name")}
                    onKeyDown={handleDraftKeyDown("name")}
                    placeholder="Enter agent name (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Universe => local draft */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Universe
                  </label>
                  <textarea
                    value={draftFields.universe}
                    onChange={handleDraftChange("universe")}
                    onKeyDown={handleDraftKeyDown("universe")}
                    placeholder="Enter universe (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Topic Expertise => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Topic Expertise
                  </label>
                  <TraitButtons
                    field="topic_expertise"
                    options={agent.agent_details.topic_expertise}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.topic_expertise}
                    onChange={handleTraitDraftChange("topic_expertise")}
                    onKeyDown={handleTraitDraftKeyDown("topic_expertise")}
                    placeholder="Comma-separated (e.g. 'AI, Robotics, Music') (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>
            )}

            {activeTab === "personality" && (
              <div className="space-y-6">
                {/* Personality => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Personality
                  </label>
                  <TraitButtons
                    field="personality"
                    options={agent.agent_details.personality}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.personality}
                    onChange={handleTraitDraftChange("personality")}
                    onKeyDown={handleTraitDraftKeyDown("personality")}
                    placeholder="Comma-separated personality traits (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Backstory => local draft */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Backstory
                  </label>
                  <textarea
                    value={draftFields.backstory}
                    onChange={handleDraftChange("backstory")}
                    onKeyDown={handleDraftKeyDown("backstory")}
                    placeholder="Enter agent backstory (Press Enter to commit)"
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>
            )}

            {activeTab === "style" && (
              <div className="space-y-6">
                {/* Communication Style => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Communication Style
                  </label>
                  <TraitButtons
                    field="communication_style"
                    options={agent.agent_details.communication_style}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.communication_style}
                    onChange={handleTraitDraftChange("communication_style")}
                    onKeyDown={handleTraitDraftKeyDown("communication_style")}
                    placeholder="Comma-separated (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Hashtags => local draft => commit on Enter */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Hashtags
                  </label>
                  <TraitButtons
                    field="hashtags"
                    options={agent.agent_details.hashtags}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.hashtags}
                    onChange={handleTraitDraftChange("hashtags")}
                    onKeyDown={handleTraitDraftKeyDown("hashtags")}
                    placeholder="Comma-separated #tags (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                {/* Emojis => local draft => commit on Enter => splitted by space */}
                <div>
                  <label className="text-sm text-gray-100 block mb-2">
                    Emojis
                  </label>
                  <TraitButtons
                    field="emojis"
                    options={agent.agent_details.emojis}
                    onTraitButtonClick={handleDeleteTrait}
                  />
                  <textarea
                    value={draftTraits.emojis}
                    onChange={handleTraitDraftChange("emojis")}
                    onKeyDown={handleTraitDraftKeyDown("emojis")}
                    placeholder="Split by space (e.g. '✨ 🚀') (Press Enter to commit)"
                    rows={2}
                    className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>
            )}
          </div>

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
