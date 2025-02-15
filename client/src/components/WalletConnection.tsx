import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import WalletConnectButton from './WalletConnectButton';

const araiTokenAddress = "ArCiFf7ismXqSgdWFddHhXe4AZyhn1JTfpZd3ft1pump";

interface WalletConnectionProps {
  heliusRpcUrl: string;
  setAraiTokenBalance: React.Dispatch<React.SetStateAction<number | null>>;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ heliusRpcUrl, setAraiTokenBalance }) => {
  const { connected, publicKey, signTransaction } = useWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      if (heliusRpcUrl && connected && publicKey && signTransaction) {
        const connection = new Connection(heliusRpcUrl);
        try {
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { mint: new PublicKey(araiTokenAddress) }
          );

          if (tokenAccounts.value.length > 0) {
            const tokenAccount = tokenAccounts.value[0];
            const totalARAITokens = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
            setAraiTokenBalance(totalARAITokens || 0);
          } else {
            setAraiTokenBalance(0);
          }
        } catch (error) {
          console.error('Error fetching token account balance:', error);
          setAraiTokenBalance(0);
        }
      }
    };

    fetchBalance();
  }, [heliusRpcUrl, connected, publicKey, signTransaction, setAraiTokenBalance]);

  return (
    <div>
      <WalletConnectButton araiTokenBalance={setAraiTokenBalance} formatNumberWithCommas={formatNumberWithCommas} />
    </div>
  );
};

const formatNumberWithCommas = (number: number): string => {
  return new Intl.NumberFormat('en-US').format(number);
};

export default WalletConnection; 