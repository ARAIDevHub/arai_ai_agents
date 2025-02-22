import React from 'react';
import { BarChart2, Users, MessageSquare, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Total Followers', value: '124.7K', change: '+12%', icon: <Users className="w-6 h-6" /> },
    { title: 'Engagement Rate', value: '3.2%', change: '+0.8%', icon: <MessageSquare className="w-6 h-6" /> },
    { title: 'Performance', value: '92', change: '+3', icon: <BarChart2 className="w-6 h-6" /> },
    { title: 'Market Trend', value: 'Bullish', change: '+5%', icon: <TrendingUp className="w-6 h-6" /> },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your social media and market performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                <span className="text-emerald-400 text-sm">{stat.change}</span>
              </div>
              <div className="text-slate-400">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Placeholder content */}
            <div className="border-b border-slate-700 pb-4">
              <p className="text-slate-400">New post scheduled for Twitter</p>
              <p className="text-sm text-slate-500">2 hours ago</p>
            </div>
            <div className="border-b border-slate-700 pb-4">
              <p className="text-slate-400">Market alert: BTC up 5%</p>
              <p className="text-sm text-slate-500">3 hours ago</p>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Performance Overview</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-400">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 