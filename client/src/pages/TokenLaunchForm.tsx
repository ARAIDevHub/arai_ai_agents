import React, { useState, useMemo, useEffect } from 'react';
// import { Wallet } from 'lucide-react';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { DEFAULT_DECIMALS, PumpFunSDK } from "pumpdotfun-sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import { saveAs } from 'file-saver';

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

interface TokenLaunchFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

interface Payload {
  captchaToken?: string;
  vanityKeyCaptchaToken?: string;
  metadataUri?: string;
  name: string;
  ticker: string;
  description: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  showName: boolean;
  image?: string;
}

const TokenLaunchForm: React.FC<TokenLaunchFormProps> = ({ formData, setFormData }) => {
  const { connection } = useConnection();
  const { connected, publicKey, signTransaction, signAllTransactions } = useWallet();
  const SLIPPAGE_BASIS_POINTS = 100n;

  // Add logging for wallet connection state changes
  useEffect(() => {
    console.log('Wallet connection state:', {
      connected,
      publicKey: publicKey?.toString(),
      hasSignTransaction: !!signTransaction,
      hasSignAllTransactions: !!signAllTransactions
    });
  }, [connected, publicKey, signTransaction, signAllTransactions]);

  const initializePumpFunSDK = () => {
    console.log('Initializing PumpFun SDK...');
    if (!publicKey || !signTransaction || !signAllTransactions) {
      console.error('SDK Init Error: Wallet not connected or missing signing capabilities');
      throw new Error("Wallet not connected");
    }

    const phantomWallet = {
      publicKey: publicKey,
      signTransaction: signTransaction,
      signAllTransactions: signAllTransactions,
    };
    console.log('Created phantom wallet adapter:', {
      publicKey: phantomWallet.publicKey.toString(),
      hasSigners: !!phantomWallet.signTransaction && !!phantomWallet.signAllTransactions
    });

    const provider = new AnchorProvider(
      connection,
      phantomWallet,
      { commitment: "finalized" }
    );
    console.log('Created AnchorProvider with connection:', connection.rpcEndpoint);

    const sdk = new PumpFunSDK(provider);
    console.log('PumpFun SDK initialized successfully');
    return sdk;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!connected || !publicKey || !signTransaction || !signAllTransactions) {
      console.error('Submit blocked: Wallet not connected', {
        connected,
        publicKey: publicKey?.toString(),
        hasSignTransaction: !!signTransaction,
        hasSignAllTransactions: !!signAllTransactions
      });
      alert('Please connect your wallet first');
      return;
    }

    try {
      console.log('Starting token creation process...');
      const sdk = initializePumpFunSDK();
      console.log('SDK initialized:', {
        connection: connection.rpcEndpoint,
        wallet: publicKey.toString()
      });

      const mint = Keypair.generate();
      console.log('Generated mint keypair:', {
        publicKey: mint.publicKey.toString(),
        secretKey: mint.secretKey.toString()
      });

      // Create blob directly from the file
      let fileBlob;
      if (formData.logo) {
        const arrayBuffer = await formData.logo.arrayBuffer();
        fileBlob = new Blob([arrayBuffer], { type: formData.logo.type });
        console.log('Created file blob:', {
          type: formData.logo.type,
          size: fileBlob.size,
          originalFileName: formData.logo.name
        });
      }

      const tokenMetadata = {
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        description: formData.tokenDescription,
        file: fileBlob,
      };
      console.log('Prepared token metadata:', {
        ...tokenMetadata,
        file: fileBlob ? `Blob present (${fileBlob.size} bytes)` : 'No file'
      });

      const solAmount = BigInt(parseFloat(formData.solAmount) * LAMPORTS_PER_SOL);
      console.log('Calculated SOL amount:', {
        input: formData.solAmount,
        lamports: solAmount.toString(),
        inSol: parseFloat(formData.solAmount)
      });
      
      // Get the create instructions
      console.log('Getting create instructions...');
      const createTx = await sdk.getCreateInstructions(
        publicKey,
        tokenMetadata.name,
        tokenMetadata.symbol,
        tokenMetadata.description,
        mint
      );
      console.log('Create transaction obtained:', {
        instructions: createTx.instructions.length,
        signers: createTx.signers?.length
      });

      // Get the buy instructions
      console.log('Getting buy instructions...');
      const buyTx = await sdk.getBuyInstructionsBySolAmount(
        publicKey,
        mint.publicKey,
        solAmount,
        SLIPPAGE_BASIS_POINTS
      );
      console.log('Buy transaction obtained:', {
        instructions: buyTx.instructions.length,
        signers: buyTx.signers?.length
      });

      // Combine transactions
      const transactions = [createTx, buyTx];
      console.log('Combined transactions:', {
        count: transactions.length,
        types: ['create', 'buy']
      });
      
      // Sign all transactions with Phantom
      console.log('Requesting wallet signature for transactions...');
      const signedTransactions = await signAllTransactions(transactions);
      console.log('Transactions signed by wallet:', {
        count: signedTransactions.length,
        signatures: signedTransactions.map(tx => tx.signatures.map(sig => sig.publicKey.toString()))
      });

      // Send signed transactions
      for (let i = 0; i < signedTransactions.length; i++) {
        const tx = signedTransactions[i];
        console.log(`Sending transaction ${i + 1}...`);
        const sig = await connection.sendRawTransaction(tx.serialize());
        console.log(`Transaction ${i + 1} sent:`, sig);
        console.log(`Confirming transaction ${i + 1}...`);
        await connection.confirmTransaction(sig, 'confirmed');
        console.log(`Transaction ${i + 1} confirmed:`, {
          signature: sig,
          link: `https://solscan.io/tx/${sig}`
        });
      }

      console.log('All transactions completed successfully');
      const tokenUrl = `https://pump.fun/${mint.publicKey.toBase58()}`;
      console.log('Token created:', {
        mint: mint.publicKey.toString(),
        url: tokenUrl
      });
      alert(`Token created successfully! View at: ${tokenUrl}`);

      // Get and log the bonding curve account
      const boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
      console.log("Bonding curve account:", {
        mint: mint.publicKey.toString(),
        account: boundingCurveAccount
      });

    } catch (error) {
      console.error("Error creating token:", {
        error,
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      });
      alert(`Error creating token: ${error.message}`);
    }
  };

  // Log form data changes
  // useEffect(() => {
  //   console.log('Form data updated:', formData);
  // }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modify the handleLogoUpload function
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Validate file type
      if (!file.type.match(/^image\/(png|jpeg|jpg|gif|webp)$/)) {
        alert('Please upload an image file (PNG, JPEG, JPG, GIF or WEBP)');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Update form data with just the file
      setFormData(prev => ({
        ...prev,
        logo: file
      }));

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewElement = document.getElementById('logo-preview') as HTMLImageElement;
        if (previewElement && e.target?.result) {
          previewElement.src = e.target.result as string;
          previewElement.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  // Update the WalletConnectButton component
  const WalletConnectButton = () => {
    const { connected, connecting, disconnect } = useWallet();
    
    return (
      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-3">
          {/* Style the WalletMultiButton wrapper */}
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

          {/* Disconnect button next to connect button */}
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
        </div>
      </div>
    );
  };

  const addWalletRow = () => {
    if (formData.walletRows.length < 20) {
      setFormData(prev => ({
        ...prev,
        walletRows: [...prev.walletRows, {
          id: String(prev.walletRows.length + 1),
          privateKey: '',
          address: '',
          solBalance: '-',
          estVolume: '-',
          buyAmount: ''
        }]
      }));
    }
  };

  const removeWalletRow = (id: string) => {
    setFormData(prev => ({
      ...prev,
      walletRows: prev.walletRows.filter(row => row.id !== id)
    }));
  };

  return (
    <form onSubmit={handleSubmit} onChange={handleChange} className="w-full p-6 overflow-visible">
      <WalletConnectButton />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600" />
          <h2 className="text-2xl font-bold text-white">Pump Launch and Buy</h2>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-lg leading-relaxed">
          During the Pump.fun launch, other addresses simultaneously perform token buy-in operations, 
          effectively simplifying the trading process and accelerating market participation, 
          giving you an early advantage and potential profits sooner.
        </p>

        {/* Main Form Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-lg text-gray-100 mb-2">
                Token Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="tokenName"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Enter token name"
                value={formData.tokenName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="flex items-center text-lg text-gray-100 mb-2">
                Token Symbol
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="tokenSymbol"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Enter token symbol"
                value={formData.tokenSymbol}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="flex items-center text-lg text-gray-100 mb-2">
                Token Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="tokenDescription"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 h-32"
                placeholder="Enter Token Description"
                value={formData.tokenDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <label className="flex items-center text-lg text-gray-100 mb-2">
              Token Logo
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div 
              className="border-2 border-dashed border-orange-500/30 rounded-lg p-8 
                         bg-slate-900/80 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              <div className="w-32 h-32 border-2 border-dashed border-orange-500/30 rounded-lg 
                            flex items-center justify-center mb-4 relative">
                <img 
                  id="logo-preview"
                  alt="Token Logo Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  style={{ display: 'none' }}
                />
                <span className="text-4xl text-orange-400">+</span>
              </div>
              <p className="text-gray-100 mb-1">Click to Upload</p>
              <p className="text-gray-400">Supported formats: PNG/GIF/JPG/WEBP and JPEG</p>
              <p className="text-gray-400">Recommended size: 1000×1000 pixels</p>
              <p className="text-gray-400 mt-4 text-center">
                If it meets the above requirements, it can be better displayed on various platforms and applications.
              </p>
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleLogoUpload}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-100 mb-2">
            Enter the amount of SOL you want to buy
          </label>
          <div className="relative">
            <input
              type="text"
              name="solAmount"
              className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 
                       text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="Minimum 0.00000001 SOL/Enter total"
              value={formData.solAmount}
              onChange={handleChange}
            />
            <span className="absolute right-3 top-2 text-gray-400">SOL</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-md border border-orange-500/30">
          <div>
            <p className="text-sm text-gray-100">Estimated Receive</p>
            <p className="font-medium text-gray-100">-- Token</p>
          </div>
          <div>
            <p className="text-sm text-gray-100">Estimated Cost</p>
            <p className="font-medium text-gray-100">-- SOL</p>
          </div>
          <div>
            <p className="text-sm text-gray-100">Current Balance</p>
            <p className="font-medium text-gray-100">-- SOL</p>
          </div>
        </div>

        {/* Social Links Section */}
        {formData.showSocialLinks && (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-lg text-gray-100 mb-2 block">
                  Website:
                </label>
                <input
                  type="text"
                  name="website"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Enter Your Website URL"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="text-lg text-gray-100 mb-2 block">
                  Telegram:
                </label>
                <input
                  type="text"
                  name="telegram"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Enter Your Telegram Link"
                  value={formData.telegram}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="text-lg text-gray-100 mb-2 block">
                X:
              </label>
              <input
                type="text"
                name="xLink"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Enter Your X Link"
                value={formData.xLink}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-600 to-orange-600 
                    hover:from-cyan-700 hover:to-orange-700 text-white py-3 rounded-md 
                    transition-colors"
        >
          Pump Launch and Buy
        </button>
      </div>
    </form>
  );
};

// Create a wrapper component to provide wallet context
const TokenLaunchFormWithWallet: React.FC<TokenLaunchFormProps> = (props) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => {
    const url = clusterApiUrl(network);
    // Validate endpoint URL
    if (!url.startsWith('https://')) {
      throw new Error('Invalid RPC endpoint');
    }
    return url;
  }, [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <TokenLaunchForm {...props} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default TokenLaunchFormWithWallet;