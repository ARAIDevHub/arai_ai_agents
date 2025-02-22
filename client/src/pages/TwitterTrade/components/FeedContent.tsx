import React from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import FeedColumn from './FeedColumn';
import TweetCard from './TweetCard';
import { Tweet } from '../types/Tweet';
import { WatchlistColumn } from '../types/Watchlist';

interface FeedContentProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isAddingNew: boolean;
  setIsAddingNew: (isAdding: boolean) => void;
  newWatchlistName: string;
  onNewWatchlistNameChange: (name: string) => void;
  onAddWatchlist: () => void;
  onRefresh: () => void;
  selectedWatchlistId: string | null;
  watchlists: any[];
  onAddAccount: (account: string) => void;
  activeColumns: WatchlistColumn[];
  getColumnTweets: (column: WatchlistColumn) => Tweet[];
  onColumnClose: (columnId: string) => void;
  onTweetSelect: (tweet: Tweet) => void;
  filteredUsernames: string[];
}

const FeedContent: React.FC<FeedContentProps> = ({
  searchTerm,
  onSearchChange,
  isAddingNew,
  setIsAddingNew,
  newWatchlistName,
  onNewWatchlistNameChange,
  onAddWatchlist,
  onRefresh,
  selectedWatchlistId,
  watchlists,
  onAddAccount,
  activeColumns,
  getColumnTweets,
  onColumnClose,
  onTweetSelect,
  filteredUsernames
}) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-white">Crypto Twitter Feed</h1>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredUsernames.map(username => (
                    <button
                      key={username}
                      onClick={() => {
                        if (!selectedWatchlistId) {
                          console.warn('Please select a track first');
                          return;
                        }
                        console.log('Adding account to track:', {
                          account: username,
                          selectedTrack: watchlists.find(w => w.id === selectedWatchlistId)?.name
                        });
                        onAddAccount(username);
                        onSearchChange('');
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-slate-700"
                    >
                      {username}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!isAddingNew ? (
              <button 
                onClick={() => setIsAddingNew(true)}
                className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-1 rounded-md hover:from-teal-600 hover:to-orange-600 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Track
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newWatchlistName}
                  onChange={(e) => onNewWatchlistNameChange(e.target.value)}
                  placeholder="Enter track name"
                  className="px-3 py-1 bg-slate-800 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onAddWatchlist();
                    }
                  }}
                />
                <button
                  onClick={onAddWatchlist}
                  className="bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    onNewWatchlistNameChange('');
                  }}
                  className="bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            )}
            <button className="bg-slate-800 text-teal-400 px-4 py-1 rounded-md hover:bg-slate-700">
              Filter
            </button>
            <RefreshCw 
              className="w-5 h-5 text-teal-400 cursor-pointer hover:text-orange-400" 
              onClick={onRefresh}
            />
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-x-auto">
        {activeColumns.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <p className="mb-4">No columns yet</p>
              <button 
                onClick={() => setIsAddingNew(true)}
                className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-2 rounded-md hover:from-teal-600 hover:to-orange-600 flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Your First Track
              </button>
            </div>
          </div>
        ) : (
          activeColumns.map(column => {
            const columnTweets = getColumnTweets(column);
            console.log(`Found ${columnTweets.length} tweets for column ${column.name}:`, columnTweets);

            return (
              <FeedColumn 
                key={column.id}
                title={`${column.name} (${columnTweets.length} tweets)`}
                onClose={() => onColumnClose(column.id)}
              >
                {columnTweets.length > 0 ? (
                  columnTweets.map(tweet => (
                    <TweetCard
                      key={tweet.id}
                      tweet={tweet}
                      onSelect={onTweetSelect}
                    />
                  ))
                ) : (
                  <div className="p-4 text-slate-400 text-center">
                    <p>No tweets found</p>
                    <p className="text-sm mt-2">
                      {column.accounts.length === 0 
                        ? 'Add accounts to this track to see their tweets'
                        : `Tracking: ${column.accounts.join(', ')}`
                      }
                    </p>
                  </div>
                )}
              </FeedColumn>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FeedContent; 