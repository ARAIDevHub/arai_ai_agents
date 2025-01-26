import React, { useState } from 'react';

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

const TokenLaunchForm: React.FC<TokenLaunchFormProps> = ({ formData, setFormData }) => {
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
    <div className="w-full p-6 overflow-visible">
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
                className="w-full px-4 py-3 rounded-lg bg-gray-800/95 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Enter token name"
                value={formData.tokenName}
                onChange={(e) => setFormData({...formData, tokenName: e.target.value})}
              />
            </div>

            <div>
              <label className="flex items-center text-lg text-gray-100 mb-2">
                Token Symbol
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/95 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Enter token symbol"
                value={formData.tokenSymbol}
                onChange={(e) => setFormData({...formData, tokenSymbol: e.target.value})}
              />
            </div>

            <div>
              <label className="flex items-center text-lg text-gray-100 mb-2">
                Token Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-gray-800/95 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 h-32"
                placeholder="Enter Token Description"
                value={formData.tokenDescription}
                onChange={(e) => setFormData({...formData, tokenDescription: e.target.value})}
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <label className="flex items-center text-lg text-gray-100 mb-2">
              Token Logo
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="border-2 border-dashed border-orange-500/30 rounded-lg p-8 
                          bg-gray-800/95 flex flex-col items-center justify-center">
              <div className="w-32 h-32 border-2 border-dashed border-orange-500/30 rounded-lg 
                            flex items-center justify-center mb-4">
                <span className="text-4xl text-orange-400">+</span>
              </div>
              <p className="text-gray-100 mb-1">Click to Upload</p>
              <p className="text-gray-400">Supported image formats: PNG/GIF/JPG/WEBP and JPEG</p>
              <p className="text-gray-400">Recommended size: 1000×1000 pixels</p>
              <p className="text-gray-400 mt-4 text-center">
                If it meets the above requirements, it can be better displayed on various platforms and applications.
              </p>
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
              className="w-full px-3 py-2 rounded-md bg-gray-800/95 border border-orange-500/30 
                       text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              placeholder="Minimum 0.00000001 SOL/Enter total"
              value={formData.solAmount}
              onChange={(e) => setFormData({...formData, solAmount: e.target.value})}
            />
            <span className="absolute right-3 top-2 text-gray-400">SOL</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-gray-800/95 p-4 rounded-md border border-orange-500/30">
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

        {/* Social Links Toggle */}
        <div className="flex items-center justify-between border-t border-orange-500/20 pt-4">
          <span className="text-white font-medium">Add Social Links</span>
          <button 
            className={`w-12 h-6 rounded-full transition-colors ${
              formData.showSocialLinks ? 'bg-orange-500' : 'bg-slate-700'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, showSocialLinks: !prev.showSocialLinks }))}
          >
            <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
              formData.showSocialLinks ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
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
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/95 border border-orange-500/30 
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Enter Your Website URL"
                />
              </div>
              
              <div>
                <label className="text-lg text-gray-100 mb-2 block">
                  X:
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/95 border border-orange-500/30 
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  placeholder="Enter Your X Link"
                />
              </div>
            </div>

            <div>
              <label className="text-lg text-gray-100 mb-2 block">
                Telegram:
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/95 border border-orange-500/30 
                         text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="Enter Your Telegram Link"
              />
            </div>
          </div>
        )}

        {/* Wallet Parameters Section */}
        <div className="border-t border-orange-500/20 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Other Wallet Buy Parameters Settings</h3>
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
                    <span className="text-gray-100">Est. Volume</span>
                  </th>
                  <th className="text-left p-2 border-b border-orange-500/30">
                    <span className="text-red-500">*</span>
                    <span className="text-gray-100">Buy Amount in SOL</span>
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {formData.walletRows.map((row) => (
                  <tr key={row.id}>
                    <td className="p-2 border-b border-orange-500/30">
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md bg-gray-800/95 border border-orange-500/30 
                                 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="Enter Private Key"
                        value={row.privateKey}
                        onChange={(e) => {
                          const updatedRows = formData.walletRows.map(r =>
                            r.id === row.id ? { ...r, privateKey: e.target.value } : r
                          );
                          setFormData(prev => ({ ...prev, walletRows: updatedRows }));
                        }}
                      />
                    </td>
                    <td className="p-2 border-b border-orange-500/30 text-gray-400">-</td>
                    <td className="p-2 border-b border-orange-500/30 text-gray-400">-</td>
                    <td className="p-2 border-b border-orange-500/30 text-gray-400">-</td>
                    <td className="p-2 border-b border-orange-500/30">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md bg-gray-800/95 border border-orange-500/30 
                                   text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                          placeholder="Enter Purchase Amount"
                          value={row.buyAmount}
                          onChange={(e) => {
                            const updatedRows = formData.walletRows.map(r =>
                              r.id === row.id ? { ...r, buyAmount: e.target.value } : r
                            );
                            setFormData(prev => ({ ...prev, walletRows: updatedRows }));
                          }}
                        />
                        <button className="px-3 py-2 bg-slate-800 text-cyan-200 rounded-md hover:bg-slate-700">
                          MAX
                        </button>
                      </div>
                    </td>
                    <td className="p-2 border-b border-orange-500/30">
                      <div className="flex gap-1">
                        {formData.walletRows.length > 1 && (
                          <button 
                            className="w-6 h-6 flex items-center justify-center text-orange-400 hover:text-orange-300"
                            onClick={() => removeWalletRow(row.id)}
                          >
                            −
                          </button>
                        )}
                        {row.id === formData.walletRows[formData.walletRows.length - 1].id && (
                          <button 
                            className="w-6 h-6 flex items-center justify-center text-orange-400 hover:text-orange-300"
                            onClick={addWalletRow}
                          >
                            +
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Options Section */}
        <div className="border-t border-orange-500/20 pt-6">
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
                        ? 'bg-gray-800/95 text-gray-100' 
                        : 'bg-gray-800/50 text-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, mevTip: '0.00003' }))}
                  >
                    Default 0.00003
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${
                      formData.mevTip === '0.0001' 
                        ? 'bg-gray-800/95 text-gray-100' 
                        : 'bg-gray-800/50 text-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, mevTip: '0.0001' }))}
                  >
                    High 0.0001
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md ${
                      formData.mevTip === '0.0003' 
                        ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white' 
                        : 'bg-gray-800/50 text-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, mevTip: '0.0003' }))}
                  >
                    Ultra-High 0.0003
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-24 px-3 py-2 rounded-md bg-gray-800/95 border border-orange-500/30 
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
                  className="w-full px-3 py-2 rounded-md bg-gray-800/95 border border-orange-500/30 
                           text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  value={formData.blockEngine}
                  onChange={(e) => setFormData(prev => ({ ...prev, blockEngine: e.target.value }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button className="w-full bg-gradient-to-r from-cyan-600 to-orange-600 
                         hover:from-cyan-700 hover:to-orange-700 text-white py-3 rounded-md 
                         transition-colors">
          Pump Launch and Buy
        </button>
      </div>
    </div>
  );
};

export default TokenLaunchForm;