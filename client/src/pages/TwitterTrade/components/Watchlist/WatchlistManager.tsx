import React, { useState } from 'react';
import { Plus, Search, ChevronLeft, ChevronDown, ChevronRight, X } from 'lucide-react';

interface Watchlist {
  id: string;
  name: string;
  accounts: string[];
  isExpanded?: boolean;
}

interface WatchlistManagerProps {
  onWatchlistSelect: (watchlistId: string) => void;
  watchlists?: Watchlist[];
  onWatchlistsChange?: (watchlists: Watchlist[]) => void;
}

const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  onWatchlistSelect,
  watchlists: externalWatchlists,
  onWatchlistsChange
}) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(externalWatchlists || [
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
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addingAccountToId, setAddingAccountToId] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState('');

  const handleAddWatchlist = () => {
    if (newWatchlistName.trim()) {
      const newWatchlist = {
        id: Date.now().toString(),
        name: newWatchlistName.trim(),
        accounts: [],
        isExpanded: false
      };

      const updatedWatchlists = [...watchlists, newWatchlist];
      setWatchlists(updatedWatchlists);
      
      // Notify parent of watchlist changes
      if (onWatchlistsChange) {
        onWatchlistsChange(updatedWatchlists);
      }

      // Select the new watchlist
      onWatchlistSelect(newWatchlist.id);
      
      setNewWatchlistName('');
      setIsAddingNew(false);
    }
  };

  const toggleWatchlist = (watchlistId: string) => {
    setWatchlists(watchlists.map(w => 
      w.id === watchlistId ? { ...w, isExpanded: !w.isExpanded } : w
    ));
  };

  const handleAddAccount = (watchlistId: string) => {
    if (newAccount.trim()) {
      const updatedWatchlists = watchlists.map(w => 
        w.id === watchlistId 
          ? { ...w, accounts: [...w.accounts, newAccount.trim()] }
          : w
      );
      setWatchlists(updatedWatchlists);
      
      // Notify parent of watchlist changes
      if (onWatchlistsChange) {
        onWatchlistsChange(updatedWatchlists);
      }
      
      setNewAccount('');
      setAddingAccountToId(null);
    }
  };

  const removeAccount = (watchlistId: string, account: string) => {
    const updatedWatchlists = watchlists.map(w => 
      w.id === watchlistId 
        ? { ...w, accounts: w.accounts.filter(a => a !== account) }
        : w
    );
    setWatchlists(updatedWatchlists);
    
    // Notify parent of watchlist changes
    if (onWatchlistsChange) {
      onWatchlistsChange(updatedWatchlists);
    }
  };

  const handleWatchlistClick = (watchlistId: string) => {
    onWatchlistSelect(watchlistId);
  };

  return (
    <div className="h-full flex flex-col bg-slate-800 border-r border-slate-700">
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Crypto Watch</h2>
            <ChevronLeft className="w-5 h-5 text-teal-400 cursor-pointer" />
          </div>

          {/* Add Track Button */}
          {!isAddingNew ? (
            <button 
              onClick={() => setIsAddingNew(true)}
              className="w-full bg-gradient-to-r from-teal-500 to-orange-500 text-white py-2 px-4 rounded-md mb-4 flex items-center justify-center hover:from-teal-600 hover:to-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Track
            </button>
          ) : (
            <div className="mb-4 space-y-2">
              <input
                type="text"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                placeholder="Watchlist name"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-md"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleAddWatchlist}
                  className="flex-1 bg-teal-500 text-white py-1 rounded-md hover:bg-teal-600"
                >
                  Create
                </button>
                <button 
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 bg-slate-600 text-white py-1 rounded-md hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search streams"
              className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Scrollable Watchlists Section */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-2">
            {watchlists.map((watchlist) => (
              <div key={watchlist.id} className="bg-slate-700/50 rounded-md overflow-hidden">
                {/* Watchlist Header */}
                <div 
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-700"
                  onClick={() => {
                    toggleWatchlist(watchlist.id);
                    handleWatchlistClick(watchlist.id);
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium text-white">{watchlist.name}</div>
                    <div className="text-sm text-slate-400">
                      {watchlist.accounts.length} accounts
                    </div>
                  </div>
                  {watchlist.isExpanded ? 
                    <ChevronDown className="w-5 h-5 text-slate-400" /> : 
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  }
                </div>

                {/* Expanded Content */}
                {watchlist.isExpanded && (
                  <div className="px-3 pb-3">
                    {/* Accounts List */}
                    <div className="space-y-1">
                      {watchlist.accounts.map((account) => (
                        <div 
                          key={account}
                          className="flex items-center justify-between px-2 py-1 rounded bg-slate-600/50"
                        >
                          <span className="text-sm text-slate-200">{account}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAccount(watchlist.id, account);
                            }}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Account Input */}
                    {addingAccountToId === watchlist.id ? (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={newAccount}
                          onChange={(e) => setNewAccount(e.target.value)}
                          placeholder="@username"
                          className="flex-1 px-2 py-1 text-sm bg-slate-600 text-white rounded"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddAccount(watchlist.id);
                          }}
                          className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddingAccountToId(watchlist.id);
                        }}
                        className="mt-2 w-full px-2 py-1 text-sm text-teal-400 hover:text-teal-300 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Account
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistManager; 