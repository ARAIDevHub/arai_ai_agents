import React from 'react';
import { Target, Users, BarChart2, TrendingUp, ArrowUp, ArrowDown, Search, Filter, RefreshCw } from 'lucide-react';

const CompetitorsPage: React.FC = () => {
  const competitors = [
    {
      name: 'CryptoTrader',
      metrics: {
        followers: '25.3K',
        engagement: '5.2%',
        growth: '+3.2%',
        trend: 'up'
      },
      performance: 'high'
    },
    {
      name: 'MarketAnalyst',
      metrics: {
        followers: '18.7K',
        engagement: '4.8%',
        growth: '+2.1%',
        trend: 'up'
      },
      performance: 'medium'
    },
    {
      name: 'TradingPro',
      metrics: {
        followers: '15.2K',
        engagement: '3.9%',
        growth: '-0.5%',
        trend: 'down'
      },
      performance: 'low'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Competitor Analysis</h1>
        <p className="text-slate-400">Track and analyze competitor performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search competitors..."
                  className="w-full bg-slate-700 text-slate-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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

          {/* Competitor Cards */}
          {competitors.map((competitor, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">{competitor.name}</h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    competitor.performance === 'high' 
                      ? 'bg-emerald-400/20 text-emerald-400'
                      : competitor.performance === 'medium'
                        ? 'bg-orange-400/20 text-orange-400'
                        : 'bg-red-400/20 text-red-400'
                  }`}>
                    {competitor.performance.charAt(0).toUpperCase() + competitor.performance.slice(1)} Performance
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${
                  competitor.metrics.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {competitor.metrics.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {competitor.metrics.growth}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Followers</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{competitor.metrics.followers}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Engagement</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{competitor.metrics.engagement}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Growth</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{competitor.metrics.growth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Market Position</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Market Rank</span>
                <span className="text-teal-400">#3</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Market Share</span>
                <span className="text-teal-400">15.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Growth Rate</span>
                <span className="text-emerald-400">+2.8%</span>
              </div>
            </div>
          </div>

          {/* Competitive Advantages */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Key Differentiators</h2>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300">Content Quality</p>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300">Engagement Rate</p>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300">Growth Rate</p>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorsPage; 