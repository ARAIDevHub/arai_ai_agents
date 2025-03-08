import React, { useState } from 'react';
import { Edit, Layers } from 'lucide-react';
import ContentGeneration from '../components/socialFeedComponents/ContentGeneration';
import SeasonContent from '../components/socialFeedComponents/SeasonContent';
import { useAgent } from '../context/AgentContext';

const SocialFeedDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contentGeneration');
  const { state } = useAgent();

  const renderContent = () => {
    switch (activeTab) {
      case 'contentGeneration':
        return <ContentGeneration />;
      case 'seasonContent':
        return <SeasonContent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      <div className="border-b border-orange-500/30">
        <div className="flex p-4 gap-4">
          <button
            onClick={() => setActiveTab('contentGeneration')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === 'contentGeneration'
                ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white'
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            <Edit size={20} />
            Content Generation
          </button>
          <button
            onClick={() => setActiveTab('seasonContent')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              activeTab === 'seasonContent'
                ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white'
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            <Layers size={20} />
            Season Content
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default SocialFeedDashboard; 