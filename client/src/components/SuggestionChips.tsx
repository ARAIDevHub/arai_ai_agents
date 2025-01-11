import { Sparkles } from 'lucide-react';
import React from 'react';

interface SuggestionChipsProps {
  field: string;
  options: string[];
  handleSuggestionClick: (field: string, option: string) => void;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ field, options, handleSuggestionClick }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {options.map((option, index) => (
      <button
        key={index}
        className="px-3 py-1 rounded-full bg-cyan-900/30 hover:bg-cyan-800/30 text-cyan-200 
                   border border-orange-500/30 transition-all duration-300 flex items-center"
        onClick={() => handleSuggestionClick(field, option)}
      >
        <Sparkles className="w-4 h-4 mr-2 text-orange-400" />
        {option}
      </button>
    ))}
  </div>
);

export default SuggestionChips; 