import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, ChevronDown, ChevronUp, TrendingUp, Users, Wallet, BarChart, Eye, BrainCircuit, User, Star, BadgeCheck, X, MessageSquare, Bookmark } from 'lucide-react';

import TwitterStockStream from './TwitterStockStream';
import { Tweet, formatMetricCount } from '../types/Tweet';

interface EnhancedTweetProps {
  tweet: Tweet;
  onSelect: (tweet: Tweet) => void;
}

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
    ${active 
      ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-gray-100' 
      : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/50'}`}
  >
    {children}
  </button>
);

const MetricCard = ({ label, value, delta, icon }) => (
  <div className="bg-slate-900/80 p-4 rounded-lg border border-orange-500/30 shadow-xl h-full">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm text-gray-300 truncate">{label}</span>
    </div>
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-2xl font-bold text-gray-100 truncate">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      {delta !== undefined && (
        <span className={`text-sm ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {delta >= 0 ? '+' : ''}{delta}%
        </span>
      )}
    </div>
  </div>
);

const MindshareTab = ({ mindshareInfo = {} }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Mindshare"
        value={mindshareInfo.mindshare || 0}
        delta={mindshareInfo.mindshareDelta}
        icon={<TrendingUp size={20} className="text-cyan-600" />}
      />
      <MetricCard
        label="Market Cap"
        value={mindshareInfo.marketCap || 0}
        delta={mindshareInfo.marketCapDelta}
        icon={<BarChart size={20} className="text-orange-500" />}
      />
      <MetricCard
        label="Holders"
        value={mindshareInfo.holdersCount || 0}
        delta={mindshareInfo.holdersCountDelta}
        icon={<Users size={20} className="text-cyan-600" />}
      />
      <MetricCard
        label="24h Volume"
        value={mindshareInfo.volume24h || 0}
        delta={mindshareInfo.volume24hDelta}
        icon={<Wallet size={20} className="text-orange-500" />}
      />
    </div>

    <div className="bg-slate-900/80 rounded-lg p-4 border border-orange-500/30">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-400">Price</p>
          <p className="font-medium text-gray-100">${(mindshareInfo.price || 0).toFixed(4)}</p>
          <p className={`text-sm ${(mindshareInfo.priceDelta || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {(mindshareInfo.priceDelta || 0) >= 0 ? '+' : ''}{mindshareInfo.priceDelta || 0}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Liquidity</p>
          <p className="font-medium text-gray-100">${(mindshareInfo.liquidity || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Chain</p>
          <p className="font-medium text-gray-100">{mindshareInfo.chain || "Unknown"}</p>
          <p className="font-medium font-mono text-xs text-gray-400 truncate">
            {mindshareInfo.contractAddress || "0x..."}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const TwitterStatsTab = ({ mindshareInfo = {}, tweetInfo = {} }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        label="Smart Followers"
        value={mindshareInfo.smartFollowersCount || 0}
        icon={<User size={20} className="text-cyan-600" />}
      />
      <MetricCard
        label="Avg. Impressions"
        value={mindshareInfo.avgImpressions || 0}
        delta={mindshareInfo.avgImpressionsDelta}
        icon={<Eye size={20} className="text-orange-500" />}
      />
      <MetricCard
        label="Avg. Engagements"
        value={mindshareInfo.avgEngagements || 0}
        delta={mindshareInfo.avgEngagementsDelta}
        icon={<Heart size={20} className="text-cyan-600" />}
      />
    </div>

    <div className="bg-slate-900/80 rounded-lg p-4 border border-orange-500/30">
      <h3 className="text-gray-300 font-medium mb-4">Engagement Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-400">Smart Engagement Score</p>
          <p className="font-medium text-gray-100">{(tweetInfo.smartEngagementPoints || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Followers</p>
          <p className="font-medium text-gray-100">{(mindshareInfo.followersCount || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Smart Followers Ratio</p>
          <p className="font-medium text-gray-100">
            {((mindshareInfo.smartFollowersCount || 0) / (mindshareInfo.followersCount || 1) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  </div>
);

const AIAnalysisTab = ({ aiAnalysis = {} }) => (
  <div className="space-y-6">
    <div className="bg-slate-900/80 rounded-lg p-4 border border-orange-500/30">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit size={20} className="text-cyan-600" />
        <h3 className="text-gray-300 font-medium">AI Sentiment Analysis</h3>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">Content Quality</p>
          <div className="h-2 bg-slate-700 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-orange-600 rounded-full"
              style={{ width: `${aiAnalysis.contentQuality || 0}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-1">{aiAnalysis.contentQuality || 0}% Quality Score</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Key Insights</p>
          <ul className="space-y-2">
            {(aiAnalysis.insights || ["No AI analysis available"]).map((insight, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                <span className="text-cyan-600">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SimilarTab = ({ similar = [] }) => (
  <div className="space-y-4">
    {(similar.length > 0 ? similar : [
      { name: "No similar content available", score: 0 }
    ]).map((item, index) => (
      <div key={index} className="bg-slate-900/80 p-4 rounded-lg border border-orange-500/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-100 font-medium">{item.name}</span>
          <span className="text-sm text-cyan-600">{item.score}% Match</span>
        </div>
        {item.description && (
          <p className="text-sm text-gray-400">{item.description}</p>
        )}
      </div>
    ))}
  </div>
);

const NotableUsersTab = ({ engagements = [] }) => (
  <div className="space-y-4">
    {(engagements.length > 0 ? engagements : [
      { username: "No notable engagements yet", type: "none" }
    ]).map((engagement, index) => (
      <div key={index} className="bg-slate-900/80 p-4 rounded-lg border border-orange-500/30 flex items-center gap-4">
        <img
          src={engagement.profileImage || "/api/placeholder/48/48"}
          alt={engagement.username}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-100 truncate">{engagement.displayName || engagement.username}</span>
            {engagement.verified && (
              <BadgeCheck size={16} className="text-cyan-600" />
            )}
            <span className="text-gray-400">@{engagement.username}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {engagement.type === 'like' && (
              <Heart size={14} className="text-orange-500" />
            )}
            {engagement.type === 'retweet' && (
              <Repeat2 size={14} className="text-green-600" />
            )}
            {engagement.type === 'reply' && (
              <MessageCircle size={14} className="text-cyan-600" />
            )}
            <span className="text-sm text-gray-400">{engagement.timestamp || ''}</span>
          </div>
          {engagement.metrics && (
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-orange-500" />
                <span className="text-sm text-gray-300">{engagement.metrics.influence || 0} Influence</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} className="text-cyan-600" />
                <span className="text-sm text-gray-300">{(engagement.metrics.followers || 0).toLocaleString()} Followers</span>
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

const EnhancedTweet: React.FC<EnhancedTweetProps> = ({ tweet, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('mindshare');

  const handleAnalyticsToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-3xl w-full mx-auto border border-orange-500/30 rounded-lg bg-slate-900/80 shadow-xl relative">
      <button 
        onClick={() => onSelect(tweet)}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-orange-400"
      >
        <X className="w-5 h-5" />
      </button>
      
      {/* Main Tweet Section */}
      <div className="p-4 border-b border-orange-500/30">
        <div className="flex gap-4">
          <img
            src={tweet.author.profileImageUrl}
            alt="Avatar"
            className="w-12 h-12 rounded-full flex-shrink-0"
          />
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-gray-100 truncate">
                {tweet.author.name}
              </span>
              <span className="text-gray-400 truncate">@{tweet.author.username}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400 hover:text-orange-300">
                {new Date(tweet.createdAt).toLocaleTimeString()}
              </span>
            </div>
            
            <p className="text-gray-100 mb-3 break-words overflow-hidden">
              {tweet.text}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-3 text-slate-400">
              <button className="flex items-center hover:text-cyan-600 group">
                <div className="p-2 rounded-full group-hover:bg-cyan-600/20">
                  <MessageCircle size={18} />
                </div>
                <span className="ml-1 text-sm">{formatMetricCount(tweet.commentCount || tweet.metrics?.replies || 0)}</span>
              </button>
              <button className="flex items-center hover:text-green-600 group">
                <div className="p-2 rounded-full group-hover:bg-green-600/20">
                  <Repeat2 size={18} />
                </div>
                <span className="ml-1 text-sm">{formatMetricCount(tweet.retweetCount || tweet.metrics?.retweets || 0)}</span>
              </button>
              <button className="flex items-center hover:text-blue-600 group">
                <div className="p-2 rounded-full group-hover:bg-blue-600/20">
                  <MessageSquare size={18} />
                </div>
                <span className="ml-1 text-sm">{formatMetricCount(tweet.metrics?.quotes || 0)}</span>
              </button>
              <button className="flex items-center hover:text-red-600 group">
                <div className="p-2 rounded-full group-hover:bg-red-600/20">
                  <Heart size={18} />
                </div>
                <span className="ml-1 text-sm">{formatMetricCount(tweet.likeCount || tweet.metrics?.likes || 0)}</span>
              </button>
              <button className="flex items-center hover:text-yellow-600 group">
                <div className="p-2 rounded-full group-hover:bg-yellow-600/20">
                  <Bookmark size={18} />
                </div>
                <span className="ml-1 text-sm">{formatMetricCount(tweet.metrics?.bookmarks || 0)}</span>
              </button>
              <button className="flex items-center hover:text-cyan-600 group" onClick={() => onSelect(tweet)}>
                <div className="p-2 rounded-full group-hover:bg-cyan-600/20">
                  <Eye size={18} />
                </div>
                <span className="ml-1 text-sm">{formatMetricCount(tweet.metrics?.impressions || 0)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Toggle */}
      <button 
        className="w-full p-4 flex items-center justify-between text-gray-300 hover:bg-slate-800/50"
        onClick={handleAnalyticsToggle}
      >
        <span className="font-medium">Analytics & Mindshare Data</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Expanded Analytics Section */}
      {isExpanded && (
        <div className="p-4 bg-slate-800/50 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <TabButton 
              active={activeTab === 'mindshare'} 
              onClick={() => setActiveTab('mindshare')}
            >
              Mindshare
            </TabButton>
            <TabButton 
              active={activeTab === 'twitter'} 
              onClick={() => setActiveTab('twitter')}
            >
              Twitter Stats
            </TabButton>
            <TabButton 
              active={activeTab === 'ai'} 
              onClick={() => setActiveTab('ai')}
            >
              AI Analysis
            </TabButton>
            <TabButton 
              active={activeTab === 'similar'} 
              onClick={() => setActiveTab('similar')}
            >
              Similar
            </TabButton>
            <TabButton 
              active={activeTab === 'notable'} 
              onClick={() => setActiveTab('notable')}
            >
              Notable Users
            </TabButton>
          </div>

          {/* Tab Content */}
          {activeTab === 'mindshare' && <MindshareTab mindshareInfo={tweet.metrics} />}
          {activeTab === 'twitter' && <TwitterStatsTab mindshareInfo={tweet.metrics} tweetInfo={tweet} />}
          {activeTab === 'ai' && <AIAnalysisTab aiAnalysis={tweet.aiAnalysis} />}
          {activeTab === 'similar' && <SimilarTab similar={tweet.similar} />}
          {activeTab === 'notable' && <NotableUsersTab engagements={tweet.engagements} />}
        </div>
      )}
    </div>
  );
};

export default EnhancedTweet;