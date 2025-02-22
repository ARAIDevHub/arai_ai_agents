import React from 'react';
import TwitterStockStream from './TwitterStockStream';
import EnhancedTweet from './TweetCardInsights';
import { Tweet } from '../types/Tweet';

interface RightPanelProps {
  width: number;
  selectedTweet: Tweet | null;
  onTweetSelect: (tweet: Tweet | null) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ width, selectedTweet, onTweetSelect }) => {
  return (
    <div className="flex flex-col" style={{ width }}>
      {/* Top Half - Twitter Stock Stream */}
      <div className="h-1/2 border-b border-slate-700">
        <TwitterStockStream selectedTweet={selectedTweet} />
      </div>

      {/* Bottom Half - Tweet Insights */}
      <div className="h-1/2 overflow-y-auto">
        {selectedTweet && (
          <EnhancedTweet 
            tweet={selectedTweet} 
            onSelect={() => onTweetSelect(null)}
          />
        )}
      </div>
    </div>
  );
};

export default RightPanel; 