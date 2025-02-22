import React from 'react';
import { BarChart2, TrendingUp, Activity, DollarSign, Users, Globe, Clock, Filter, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';

const MarketAnalyticsPage: React.FC = () => {
  const marketMetrics = [
    {
      title: 'Market Cap',
      value: '$2.1T',
      change: '+3.2%',
      trend: 'up'
    },
    {
      title: 'Trading Volume',
      value: '$142B',
      change: '+5.8%',
      trend: 'up'
    },
    {
      title: 'Dominance',
      value: 'BTC: 42%',
      change: '-0.5%',
      trend: 'down'
    },
    {
      title: 'Active Pairs',
      value: '1,245',
      change: '+12',
      trend: 'up'
    }
  ];

  const topMovers = [
    {
      symbol: 'BTC/USD',
      price: '$45,230',
      change: '+5.2%',
      volume: '$28B',
      trend: 'up'
    },
    {
      symbol: 'ETH/USD',
      price: '$2,850',
      change: '+3.8%',
      volume: '$15B',
      trend: 'up'
    },
    {
      symbol: 'SOL/USD',
      price: '$98.45',
      change: '-2.1%',
      volume: '$4.2B',
      trend: 'down'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Market Analytics</h1>
        <p className="text-slate-400">Comprehensive market analysis and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">Overview</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Technical</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Fundamental</button>
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

          {/* Market Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {marketMetrics.map((metric, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400">{metric.title}</h3>
                  <div className={`flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {metric.trend === 'up' ? 
                      <ArrowUp className="w-4 h-4" /> : 
                      <ArrowDown className="w-4 h-4" />
                    }
                    {metric.change}
                  </div>
                </div>
                <div className="text-white text-2xl font-semibold">{metric.value}</div>
              </div>
            ))}
          </div>

          {/* Market Chart */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Market Overview</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">1D</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">1W</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">1M</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <p className="text-slate-400">Chart Placeholder</p>
            </div>
          </div>

          {/* Top Movers */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Movers</h2>
            <div className="space-y-4">
              {topMovers.map((mover, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-white font-medium">{mover.symbol}</h3>
                      <span className="text-slate-400">Vol: {mover.volume}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white">{mover.price}</span>
                    <span className={`flex items-center gap-1 ${
                      mover.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {mover.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4" /> : 
                        <ArrowDown className="w-4 h-4" />
                      }
                      {mover.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Summary */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Market Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Global Rank</span>
                <span className="text-teal-400">#1</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Market Share</span>
                <span className="text-teal-400">42.3%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">24h Volume</span>
                <span className="text-emerald-400">+12.8%</span>
              </div>
            </div>
          </div>

          {/* Market Indicators */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Market Indicators</h2>
            <div className="space-y-4">
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Fear & Greed Index</span>
                  <span className="text-orange-400">65</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Volatility Index</span>
                  <span className="text-teal-400">32</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Updates</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Clock className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300 text-sm">Market cap reaches new ATH</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Activity className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">Volatility alert triggered</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm">Global volume surge detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalyticsPage; 