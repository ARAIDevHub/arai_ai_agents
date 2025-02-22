import React from 'react';
import { Twitter, MessageSquare, RefreshCw, Filter } from 'lucide-react';

const SocialFeedPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Social Feed</h1>
        <p className="text-slate-400">Monitor real-time social media activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Live Feed</h2>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {/* Feed items would go here */}
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400">Feed content placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Trending</h2>
            <div className="space-y-3">
              {['#Bitcoin', '#Crypto', '#Trading'].map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <span className="text-slate-300">{topic}</span>
                  <span className="text-teal-400">trending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeedPage; 