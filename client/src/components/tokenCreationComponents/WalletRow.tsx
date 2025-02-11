import React from 'react';

interface WalletRowProps {
  row: {
    id: string;
    privateKey: string;
    address: string;
    solBalance: string;
    buyAmount: string;
  };
  handlePrivateKeyChange: (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => void;
  handleBuyAmountChange: (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => void;
  removeWalletRow: (id: string) => void;
  addWalletRow: () => void;
  isLastRow: boolean;
  canRemoveRow: boolean;
}

const WalletRow: React.FC<WalletRowProps> = ({
  row,
  handlePrivateKeyChange,
  handleBuyAmountChange,
  removeWalletRow,
  addWalletRow,
  isLastRow,
  canRemoveRow
}) => {
  return (
    <tr key={row.id}>
      <td className="p-2 border-b border-orange-500/30">
        <input
          type="text"
          className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 
                   text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          placeholder="Enter Private Key"
          value={row.privateKey}
          onChange={(e) => handlePrivateKeyChange(e, row.id)}
        />
      </td>
      <td className="p-2 border-b border-orange-500/30 text-gray-400">{row.address}</td>
      <td className="p-2 border-b border-orange-500/30 text-gray-400">{row.solBalance}</td>
      <td className="p-2 border-b border-orange-500/30 text-gray-400">-</td>
      <td className="p-2 border-b border-orange-500/30">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md bg-slate-900/80 border border-orange-500/30 
                     text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            placeholder="Enter Purchase Amount"
            value={row.buyAmount}
            onChange={(e) => handleBuyAmountChange(e, row.id)}
          />
          <button className="px-3 py-2 bg-slate-800 text-cyan-200 rounded-md hover:bg-slate-700">
            MAX
          </button>
        </div>
      </td>
      <td className="p-2 border-b border-orange-500/30">
        <div className="flex gap-1">
          {canRemoveRow && (
            <button 
              className="w-6 h-6 flex items-center justify-center text-orange-400 hover:text-orange-300"
              onClick={() => removeWalletRow(row.id)}
            >
              −
            </button>
          )}
          {isLastRow && (
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
  );
};

export default WalletRow; 