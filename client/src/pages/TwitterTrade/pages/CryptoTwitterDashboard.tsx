import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Resizable } from 're-resizable';
import WatchlistManager from '../components/Watchlist/WatchlistManager';
import { Tweet } from '../types/Tweet';
import { Watchlist, WatchlistColumn } from '../types/Watchlist';
import { parseTwitterCSV } from '../utils/csvParser';
import csvData from '../data/allAgentsTwitter_updated.csv?raw';
import RightPanel from '../components/RightPanel';
import FeedContent from '../components/FeedContent';

interface CryptoTwitterDashboardProps {
  initialTweets?: Tweet[];
}

const CryptoTwitterDashboard: React.FC<CryptoTwitterDashboardProps> = ({ initialTweets = [] }) => {
  // State for layout
  const sidebarWidth = 64;
  const remainingWidth = window.innerWidth - sidebarWidth;
  const [watchlistWidth, setWatchlistWidth] = useState(remainingWidth * 0.2);
  const [feedWidth, setFeedWidth] = useState(remainingWidth * 0.4);
  const [rightPanelWidth, setRightPanelWidth] = useState(remainingWidth * 0.4);

  // State for data
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
  const [activeColumns, setActiveColumns] = useState<WatchlistColumn[]>([]);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    {
      id: '1',
      name: 'Crypto Traders',
      accounts: ['unusual_whales', 'ErikVoorhees']
    },
    {
      id: '2',
      name: 'DeFi Updates',
      accounts: ['AndreCronjeTech', 'AmirOrmu']
    }
  ]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Load tweets from CSV
  const loadTweets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const parsedTweets = parseTwitterCSV(csvData);
      const sortedTweets = parsedTweets.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTweets(sortedTweets);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading tweets';
      setError(errorMessage);
      setTweets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize tweets and watchlists
  useEffect(() => {
    loadTweets();
    const savedWatchlists = localStorage.getItem('watchlists');
    if (savedWatchlists) {
      const parsed = JSON.parse(savedWatchlists) as Watchlist[];
      setWatchlists(parsed);
      const initialColumns = parsed.map(watchlist => ({
        id: watchlist.id,
        name: watchlist.name,
        accounts: watchlist.accounts
      }));
      setActiveColumns(initialColumns);
    }
  }, []);

  // Save watchlists to localStorage
  useEffect(() => {
    localStorage.setItem('watchlists', JSON.stringify(watchlists));
  }, [watchlists]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const remainingWidth = window.innerWidth - sidebarWidth;
      setWatchlistWidth(remainingWidth * 0.2);
      setFeedWidth(remainingWidth * 0.4);
      setRightPanelWidth(remainingWidth * 0.4);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Watchlist handlers
  const handleWatchlistSelect = (watchlistId: string) => {
    const watchlist = watchlists.find(w => w.id === watchlistId);
    if (watchlist && !activeColumns.some(col => col.id === watchlistId)) {
      setActiveColumns(prev => [...prev, {
        id: watchlistId,
        name: watchlist.name,
        accounts: watchlist.accounts
      }]);
    }
    setSelectedWatchlistId(watchlistId);
  };

  const handleColumnClose = (columnId: string) => {
    setActiveColumns(prev => prev.filter(col => col.id !== columnId));
  };

  // Tweet filtering
  const getColumnTweets = useCallback((column: WatchlistColumn) => {
    if (column.accounts.length === 0) return [];

    const columnTweets = column.accounts.reduce<Tweet[]>((acc, account) => {
      const normalizedAccount = account.toLowerCase().replace('@', '').trim();
      const accountTweets = tweets.filter(tweet => 
        tweet.author.username.toLowerCase().replace('@', '').trim() === normalizedAccount
      );
      return [...acc, ...accountTweets];
    }, []);

    return columnTweets.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tweets]);

  // Get unique usernames for search
  const uniqueUsernames = useMemo(() => {
    const usernames = tweets.map(tweet => 
      tweet.author.username.toLowerCase().replace('@', '')
    );
    return [...new Set(usernames)];
  }, [tweets]);

  const filteredUsernames = useMemo(() => {
    const searchTermNormalized = searchTerm.toLowerCase().replace('@', '');
    return uniqueUsernames.filter(username => 
      username.includes(searchTermNormalized)
    );
  }, [uniqueUsernames, searchTerm]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Loading tweets...</div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-red-500">Error: {error}</div>
    </div>;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex">
        {/* Left Panel - Watchlist */}
        <Resizable
          size={{ width: watchlistWidth, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setWatchlistWidth(watchlistWidth + d.width);
          }}
          minWidth={200}
          maxWidth={(window.innerWidth - 64) * 0.3}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          className="border-r border-slate-700"
        >
          <WatchlistManager 
            watchlists={watchlists}
            onWatchlistSelect={handleWatchlistSelect}
            onWatchlistsChange={setWatchlists}
          />
        </Resizable>

        {/* Middle Panel - Feed */}
        <Resizable
          size={{ width: feedWidth, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setFeedWidth(feedWidth + d.width);
          }}
          minWidth={400}
          maxWidth={(window.innerWidth - 64) * 0.5}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          className="border-r border-slate-700"
        >
          <FeedContent 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isAddingNew={isAddingNew}
            setIsAddingNew={setIsAddingNew}
            newWatchlistName={newWatchlistName}
            onNewWatchlistNameChange={setNewWatchlistName}
            onAddWatchlist={() => {/* Add watchlist logic */}}
            onRefresh={loadTweets}
            selectedWatchlistId={selectedWatchlistId}
            watchlists={watchlists}
            onAddAccount={() => {/* Add account logic */}}
            activeColumns={activeColumns}
            getColumnTweets={getColumnTweets}
            onColumnClose={handleColumnClose}
            onTweetSelect={setSelectedTweet}
            filteredUsernames={filteredUsernames}
          />
        </Resizable>

        {/* Right Panel */}
        <RightPanel 
          width={rightPanelWidth}
          selectedTweet={selectedTweet}
          onTweetSelect={setSelectedTweet}
        />
      </div>
    </div>
  );
};

export default CryptoTwitterDashboard; 