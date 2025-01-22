import React, { useState } from 'react';
import useCharacters from '../hooks/useCharacters';
import { MessageSquare, Heart } from 'lucide-react';
import { Post, Episode, Season } from '../interfaces/PostsInterface';
import { createSeason, createEpisodePosts } from '../api/agentsAPI';
import { Button } from '../components/button';


const SocialFeed: React.FC = () => {
  const { characters, loading, error } = useCharacters();
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [characterPosts, setCharacterPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateContent = async () => {
    if (!selectedCharacter || isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Extract the master file path from the character
      const masterFilePath = `configs/${selectedCharacter.agent.agent_details.name}/${selectedCharacter.agent.agent_details.name}_master.json`;
      
      // First create new season
      await createSeason(masterFilePath);
      
      // Then create posts for episodes
      const updatedAgentWithPosts = await createEpisodePosts(masterFilePath);
      
      // Update the selected character with final data
      setSelectedCharacter(updatedAgentWithPosts);
      
      // Update posts
      const posts = getCharacterPosts(updatedAgentWithPosts);
      setCharacterPosts(posts);
    } catch (error) {
      console.error('Error generating content:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 text-gray-300 rounded-lg p-4 border border-cyan-800 text-center mt-8">
        Loading AI Network...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 text-gray-300 rounded-lg p-4 border border-red-800 text-center mt-8">
        No Existing Agents - {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Agent Selection Row */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="flex items-center">
          <label className="text-lg font-semibold text-white mr-2">
            Select Agent:
          </label>
          <select 
            className="bg-slate-800 text-white rounded-lg p-2 border border-cyan-800"
            onChange={(e) => {
              const char = characters.find(c => c.agent.agent_details.name === e.target.value);
              if (char) handleCharacterSelect(char);
            }}
            value={selectedCharacter?.agent.agent_details.name || ""}
          >
            <option value="" className="text-white">Select an Agent</option>
            {characters.map((char, index) => (
              <option key={index} value={char.agent.agent_details.name}>
                {char.agent.agent_details.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Interface */}
      <div 
        className="flex flex-col h-[70vh] relative"
        style={{
          backgroundImage: selectedCharacter?.agent?.profile_image?.details?.url 
            ? `url(${selectedCharacter.agent.profile_image.details.url})` 
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Add an overlay div for opacity */}
        <div className="absolute inset-0 bg-slate-900/80" />
        
        {/* Wrap content in relative div to appear above overlay */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Feed Header */}
          <div className="mb-8 pt-6 px-4">
            <h2 className="text-2xl font-bold text-white">
              {selectedCharacter ? `${selectedCharacter.agent.agent_details.name}'s Feed` : 'AI Social Network'}
            </h2>
            <p className="text-gray-400 mb-4">
              {characterPosts.length} Posts Available
            </p>
            
            {selectedCharacter && (
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={handleGenerateContent}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Posts Content'}
                </Button>

                <Button
                  onClick={() => {}}  // Placeholder for future functionality
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Post to Twitter
                </Button>
              </div>
            )}
          </div>

          {/* Posts Feed */}
          <div className="flex-grow overflow-y-auto space-y-4 p-4">
            {characterPosts.map(post => (
              <div key={post.post_id} className="max-w-2xl mx-auto bg-slate-900/80 p-6 rounded-lg backdrop-blur-sm border border-cyan-900/50">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600"
                    style={{
                      backgroundImage: selectedCharacter?.agent.profile_image?.details?.url 
                        ? `url(${selectedCharacter.agent.profile_image.details.url})` 
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
      </div>
    </div>
  );
};

export default SocialFeed;
