import React from 'react';
import { BarChart2, TrendingUp, Users, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';

const SocialPerformancePage: React.FC = () => {
  const metrics = [
    { title: 'Total Reach', value: '892.1K', change: '+15%', trend: 'up', icon: <Users className="w-6 h-6" /> },
    { title: 'Engagement Rate', value: '4.2%', change: '+0.5%', trend: 'up', icon: <MessageSquare className="w-6 h-6" /> },
    { title: 'Post Performance', value: '78/100', change: '-2', trend: 'down', icon: <BarChart2 className="w-6 h-6" /> },
    { title: 'Growth Rate', value: '+12.3%', change: '+2.1%', trend: 'up', icon: <TrendingUp className="w-6 h-6" /> },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Social Performance</h1>
        <p className="text-slate-400">Track your social media metrics and engagement</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm">{metric.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{metric.value}</h3>
                <span className={`text-sm flex items-center gap-1 ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {metric.change}
                </span>
              </div>
              <div className="text-slate-400">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Engagement Over Time</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-400">Chart Placeholder</p>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Performing Content</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border-b border-slate-700 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white">Market Analysis Update #{index + 1}</p>
                    <p className="text-sm text-slate-400">Posted 2 days ago</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>4.2K</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPerformancePage; 