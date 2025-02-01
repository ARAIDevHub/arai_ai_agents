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
import { createToken } from '../api/agentsAPI';

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
  image: File | null;
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

    const provider = new AnchorProvider(
      connection,
      phantomWallet,
      { commitment: "finalized" }
    );

    const sdk = new PumpFunSDK(provider);
    
    return sdk;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    console.log('Starting token creation process...');
    console.log('Form data being submitted:', formData);

    try {
      // Create token parameters from form data
      const tokenParams = {
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        description: formData.tokenDescription,
        // Convert SOL amount to unit price (1 SOL = 1 billion lamports)
        unitPrice: parseFloat(formData.solAmount) * 1000000000,
        unitLimit: 1000000, // Default supply limit
        initialBuyAmount: parseFloat(formData.solAmount),
        // Optional social links
        website: formData.website,
        xLink: formData.xLink,
        telegram: formData.telegram,
        // Include the image if present
        image: formData.image
      };

      console.log('Calling createToken API endpoint with params:', tokenParams);
      const result = await createToken(tokenParams);
      console.log('Token creation API response:', result);
      
      if (result.success) {
        console.log("Token creation successful:", result.output);
        alert('Token created successfully! Check console for details.');
      } else {
        console.error("Token creation failed:", result.error);
        throw new Error(result.error || 'Token creation failed');
      }

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(`Error creating token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Log form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modify the handleImageUpload function
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        image: file
      }));

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewElement = document.getElementById('image-preview') as HTMLImageElement;
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
              Token image
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div 
              className="border-2 border-dashed border-orange-500/30 rounded-lg p-8 
                         bg-slate-900/80 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <div className="w-32 h-32 border-2 border-dashed border-orange-500/30 rounded-lg 
                            flex items-center justify-center mb-4 relative">
                <img 
                  id="image-preview"
                  alt="Token image Preview"
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
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                onChange={handleImageUpload}
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
              onChange={(e) => {
                // Only allow numbers and decimal point
                const value = e.target.value.replace(/[^0-9.]/g, '');
                // Prevent multiple decimal points
                const decimalCount = (value.match(/\./g) || []).length;
                if (decimalCount <= 1) {
                  setFormData(prev => ({
                    ...prev,
                    solAmount: value
                  }));
                }
              }}
              pattern="[0-9]*[.]?[0-9]*"
              inputMode="decimal"
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
          Launch Pumpfun Token
        </button>
      </div>
    </form>
  );
};

// Create a wrapper component to provide wallet context
const TokenLaunchFormWithWallet: React.FC<TokenLaunchFormProps> = (props) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => {
    // Use the HELIUS_RPC_URL from environment variables
    const url = import.meta.env.VITE_HELIUS_RPC_URL || clusterApiUrl(network);
    console.log('Using RPC endpoint:', url);
    
    // Validate endpoint URL
    if (!url.startsWith('https://')) {
      console.error('Invalid RPC endpoint:', url);
      return clusterApiUrl(network); // Fallback to default
    }
    
    console.log('Using RPC endpoint:', url);
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