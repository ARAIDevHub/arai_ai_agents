import React, { useState } from 'react';
import { Settings, Calendar, Edit, Bot } from 'lucide-react';

// Card Components
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-lg border border-orange-500/30 bg-slate-900/80 shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('flow');

  const tabs = [
    { id: 'flow', icon: Settings, label: 'Data Flow' },
    { id: 'content', icon: Edit, label: 'Content' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'flow':
        return (
          <div className="h-full p-4">
            <div className="h-full rounded-lg border border-orange-500/30 bg-slate-900/80 p-4">
              <div className="h-full flex items-center justify-center text-gray-400">
                ReactFlow Node Editor
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="grid grid-cols-2 gap-4 h-full p-4">
            <Card>
              <CardContent>
                <textarea 
                  className="w-full h-64 p-2 rounded bg-slate-800 border border-orange-500/30 
                           text-gray-100 resize-none mb-4 focus:outline-none focus:ring-2 
                           focus:ring-orange-500/50"
                  placeholder="Write your post content here..."
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Characters: 0/280</span>
                    <span>Posts today: 0/3</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-orange-600 
                                   hover:from-cyan-700 hover:to-orange-700 text-white rounded">
                      Schedule
                    </button>
                    <button className="px-4 py-2 border border-orange-500/30 text-gray-300 
                                   hover:bg-slate-800 rounded">
                      Draft
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 mb-4 text-gray-100">
                  <Bot size={20} />
                  <h3 className="font-medium">AI Assistant</h3>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-800 border border-orange-500/30 rounded text-gray-300">
                    Consider adding market data to support your analysis
                  </div>
                  <div className="p-3 bg-slate-800 border border-orange-500/30 rounded text-gray-300">
                    Include a clear call-to-action for engagement
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'calendar':
        return (
          <div className="grid grid-cols-3 gap-4 p-4">
            <Card>
              <CardContent>
                <h3 className="font-medium mb-4 text-gray-100">Daily</h3>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-2 border border-orange-500/30 bg-slate-800 
                                        rounded text-gray-300">
                      {`${9 + i * 3}:00 - Post ${i + 1}`}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <h3 className="font-medium mb-4 text-gray-100">Weekly</h3>
                <div className="space-y-2">
                  {['Mon', 'Wed', 'Fri'].map(day => (
                    <div key={day} className="p-2 border border-orange-500/30 bg-slate-800 
                                          rounded text-gray-300">
                      {`${day} - Thread`}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <h3 className="font-medium mb-4 text-gray-100">Monthly</h3>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className="aspect-square border border-orange-500/30 
                                        bg-slate-800 flex items-center justify-center text-gray-300">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      <div className="border-b border-orange-500/30">
        <div className="flex p-4 gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white' 
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;