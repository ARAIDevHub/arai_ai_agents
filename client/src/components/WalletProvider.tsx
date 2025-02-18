import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

const AppWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => {
    const url = import.meta.env.VITE_HELIUS_RPC_URL || clusterApiUrl(network);
    console.log('Using RPC endpoint:', url);

    if (!url.startsWith('https://')) {
      console.error('Invalid RPC endpoint:', url);
      return clusterApiUrl(network);
    }

    return url;
  }, [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default AppWalletProvider; 