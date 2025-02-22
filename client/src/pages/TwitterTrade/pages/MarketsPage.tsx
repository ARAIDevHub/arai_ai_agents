import React from 'react';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, DollarSign, BarChart2, Search, Filter, RefreshCw, Globe, Clock } from 'lucide-react';

const MarketsPage: React.FC = () => {
  const markets = [
    {
      pair: 'BTC/USD',
      price: '43,521.34',
      change24h: '+2.4%',
      volume: '24.5B',
      marketCap: '845.2B',
      dominance: '42.3%',
      trend: 'up',
      change: '+1,423.45'
    },
    {
      pair: 'ETH/USD',
      price: '2,845.67',
      change24h: '+3.2%',
      volume: '15.2B',
      marketCap: '342.1B',
      dominance: '18.5%',
      trend: 'up',
      change: '+89.23'
    },
    {
      pair: 'SOL/USD',
      price: '98.45',
      change24h: '-1.8%',
      volume: '4.2B',
      marketCap: '42.3B',
      dominance: '2.1%',
      trend: 'down',
      change: '-1.82'
    }
  ];

  const marketIndicators = [
    {
      name: 'Fear & Greed Index',
      value: '72',
      status: 'Greed',
      trend: 'up',
      color: 'orange'
    },
    {
      name: 'Volatility Index',
      value: '28',
      status: 'Low',
      trend: 'down',
      color: 'teal'
    },
    {
      name: 'Market Strength',
      value: '85',
      status: 'Strong',
      trend: 'up',
      color: 'emerald'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Markets Overview</h1>
        <p className="text-slate-400">Real-time market data and analysis</p>
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
                  placeholder="Search markets..."
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

          {/* Market Cards */}
          {markets.map((market, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{market.pair}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-400">Vol: {market.volume}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-400">MCap: {market.marketCap}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${
                  market.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {market.trend === 'up' ? 
                    <TrendingUp className="w-5 h-5" /> : 
                    <TrendingDown className="w-5 h-5" />
                  }
                  {market.change24h}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Price</span>
                  </div>
                  <span className="text-white text-xl font-semibold">${market.price}</span>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-teal-400" />
                    <span className="text-slate-400">Dominance</span>
                  </div>
                  <span className="text-white text-xl font-semibold">{market.dominance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Market Indicators */}
          {marketIndicators.map((indicator, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">{indicator.name}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-3xl font-bold text-${indicator.color}-400`}>
                    {indicator.value}
                  </span>
                  <span className={`text-${indicator.color}-400`}>
                    {indicator.status}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className={`bg-${indicator.color}-400 h-2 rounded-full`} 
                       style={{ width: `${indicator.value}%` }}></div>
                </div>
              </div>
            </div>
          ))}

          {/* Market Activity */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Market Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Globe className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300 text-sm">Global volume surge</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">BTC options expiry in 2h</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm">New market cycle detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketsPage; 