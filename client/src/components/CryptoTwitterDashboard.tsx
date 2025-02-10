// import React from 'react';
// import { ChevronLeft, Search, Plus, RefreshCw, TrendingUp, Twitter, MessageSquare, Activity, DollarSign, Bell } from 'lucide-react';

// const CryptoTwitterDashboard = () => {
//   const sidebarItems = [
//     { icon: <TrendingUp className="w-5 h-5" />, label: "Markets" },
//     { icon: <Twitter className="w-5 h-5" />, label: "Feed" },
//     { icon: <Activity className="w-5 h-5" />, label: "Analytics" },
//     { icon: <DollarSign className="w-5 h-5" />, label: "Trading" }
//   ];

//   const watchlist = [
//     "BTC/USD",
//     "ETH/USD",
//     "SOL/USD",
//     "#Bitcoin",
//     "#Crypto",
//     "#NFTs",
//     "Whale Alerts",
//     "Trading Signals",
//     "My Portfolio"
//   ];

//   const tweets = [
//     {
//       handle: "@whale_alert",
//       content: "🚨 1,500 #BTC transferred from unknown wallet to Binance",
//       time: "2m ago",
//       metrics: { replies: 45, retweets: 128, likes: 892 }
//     },
//     {
//       handle: "@CryptoAnalyst",
//       content: "ETH breaking key resistance at $3,450. Next target: $3,800",
//       time: "5m ago",
//       metrics: { replies: 23, retweets: 67, likes: 445 }
//     }
//   ];

//   return (
//     <div className="flex h-screen bg-slate-900">
//       {/* Left Sidebar */}
//       <div className="w-16 bg-slate-800 flex flex-col items-center py-4">
//         <div className="mb-8">
//           <DollarSign className="w-8 h-8 text-teal-400" />
//         </div>
//         {sidebarItems.map((item, index) => (
//           <div key={index} className="mb-4 text-teal-400 hover:text-orange-400 cursor-pointer transition-colors">
//             {item.icon}
//           </div>
//         ))}
//       </div>

//       {/* Secondary Sidebar */}
//       <div className="w-64 bg-slate-800 border-r border-slate-700">
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-white">Crypto Watch</h2>
//             <ChevronLeft className="w-5 h-5 text-teal-400" />
//           </div>
//           <button className="w-full bg-gradient-to-r from-teal-500 to-orange-500 text-white py-2 px-4 rounded-md mb-4 flex items-center hover:from-teal-600 hover:to-orange-600">
//             <Plus className="w-4 h-4 mr-2" /> Add Track
//           </button>
//           <div className="relative mb-4">
//             <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search assets or tags"
//               className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white border-slate-600 rounded-md focus:ring-teal-500 focus:border-teal-500"
//             />
//           </div>
//           <div className="font-semibold mb-2 text-teal-400">WATCHLIST</div>
//           {watchlist.map((item, index) => (
//             <div
//               key={index}
//               className="py-2 px-3 hover:bg-slate-700 cursor-pointer flex items-center justify-between text-slate-300"
//             >
//               <span>{item}</span>
//               <span className="text-teal-400">{index < 3 ? "+2.4%" : ""}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto bg-slate-900">
//         <div className="p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-4">
//               <h1 className="text-lg font-semibold text-white">Crypto Twitter Feed</h1>
//               <button className="bg-slate-800 text-teal-400 px-4 py-1 rounded-md hover:bg-slate-700">Add Stream</button>
//               <button className="bg-slate-800 text-teal-400 px-4 py-1 rounded-md hover:bg-slate-700">Filter</button>
//               <RefreshCw className="w-5 h-5 text-teal-400 cursor-pointer hover:text-orange-400" />
//             </div>
//             <div className="flex items-center space-x-4 text-slate-300">
//               <span>Live Updates</span>
//             </div>
//           </div>

//           {/* Stream Content */}
//           <div className="grid grid-cols-3 gap-4">
//             {tweets.map((tweet, index) => (
//               <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
//                 <div className="font-semibold text-teal-400 mb-2">{tweet.handle}</div>
//                 <div className="text-slate-300 mb-3">{tweet.content}</div>
//                 <div className="flex justify-between text-slate-500 text-sm">
//                   <span>{tweet.time}</span>
//                   <div className="flex space-x-4">
//                     <span>💬 {tweet.metrics.replies}</span>
//                     <span>🔄 {tweet.metrics.retweets}</span>
//                     <span>❤️ {tweet.metrics.likes}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CryptoTwitterDashboard;