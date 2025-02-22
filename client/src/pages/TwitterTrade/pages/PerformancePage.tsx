import React from 'react';
import { TrendingUp, BarChart2, PieChart, ArrowUp, ArrowDown, Calendar, Filter, RefreshCw, Clock, DollarSign, Target, Percent, Timer, AlertTriangle } from 'lucide-react';

const PerformancePage: React.FC = () => {
  const performanceMetrics = [
    {
      title: 'Total Return',
      value: '+32.5%',
      change: '+2.3%',
      trend: 'up',
      period: 'YTD',
      details: 'Based on $100K initial capital'
    },
    {
      title: 'Win Rate',
      value: '68%',
      change: '+1.2%',
      trend: 'up',
      period: '30D',
      details: '124 out of 182 trades'
    },
    {
      title: 'Avg. Trade',
      value: '$425',
      change: '-$12',
      trend: 'down',
      period: '7D',
      details: 'Across all positions'
    },
    {
      title: 'Profit Factor',
      value: '2.4',
      change: '+0.2',
      trend: 'up',
      period: '30D',
      details: 'Gross profit / Gross loss'
    }
  ];

  const recentTrades = [
    {
      pair: 'BTC/USD',
      type: 'LONG',
      entry: '44,250',
      exit: '45,800',
      pnl: '+3.5%',
      trend: 'up',
      time: '2h ago',
      size: '0.5 BTC',
      leverage: '2x',
      stopLoss: '43,800',
      takeProfit: '45,800',
      duration: '1h 45m'
    },
    {
      pair: 'ETH/USD',
      type: 'SHORT',
      entry: '2,850',
      exit: '2,780',
      pnl: '+2.4%',
      trend: 'up',
      time: '5h ago',
      size: '5 ETH',
      leverage: '3x',
      stopLoss: '2,900',
      takeProfit: '2,750',
      duration: '4h 20m'
    },
    {
      pair: 'SOL/USD',
      type: 'LONG',
      entry: '98.50',
      exit: '96.20',
      pnl: '-2.3%',
      trend: 'down',
      time: '8h ago',
      size: '20 SOL',
      leverage: '2x',
      stopLoss: '96.00',
      takeProfit: '102.00',
      duration: '2h 15m'
    }
  ];

  const advancedStats = [
    {
      title: 'Sharpe Ratio',
      value: '2.8',
      status: 'Excellent',
      trend: 'up'
    },
    {
      title: 'Max Drawdown',
      value: '-12.5%',
      status: 'Moderate',
      trend: 'neutral'
    },
    {
      title: 'Recovery Factor',
      value: '3.2',
      status: 'Strong',
      trend: 'up'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Performance Analytics</h1>
        <p className="text-slate-400">Track and analyze your trading performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">All Time</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">YTD</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">30D</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">7D</button>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <Filter className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-slate-400">{metric.title}</h3>
                    <span className="text-slate-500 text-sm">{metric.period}</span>
                  </div>
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

          {/* Performance Chart */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Equity Curve</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">Linear</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Log</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <p className="text-slate-400">Chart Placeholder</p>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Trades</h2>
            <div className="space-y-4">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-white font-medium">{trade.pair}</h3>
                      <span className={`text-sm ${
                        trade.type === 'LONG' ? 'text-emerald-400' : 'text-red-400'
                      }`}>{trade.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-slate-400">Entry: {trade.entry}</div>
                      <div className="text-slate-400">Exit: {trade.exit}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${
                        trade.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                      }`}>{trade.pnl}</span>
                      <span className="text-slate-500 text-sm">{trade.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Metrics */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Advanced Metrics</h2>
            <div className="grid grid-cols-3 gap-4">
              {advancedStats.map((stat, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-slate-400 mb-2">{stat.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xl font-semibold">{stat.value}</span>
                    <span className={`text-sm ${
                      stat.trend === 'up' ? 'text-emerald-400' : 
                      stat.trend === 'down' ? 'text-red-400' : 
                      'text-orange-400'
                    }`}>{stat.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Details Expansion */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Trade Analysis</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">By Pair</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">By Strategy</button>
              </div>
            </div>
            <div className="space-y-4">
              {recentTrades.map((trade, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-medium">{trade.pair}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trade.type === 'LONG' ? 'bg-emerald-400/20 text-emerald-400' : 
                        'bg-red-400/20 text-red-400'
                      }`}>{trade.type}</span>
                    </div>
                    <span className="text-slate-400 text-sm">{trade.time}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-slate-400 text-sm">Position Size</span>
                      <p className="text-white">{trade.size}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Leverage</span>
                      <p className="text-white">{trade.leverage}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Duration</span>
                      <p className="text-white">{trade.duration}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-400">TP: {trade.takeProfit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-slate-400">SL: {trade.stopLoss}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Performance Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Best Trade</span>
                <span className="text-emerald-400">+8.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Worst Trade</span>
                <span className="text-red-400">-3.5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Avg. Hold Time</span>
                <span className="text-teal-400">4.2h</span>
              </div>
            </div>
          </div>

          {/* Trading Statistics */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Trading Statistics</h2>
            <div className="space-y-4">
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-slate-300">Risk/Reward Ratio</span>
                    <p className="text-xs text-slate-400">Average across all trades</p>
                  </div>
                  <span className="text-teal-400">2.5</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
              
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-slate-300">Win Streak</span>
                    <p className="text-xs text-slate-400">Current / Best: 5 / 8</p>
                  </div>
                  <span className="text-emerald-400">5</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>

              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-slate-300">Average Hold Time</span>
                    <p className="text-xs text-slate-400">Profitable trades</p>
                  </div>
                  <span className="text-teal-400">3h 45m</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div className="bg-teal-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Clock className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300 text-sm">New position opened</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 text-sm">Profit target hit</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <BarChart2 className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">Risk level adjusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage; 