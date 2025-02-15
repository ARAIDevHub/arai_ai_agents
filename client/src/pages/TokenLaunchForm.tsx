import React, { useState, useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { createToken } from '../api/tokenAPI';
import { encryptData } from '../utils/encryptionUtils';
import bs58 from 'bs58'; // Import bs58 for base58 decoding
import WalletRow from '../components/tokenCreationComponents/WalletRow';
import { TokenLaunchFormProps } from '../interfaces/TokenLaunchFormProps';
import WalletConnectButton from '../components/WalletConnectButton';
import AgentSelection from '../components/AgentSelection';
import useCharacters from '../hooks/useCharacters'; // Import useCharacters
import { useAgent } from '../context/AgentContext'; // Import the useAgent hook
import { CheckCircle } from 'lucide-react'; // Import the checkmark icon
import { fetchAraiBalance } from '../utils/fetchAraiBalance';
import { addWalletRow, removeWalletRow } from '../TokenLaunchUtils/walletRowUtils';



const TokenLaunchForm: React.FC<TokenLaunchFormProps> = ({ formData, setFormData }) => {
  const [araiTokenBalance, setAraiTokenBalance] = useState<number | null>(null);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(-1);
  const { characters } = useCharacters(); // Use the hook to get characters
  const [agentImage, setAgentImage] = useState<string | null>(null); // State for agent's image
  const { dispatch } = useAgent(); // Use the dispatch function from the context
  const [selectedImage, setSelectedImage] = useState<'agent' | 'uploaded' | null>(null); // Track selected image
  const [tokenInfo, setTokenInfo] = useState<{
    mintAddress: string;
    url: string;
    txSignature: string;
  } | null>(null);

  const heliusRpcUrl = import.meta.env.VITE_HELIUS_RPC_URL || "";
  console.log('[tokenLaunchForm] Helius RPC URL:', heliusRpcUrl);
  const { connected, publicKey, signTransaction, signAllTransactions } = useWallet();

  // Add logging for wallet connection state changes
  useEffect(() => {
    console.log('Wallet connection state:', {
      connected,
      publicKey: publicKey?.toString(),
      hasSignTransaction: !!signTransaction,
      hasSignAllTransactions: !!signAllTransactions
    });
  }, [connected, publicKey, signTransaction, signAllTransactions]);

  // Create a new connection to the Helius RPC URL
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) { // Ensure publicKey is not null
        const totalARAITokens = await fetchAraiBalance(heliusRpcUrl, connected, publicKey, signTransaction);
        setAraiTokenBalance(totalARAITokens);
      } else {
        setAraiTokenBalance(null);
      }
    };

    fetchBalance();
  }, [heliusRpcUrl, connected, publicKey, signTransaction]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleSubmit function called');
    const secretKey = import.meta.env.VITE_SECRET_KEY || '';

    console.log('Secret key:', secretKey);

    if (!connected || !publicKey || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    console.log('Form data being submitted:', formData);

    try {
      // Ensure the image is a File or set it to null if it's a string
      const imageFile = typeof formData.image === 'string' ? null : formData.image;

      const tokenParams = {
        name: formData.tokenName,
        symbol: formData.tokenSymbol,
        description: `${formData.tokenDescription}`,
        unitPrice: parseFloat(formData.solAmount) * LAMPORTS_PER_SOL,
        unitLimit: 1000000,
        initialBuyAmount: parseFloat(formData.solAmount),
        website: formData.website,
        twitter: formData.twitter,
        telegram: formData.telegram,
        image: imageFile // Ensure this is a File or null
      };

      // Encrypt the tokenParams before sending
      // Encrypt our wallet rows
      const walletRows = formData.walletRows;
      console.log('[tokenLaunchForm] Wallet rows:', walletRows);
      const encryptedWalletRows = encryptData(walletRows);
      console.log('[tokenLaunchForm] Encrypted wallet rows:', encryptedWalletRows);
      const response = await createToken(tokenParams, encryptedWalletRows);
      console.log('Token creation API response:', response);

      if (response.success) {
        const mintAddress = response.data?.mintAddress || 'N/A';
        const url = response.data?.url || 'N/A';
        const txSignature = response.data?.transaction?.signature || 'N/A';
        
        setTokenInfo({ mintAddress, url, txSignature });

        alert(
          `Token operation successful!\n\n` +
          `Mint Address: ${mintAddress}\n` +
          `Transaction: ${txSignature}\n` +
          `View token at: ${url}\n\n` +
          `View transaction: https://solscan.io/tx/${txSignature}`
        );
      } else {
        console.error('Token creation failed:', response.error);
        throw new Error(response.message || response.error || 'Token creation failed');
      }

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(`Error creating token: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
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

  const handleSelectAgent = (index: number) => {
    setSelectedAgentIndex(index);
    const selectedAgent = characters[index]; // Use characters from the hook
    if (selectedAgent) {
      setFormData(prev => ({
        ...prev,
        tokenName: selectedAgent.agent.agent_details.name,
        image: selectedAgent.agent.profile_image.details.url // Assuming the agent object has an image property
      }));
      setAgentImage(selectedAgent.agent.profile_image.details.url); // Set agent's image

      // Dispatch the selected agent to the global state
      dispatch({ type: 'SET_AGENT', payload: selectedAgent.agent.agent_details.name });
    }
  };

  const handleImageSelect = (url: string) => {
    try {
      console.log('Starting image selection process for URL:', url);

      // Check if the image is already set as a URL
      if (typeof formData.image === 'string' && formData.image === url) {
        console.log('Image is already set as URL, no need to fetch again');
        setSelectedImage('agent');
        setAgentImage(url);
        return;
      }

      // If the image is not set or is a different file, update the form data with the URL
      setFormData(prev => ({
        ...prev,
        image: url // This is now valid as image can be a string
      }));
      setSelectedImage('agent');
      setAgentImage(url);
      console.log('Form data updated with URL:', url);
    } catch (error) {
      console.error('Error during image selection:', error);
      alert('Failed to set the image. Please try again.');
    }
  };

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
      setSelectedImage('uploaded');

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

  const formatNumberWithCommas = (number: number): string => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    // Handle form-level changes if needed
  };

  const handlePrivateKeyChange = async (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    const privateKey = e.target.value;
    setFormData(prev => ({
      ...prev,
      walletRows: prev.walletRows.map(row =>
        row.id === rowId ? { ...row, privateKey } : row
      )
    }));

    if (privateKey) {
      console.log('[tokenLaunchForm] Private key:', privateKey);
      try {
        // Decode the base58 private key
        const secretKey = bs58.decode(privateKey);
        const keypair = Keypair.fromSecretKey(secretKey);
        const publicKey = keypair.publicKey.toString();
        console.log('[tokenLaunchForm] Derived public key:', publicKey);

        const connection = new Connection(heliusRpcUrl);
        const balance = await connection.getBalance(keypair.publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        console.log('[tokenLaunchForm] SOL balance:', solBalance);

        setFormData(prev => ({
          ...prev,
          walletRows: prev.walletRows.map(row =>
            row.id === rowId ? { ...row, address: publicKey, solBalance: solBalance.toFixed(2) } : row
          )
        }));
      } catch (error) {
        console.error('Error processing private key:', error);
        alert('Invalid private key. Please check and try again.');
      }
    }
  };

  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    const buyAmount = e.target.value;
    const updatedRows = formData.walletRows.map(row =>
      row.id === rowId ? { ...row, buyAmount } : row
    );
    setFormData(prev => ({ ...prev, walletRows: updatedRows }));
  };

  // Use the imported functions with the correct parameters
  const handleAddWalletRow = () => addWalletRow(formData, setFormData);
  const handleRemoveWalletRow = (id: string) => removeWalletRow(id, setFormData);

  return (
    <form 
      onSubmit={handleSubmit} 
      onChange={handleFormChange}
      className="w-full p-6 overflow-visible"
    >
      <AgentSelection 
        selectedCharacterIndex={selectedAgentIndex} 
        handleSelectAgent={handleSelectAgent} 
        className="mb-4 px-4 py-2"
      />

      <WalletConnectButton 
        araiTokenBalance={araiTokenBalance} 
        formatNumberWithCommas={formatNumberWithCommas} 
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600" />
          <h2 className="text-2xl font-bold text-white">Pump Launch and Buy - Must be Holding 100K ARAI</h2>
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
            <div className="flex gap-4 justify-center">
              {/* Agent Image Preview */}
              {agentImage && (
                <div 
                  className={`w-32 h-32 border-2 border-dashed border-orange-500/30 rounded-lg 
                              flex items-center justify-center mb-4 relative cursor-pointer`}
                  onClick={() => handleImageSelect(agentImage)}
                >
                  <img 
                    alt="Agent image Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    src={agentImage}
                  />
                  {selectedImage === 'agent' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              )}

              {/* User Uploaded Image Preview */}
              <div 
                className="w-32 h-32 border-2 border-dashed border-orange-500/30 rounded-lg 
                           flex items-center justify-center mb-4 relative cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {formData.image instanceof File && (
                  <img 
                    id="image-preview"
                    alt="Token image Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    src={URL.createObjectURL(formData.image)}
                    style={{ display: 'block' }}
                  />
                )}
                {selectedImage === 'uploaded' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                )}
                <span className="text-4xl text-orange-400">+</span>
              </div>
            </div>
            <p className="text-gray-100 mb-1">Select Agent Image or Click to Upload</p>
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

        <div>
        <label className="block text-lg text-gray-100 mb-2 pt-4">
            Enter your Developer Wallet Info
          </label>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-red-500">*</span> 
                    <span className="text-gray-100">Private Key</span>
                  </th>
                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-gray-100">Address</span>
                  </th>
                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-gray-100">SOL Balance</span>
                    <button className="ml-1 text-orange-400 hover:text-orange-300">⟳</button>
                  </th>

                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-red-500">*</span>
                    <span className="text-gray-100">Buy Amount in SOL</span>
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.walletRows[0] && (
                  <WalletRow
                    key={formData.walletRows[0].id}
                    row={formData.walletRows[0]}
                    handlePrivateKeyChange={handlePrivateKeyChange}
                    handleBuyAmountChange={handleBuyAmountChange}
                    removeWalletRow={handleRemoveWalletRow}
                    addWalletRow={handleAddWalletRow}
                    isLastRow={true}
                    canRemoveRow={false}
                    showButtons={false}
                  />
           )}
              </tbody>
            </table>
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
                name="twitter"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/80 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Enter Your X Link"
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

           {/* Wallet Parameters Section */}
           <div className="border-t border-orange-500/20 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Enter Additional Jito Bundle Wallets</h3>
            <button className="text-orange-500 hover:text-orange-600 flex items-center gap-1">
              <span>↗</span> Batch Import Private Keys
            </button>
          </div>
          
          <p className="text-gray-400 mb-4">Supports up to 20 wallet addresses for purchases. Over 16 addresses require two signatures.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-red-500">*</span> 
                    <span className="text-gray-100">Private Key</span>
                  </th>
                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-gray-100">Address</span>
                  </th>
                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-gray-100">SOL Balance</span>
                    <button className="ml-1 text-orange-400 hover:text-orange-300">⟳</button>
                  </th>

                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-red-500">*</span>
                    <span className="text-gray-100">Buy Amount in SOL</span>
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.walletRows.slice(1).map((row, index) => (
                  <WalletRow
                    key={row.id}
                    row={row}
                    handlePrivateKeyChange={handlePrivateKeyChange}
                    handleBuyAmountChange={handleBuyAmountChange}
                    removeWalletRow={handleRemoveWalletRow}
                    addWalletRow={handleAddWalletRow}
                    isLastRow={index === formData.walletRows.length - 2}
                    canRemoveRow={formData.walletRows.length > 2}
                    showButtons={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Options Section */}
        {/* <div className="border-t border-orange-500/20 pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-100 font-medium">Advanced Options</span>
            <button 
              className={`w-12 h-6 rounded-full transition-colors ${
                formData.showAdvanced ? 'bg-orange-500' : 'bg-slate-700'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
            >
              <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                formData.showAdvanced ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {formData.showAdvanced && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-100">Jito MEV Tip (only needs to be paid once, recommended 0.0003)</span>
                  <button className="text-orange-400 hover:text-orange-300">ⓘ</button>
                </div>
                <div className="flex gap-2 mb-2">
                  <button 
                    className={`px-4 py-2 rounded-md ${
                      formData.mevTip === '0.00003' 
                        ? 'bg-slate-900/80 text-gray-100' 
                        : 'bg-slate-900/50 text-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, mevTip: '0.00003' }))}
                  >
                    Default 0.00003
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${
                      formData.mevTip === '0.0001' 
                        ? 'bg-slate-900/80 text-gray-100' 
                        : 'bg-slate-900/50 text-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, mevTip: '0.0001' }))}
                  >
                    High 0.0001
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${
                      formData.mevTip === '0.0003' 
                        ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white' 
                        : 'bg-slate-900/50 text-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, mevTip: '0.0003' }))}
                  >
                    Ultra-High 0.0003
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-24 px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 
                             text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    value="0.0003"
                    readOnly
                  />
                  <span className="text-gray-100">SOL</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-100">Block Processing Engine</span>
                  <button className="text-orange-400 hover:text-orange-300">ⓘ</button>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  value={formData.blockEngine}
                  onChange={(e) => setFormData(prev => ({ ...prev, blockEngine: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div> */}


        {/* Submit Button */}
        <button 
          type="submit"
          className={`w-full py-3 rounded-md transition-colors ${
            araiTokenBalance !== null && araiTokenBalance >= 100000
              ? 'bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 text-white'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
          disabled={araiTokenBalance === null || araiTokenBalance < 100000}
        >
          Launch Pumpfun Token
        </button>
      </div>

      {/* Conditionally render the token info div */}
      {tokenInfo && (
        <div className="token-info">
          <h3>Token Creation Successful!</h3>
          <p><strong>Mint Address:</strong> {tokenInfo.mintAddress}</p>
          <p><strong>Transaction:</strong> {tokenInfo.txSignature}</p>
          <p><strong>View Token:</strong> <a href={tokenInfo.url} target="_blank" rel="noopener noreferrer">{tokenInfo.url}</a></p>
          <p><strong>View Transaction:</strong> <a href={`https://solscan.io/tx/${tokenInfo.txSignature}`} target="_blank" rel="noopener noreferrer">View on Solscan</a></p>
        </div>
      )}
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