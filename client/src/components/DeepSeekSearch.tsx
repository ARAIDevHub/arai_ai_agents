import React, { useState } from 'react';
import { Search, Database, Link, FileText, TrendingUp } from 'lucide-react';

interface SearchResult {
  type: 'contract' | 'twitter' | 'news' | 'project';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  relevance: number;
}

const DeepSeekSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    
    try {
      // TODO: Implement DeepSeek API call
      // const response = await fetchDeepSeekData(query);
      // setResults(response.data);
      
      // Mock data for now
      setResults([
        {
          type: 'contract',
          title: 'Uniswap V3 Contract',
          description: 'Latest version of Uniswap decentralized exchange',
          source: 'Etherscan',
          timestamp: '2023-10-15',
          relevance: 0.95
        },
        {
          type: 'twitter',
          title: 'Vitalik Buterin Tweet',
          description: 'Discussion on Ethereum roadmap updates',
          source: 'Twitter',
          timestamp: '2023-10-14',
          relevance: 0.92
        }
      ]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'contract': return <Database size={16} className="text-blue-400" />;
      case 'twitter': return <Link size={16} className="text-sky-400" />;
      case 'news': return <FileText size={16} className="text-green-400" />;
      case 'project': return <TrendingUp size={16} className="text-orange-400" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="h-full p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contracts, tweets, news..."
          className="flex-1 p-2 rounded bg-slate-800 border border-orange-500/30 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {results.map((result, i) => (
          <div key={i} className="p-3 rounded border border-orange-500/30 bg-slate-800/50 hover:bg-slate-800/70">
            <div className="flex items-center gap-2">
              {getResultIcon(result.type)}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-100">{result.title}</div>
                <div className="text-xs text-gray-400">{result.description}</div>
              </div>
              <div className="text-xs text-gray-400">
                {result.source} • {result.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeepSeekSearch; 