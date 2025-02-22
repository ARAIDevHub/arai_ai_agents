import React from 'react';
import { Calendar, Clock, Plus, Filter, MoreHorizontal, Twitter, Instagram, Facebook } from 'lucide-react';

const ContentPlannerPage: React.FC = () => {
  const scheduledPosts = [
    {
      time: '09:00 AM',
      content: 'Bitcoin Technical Analysis: Key support levels to watch',
      platform: 'Twitter',
      status: 'scheduled'
    },
    {
      time: '12:30 PM',
      content: 'Weekly Market Recap: DeFi tokens show strong momentum',
      platform: 'Instagram',
      status: 'draft'
    },
    {
      time: '03:00 PM',
      content: 'Breaking: New partnership announcement',
      platform: 'Facebook',
      status: 'scheduled'
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
        <h1 className="text-2xl font-bold text-white mb-2">Content Planner</h1>
        <p className="text-slate-400">Schedule and manage your social media content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">Calendar</h2>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Post
                </button>
              </div>
            </div>

            {/* Calendar Grid Placeholder */}
            <div className="border border-slate-700 rounded-lg p-4">
              <div className="h-96 flex items-center justify-center">
                <p className="text-slate-400">Calendar View Placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Posts Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {scheduledPosts.map((post, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{post.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <button className="text-slate-400 hover:text-slate-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white mb-2">{post.content}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.status === 'scheduled' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-orange-400/20 text-orange-400'
                  }`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Posts Today</span>
                <span className="text-teal-400">5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Scheduled</span>
                <span className="text-teal-400">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Drafts</span>
                <span className="text-teal-400">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPlannerPage; 