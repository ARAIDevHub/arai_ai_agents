import React from 'react';
import { MessageSquare, RefreshCw, Plus, Settings } from 'lucide-react';

interface StreamPost {
  handle: string;
  content: string;
  time: string;
  metrics: {
    replies: number;
    retweets: number;
    likes: number;
  };
}

interface StreamColumn {
  title: string;
  posts: StreamPost[];
}

const StreamingColumns = () => {
  const columns: StreamColumn[] = [
    {
      title: "Posts",
      posts: [
        {
          handle: "@user1",
          content: "Just published my latest market analysis",
          time: "2m ago",
          metrics: { replies: 12, retweets: 34, likes: 156 }
        }
      ]
    },
    {
      title: "KOL Comments",
      posts: [
        {
          handle: "@influencer",
          content: "Here's my take on the recent market movements",
          time: "5m ago",
          metrics: { replies: 45, retweets: 89, likes: 432 }
        }
      ]
    },
    {
      title: "Reply to Comments",
      posts: [
        {
          handle: "@community",
          content: "Great insights! What's your view on...",
          time: "3m ago",
          metrics: { replies: 8, retweets: 12, likes: 67 }
        }
      ]
    },
    {
      title: "Reply to Mentions",
      posts: [
        {
          handle: "@mention",
          content: "Thanks for the mention! Let me clarify...",
          time: "1m ago",
          metrics: { replies: 5, retweets: 8, likes: 42 }
        }
      ]
    }
  ];

  return (
    <div className="h-full bg-slate-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-white">Social Streams</h1>
          <button className="bg-slate-800 text-teal-400 px-4 py-1 rounded-md hover:bg-slate-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Column
          </button>
          <button className="bg-slate-800 text-teal-400 px-4 py-1 rounded-md hover:bg-slate-700 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Configure
          </button>
          <RefreshCw className="w-5 h-5 text-teal-400 cursor-pointer hover:text-orange-400" />
        </div>
        <div className="flex items-center space-x-4 text-slate-300">
          <span>Live Updates</span>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-4 gap-4 h-[calc(100%-4rem)] overflow-hidden">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col bg-slate-800 rounded-lg border border-slate-700">
            {/* Column Header */}
            <div className="p-3 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <h2 className="font-semibold text-white">{column.title}</h2>
              </div>
              <span className="text-sm text-slate-400">0/{column.posts.length}</span>
            </div>

            {/* Column Content */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {column.posts.map((post, postIndex) => (
                <div key={postIndex} className="bg-slate-900/50 p-3 rounded-lg hover:bg-slate-900/80 transition-colors">
                  <div className="font-semibold text-teal-400 mb-1">{post.handle}</div>
                  <div className="text-slate-300 text-sm mb-2">{post.content}</div>
                  <div className="flex justify-between text-slate-500 text-xs">
                    <span>{post.time}</span>
                    <div className="flex space-x-3">
                      <span>💬 {post.metrics.replies}</span>
                      <span>🔄 {post.metrics.retweets}</span>
                      <span>❤️ {post.metrics.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamingColumns; 