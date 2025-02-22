import React, { useState } from 'react';
import LeftSidebar from './components/LeftSidebar';
import {
  // Social Management
  DashboardPage,
  AccountsPage,
  
  // Content
  CreateContentPage,
  ContentPlannerPage,
  ContentInboxPage,
  PostHistoryPage,
  
  // Social Analytics
  SocialPerformancePage,
  EngagementPage,
  CompetitorsPage,
  
  // Trading & Markets
  MarketsPage,
  TradingPage,
  WatchlistPage,
  
  // Market Analysis
  SocialFeedPage,
  CryptoTwitterDashboard,
  MarketAnalyticsPage,
  SignalsPage,
  SentimentPage,
  
  // Portfolio
  PortfolioPage,
  PerformancePage,
  
  // AI Tools
  AIWriterPage,
  AIInsightsPage,
  NewsDigestPage,
  AIStrategiesPage,
  
  // Settings
  SettingsPage,
} from './pages';

const AISocialManager: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      // Social Management
      case 'dashboard':
        return <DashboardPage />;
      case 'accounts':
        return <AccountsPage />;
      
      // Content
      case 'create':
        return <CreateContentPage />;
      case 'planner':
        return <ContentPlannerPage />;
      case 'inbox':
        return <ContentInboxPage />;
      case 'history':
        return <PostHistoryPage />;
      
      // Social Analytics
      case 'social-performance':
        return <SocialPerformancePage />;
      case 'engagement':
        return <EngagementPage />;
      case 'competitors':
        return <CompetitorsPage />;
      
      // Trading & Markets
      case 'markets':
        return <MarketsPage />;
      case 'trading':
        return <TradingPage />;
      case 'watchlist':
        return <WatchlistPage />;
      
      // Market Analysis
      case 'feed':
        return <SocialFeedPage />;
      case 'token-dashboard':
        return <CryptoTwitterDashboard />;
      case 'market-analytics':
        return <MarketAnalyticsPage />;
      case 'signals':
        return <SignalsPage />;
      case 'sentiment':
        return <SentimentPage />;
      
      // Portfolio
      case 'portfolio':
        return <PortfolioPage />;
      case 'performance':
        return <PerformancePage />;
      
      // AI Tools
      case 'ai-writer':
        return <AIWriterPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'news-digest':
        return <NewsDigestPage />;
      case 'ai-strategies':
        return <AIStrategiesPage />;
      
      // Settings
      case 'settings':
        return <SettingsPage />;
      
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-visible">
      <LeftSidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default AISocialManager;