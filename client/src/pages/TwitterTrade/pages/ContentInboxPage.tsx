import React from 'react';
import { MessageSquare, Star, Archive, Trash2, Filter, RefreshCw, Clock, AlertCircle } from 'lucide-react';

const ContentInboxPage: React.FC = () => {
  const messages = [
    {
      id: 1,
      type: 'mention',
      platform: 'Twitter',
      content: '@tradingbot Great analysis on BTC! What\u2019s your take on ETH?',
      author: 'CryptoTrader',
      time: '5 min ago',
      status: 'unread',
      priority: 'high'
    },
    {
      id: 2,
      type: 'dm',
      platform: 'Twitter',
      content: 'Would love to collaborate on market analysis content',
      author: 'MarketGuru',
      time: '15 min ago',
      status: 'unread',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'comment',
      platform: 'Instagram',
      content: 'Great insights on the DeFi market trends!',
      author: 'CryptoAnalyst',
      time: '1 hour ago',
      status: 'read',
      priority: 'low'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Content Inbox</h1>
        <p className="text-slate-400">Manage your social media interactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">All Messages</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Unread</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Flagged</button>
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

          {/* Messages List */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-400" />
                    <span className="text-slate-400">{message.platform}</span>
                    {message.status === 'unread' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-teal-400/20 text-teal-400">
                        New
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-sm">{message.time}</span>
                </div>

                <div className="mb-4">
                  <p className="text-white">{message.content}</p>
                  <p className="text-slate-400 text-sm mt-1">From: {message.author}</p>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                    <Star className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-400 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Inbox Stats */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Inbox Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Unread</span>
                <span className="text-teal-400">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Priority</span>
                <span className="text-orange-400">5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Response Time</span>
                <span className="text-emerald-400">1.2h</span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Filters</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Mentions
              </button>
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Direct Messages
              </button>
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Comments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentInboxPage; 