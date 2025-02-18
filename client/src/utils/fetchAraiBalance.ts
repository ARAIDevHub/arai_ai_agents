import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const ARAI_TOKEN_ADDRESS = 'ArCiFf7ismXqSgdWFddHhXe4AZyhn1JTfpZd3ft1pump';

export const fetchAraiBalance = async (heliusRpcUrl: string, connected: boolean, publicKey: PublicKey, signTransaction: any) => {
  if (heliusRpcUrl) {
    const connection = new Connection(heliusRpcUrl);
    console.log('[tokenLaunchForm] Helius RPC connection:', connection);
    if (connected && publicKey && signTransaction) {
      console.log('[tokenLaunchForm] Wallet is connected and ready to sign transactions');
      // Check the current wallet's balance of ARAI tokens
      const balance = await connection.getBalance(publicKey);
      console.log('[tokenLaunchForm] Current wallet balance:', balance);
      // Convert the balance to SOL
      const solBalance = balance / LAMPORTS_PER_SOL;
      console.log('[tokenLaunchForm] Current wallet balance in SOL:', solBalance);

      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: new PublicKey(ARAI_TOKEN_ADDRESS) }
        );

        if (tokenAccounts.value.length > 0) {
          const tokenAccount = tokenAccounts.value[0];
          const totalARAITokens = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
          console.log('Total ARAI tokens:', totalARAITokens);
          return totalARAITokens;
        } else {
          console.warn('No arai token accounts found for the specified mint address.');
          return null;
        }
      } catch (error) {
        console.error('Error fetching token account balance:', error);
        return null;
      }
    }
  }
  return null;
};


