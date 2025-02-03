import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Tweet {
  id: string;
  text: string;
  user: {
    name: string;
    screen_name: string;
    profile_image_url: string;
  };
  created_at: string;
  entities: {
    urls: {
      url: string;
      expanded_url: string;
      display_url: string;
    }[];
  };
}

interface Transaction {
  time: string;
  amount: string;
  price: string;
  maker: string;
  type: 'buy' | 'sell';
}

interface TwitterStockStreamProps {
  projects: string[];
}

const TwitterStockStream: React.FC<TwitterStockStreamProps> = ({ projects }) => {
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
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
  ]);

  // Mock data - replace with actual Twitter API integration
  const tweets: Tweet[] = [
    {
      id: '1',
      text: '$BTC just hit a new ATH! Check it out on Binance: https://binance.com',
      user: {
        name: 'Crypto Trader',
        screen_name: 'cryptotrader',
        profile_image_url: 'https://pbs.twimg.com/profile_image.jpg'
      },
      created_at: '2023-10-01T12:00:00Z',
      entities: {
        urls: [{
          url: 'https://binance.com',
          expanded_url: 'https://www.binance.com/en/trade/BTC_USDT',
          display_url: 'binance.com'
        }]
      }
    },
    // Add more tweets here
  ];

  const filteredTweets = tweets.filter(tweet => 
    projects.some(project => tweet.text.includes(project))
  );

  return (
    <div className="flex h-full">
      {/* Left side - Tweets */}
      <div className="w-1/2 border-r border-orange-500/30 p-4">
        <h2 className="text-xl font-bold text-orange-400 mb-4">Project Mentions</h2>
        <div className="space-y-4">
          {filteredTweets.map(tweet => (
            <div
              key={tweet.id}
              className="p-4 bg-slate-800/80 rounded-lg border border-orange-500/30 cursor-pointer hover:bg-slate-700/50"
              onClick={() => setSelectedTweet(tweet)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={tweet.user.profile_image_url}
                  alt={tweet.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-bold text-gray-100">{tweet.user.name}</div>
                  <div className="text-sm text-gray-400">@{tweet.user.screen_name}</div>
                </div>
              </div>
              <div className="mt-2 text-gray-100">{tweet.text}</div>
              {tweet.entities.urls.length > 0 && (
                <div className="mt-2 text-sm text-orange-400">
                  {tweet.entities.urls[0].display_url}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Transactions */}
      <div className="w-1/2 p-4">
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

        {/* Chart area */}
        {selectedTweet && (
          <div className="h-[400px] bg-slate-900/80 rounded-lg">
            <iframe
              src={`https://www.tradingview.com/chart/?symbol=${selectedTweet.text.match(/\$[A-Z]+/)?.[0] || 'BTCUSD'}`}
              className="w-full h-full rounded-lg"
              title="Trading View"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterStockStream; 