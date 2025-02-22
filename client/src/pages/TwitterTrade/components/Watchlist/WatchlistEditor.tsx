import React, { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';

interface WatchlistEditorProps {
  watchlistId: string;
  accounts: string[];
  onAddAccount: (account: string) => void;
  onRemoveAccount: (account: string) => void;
}

const WatchlistEditor: React.FC<WatchlistEditorProps> = ({
  accounts,
  onAddAccount,
  onRemoveAccount
}) => {
  const [newAccount, setNewAccount] = useState('');

  const handleAddAccount = () => {
    if (newAccount.trim()) {
      onAddAccount(newAccount);
      setNewAccount('');
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newAccount}
          onChange={(e) => setNewAccount(e.target.value)}
          placeholder="@username"
          className="flex-1 px-3 py-2 bg-slate-700 text-white rounded-md"
        />
        <button
          onClick={handleAddAccount}
          className="bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {accounts.map((account) => (
          <div 
            key={account}
            className="flex items-center justify-between p-2 bg-slate-700/50 rounded-md"
          >
            <span className="text-white">{account}</span>
            <button
              onClick={() => onRemoveAccount(account)}
              className="text-slate-400 hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistEditor; 