import React from 'react';
import { Zap, TrendingUp, BarChart2, MessageSquare, AlertTriangle, CheckCircle, Brain, RefreshCw } from 'lucide-react';

const AIInsightsPage: React.FC = () => {
  const insights = [
    {
      type: 'Market Trend',
      content: 'Bullish sentiment detected across social media for BTC',
      confidence: '89%',
      impact: 'High',
      status: 'positive'
    },
    {
      type: 'Content Strategy',
      content: 'Engagement peaks detected during Asian market hours',
      confidence: '92%',
      impact: 'Medium',
      status: 'positive'
    },
    {
      type: 'Risk Alert',
      content: 'Unusual volume detected in ETH derivatives',
      confidence: '78%',
      impact: 'High',
      status: 'warning'
    }
  ];

  const recommendations = [
    "Schedule key announcements during Asian market hours",
    "Increase content focus on DeFi developments",
    "Monitor ETH price action closely in next 24h"
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">AI Insights</h1>
        <p className="text-slate-400">AI-powered analysis and recommendations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Insights Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white">Latest Insights</h2>
              <button className="text-slate-400 hover:text-teal-400">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-teal-400" />
                      <span className="text-white font-medium">{insight.type}</span>
                    </div>
                    {insight.status === 'positive' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  <p className="text-slate-300 mb-3">{insight.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-teal-400">Confidence: {insight.confidence}</span>
                    <span className="text-orange-400">Impact: {insight.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">AI Analysis Overview</h2>
            <div className="h-64 flex items-center justify-center border border-slate-700 rounded-lg">
              <p className="text-slate-400">Analysis Visualization Placeholder</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recommended Actions</h2>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-teal-400" />
                  {rec}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Stats */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Analysis Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Analyzed Posts</span>
                <span className="text-teal-400">2,547</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Market Signals</span>
                <span className="text-teal-400">156</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Accuracy Rate</span>
                <span className="text-teal-400">92.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage; 