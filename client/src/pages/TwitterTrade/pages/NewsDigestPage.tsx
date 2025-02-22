import React from 'react';
import { Newspaper, TrendingUp, Globe, Clock, BookmarkPlus, Share2, ThumbsUp, MessageSquare, Filter, RefreshCw } from 'lucide-react';

const NewsDigestPage: React.FC = () => {
  const newsCategories = ['Market Updates', 'Technology', 'Regulation', 'DeFi', 'NFTs'];
  
  const newsItems = [
    {
      category: 'Market Updates',
      title: 'Bitcoin Surges Past $45K as Market Sentiment Improves',
      source: 'CryptoNews',
      time: '2 hours ago',
      summary: 'Bitcoin has broken through key resistance levels as institutional interest continues to grow...',
      sentiment: 'positive',
      relevance: 92,
      engagement: 1240
    },
    {
      category: 'Technology',
      title: 'Ethereum Layer 2 Solutions Show Promising Growth',
      source: 'BlockchainDaily',
      time: '4 hours ago',
      summary: 'Leading Layer 2 solutions are reporting record transaction volumes as adoption increases...',
      sentiment: 'positive',
      relevance: 88,
      engagement: 856
    },
    {
      category: 'Regulation',
      title: 'New Crypto Regulations Expected in Q3',
      source: 'CryptoInsider',
      time: '6 hours ago',
      summary: 'Regulatory bodies are preparing to announce new framework for cryptocurrency trading...',
      sentiment: 'neutral',
      relevance: 95,
      engagement: 2130
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">News Digest</h1>
        <p className="text-slate-400">AI-curated news and market insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main News Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {newsCategories.map((category, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* News Items */}
          <div className="space-y-4">
            {newsItems.map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-slate-700 text-teal-400">
                      {item.category}
                    </span>
                    <span className="text-slate-400 text-sm flex items-center gap-1">
                      <Globe className="w-4 h-4" /> {item.source}
                    </span>
                    <span className="text-slate-400 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {item.time}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-teal-400">
                      <BookmarkPlus className="w-5 h-5" />
                    </button>
                    <button className="text-slate-400 hover:text-teal-400">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-300 mb-4">{item.summary}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" /> {item.engagement}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" /> {Math.floor(item.engagement / 3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-teal-400">AI Relevance: {item.relevance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Trending Topics</h2>
            <div className="space-y-3">
              {['#Bitcoin', '#ETH2', '#DeFi', '#NFTs', '#Regulation'].map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-slate-300">{topic}</span>
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Key Updates */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Key Updates</h2>
            <div className="space-y-4">
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300">Market cap reaches 2.1T</p>
                <span className="text-sm text-slate-400">Updated 5m ago</span>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300">ETH gas fees at monthly low</p>
                <span className="text-sm text-slate-400">Updated 15m ago</span>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300">New protocol launch: Venus</p>
                <span className="text-sm text-slate-400">Updated 30m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDigestPage; 