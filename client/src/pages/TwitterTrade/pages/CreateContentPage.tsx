import React from 'react';
import { PenSquare, Image, Link, Calendar, Send } from 'lucide-react';

const CreateContentPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create Content</h1>
        <p className="text-slate-400">Create and schedule your social media content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="mb-4">
              <textarea 
                className="w-full h-32 bg-slate-700 rounded-lg p-4 text-white resize-none"
                placeholder="What's on your mind?"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700">
                <Link className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700">
                <Calendar className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI Suggestions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400">Try adding trending hashtags: #crypto #trading</p>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400">Suggested improvement: Add a call to action</p>
            </div>
          </div>
          
          <button className="mt-6 w-full bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContentPage; 