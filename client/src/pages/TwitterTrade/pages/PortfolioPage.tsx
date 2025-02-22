import React from 'react';
import { Wallet, TrendingUp, BarChart2, PieChart, DollarSign, Percent, RefreshCw, Filter, ArrowUp, ArrowDown, Clock, AlertCircle } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const portfolioSummary = [
    {
      title: 'Total Value',
      value: '$124,582.45',
      change: '+12.4%',
      trend: 'up',
      period: '30D'
    },
    {
      title: 'Available Balance',
      value: '$25,321.80',
      change: '-2.1%',
      trend: 'down',
      period: '24H'
    },
    {
      title: 'Unrealized P/L',
      value: '$8,245.32',
      change: '+5.2%',
      trend: 'up',
      period: '24H'
    },
    {
      title: 'Margin Used',
      value: '45%',
      change: '+2.5%',
      trend: 'up',
      period: '24H'
    }
  ];

  const holdings = [
    {
      asset: 'Bitcoin',
      symbol: 'BTC',
      amount: '2.45',
      value: '$98,452.30',
      avgPrice: '$38,245.20',
      currentPrice: '$42,521.34',
      pnl: '+15.2%',
      allocation: '42%',
      trend: 'up',
      risk: 'medium'
    },
    {
      asset: 'Ethereum',
      symbol: 'ETH',
      amount: '12.8',
      value: '$35,824.15',
      avgPrice: '$2,450.80',
      currentPrice: '$2,845.67',
      pnl: '+8.4%',
      allocation: '28%',
      trend: 'up',
      risk: 'low'
    },
    {
      asset: 'Solana',
      symbol: 'SOL',
      amount: '145.2',
      value: '$14,285.42',
      avgPrice: '$85.20',
      currentPrice: '$98.45',
      pnl: '-2.8%',
      allocation: '12%',
      trend: 'down',
      risk: 'high'
    }
  ];

  const recentActivity = [
    {
      type: 'BUY',
      asset: 'BTC',
      amount: '0.25',
      price: '$42,350.45',
      time: '2h ago'
    },
    {
      type: 'SELL',
      asset: 'ETH',
      amount: '2.5',
      price: '$2,845.67',
      time: '5h ago'
    },
    {
      type: 'DEPOSIT',
      asset: 'USDT',
      amount: '10,000',
      price: '$1.00',
      time: '1d ago'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Portfolio Overview</h1>
        <p className="text-slate-400">Track and manage your crypto assets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">All Assets</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Spot</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Margin</button>
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

          {/* Portfolio Summary */}
          <div className="grid grid-cols-2 gap-4">
            {portfolioSummary.map((metric, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-400">{metric.title}</h3>
                  <span className="text-slate-500 text-sm">{metric.period}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-2xl font-semibold">{metric.value}</span>
                  <div className={`flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Holdings Table */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Holdings</h2>
            <div className="space-y-4">
              {holdings.map((holding, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-medium">{holding.asset}</h3>
                      <span className="text-slate-400">{holding.symbol}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        holding.risk === 'low' ? 'bg-emerald-400/20 text-emerald-400' :
                        holding.risk === 'medium' ? 'bg-orange-400/20 text-orange-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>{holding.risk} risk</span>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      holding.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {holding.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {holding.pnl}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <span className="text-slate-400 text-sm">Amount</span>
                      <p className="text-white">{holding.amount}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Value</span>
                      <p className="text-white">{holding.value}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Avg Price</span>
                      <p className="text-white">{holding.avgPrice}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Allocation</span>
                      <p className="text-white">{holding.allocation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Portfolio Stats */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Portfolio Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Risk Score</span>
                <span className="text-orange-400">Medium (65)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Diversification</span>
                <span className="text-emerald-400">Good</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Volatility</span>
                <span className="text-teal-400">Low</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.type === 'BUY' ? 'bg-emerald-400/20 text-emerald-400' :
                      activity.type === 'SELL' ? 'bg-red-400/20 text-red-400' :
                      'bg-orange-400/20 text-orange-400'
                    }`}>{activity.type}</span>
                    <div>
                      <p className="text-white">{activity.amount} {activity.asset}</p>
                      <p className="text-slate-400 text-sm">{activity.price}</p>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage; 