import React, { useState } from 'react';
import { useAgent } from '../../context/AgentContext';

interface GenerateAgentSectionProps {
  onGenerate: (concept: string) => void;
}

const GenerateAgentSection: React.FC<GenerateAgentSectionProps> = ({ onGenerate }) => {
  const [concept, setConcept] = useState('');
  const { state, dispatch } = useAgent();

  const handleGenerateClick = () => {
    if (!concept) {
      console.warn("Concept is empty, cannot generate agent");
      return;
    }
    dispatch({ type: 'SET_GENERATING_AGENT', payload: true });
    onGenerate(concept);
  };

  return (
    <div className="grid grid-cols-3">
      <div className="col-start-2 col-span-1 p-4 bg-slate-900/80 rounded-lg border border-orange-500/30">
        <div className="mb-4">
          <label className="text-lg font-semibold text-orange-400">
            Enter Concept
          </label>
          <textarea
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            rows={4}
            placeholder="Enter concept for agent generation"
            className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerateClick}
          className="mt-4 w-full px-4 py-2 rounded-md bg-gradient-to-r 
                     from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 
                     text-gray-100 transition-all duration-300 flex items-center justify-center"
          disabled={state.isGeneratingAgent}
        >
          {state.isGeneratingAgent ? "Generating..." : "Generate Agent"}
        </button>
      </div>
    </div>
  );
};

export default GenerateAgentSection; 