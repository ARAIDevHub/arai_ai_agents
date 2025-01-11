import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AgentDetails } from '../interfaces/AgentInterfaces'; // Adjust the import path as necessary

interface TraitButtonsProps {
  field: keyof AgentDetails;
  options: string[];
  onTraitButtonClick: (field: keyof AgentDetails, value: string) => void; // Ensure this is defined
}

// Function to handle suggestion chip clicks and update the agent's field with the selected value
const handleTraitButtonsClick = (field: keyof AgentDetails, value: string, onClick: (field: keyof AgentDetails, value: string) => void): void => {
  if (typeof onClick === 'function') {
    onClick(field, value);
  } else {
    console.error('onClick is not a function');
  }
};

// Component to render suggestion chips for a given field with provided options
const TraitButtons: React.FC<TraitButtonsProps> = ({ field, options, onTraitButtonClick }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // Track selected option

  const handleDeleteTrait = (option: string) => {
    if (typeof onTraitButtonClick === 'function') {
      onTraitButtonClick(field, option); // Call the click handler to delete the trait
    } else {
      console.error('onTraitButtonClick is not a function'); // Log an error if it's not a function
    }
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
              setSelectedOption(option); // Update selected option for highlighting
            }}
          >
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
              {option}
            </div>
            <span
              className="text-red-500 ml-2 cursor-pointer"
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