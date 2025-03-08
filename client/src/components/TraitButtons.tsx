import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { TraitButtonsProps } from '../interfaces/TraitButtonsProps';

// Component to render suggestion chips for a given field with provided options
const TraitButtons: React.FC<TraitButtonsProps> = ({ field, options = [], onTraitButtonClick }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Track selected option

  const handleDeleteTrait = (option: string) => {
    setSelectedOption(null); // Clear the selected option
    onTraitButtonClick(field, option); // Call the click handler to delete the trait
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <div key={index} className="flex items-center">
          <button
            className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center justify-between 
                        ${selectedOption === option ? 'bg-orange-500 text-white' : 'bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-200'} 
                        border border-orange-500/30`}
            onClick={() => {
              setSelectedOption(option); // Update selected option
            }}
          >
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
              {option}
            </div>
            <span
              className="text-red-500 ml-2 cursor-pointer" // Changed to span and added cursor pointer
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from bubbling up to the main button
                handleDeleteTrait(option); // Handle delete action
              }}
            >
              x
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default TraitButtons;