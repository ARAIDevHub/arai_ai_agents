import React from 'react';
import { Sparkles } from 'lucide-react';

interface TraitButtonsProps {
  field: string; // Adjusted to string for simplicity
  options: string[];
  onClick: (field: string, value: string) => void; // Prop to handle click
}

const TraitButtons: React.FC<TraitButtonsProps> = ({ field, options, onClick }) => {
  console.log("TraitButtons rendered with field:", field, "and options:", options); // Debug log
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <button
          key={index}
          className="px-3 py-1 rounded-full bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-200 
                     border border-orange-500/30 transition-all duration-300 flex items-center"
          onClick={() => onClick(field, option)} // Use the passed onClick function
        >
          <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
          {option}
        </button>
      ))}
    </div>
  );
};

export default TraitButtons; 