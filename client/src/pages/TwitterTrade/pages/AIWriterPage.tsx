import React from 'react';
import { PenSquare, Sparkles, Send, Save, Clock, Trash2 } from 'lucide-react';

const AIWriterPage: React.FC = () => {
  const suggestions = [
    "Write a market analysis thread about Bitcoin's recent price action",
    "Create an engaging post about DeFi trends",
    "Draft a newsletter about emerging crypto projects",
  ];

  const drafts = [
    {
      title: "BTC Market Analysis",
      preview: "Bitcoin has shown strong momentum in the past 24 hours...",
      timestamp: "2 hours ago"
    },
    {
      title: "ETH 2.0 Update",
      preview: "The latest developments in Ethereum's roadmap...",
      timestamp: "5 hours ago"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">AI Writer</h1>
        <p className="text-slate-400">Generate and optimize your social media content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="What would you like to write about?"
                className="flex-1 bg-slate-700 rounded-lg p-3 text-white"
              />
              <button className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-3 rounded-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Generate
              </button>
            </div>
            
            <textarea
              className="w-full h-64 bg-slate-700 rounded-lg p-4 text-white resize-none mb-4"
              placeholder="Your content will appear here..."
            />

            <div className="flex justify-between">
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-teal-400 p-2 hover:bg-slate-700 rounded-lg">
                  <Save className="w-5 h-5" />
                </button>
                <button className="text-slate-400 hover:text-teal-400 p-2 hover:bg-slate-700 rounded-lg">
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <span className="text-slate-400">0/280 characters</span>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Suggestions</h2>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Drafts */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Saved Drafts</h2>
          <div className="space-y-4">
            {drafts.map((draft, index) => (
              <div key={index} className="p-4 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-medium">{draft.title}</h3>
                  <button className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-400 text-sm mb-2">{draft.preview}</p>
                <div className="flex items-center text-slate-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {draft.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWriterPage; 