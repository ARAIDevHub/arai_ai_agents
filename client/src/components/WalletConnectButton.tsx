import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface WalletConnectButtonProps {
  araiTokenBalance: number | null;
  formatNumberWithCommas: (number: number) => string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ araiTokenBalance, formatNumberWithCommas }) => {
  const { connected, connecting, disconnect } = useWallet();

  return (
    <div className="absolute top-6 left-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <WalletMultiButton 
            className="!bg-gradient-to-r !from-cyan-600 !to-orange-600 hover:!from-cyan-700 
                       hover:!to-orange-700 !transition-all !rounded-lg !py-3 !px-6 
                       !text-white !font-semibold !h-auto" 
          />
          {connecting && (
            <div className="absolute -bottom-6 left-0 text-yellow-400 text-sm">
              Connecting...
            </div>
          )}
          {connected && (
            <div className="w-2 h-2 rounded-full bg-green-400 absolute right-3 top-1/2 transform -translate-y-1/2"></div>
          )}
        </div>

        {connected && (
          <button 
            onClick={disconnect}
            className="px-6 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                     text-red-400 hover:text-red-300 hover:bg-slate-900/60 
                     transition-all font-semibold flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Disconnect
          </button>
        )}

        {connected && araiTokenBalance !== null && (
          <div className="ml-4 px-4 py-2 rounded-lg bg-slate-900/80 border border-orange-500/30 
                       text-white font-semibold flex items-center justify-center">
            ARAI Balance: {formatNumberWithCommas(araiTokenBalance)}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnectButton; 