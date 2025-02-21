import React from 'react';
import { Brain, RefreshCcw, Save } from "lucide-react";
import LoadingBar from "../LoadingBar";
import AgentForm from "./AgentForm";
import { GeneratedImage } from "../../interfaces/AgentInterfaces";
import { inconsistentImageLambda } from "../../api/leonardoApi";

const LEONARDO_MODEL_ID = "e71a1c2f-4f80-4800-934f-2c68979d8cc8";
const LEONARDO_STYLE_UUID = "b2a54a51-230b-4d4f-ad4e-8409bf58645f";

interface FullAgentCreationContentProps {
  agent: any;
  draftFields: any;
  draftTraits: any;
  loadingProgress: number;
  isGenerating: boolean;
  handleDraftChange: (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleDraftKeyDown: (field: string) => (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleTraitDraftChange: (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleTraitDraftKeyDown: (field: string) => (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSubmitCreateAgent: (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => void;
  handleTabChange: (tab: "concept" | "personality" | "basic" | "style") => void;
  handleCharacterSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  characters: any[];
  loading: boolean;
  error: any;
  selectedCharacterIndex: number;
  setAgent: React.Dispatch<React.SetStateAction<any>>;
  setLoadingProgress: React.Dispatch<React.SetStateAction<number>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setDraftFields: React.Dispatch<React.SetStateAction<any>>;
  setDraftTraits: React.Dispatch<React.SetStateAction<any>>;
  activeTab: "concept" | "personality" | "basic" | "style";
}

const FullAgentCreationContent: React.FC<FullAgentCreationContentProps> = ({
  agent,
  draftFields,
  draftTraits,
  loadingProgress,
  isGenerating,
  handleDraftChange,
  handleDraftKeyDown,
  handleTraitDraftChange,
  handleTraitDraftKeyDown,
  handleSubmitCreateAgent,
  handleTabChange,
  handleCharacterSelect,
  characters,
  loading,
  error,
  selectedCharacterIndex,
  setAgent,
  setLoadingProgress,
  setIsGenerating,
  activeTab
}) => {
  return (
    <div className="flex">
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
                         ${isGenerating
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
                  setAgent((prev: any) => ({
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
                            ${agent.selectedImage === index
                      ? "ring-2 ring-orange-500"
                      : ""
                    }`}
                  onClick={async () => {

                    try {
                      setLoadingProgress(30);

                      setLoadingProgress(70);

                      setAgent((prev: any) => ({
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
        <AgentForm
          draftFields={draftFields}
          draftTraits={draftTraits}
          handleDraftChange={handleDraftChange}
          handleDraftKeyDown={handleDraftKeyDown}
          handleTraitDraftChange={handleTraitDraftChange}
          handleTraitDraftKeyDown={handleTraitDraftKeyDown}
          handleDeleteTrait={(field: string, value: string) => {
            setAgent((prev: any) => ({
              ...prev,
              agent_details: {
                ...prev.agent_details,
                [field as keyof typeof agent.agent_details]: Array.isArray(prev.agent_details[field as keyof typeof agent.agent_details])
                  ? (prev.agent_details[field as keyof typeof agent.agent_details] as string[]).filter(
                    (trait: string) => trait !== value
                  )
                  : prev.agent_details[field as keyof typeof agent.agent_details], // If it's not an array, return as is
              },
            }));
          }}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          agent={agent}
        />

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
      </div>
    </div>
  );
};

export default FullAgentCreationContent; 