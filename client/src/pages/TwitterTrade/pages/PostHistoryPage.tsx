import React from 'react';
import { History, BarChart2, MessageSquare, Share2, Repeat2, Filter, Calendar, Twitter, Instagram, Facebook } from 'lucide-react';

const PostHistoryPage: React.FC = () => {
  const posts = [
    {
      id: 1,
      platform: 'Twitter',
      content: 'Bitcoin showing strong support at $44k. Key resistance levels to watch: $45.5k and $46.2k 📈 #BTC #CryptoTrading',
      timestamp: '2 days ago',
      stats: {
        engagement: '3.2K',
        replies: '145',
        shares: '892'
      },
      performance: 'high'
    },
    {
      id: 2,
      platform: 'Instagram',
      content: 'Weekly market analysis: DeFi tokens showing impressive momentum. Swipe to see our top picks for the week! 📊',
      timestamp: '3 days ago',
      stats: {
        engagement: '2.8K',
        replies: '92',
        shares: '456'
      },
      performance: 'medium'
    },
    {
      id: 3,
      platform: 'Twitter',
      content: "Breaking: Major protocol upgrade announced for Ethereum. Here\u2019s what you need to know 🔥 #ETH #Crypto",
      timestamp: '4 days ago',
      stats: {
        engagement: '4.5K',
        replies: '234',
        shares: '1.2K'
      },
      performance: 'high'
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Twitter':
        return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Post History</h1>
        <p className="text-slate-400">Track and analyze your social media post performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">All Posts</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">High Performing</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Needs Attention</button>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(post.platform)}
                    <span className="text-slate-400">{post.platform}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.performance === 'high' 
                        ? 'bg-emerald-400/20 text-emerald-400' 
                        : 'bg-orange-400/20 text-orange-400'
                    }`}>
                      {post.performance === 'high' ? 'High Performing' : 'Average'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-sm">{post.timestamp}</span>
                </div>

                <p className="text-white mb-4">{post.content}</p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg">
                    <BarChart2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-300">{post.stats.engagement}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-300">{post.stats.replies}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg">
                    <Share2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-300">{post.stats.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Performance Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Total Posts</span>
                <span className="text-teal-400">156</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Avg. Engagement</span>
                <span className="text-teal-400">2.8K</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Top Performing</span>
                <span className="text-emerald-400">32%</span>
              </div>
            </div>
          </div>

          {/* Content Analysis */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Content Analysis</h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300 mb-1">Best Posting Time</p>
                <p className="text-teal-400">9:00 AM - 11:00 AM</p>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300 mb-1">Top Hashtags</p>
                <p className="text-teal-400">#crypto #BTC #trading</p>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300 mb-1">Content Type</p>
                <p className="text-teal-400">Market Analysis</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                <Repeat2 className="w-4 h-4" />
                Repost Best Performing
              </button>
              <button className="w-full flex items-center gap-2 p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                <History className="w-4 h-4" />
                Export History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHistoryPage; 