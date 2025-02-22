import React from 'react';
import { 
  TrendingUp, 
  Twitter, 
  Activity, 
  BarChart2,
  BrainCircuit,
  LayoutDashboard,
  LineChart,
  ListChecks,
  GaugeCircle,
  Wallet,
  PieChart,
  Lightbulb,
  Settings,
  Users,
  PenSquare,
  Calendar,
  Inbox,
  History,
  Target,
  Zap,
  Share2,
  Newspaper,
  MessageSquare
} from 'lucide-react';

interface LeftSidebarProps {
  activePage: string;
  onPageChange: (pageId: string) => void;
}

const sidebarSections = [
  {
    title: "Social Management",
    items: [
      { id: 'accounts', icon: <Users className="w-5 h-5" />, label: "Accounts" },
      { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
    ]
  },
  {
    title: "Content",
    items: [
      { id: 'create', icon: <PenSquare className="w-5 h-5" />, label: "Create Content" },
      { id: 'planner', icon: <Calendar className="w-5 h-5" />, label: "Content Planner" },
      { id: 'inbox', icon: <Inbox className="w-5 h-5" />, label: "Content Inbox" },
      { id: 'history', icon: <History className="w-5 h-5" />, label: "Post History" },
    ]
  },
  {
    title: "Social Analytics",
    items: [
      { id: 'social-performance', icon: <BarChart2 className="w-5 h-5" />, label: "Performance" },
      { id: 'engagement', icon: <Share2 className="w-5 h-5" />, label: "Engagement" },
      { id: 'competitors', icon: <Target className="w-5 h-5" />, label: "Competitors" },
    ]
  },
  {
    title: "Trading & Markets",
    items: [
      { id: 'markets', icon: <TrendingUp className="w-5 h-5" />, label: "Markets" },
      { id: 'trading', icon: <LineChart className="w-5 h-5" />, label: "Trading" },
      { id: 'watchlist', icon: <ListChecks className="w-5 h-5" />, label: "Watchlist" },
    ]
  },
  {
    title: "Market Analysis",
    items: [
      { id: 'feed', icon: <Twitter className="w-5 h-5" />, label: "Social Feed" },
      { id: 'token-dashboard', icon: <Twitter className="w-5 h-5" />, label: "Token Dashboard" },
      { id: 'market-analytics', icon: <BarChart2 className="w-5 h-5" />, label: "Analytics" },
      { id: 'signals', icon: <Activity className="w-5 h-5" />, label: "Signals" },
      { id: 'sentiment', icon: <GaugeCircle className="w-5 h-5" />, label: "Sentiment" },
    ]
  },
  {
    title: "Portfolio",
    items: [
      { id: 'portfolio', icon: <Wallet className="w-5 h-5" />, label: "Portfolio" },
      { id: 'performance', icon: <PieChart className="w-5 h-5" />, label: "Performance" },
    ]
  },
  {
    title: "AI Tools",
    items: [
      { id: 'ai-writer', icon: <BrainCircuit className="w-5 h-5" />, label: "AI Writer" },
      { id: 'ai-insights', icon: <Zap className="w-5 h-5" />, label: "AI Insights" },
      { id: 'news-digest', icon: <Newspaper className="w-5 h-5" />, label: "News Digest" },
      { id: 'ai-strategies', icon: <Lightbulb className="w-5 h-5" />, label: "AI Strategies" },
    ]
  },
  {
    title: "Settings",
    items: [
      { id: 'settings', icon: <Settings className="w-5 h-5" />, label: "Settings" },
    ]
  }
];

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activePage, onPageChange }) => {
  return (
    <div className="h-screen bg-slate-800 flex-shrink-0 border-r border-slate-700 transition-all duration-300 group hover:w-64 w-20">
      {/* Logo */}
      <div className="mb-8 overflow-visible">
        <button className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-slate-700/50 mx-auto mt-4">
          <div className="w-10 h-10 flex items-center justify-center">
            <BrainCircuit className="w-full h-full text-teal-400" />
          </div>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex flex-col space-y-6 px-2 overflow-y-auto max-h-[calc(100vh-120px)]">
        {sidebarSections.map((section, index) => (
          <div key={index} className="flex flex-col space-y-2">
            {/* Section Title - Always present but opacity changes */}
            <div className="px-4 text-xs font-semibold text-slate-400 uppercase opacity-0 group-hover:opacity-100 h-4">
              {section.title}
            </div>
            
            {/* Section Items */}
            {section.items.map(item => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center p-2 rounded-lg transition-colors w-full
                  ${activePage === item.id
                    ? 'text-white bg-gradient-to-r from-teal-500 to-orange-500'
                    : 'text-slate-400 hover:text-teal-400 hover:bg-slate-700/50'
                  }`}
              >
                <div className="w-5 h-5 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="ml-3 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar; 