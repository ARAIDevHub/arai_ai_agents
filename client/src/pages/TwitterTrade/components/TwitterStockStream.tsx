import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Transaction {
  time: string;
  amount: string;
  price: string;
  maker: string;
  type: 'buy' | 'sell';
}

interface TwitterStockStreamProps {
  selectedTweet: Tweet | null;
}

const TwitterStockStream: React.FC<TwitterStockStreamProps> = ({ selectedTweet }) => {
  const transactions: Transaction[] = [
    {
      time: '4m',
      amount: '$529.86K',
      price: '$20.5940',
      maker: 'PAHCGW',
      type: 'buy'
    },
    {
      time: '4m',
      amount: '$800.00K',
      price: '$20.3901',
      maker: 'TFN916',
      type: 'buy'
    },
    // Add more mock transactions as needed
  ];

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>Txns</span>
            <span>Top Traders</span>
            <span>Holders (286,152)</span>
          </div>
          
          {/* Transaction table */}
          <div className="bg-slate-900/80 rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-400 border-b border-orange-500/30">
                  <th className="p-2 text-left">TXN</th>
                  <th className="p-2 text-left">USD</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">MAKER</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index} className="border-b border-orange-500/10 text-sm">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        {tx.time}
                      </div>
                    </td>
                    <td className="p-2 text-green-400">{tx.amount}</td>
                    <td className="p-2 text-gray-300">{tx.price}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">{tx.maker}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Chart area */}
      {selectedTweet && selectedTweet.entities.urls.length > 0 && (
          <div className="h-[280px] bg-slate-900/80 rounded-lg">
          <iframe
            src={`https://www.tradingview.com/widgetembed/?symbol=${selectedTweet.text.match(/\$([A-Z]+)/)?.[1] || 'BTCUSD'}&interval=D&hidesidetoolbar=1&theme=dark`}
            className="w-full h-full rounded-lg"
            title="Trading View"
            style={{ border: 'none' }}
            allowTransparency={true}
          />
        </div>
      )}
    </div>
  );
};

export default TwitterStockStream; 