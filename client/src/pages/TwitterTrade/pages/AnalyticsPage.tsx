import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-4 text-white animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-teal-500/20">
          <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Bullish</span>
              <div className="w-2/3 bg-slate-700 rounded-full h-2">
                <div className="bg-teal-400 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-orange-500/20">
          <h3 className="text-lg font-semibold mb-4">Volume Analysis</h3>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 