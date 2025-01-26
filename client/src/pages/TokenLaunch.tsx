import React, { useState } from 'react';
import TokenLaunchForm from './TokenLaunchForm';
import TokenLaunchFlow from './TokenLaunchFlow';
import { LayoutGrid, GitGraph } from 'lucide-react';

interface WalletRow {
  id: string;
  privateKey: string;
  address: string;
  solBalance: string;
  estVolume: string;
  buyAmount: string;
}

interface FormData {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  solAmount: string;
  logo: File | null;
  website?: string;
  xLink?: string;
  telegram?: string;
  walletRows: WalletRow[];
  showAdvanced: boolean;
  mevTip: '0.00003' | '0.0001' | '0.0003';
  blockEngine: string;
  showSocialLinks: boolean;
}

const TokenLaunch = () => {
  const [viewMode, setViewMode] = useState<'form' | 'flow'>('form');
  const [formData, setFormData] = useState<FormData>({
    tokenName: '',
    tokenSymbol: '',
    tokenDescription: '',
    solAmount: '',
    logo: null,
    website: '',
    xLink: '',
    telegram: '',
    walletRows: [{ 
      id: '1',
      privateKey: '',
      address: '',
      solBalance: '-',
      estVolume: '-',
      buyAmount: ''
    }],
    showAdvanced: false,
    mevTip: '0.00003',
    blockEngine: 'https://mainnet.block-engine.jito.wtf',
    showSocialLinks: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      <div className="max-w-7xl mx-auto relative">
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg backdrop-blur">
          <button
            onClick={() => setViewMode('form')}
            className={`p-2 rounded-md transition-all flex items-center gap-2 ${
              viewMode === 'form'
                ? 'bg-orange-500/20 text-orange-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            title="Form View"
          >
            <LayoutGrid size={20} />
            <span className="text-sm">Form</span>
          </button>
          <div className="w-px h-6 bg-gray-700" />
          <button
            onClick={() => setViewMode('flow')}
            className={`p-2 rounded-md transition-all flex items-center gap-2 ${
              viewMode === 'flow'
                ? 'bg-orange-500/20 text-orange-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            title="Flow View"
          >
            <GitGraph size={20} />
            <span className="text-sm">Flow</span>
          </button>
        </div>

        <div className="w-full pt-20 pb-8">
          {viewMode === 'form' ? (
            <TokenLaunchForm formData={formData} setFormData={setFormData} />
          ) : (
            <TokenLaunchFlow formData={formData} setFormData={setFormData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenLaunch;