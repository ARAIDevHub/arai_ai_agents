import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, Clock, AlertTriangle } from 'lucide-react';

const TradingPage: React.FC = () => {
  const markets = [
    { symbol: 'BTC/USD', price: '42,389.50', change: '+2.45%', trend: 'up' },
    { symbol: 'ETH/USD', price: '2,842.30', change: '-1.20%', trend: 'down' },
    { symbol: 'SOL/USD', price: '98.45', change: '+5.67%', trend: 'up' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Trading</h1>
        <p className="text-slate-400">Execute trades and monitor market positions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Overview */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Market Overview</h2>
            <div className="space-y-4">
              {markets.map((market, index) => (
                <div key={index} className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div>
                    <p className="text-white font-semibold">{market.symbol}</p>
                    <p className="text-slate-400">${market.price}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${market.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {market.change}
                    {market.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Price Chart</h2>
            <div className="h-96 flex items-center justify-center">
              <p className="text-slate-400">Chart Placeholder</p>
            </div>
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Trade</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Amount</label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    className="w-full bg-slate-700 rounded-lg p-2 text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg">Buy</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Sell</button>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="border-b border-slate-700 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white">BTC/USD</p>
                      <p className="text-sm text-slate-400">Buy @ $42,350</p>
                    </div>
                    <div className="text-emerald-400">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage; 