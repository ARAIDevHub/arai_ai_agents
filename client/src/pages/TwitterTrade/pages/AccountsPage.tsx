import React from 'react';
import { User, Twitter, Instagram, Facebook } from 'lucide-react';

const AccountsPage: React.FC = () => {
  const accounts = [
    {
      name: 'Crypto Insights',
      platforms: [
        { type: 'Twitter', followers: '45.2K', engagement: '2.8%', icon: <Twitter className="w-5 h-5" /> },
        { type: 'Instagram', followers: '32.1K', engagement: '3.2%', icon: <Instagram className="w-5 h-5" /> }
      ]
    },
    {
      name: 'Market Analysis',
      platforms: [
        { type: 'Twitter', followers: '28.9K', engagement: '3.1%', icon: <Twitter className="w-5 h-5" /> },
        { type: 'Facebook', followers: '15.4K', engagement: '1.9%', icon: <Facebook className="w-5 h-5" /> }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Account Management</h1>
        <p className="text-slate-400">Manage your social media accounts and connections</p>
      </div>

      {/* Add Account Button */}
      <button className="mb-8 bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <User className="w-5 h-5" />
        Add New Account
      </button>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((account, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{account.name}</h2>
            <div className="space-y-4">
              {account.platforms.map((platform, pIndex) => (
                <div key={pIndex} className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400">{platform.icon}</div>
                    <div>
                      <p className="text-white">{platform.type}</p>
                      <p className="text-sm text-slate-400">{platform.followers} followers</p>
                    </div>
                  </div>
                  <div className="text-emerald-400">{platform.engagement}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsPage; 