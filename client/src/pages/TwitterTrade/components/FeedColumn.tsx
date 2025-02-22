import React from 'react';
import { Settings2, X } from 'lucide-react';
import { Tweet } from '../types/Tweet';

interface FeedColumnProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const FeedColumn: React.FC<FeedColumnProps> = ({ title, onClose, children }) => {
  return (
    <div className="h-full flex flex-col min-w-[400px] max-w-[600px] border-r border-slate-700 bg-slate-800/50">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium">{title}</span>
          <div className="flex items-center space-x-2">
            <button className="text-slate-400 hover:text-white">
              <Settings2 className="w-4 h-4" />
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FeedColumn; 