import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, Play, Pause, Settings2, ChevronRight, BarChart2, Clock, Brain } from 'lucide-react';

const AIStrategiesPage: React.FC = () => {
  const strategies = [
    {
      name: 'Sentiment Momentum',
      description: 'Trade based on social sentiment and market momentum correlation',
      status: 'active',
      performance: '+12.3%',
      signals: 15,
      lastUpdated: '5 min ago',
      risk: 'Medium'
    },
    {
      name: 'Trend Following',
      description: 'AI-enhanced trend following strategy with social validation',
      status: 'paused',
      performance: '+8.7%',
      signals: 23,
      lastUpdated: '15 min ago',
      risk: 'Low'
    },
    {
      name: 'News Arbitrage',
      description: 'Capitalize on market inefficiencies during news events',
      status: 'active',
      performance: '+15.1%',
      signals: 8,
      lastUpdated: '2 min ago',
      risk: 'High'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">AI Trading Strategies</h1>
        <p className="text-slate-400">Manage and monitor your AI-powered trading strategies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy List */}
        <div className="lg:col-span-2 space-y-6">
          {strategies.map((strategy, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
                  </div>
                  <p className="text-slate-400">{strategy.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700">
                    <Settings2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700">
                    {strategy.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">Performance</p>
                  <p className="text-emerald-400 font-semibold">{strategy.performance}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">Signals</p>
                  <p className="text-white font-semibold">{strategy.signals}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">Risk Level</p>
                  <p className="text-orange-400 font-semibold">{strategy.risk}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">Updated</p>
                  <p className="text-white font-semibold">{strategy.lastUpdated}</p>
                </div>
              </div>

              <button className="w-full text-left text-slate-400 hover:text-teal-400 flex items-center justify-between p-2 rounded-lg hover:bg-slate-700">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-3 rounded-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Create New Strategy
              </button>
              <button className="w-full bg-slate-700 text-slate-300 px-4 py-3 rounded-lg flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                Performance Report
              </button>
            </div>
          </div>

          {/* Strategy Health */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Strategy Health</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Active Strategies</span>
                <span className="text-emerald-400">2/3</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Success Rate</span>
                <span className="text-emerald-400">87%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Risk Score</span>
                <span className="text-orange-400">Medium</span>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">Strategy 'Trend Following' needs optimization</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Clock className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300 text-sm">New signal generated for BTC/USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStrategiesPage; 