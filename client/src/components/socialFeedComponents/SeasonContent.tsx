import React from 'react';
import SeasonTabs from './SeasonTabs';
import { Post } from '../../interfaces/PostsInterface';

const SeasonContent: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = React.useState<number | null>(null);
  const [characterPosts, setCharacterPosts] = React.useState<Post[]>([]);

  const handleSeasonSelect = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    // Logic to fetch and set posts for the selected season
  };

  const handleDeleteSeason = (seasonNumber: number) => {
    // Logic to delete a season
  };

  return (
    <div className="mb-4 p-4 bg-slate-900/50 rounded-lg w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-white mb-2">Select Season</h3>
      <SeasonTabs
        selectedSeason={selectedSeason}
        handleSeasonSelect={handleSeasonSelect}
        handleDeleteSeason={handleDeleteSeason}
      />
      <div>
        {characterPosts.map(post => (
          <div key={post.post_id} className="text-white">
            {post.post_content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonContent; 