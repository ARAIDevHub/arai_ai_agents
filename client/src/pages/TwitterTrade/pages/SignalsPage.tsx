import React from 'react';
import { Activity, AlertTriangle, ArrowUp, ArrowDown, Bell, Filter, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';

const SignalsPage: React.FC = () => {
  const signals = [
    {
      type: 'Price Action',
      asset: 'BTC/USD',
      signal: 'Strong Buy',
      confidence: '92%',
      timeframe: '4H',
      timestamp: '5 min ago',
      status: 'active',
      direction: 'up',
      price: '$45,230'
    },
    {
      type: 'Volume Alert',
      asset: 'ETH/USD',
      signal: 'Volume Spike',
      confidence: '87%',
      timeframe: '1H',
      timestamp: '15 min ago',
      status: 'active',
      direction: 'up',
      price: '$2,850'
    },
    {
      type: 'Trend Break',
      asset: 'SOL/USD',
      signal: 'Sell',
      confidence: '78%',
      timeframe: '1D',
      timestamp: '1 hour ago',
      status: 'expired',
      direction: 'down',
      price: '$98.45'
    }
  ];

  const alertSettings = [
    { name: 'Price Alerts', status: 'enabled' },
    { name: 'Volume Alerts', status: 'enabled' },
    { name: 'Trend Alerts', status: 'disabled' },
    { name: 'News Alerts', status: 'enabled' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Market Signals</h1>
        <p className="text-slate-400">Real-time market signals and trading alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Signals Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-teal-400">All Signals</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Active</button>
                <button className="px-3 py-1 text-sm rounded-full bg-slate-700 text-slate-400">Expired</button>
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

          {/* Signals List */}
          <div className="space-y-4">
            {signals.map((signal, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-teal-400" />
                      <h3 className="text-lg font-semibold text-white">{signal.type}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        signal.status === 'active' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-slate-600 text-slate-400'
                      }`}>
                        {signal.status}
                      </span>
                    </div>
                    <p className="text-slate-400">
                      {signal.asset} • {signal.timeframe} • {signal.timestamp}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 ${
                    signal.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {signal.direction === 'up' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                    <span className="font-semibold">{signal.price}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-sm text-slate-400 mb-1">Signal</p>
                    <p className="text-white font-semibold">{signal.signal}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-sm text-slate-400 mb-1">Confidence</p>
                    <p className="text-teal-400 font-semibold">{signal.confidence}</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-sm text-slate-400 mb-1">Timeframe</p>
                    <p className="text-white font-semibold">{signal.timeframe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Alert Settings */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Alert Settings</h2>
            <div className="space-y-3">
              {alertSettings.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{alert.name}</span>
                  </div>
                  <div className={alert.status === 'enabled' ? 'text-teal-400' : 'text-slate-500'}>
                    {alert.status === 'enabled' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signal Statistics */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Signal Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Success Rate</span>
                <span className="text-emerald-400">85%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Active Signals</span>
                <span className="text-teal-400">8</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Today's Signals</span>
                <span className="text-teal-400">24</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <Clock className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300 text-sm">New BTC signal generated</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300 text-sm">ETH volume alert triggered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalsPage; 