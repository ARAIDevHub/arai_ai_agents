import React from 'react';
import { Post } from '../../interfaces/PostsInterface';

interface CharacterPostsProps {
  characterPosts: Post[];
  selectedCharacter: any;
}

const CharacterPosts: React.FC<CharacterPostsProps> = ({ characterPosts, selectedCharacter }) => {
  return (
    <div className="flex-grow overflow-y-auto space-y-4">
      {characterPosts.map((post) => (
        <div
          key={post.post_id}
          className="relative max-w-2xl mx-auto slate-800/30 p-6 rounded-lg backdrop-blur-sm border border-orange-500/30"
        >
          <div
            className={`absolute top-4 right-4 px-2 py-1 rounded text-sm font-semibold ${
              post.post_posted ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {post.post_posted ? "Posted" : "Not Posted"}
          </div>

          <div className="flex items-center mb-4">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600"
              style={{
                backgroundImage: selectedCharacter?.agent.profile_image?.details?.url
                  ? `url(${selectedCharacter.agent.profile_image.details.url})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-cyan-400 text-left">
                {selectedCharacter?.agent.agent_details.name}
              </h3>
              <div className="text-sm text-gray-500">
                <span>
                  Season {post.seasonNumber || 0}, Episode {post.episodeNumber || 0}
                </span>
                <span className="mx-2">•</span>
                <span>Post {post.post_number}</span>
              </div>
            </div>
          </div>

          {post.post_highlights && (
            <div className="mt-4 mb-4 bg-slate-900/50 rounded-lg p-4 border-l-2 border-orange-500/30">
              <p className="text-gray-400 text-sm italic">{post.post_highlights}</p>
            </div>
          )}

          <p className="text-gray-300 mb-2 whitespace-pre-wrap bg-slate-900/50 p-4 rounded-lg">
            {post.post_content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CharacterPosts; 