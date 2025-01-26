import React, { useState } from 'react';
import { Settings, Calendar, Edit, Bot, ChevronUp, ChevronDown, Database, Cog, MessageSquare, MessagesSquare, Reply, AtSign, TrendingUp, Layout } from 'lucide-react';
import AgentPipeline from '../components/AgentPipeline';
import CryptoTwitterDashboard from '../components/CryptoTwitterDashboard';
import StreamingColumns from '../components/StreamingColumns';
import TwitterStockStream from '../components/TwitterStockStream';

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

const CollapsibleSection = ({ title, children, isOpen, onToggle }) => (
  <div className="rounded-lg border border-orange-500/30 bg-slate-900/80 overflow-hidden">
    <div 
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50"
      onClick={onToggle}
    >
      <h3 className="text-white font-bold">{title}</h3>
      {isOpen ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </div>
    {isOpen && children}
  </div>
);

const MinecraftSlot = ({ className = '' }) => (
  <div className={`aspect-square bg-gray-800/80 border-2 border-t-gray-600 border-l-gray-600 
                   border-r-gray-900 border-b-gray-900 ${className}`} />
);

const MinecraftTab = ({ icon: Icon, label, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-2 p-2 cursor-pointer w-full
                ${isActive ? 'bg-gray-800/80 border-r-2 border-orange-500/30' : 'hover:bg-gray-800/50'}`}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-gray-400'}`} />
    <span className={`text-sm ${isActive ? 'text-orange-400' : 'text-gray-400'}`}>{label}</span>
  </div>
);

interface TimelineEvent {
  type: 'post' | 'thread' | 'reply' | 'mention';
  time: string;
  content: string;
  engagement?: {
    likes: number;
    replies: number;
    reposts: number;
  };
  status?: 'scheduled' | 'posted' | 'draft';
}

const TimelineCard = ({ event }: { event: TimelineEvent }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'post':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'thread':
        return <MessagesSquare className="w-4 h-4 text-green-400" />;
      case 'reply':
        return <Reply className="w-4 h-4 text-orange-400" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`p-2 rounded border ${
      event.status === 'scheduled' ? 'border-orange-500/30 bg-slate-800/50' :
      event.status === 'posted' ? 'border-green-500/30 bg-slate-800/50' :
      'border-gray-600/30 bg-slate-800/30'
    } mb-2`}>
      <div className="flex items-center gap-2 mb-1">
        {getEventIcon()}
        <span className="text-sm text-gray-400">{event.time}</span>
        {event.status === 'scheduled' && (
          <span className="text-xs text-orange-400 ml-auto">Scheduled</span>
        )}
      </div>
      <p className="text-sm text-gray-300 line-clamp-2">{event.content}</p>
      {event.engagement && (
        <div className="flex gap-3 mt-1 text-xs text-gray-400">
          <span>♥ {event.engagement.likes}</span>
          <span>↺ {event.engagement.reposts}</span>
          <span>↩ {event.engagement.replies}</span>
        </div>
      )}
    </div>
  );
};

const DayColumn = ({ date, events, isToday }: { 
  date: Date, 
  events: TimelineEvent[], 
  isToday: boolean 
}) => (
  <div className={`flex-1 min-w-0 ${isToday ? 'bg-slate-800/30' : ''}`}>
    <div className={`sticky top-0 p-2 text-center border-b border-orange-500/30 
                    ${isToday ? 'bg-orange-500/10' : 'bg-slate-900/80'}`}>
      <div className="text-sm text-gray-400">
        {date.toLocaleDateString('en-US', { weekday: 'short' })}
      </div>
      <div className={`text-sm ${isToday ? 'text-orange-400 font-bold' : 'text-gray-300'}`}>
        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </div>
    <div className="p-2 h-full">
      {events.map((event, i) => (
        <TimelineCard key={i} event={event} />
      ))}
    </div>
  </div>
);

const ContentEditor = ({ type, limit }: { type: string; limit: number }) => (
  <Card className="flex-1">
    <CardContent>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-100">{type}</h3>
        <span className="text-sm text-gray-400">0/{limit} today</span>
      </div>
      <textarea 
        className="w-full h-32 p-2 rounded bg-slate-800 border border-orange-500/30 
                  text-gray-100 resize-none mb-2 focus:outline-none focus:ring-2 
                  focus:ring-orange-500/50"
        placeholder={`Write your ${type.toLowerCase()} here...`}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Characters: 0/280</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-orange-600 
                           hover:from-cyan-700 hover:to-orange-700 text-white rounded text-sm">
            Schedule
          </button>
          <button className="px-3 py-1 border border-orange-500/30 text-gray-300 
                           hover:bg-slate-800 rounded text-sm">
            Draft
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('flow');
  const [minecraftOpen, setMinecraftOpen] = useState(true);
  const [flowOpen, setFlowOpen] = useState(true);
  const [minecraftTab, setMinecraftTab] = useState('inventory');

  const tabs = [
    { id: 'flow', icon: Settings, label: 'Data Flow' },
    { id: 'content', icon: Edit, label: 'Content' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'crypto', icon: TrendingUp, label: 'Crypto Feed' },
    { id: 'streams', icon: Layout, label: 'Streams' },
    { id: 'trading', icon: TrendingUp, label: 'Trading Stream' }
  ];

  const minecraftTabs = [
    { id: 'inventory', icon: Bot, label: 'Inventory' },
    { id: 'recipes', icon: Settings, label: 'Recipes' },
    { id: 'nodes', icon: Database, label: 'Nodes' },
    { id: 'automation', icon: Cog, label: 'Automation' }
  ];

  const renderMinecraftContent = () => {
    switch (minecraftTab) {
      case 'inventory':
        return (
          <div className="flex gap-8">
            {/* Main Inventory Grid */}
            <div className="w-1/2">
              <div className="grid grid-cols-9 gap-1 p-2 bg-gray-800/80 border-2 
                            border-t-gray-900 border-l-gray-900 border-r-gray-600 border-b-gray-600">
                {Array.from({ length: 27 }).map((_, i) => (
                  <MinecraftSlot key={`inv-${i}`} />
                ))}
              </div>

              {/* Hotbar */}
              <div className="mt-1">
                <div className="grid grid-cols-9 gap-1 p-2 bg-gray-800/80 border-2 
                              border-t-gray-900 border-l-gray-900 border-r-gray-600 border-b-gray-600">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <MinecraftSlot key={`hot-${i}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Crafting */}
            <div className="w-1/2 flex justify-center items-start">
              <div className="flex items-center gap-8">
                {/* Crafting Grid */}
                <div className="flex flex-col">
                  <div className="grid grid-cols-3 gap-1.5 p-3 bg-gray-800/80 border-2 
                                border-t-gray-900 border-l-gray-900 border-r-gray-600 border-b-gray-600">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <MinecraftSlot 
                        key={`craft-${i}`} 
                        className="w-16 h-16"
                      />
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center text-gray-400">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <span className="text-3xl">→</span>
                  </div>
                </div>

                {/* Result Slot */}
                <div className="p-3 bg-gray-800/80 border-2 border-t-gray-900 border-l-gray-900 
                              border-r-gray-600 border-b-gray-600">
                  <MinecraftSlot className="w-20 h-20" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'recipes':
        return (
          <div className="grid grid-cols-4 gap-2 p-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="bg-gray-800/80 p-2 border-2 border-gray-700 hover:border-orange-500/30">
                <div className="text-gray-400 text-sm">Recipe {i + 1}</div>
              </div>
            ))}
          </div>
        );
      case 'nodes':
        return (
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-gray-300 mb-2">Processing Nodes</h4>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/80 p-2 border-2 border-gray-700 hover:border-orange-500/30">
                    <div className="text-gray-400 text-sm">Node {i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-gray-300 mb-2">Storage Nodes</h4>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/80 p-2 border-2 border-gray-700 hover:border-orange-500/30">
                    <div className="text-gray-400 text-sm">Storage {i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'flow':
        return (
          <div className="h-full flex flex-col gap-4 p-4">
            <CollapsibleSection 
              title="Minecraft Integration"
              isOpen={minecraftOpen}
              onToggle={() => setMinecraftOpen(!minecraftOpen)}
            >
              <div className="p-4 bg-gray-700/80">
                <div className="flex">
                  {/* Left Side - Tabs */}
                  <div className="w-48 border-r border-gray-600">
                    {minecraftTabs.map(tab => (
                      <MinecraftTab
                        key={tab.id}
                        icon={tab.icon}
                        label={tab.label}
                        isActive={minecraftTab === tab.id}
                        onClick={() => setMinecraftTab(tab.id)}
                      />
                    ))}
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex-1">
                    {renderMinecraftContent()}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-2 bg-gray-800/80 border-2 border-t-gray-900 border-l-gray-900 
                                border-r-gray-600 border-b-gray-600">
                    <div className="flex justify-between text-gray-300 text-sm">
                      <span>World Status:</span>
                      <span className="text-green-400">Connected</span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-800/80 border-2 border-t-gray-900 border-l-gray-900 
                                border-r-gray-600 border-b-gray-600">
                    <div className="flex justify-between text-gray-300 text-sm">
                      <span>Active Agents:</span>
                      <span className="text-orange-400">3/5</span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-800/80 border-2 border-t-gray-900 border-l-gray-900 
                                border-r-gray-600 border-b-gray-600">
                    <div className="flex justify-between text-gray-300 text-sm">
                      <span>Resources:</span>
                      <span className="text-blue-400">247</span>
                    </div>
                  </div>
                </div>

                {/* Deploy Button */}
                <div className="mt-4">
                  <button className="w-full px-4 py-2 bg-gray-800/80 border-2 border-t-gray-600 
                                  border-l-gray-600 border-r-gray-900 border-b-gray-900 text-white 
                                  font-bold hover:bg-gray-700/80 active:border-t-gray-900 
                                  active:border-l-gray-900 active:border-r-gray-600 
                                  active:border-b-gray-600">
                    Deploy Agent
                  </button>
                </div>
              </div>
            </CollapsibleSection>
            
            {/* Flow Section */}
            <CollapsibleSection
              title="Data Flow"
              isOpen={flowOpen}
              onToggle={() => setFlowOpen(!flowOpen)}
            >
              <div className="h-[600px]">
                <AgentPipeline />
              </div>
            </CollapsibleSection>
          </div>
        );

      case 'content':
        return (
          <div className="flex flex-col h-full p-4 gap-4">
            {/* Content Editors Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Posts Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-100">Posts</h2>
                {Array.from({ length: 3 }).map((_, i) => (
                  <ContentEditor key={`post-${i}`} type="Post" limit={3} />
                ))}
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-100">Comments</h2>
                <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <ContentEditor key={`comment-${i}`} type="Comment" limit={20} />
                  ))}
                </div>
              </div>

              {/* Threads Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-100">Threads</h2>
                <div className="h-[600px] overflow-y-auto pr-2 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ContentEditor key={`thread-${i}`} type="Thread" limit={5} />
                  ))}
                </div>
              </div>
            </div>

            {/* AI Assistant */}
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

            {/* Timeline */}
            <Card className="flex-1">
              <div className="flex h-full divide-x divide-orange-500/30">
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + (i - 3)); // -3 to +3 days from today
                  const isToday = i === 3;
                  
                  // Example events - replace with real data
                  const events: TimelineEvent[] = isToday ? [
                    {
                      type: 'thread',
                      time: '10:00',
                      content: 'Market Analysis Thread #markets #crypto',
                      status: 'scheduled'
                    },
                    {
                      type: 'post',
                      time: '14:00',
                      content: 'Quick update on the latest developments',
                      status: 'scheduled'
                    }
                  ] : [
                    {
                      type: 'post',
                      time: '09:00',
                      content: 'Previous post content example',
                      engagement: {
                        likes: 42,
                        replies: 12,
                        reposts: 8
                      },
                      status: 'posted'
                    }
                  ];

                  return (
                    <DayColumn
                      key={i}
                      date={date}
                      events={events}
                      isToday={isToday}
                    />
                  );
                })}
              </div>
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

      case 'crypto':
        return (
          <div className="h-full">
            <CryptoTwitterDashboard />
          </div>
        );

      case 'streams':
        return (
          <div className="h-full">
            <StreamingColumns />
          </div>
        );

      case 'trading':
        return (
          <div className="h-full">
            <TwitterStockStream projects={['BTC', 'ETH', 'SOL', 'ADA']} />
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