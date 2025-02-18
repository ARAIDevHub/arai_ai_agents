import React from 'react';
import useCharacters from '../hooks/useCharacters';

interface AgentSelectionProps {
  selectedCharacterIndex: number;
  handleSelectAgent: (index: number) => void;
  className?: string;
}

const AgentSelection: React.FC<AgentSelectionProps> = ({ selectedCharacterIndex, handleSelectAgent, className }) => {
  const { characters } = useCharacters();

  return (
    <div className={`flex items-center ${className || ''}`}>
      <label className="text-lg font-semibold text-white mr-2">
        Select Agent:
      </label>
      <select 
        className="bg-slate-800 text-white rounded-lg p-2 border border-cyan-800"
        onChange={(e) => {
          const index = parseInt(e.target.value);
          console.log("Selected index:", index);
          handleSelectAgent(index);
        }}
        value={selectedCharacterIndex}
      >
        <option value={-1} className="text-white font-semibold">Select an Agent</option>
        {characters.map((char, index) => (
          <option key={index} value={index}>
            {char.agent.agent_details.name}
            {char.agent.master_file_path?.includes('_1') ? ' (1)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AgentSelection; 