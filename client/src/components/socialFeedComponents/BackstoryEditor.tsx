import React, { useState } from 'react';
import { Button } from '../../components/button';
import { useAgent } from '../../context/AgentContext';

interface BackstoryEditorProps {
  draftBackstory: string;
  onBackstoryChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onUpdateBackstory: () => void;
}

const BackstoryEditor: React.FC<BackstoryEditorProps> = ({ draftBackstory, onBackstoryChange, onUpdateBackstory }) => {
  const { state } = useAgent();
  
  // Add state for numPostsToGenerate
  const [numPostsToGenerate, setNumPostsToGenerate] = useState<number>(1);

  // Function to handle changes in the number input
  const handleNumPostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumPostsToGenerate(Number(e.target.value));
  };

  // Function to handle generating multiple posts
  const handleGenerateMultiplePosts = () => {
    // Logic to generate multiple posts
    console.log(`Generating ${numPostsToGenerate} posts...`);
  };

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
      <input
        type="number"
        value={numPostsToGenerate}
        onChange={handleNumPostsChange}
        min="1"
        className="w-16 p-2 bg-slate-800 text-white rounded-lg border border-cyan-800 mr-2"
      />
      <Button
        onClick={handleGenerateMultiplePosts}
        disabled={state.isGeneratingContent}
        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state.isGeneratingContent ? "Generating..." : `Generate ${numPostsToGenerate} Posts`}
      </Button>
    </div>
  );
};

export default BackstoryEditor; 