import React from 'react';
import { Share2, Users, MessageSquare, BarChart2, TrendingUp, Clock, Filter, RefreshCw } from 'lucide-react';

const EngagementPage: React.FC = () => {
  const engagementStats = [
    {
      platform: 'Twitter',
      metrics: {
        followers: '12.5K',
        engagement: '4.2%',
        responses: '892',
        shares: '245'
      },
      trend: 'up'
    },
    {
      platform: 'Instagram',
      metrics: {
        followers: '8.3K',
        engagement: '5.1%',
        responses: '634',
        shares: '178'
      },
      trend: 'up'
    }
  ];

  const recentEngagements = [
    {
      type: 'Comment',
      content: 'Great analysis on the market trends!',
      time: '5 min ago',
      platform: 'Twitter'
    },
    {
      type: 'Share',
      content: 'Technical Analysis Thread',
      time: '15 min ago',
      platform: 'Twitter'
    },
    {
      type: 'Mention',
      content: 'Featured in market discussion',
      time: '1 hour ago',
      platform: 'Instagram'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Engagement Analytics</h1>
        <p className="text-slate-400">Track and analyze your social media engagement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">All Platforms</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Twitter</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Instagram</button>
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

          {/* Platform Stats */}
          {engagementStats.map((platform, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">{platform.platform}</h2>
                <span className={`flex items-center gap-1 ${
                  platform.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  Overall Growth
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Followers</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{platform.metrics.followers}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Engagement</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{platform.metrics.engagement}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Responses</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{platform.metrics.responses}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Shares</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{platform.metrics.shares}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Engagement</h2>
            <div className="space-y-4">
              {recentEngagements.map((engagement, index) => (
                <div key={index} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-teal-400 text-sm">{engagement.type}</span>
                    <span className="text-slate-400 text-sm">{engagement.platform}</span>
                  </div>
                  <p className="text-slate-300 mb-2">{engagement.content}</p>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {engagement.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Key Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Avg. Response Time</span>
                <span className="text-teal-400">1.2 hours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Engagement Rate</span>
                <span className="text-teal-400">4.8%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Growth Rate</span>
                <span className="text-emerald-400">+2.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementPage; 