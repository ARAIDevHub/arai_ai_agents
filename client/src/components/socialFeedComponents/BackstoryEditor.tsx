import React from 'react';
import { Button } from '../../components/button';
import { useAgent } from '../../context/AgentContext';

interface BackstoryEditorProps {
  draftBackstory: string;
  onBackstoryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onUpdateBackstory: () => void;
}

const BackstoryEditor: React.FC<BackstoryEditorProps> = ({ draftBackstory, onBackstoryChange, onUpdateBackstory }) => {
  const { state } = useAgent();

  console.log("Rendering BackstoryEditor with draftBackstory:", draftBackstory);

  return (
    <div className="mb-4 p-4 bg-slate-900/50 rounded-lg w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-2">Describe Content to Generate</h3>
      <textarea
        value={draftBackstory}
        onChange={onBackstoryChange}
        className="w-full p-2 bg-slate-800 text-white rounded-lg border border-cyan-800"
        placeholder="Enter your backstory here..."
        rows={4}
      />
      <Button
        onClick={onUpdateBackstory}
        className="bg-cyan-600 hover:bg-cyan-500"
        disabled={state.isUpdatingBackstory}
      >
        {state.isUpdatingBackstory ? "Updating..." : "Update Content Description"}
      </Button>
    </div>
  );
};

export default BackstoryEditor; 