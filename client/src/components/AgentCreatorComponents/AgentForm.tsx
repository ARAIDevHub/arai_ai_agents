import React, { ChangeEvent, KeyboardEvent } from "react";
import TraitButtons from "../TraitButtons";

interface AgentFormProps {
  draftFields: any;
  draftTraits: any;
  handleDraftChange: (field: string) => (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleDraftKeyDown: (field: string) => (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleTraitDraftChange: (field: string) => (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleTraitDraftKeyDown: (field: string) => (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  handleDeleteTrait: (field: string, value: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agent: any;
}

const AgentForm: React.FC<AgentFormProps> = ({
  draftFields,
  draftTraits,
  handleDraftChange,
  handleDraftKeyDown,
  handleTraitDraftChange,
  handleTraitDraftKeyDown,
  handleDeleteTrait,
  activeTab,
  setActiveTab,
  agent,
}) => {
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 bg-slate-900/80 p-2 rounded-lg">
        {[
          { id: "basic", label: "Basic Info" },
          { id: "personality", label: "Personality" },
          { id: "style", label: "Style" },
          { id: "concept", label: "Concept" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center px-4 py-2 
                        rounded-md text-gray-100 ${
                          activeTab === id
                            ? "bg-gradient-to-r from-cyan-600 to-orange-600"
                            : ""
                        }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          {/* Agent Name */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Agent Name</label>
            <textarea
              value={draftFields.name}
              onChange={handleDraftChange("name")}
              onKeyDown={handleDraftKeyDown("name")}
              placeholder="Enter agent name (Press Enter to commit)"
              rows={2}
              className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          {/* Universe */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Universe</label>
            <textarea
              value={draftFields.universe}
              onChange={handleDraftChange("universe")}
              onKeyDown={handleDraftKeyDown("universe")}
              placeholder="Enter universe (Press Enter to commit)"
              rows={2}
              className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          {/* Image Description */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Image Generation Description</label>
            <textarea
              value={draftFields.imageDescription}
              onChange={handleDraftChange("imageDescription")}
              onKeyDown={handleDraftKeyDown("imageDescription")}
              placeholder="Enter image generation description (Press Enter to commit)"
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          {/* Backstory */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Backstory</label>
            <textarea
              value={draftFields.backstory}
              onChange={handleDraftChange("backstory")}
              onKeyDown={handleDraftKeyDown("backstory")}
              placeholder="Enter backstory (Press Enter to commit)"
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
        </div>
      )}

      {activeTab === "personality" && (
        <div className="space-y-6">
          {/* Personality Traits */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Personality Traits</label>
            <TraitButtons
              field="personality"
              options={agent.agent_details.personality || []}
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
        </div>
      )}

      {activeTab === "style" && (
        <div className="space-y-6">
          {/* Communication Style */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Communication Style</label>
            <TraitButtons
              field="communication_style"
              options={agent.agent_details.communication_style || []}
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
          {/* Hashtags */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Hashtags</label>
            <TraitButtons
              field="hashtags"
              options={agent.agent_details.hashtags || []}
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
          {/* Emojis */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Emojis</label>
            <TraitButtons
              field="emojis"
              options={agent.agent_details.emojis || []}
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

      {activeTab === "concept" && (
        <div className="space-y-6">
          {/* Concept */}
          <div>
            <label className="text-sm text-gray-100 block mb-2">Concept</label>
            <textarea
              value={draftFields.concept}
              onChange={handleDraftChange("concept")}
              onKeyDown={handleDraftKeyDown("concept")}
              placeholder="Enter concept (Press Enter to commit)"
              rows={2}
              className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentForm; 