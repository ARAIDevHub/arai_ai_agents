import React from 'react';
import { Season } from '../../interfaces/PostsInterface';

interface SeasonTabsProps {
  selectedCharacter: any;
  selectedSeason: number | null;
  handleSeasonSelect: (seasonNumber: number) => void;
  handleDeleteSeason: (seasonNumber: number) => void;
}

const SeasonTabs: React.FC<SeasonTabsProps> = ({ selectedCharacter, selectedSeason, handleSeasonSelect, handleDeleteSeason }) => {
  if (!selectedCharacter) return null;

  return (
    <div className="flex space-x-4 mb-4">
      {selectedCharacter.agent.seasons.map((season: Season) => (
        <div key={season.season_number} className="flex items-center">
          <button
            onClick={() => handleSeasonSelect(season.season_number)}
            className={`px-4 py-2 rounded-lg ${
              selectedSeason === season.season_number
                ? "bg-cyan-600 text-white"
                : "bg-slate-800 text-gray-400"
            }`}
          >
            Season {season.season_number}
          </button>
          <button
            onClick={() => handleDeleteSeason(season.season_number)}
            className="ml-2 px-2 py-1 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default SeasonTabs; 