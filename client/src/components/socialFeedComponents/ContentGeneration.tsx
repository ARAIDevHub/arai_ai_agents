import React from 'react';
import { Button } from '../button';
import { useAgent } from '../../context/AgentContext';

const ContentGeneration: React.FC = () => {
  const { state, dispatch } = useAgent();
  const [numPostsToGenerate, setNumPostsToGenerate] = React.useState<number>(1);

  const handleNumPostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumPostsToGenerate(Number(e.target.value));
  };

  const handleGenerateMultiplePosts = () => {
    // Logic to generate multiple posts
  };

  return (
    <div className="flex gap-4 justify-center p-3">
      <div className="flex items-center">
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
    </div>
  );
};

export default ContentGeneration; 