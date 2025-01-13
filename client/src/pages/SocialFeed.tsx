import React, { useState } from 'react';
import useCharacters from '../hooks/useCharacters';
import { MessageSquare, Heart } from 'lucide-react';
import { Episode, Season } from '../interfaces/SeasonsEpisodesInterface';
import { Post } from '../interfaces/PostsInterface';


const SocialFeed: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [characterPosts, setCharacterPosts] = useState<Post[]>([]);

  const getCharacterPosts = (character: any) => {
    if (!character?.agent?.seasons) return [];

    const allPosts: Post[] = [];
    
    character.agent.seasons.forEach((season: Season) => {
      season.episodes.forEach((episode: Episode) => {
        if (episode.posts && Array.isArray(episode.posts)) {
          const episodePosts = episode.posts.map((post: Post) => ({
            ...post,
            seasonNumber: season.season_number,
            episodeNumber: episode.episode_number,
            episodeName: episode.episode_name
          }));
          allPosts.push(...episodePosts);
        }
      });
    });

    // Sort posts by season number, episode number, and post number
    return allPosts.sort((a, b) => {
      // Provide default values in case of undefined
      const aSeasonNum = a.seasonNumber ?? 0;
      const bSeasonNum = b.seasonNumber ?? 0;
      const aEpisodeNum = a.episodeNumber ?? 0;
      const bEpisodeNum = b.episodeNumber ?? 0;

      if (aSeasonNum !== bSeasonNum) {
        return aSeasonNum - bSeasonNum;
      }
      if (aEpisodeNum !== bEpisodeNum) {
        return aEpisodeNum - bEpisodeNum;
      }
      return a.post_number - b.post_number;
    });
  };

  const handleCharacterSelect = (char: any) => {
    setSelectedCharacter(char);
    const posts = getCharacterPosts(char);
    setCharacterPosts(posts);
    console.log('Selected character posts:', posts);
  };

  if (loading) {
    return <div className="text-cyan-400 text-center mt-8">Loading AI Network...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center mt-8">Error loading network: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Character Selection */}
      <div className="mb-4">
        <label className="text-gray-400 mr-2">Select Character:</label>
        <select 
          className="bg-slate-800 text-gray-300 rounded-lg p-2 border border-cyan-800"
          onChange={(e) => {
            const char = characters.find(c => c.agent.agent_details.name === e.target.value);
            if (char) handleCharacterSelect(char);
          }}
          value={selectedCharacter?.agent.agent_details.name || ""}
        >
          <option value="">Select a character</option>
          {characters.map((char, index) => (
            <option key={index} value={char.agent.agent_details.name}>
              {char.agent.agent_details.name}
            </option>
          ))}
        </select>
      </div>

      {/* Feed Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
          {selectedCharacter ? `${selectedCharacter.agent.agent_details.name}'s Feed` : 'AI Social Network'}
        </h2>
        <p className="text-gray-400">
          {characterPosts.length} Posts Available
        </p>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {characterPosts.map(post => (
          <div key={post.post_id} className="bg-slate-900/60 p-6 rounded-lg backdrop-blur-sm border border-cyan-900/50">
            <div className="flex items-center mb-4">
              <div 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600"
                style={{
                  backgroundImage: selectedCharacter?.agent.agent_details.selectedImage !== undefined 
                    ? `url(/path/to/your/images/${selectedCharacter.agent.agent_details.selectedImage}.jpg)` 
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-cyan-400 text-left">
                  {selectedCharacter?.agent.agent_details.name}
                </h3>
                <div className="text-sm text-gray-500">
                  <span>Season {(post.seasonNumber || 0) }, Episode {(post.episodeNumber || 0) }</span>
                  <span className="mx-2">•</span>
                  <span>Post {post.post_number}</span>
                </div>
              </div>
            </div>

              {/* Post Highlights */}
              {post.post_highlights && (
                <div className="mt-4 mb-4 bg-slate-800/30 rounded-lg p-4 border-l-2 border-cyan-500/30">
                  <p className="text-gray-400 text-sm italic">
                    {post.post_highlights}
                  </p>
                </div>
              )}

              {/* Post Content */}
              <p className="text-gray-300 mb-2 whitespace-pre-wrap">{post.post_content}</p>

            {/* Post Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/30">
              <div className="flex space-x-4 text-sm text-gray-400">
                <button className="flex items-center space-x-2 hover:text-cyan-400 transition duration-300">
                  <Heart className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 50)}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-cyan-400 transition duration-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 20)}</span>
                </button>
              </div>
              
              {/* Episode Name */}
              {post.episodeName && (
                <div className="text-sm text-gray-500 italic">
                  Episode Name: {post.episodeName}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
