import React, { useState } from 'react';
import { Settings, Calendar, Edit, Bot } from 'lucide-react';

// Card Components
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
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
          <div className="h-full bg-gray-50 p-4">
            <div className="bg-white h-full rounded-lg border p-4">
              {/* ReactFlow would be implemented here */}
              <div className="h-full flex items-center justify-center text-gray-500">
                ReactFlow Node Editor
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="grid grid-cols-2 gap-4 h-full p-4">
            <Card className="h-full">
              <CardContent className="p-4 h-full">
                <textarea 
                  className="w-full h-64 p-2 border rounded resize-none mb-4"
                  placeholder="Write your post content here..."
                />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Characters: 0/280</span>
                    <span>Posts today: 0/3</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Schedule</button>
                    <button className="px-4 py-2 border rounded">Draft</button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bot size={20} />
                  <h3 className="font-medium">AI Assistant</h3>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded">
                    Consider adding market data to support your analysis
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
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
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Daily</h3>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-2 border rounded">
                      {`${9 + i * 3}:00 - Post ${i + 1}`}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Weekly</h3>
                <div className="space-y-2">
                  {['Mon', 'Wed', 'Fri'].map(day => (
                    <div key={day} className="p-2 border rounded">
                      {`${day} - Thread`}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Monthly</h3>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className="aspect-square border flex items-center justify-center">
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
    <div className="h-screen flex flex-col">
      <div className="border-b">
        <div className="flex p-4 gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
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