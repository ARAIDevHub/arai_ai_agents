import React, { useState, useEffect } from 'react';
import { Button } from '../../components/button';
import { useAgent } from '../../context/AgentContext';
import { updateBackstory } from '../../api/agentsAPI';

interface BackstoryEditorProps {
  selectedCharacter: any;
  setSelectedCharacter: (character: any) => void;
}

const BackstoryEditor: React.FC<BackstoryEditorProps> = ({ selectedCharacter, setSelectedCharacter }) => {
  const { state, dispatch } = useAgent();
  const [draftBackstory, setDraftBackstory] = useState<string>(selectedCharacter?.agent.agent_details.backstory || "");
  const [numPostsToGenerate, setNumPostsToGenerate] = useState<number>(1);

  useEffect(() => {
    if (selectedCharacter) {
      setDraftBackstory(selectedCharacter.agent.agent_details.backstory || "");
    }
  }, [selectedCharacter]);

  const handleBackstoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Backstory change detected:", e.target.value);
    setDraftBackstory(e.target.value);
  };

  const handleUpdateBackstory = async () => {
    if (!selectedCharacter) {
      console.warn("No character selected, cannot update backstory.");
      return;
    }

    dispatch({ type: 'SET_UPDATING_BACKSTORY', payload: true });

    try {
      const tempName = selectedCharacter.agent.agent_details.name.replace(" ", "_");
      const masterFilePath = `configs/${tempName}/${tempName}_master.json`;

      console.log("Updating backstory for:", tempName);
      console.log("Backstory content:", draftBackstory);

      const updatedAgent = await updateBackstory(masterFilePath, draftBackstory);
      console.log("Backstory updated successfully:", updatedAgent);

      setSelectedCharacter(updatedAgent);
    } catch (error) {
      console.error("Error updating backstory:", error);
    } finally {
      dispatch({ type: 'SET_UPDATING_BACKSTORY', payload: false });
    }
  };

  const handleNumPostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumPostsToGenerate(Number(e.target.value));
  };

  return (
    <div className="mb-4 p-4 bg-slate-900/50 rounded-lg w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-2">Describe Content to Generate</h3>
      <textarea
        value={draftBackstory}
        onChange={handleBackstoryChange}
        className="w-full p-2 bg-slate-800 text-white rounded-lg border border-cyan-800"
        placeholder="Enter your backstory here..."
        rows={8}
      />
      <Button
        onClick={handleUpdateBackstory}
        className="bg-cyan-600 hover:bg-cyan-500 p-2 "
        disabled={state.isUpdatingBackstory}
      >
        {state.isUpdatingBackstory ? "Updating..." : "Update Content Description"}
      </Button>
      <input
        type="number"
        value={numPostsToGenerate}
        onChange={handleNumPostsChange}
        min="1"
        className="w-16 p-2 bg-slate-800 text-white rounded-lg border border-cyan-800 mr-2"
      />
      <Button
        onClick={() => console.log(`Generating ${numPostsToGenerate} posts...`)}
        disabled={state.isGeneratingContent}
        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.isGeneratingContent ? "Generating..." : `Generate ${numPostsToGenerate} Posts`}
      </Button>
    </div>
  );
};

export default BackstoryEditor; 