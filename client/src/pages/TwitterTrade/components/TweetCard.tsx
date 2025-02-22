import React from 'react';
import { MessageCircle, Repeat2, Heart, Share, MessageSquare, Bookmark, Eye } from 'lucide-react';
import { Tweet, formatMetricCount } from '../types/Tweet';

interface TweetCardProps {
  tweet: Tweet;
  onSelect?: (tweet: Tweet) => void;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onSelect }) => {
  console.log('Rendering tweet:', tweet);
  return (
    <div 
      className="p-4 border-b border-slate-700 hover:bg-slate-800/50 cursor-pointer"
      onClick={() => onSelect?.(tweet)}
    >
      <div className="flex space-x-3">
        <img 
          src={tweet.author.profileImageUrl} 
          alt={tweet.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">{tweet.author.name}</span>
            <span className="text-slate-400">@{tweet.author.username}</span>
          </div>
          <p className="text-white mt-1">{tweet.text}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-slate-400">
            <button className="hover:text-teal-400 flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{formatMetricCount(tweet.metrics?.replies || 0)}</span>
            </button>
            <button className="hover:text-green-400 flex items-center space-x-1">
              <Repeat2 className="w-4 h-4" />
              <span className="text-xs">{formatMetricCount(tweet.metrics?.retweets || 0)}</span>
            </button>
            <button className="hover:text-blue-400 flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">{formatMetricCount(tweet.metrics?.quotes || 0)}</span>
            </button>
            <button className="hover:text-red-400 flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{formatMetricCount(tweet.metrics?.likes || 0)}</span>
            </button>
            <button className="hover:text-yellow-400 flex items-center space-x-1">
              <Bookmark className="w-4 h-4" />
              <span className="text-xs">{formatMetricCount(tweet.metrics?.bookmarks || 0)}</span>
            </button>
            <button className="hover:text-cyan-400 flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{formatMetricCount(tweet.metrics?.impressions || 0)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard; 