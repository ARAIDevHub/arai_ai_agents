import React from 'react';
import { Bell, Lock, Wallet, Globe, Zap, User, Sliders, Shield, Database, RefreshCw } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const settingSections = [
    {
      title: 'Account Settings',
      icon: <User className="w-5 h-5" />,
      settings: [
        { name: 'Profile Information', description: 'Update your account details and preferences' },
        { name: 'Email Notifications', description: 'Manage your email notification preferences' },
        { name: 'Password & Security', description: 'Update your password and security settings' }
      ]
    },
    {
      title: 'Trading Settings',
      icon: <Sliders className="w-5 h-5" />,
      settings: [
        { name: 'Default Trading Pairs', description: 'Set your preferred trading pairs' },
        { name: 'Risk Management', description: 'Configure position sizes and risk parameters' },
        { name: 'Auto-trading Settings', description: 'Manage automated trading preferences' }
      ]
    },
    {
      title: 'API Connections',
      icon: <Database className="w-5 h-5" />,
      settings: [
        { name: 'Exchange APIs', description: 'Manage your exchange API connections' },
        { name: 'Social Media APIs', description: 'Configure social media platform access' },
        { name: 'Data Provider APIs', description: 'Set up market data connections' }
      ]
    }
  ];

  const quickSettings = [
    { name: 'Notifications', icon: <Bell className="w-5 h-5" />, status: 'enabled' },
    { name: 'Two-Factor Auth', icon: <Lock className="w-5 h-5" />, status: 'enabled' },
    { name: 'Auto-Trading', icon: <RefreshCw className="w-5 h-5" />, status: 'disabled' },
    { name: 'Data Sync', icon: <Database className="w-5 h-5" />, status: 'enabled' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {settingSections.map((section, index) => (
            <div key={index} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-teal-400">{section.icon}</div>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium mb-1">{setting.name}</h3>
                        <p className="text-slate-400 text-sm">{setting.description}</p>
                      </div>
                      <button className="text-slate-400 hover:text-teal-400">
                        <Sliders className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Settings */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Settings</h2>
            <div className="space-y-3">
              {quickSettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-slate-400">{setting.icon}</div>
                    <span className="text-slate-300">{setting.name}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={setting.status === 'enabled'} readOnly />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">API Status</span>
                <span className="text-emerald-400">Connected</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Data Sync</span>
                <span className="text-emerald-400">Up to date</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Last Backup</span>
                <span className="text-slate-400">2 hours ago</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Support</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Documentation
              </button>
              <button className="w-full text-left p-3 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 