import React from 'react';
import { Star, TrendingUp, TrendingDown, BarChart2, Clock, Plus, Search, Filter, RefreshCw } from 'lucide-react';

const WatchlistPage: React.FC = () => {
  const watchlist = [
    {
      symbol: 'BTC/USD',
      name: 'Bitcoin',
      price: '45,230.50',
      change: '+5.2%',
      trend: 'up',
      volume: '2.1B',
      alerts: 2,
      lastUpdated: '1 min ago'
    },
    {
      symbol: 'ETH/USD',
      name: 'Ethereum',
      price: '2,850.75',
      change: '+3.8%',
      trend: 'up',
      volume: '1.5B',
      alerts: 1,
      lastUpdated: '1 min ago'
    },
    {
      symbol: 'SOL/USD',
      name: 'Solana',
      price: '98.45',
      change: '-2.1%',
      trend: 'down',
      volume: '425M',
      alerts: 0,
      lastUpdated: '1 min ago'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Watchlist</h1>
        <p className="text-slate-400">Monitor your favorite assets and markets</p>
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
                  placeholder="Search assets..."
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
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Watchlist Items */}
          {watchlist.map((item, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-lg font-semibold text-white">{item.symbol}</h2>
                  </div>
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <div className={`flex items-center gap-1 ${
                  item.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {item.trend === 'up' ? 
                    <TrendingUp className="w-4 h-4" /> : 
                    <TrendingDown className="w-4 h-4" />
                  }
                  {item.change}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Price</span>
                  </div>
                  <span className="text-white text-lg font-semibold">${item.price}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Volume</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{item.volume}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Updated</span>
                  </div>
                  <span className="text-white text-lg font-semibold">{item.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Overview */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Market Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Total Assets</span>
                <span className="text-teal-400">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Active Alerts</span>
                <span className="text-orange-400">3</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">24h Change</span>
                <span className="text-emerald-400">+2.8%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Create New Alert
              </button>
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Add New Asset
              </button>
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Export Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage; 