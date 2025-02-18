// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Database, Brain, Twitter, MessageSquare, Search, Bot,
//   BookOpen, Megaphone, Send, MessageCircle, MessagesSquare
// } from 'lucide-react';

// // Shared Types
// interface Position {
//   x: number;
//   y: number;
// }

// interface Resource {
//   id: string;
//   type: string;
//   position: number;
// }

// // Connection Line Component
// const ConnectionLine = ({ start, end, resources = [] }) => {
//   const pathRef = useRef(null);

//   // Calculate control points for curved line
//   const getMidPoint = () => {
//     return {
//       x: (start.x + end.x) / 2,
//       y: (start.y + end.y) / 2
//     };
//   };

//   const mid = getMidPoint();
//   const pathD = `M ${start.x} ${start.y} Q ${mid.x} ${start.y} ${end.x} ${end.y}`;

//   return (
//     <div className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
//       <svg className="w-full h-full">
//         <defs>
//           <linearGradient id={`belt-gradient-${start.x}-${start.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#0d9488" />
//             <stop offset="50%" stopColor="#14b8a6" />
//             <stop offset="100%" stopColor="#0d9488" />
//           </linearGradient>
//         </defs>
//         {/* Base conveyor belt */}
//         <path
//           ref={pathRef}
//           d={pathD}
//           stroke={`url(#belt-gradient-${start.x}-${start.y})`}
//           strokeWidth="6"
//           fill="none"
//           strokeLinecap="round"
//         />
//         {/* Animated flow line */}
//         <path
//           d={pathD}
//           stroke="#2dd4bf"
//           strokeWidth="2"
//           strokeDasharray="4 4"
//           fill="none"
//           className="animate-flow"
//         />
//       </svg>
      
//       {/* Moving resources */}
//       {resources.map((resource) => {
//         const point = getPointOnQuadraticCurve(
//           start,
//           { x: mid.x, y: start.y },
//           end,
//           resource.position
//         );
        
//         return (
//           <div
//             key={resource.id}
//             className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-teal-900/80 border border-teal-400 transform -translate-x-1/2 -translate-y-1/2 shadow-lg transition-all duration-100"
//             style={{
//               left: point.x,
//               top: point.y,
//             }}
//           >
//             {getResourceIcon(resource.type)}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// // Helper function to get point on quadratic curve
// const getPointOnQuadraticCurve = (start, control, end, t) => {
//   const x = Math.pow(1 - t, 2) * start.x + 
//            2 * (1 - t) * t * control.x + 
//            Math.pow(t, 2) * end.x;
//   const y = Math.pow(1 - t, 2) * start.y + 
//            2 * (1 - t) * t * control.y + 
//            Math.pow(t, 2) * end.y;
//   return { x, y };
// };

// // Resource icon mapping
// const getResourceIcon = (type) => {
//   switch (type) {
//     case 'tweet':
//       return <MessageSquare className="w-3 h-3 text-teal-400" />;
//     case 'analysis':
//       return <Search className="w-3 h-3 text-purple-400" />;
//     case 'research':
//       return <BookOpen className="w-3 h-3 text-blue-400" />;
//     case 'marketing':
//       return <Megaphone className="w-3 h-3 text-pink-400" />;
//     case 'post':
//       return <Send className="w-3 h-3 text-orange-400" />;
//     default:
//       return null;
//   }
// };

// // Rest of the components (PlatformNode, AgentNode, etc.) remain the same...

// // Platform Node Component
// const PlatformNode = ({ id, position, type, onMouseDown, isProcessing }) => {
//   const getIcon = () => {
//     switch (type) {
//       case 'twitter': return <Twitter className="w-8 h-8 text-sky-400" />;
//       case 'telegram': return <MessageCircle className="w-8 h-8 text-blue-400" />;
//       case 'discord': return <MessagesSquare className="w-8 h-8 text-indigo-400" />;
//       default: return null;
//     }
//   };

//   const getPlatformColor = () => {
//     switch (type) {
//       case 'twitter': return 'border-sky-500';
//       case 'telegram': return 'border-blue-500';
//       case 'discord': return 'border-indigo-500';
//       default: return 'border-gray-500';
//     }
//   };

//   return (
//     <div
//       style={{ left: position.x, top: position.y }}
//       className={`absolute p-4 rounded-lg border-2 backdrop-blur-sm bg-slate-900/75 shadow-lg w-48
//                  ${getPlatformColor()}
//                  ${isProcessing ? 'animate-pulse ring-2 ring-offset-2 ring-offset-slate-900' : ''}`}
//       onMouseDown={(e) => onMouseDown(e, id)}
//     >
//       <div className="flex items-center gap-3">
//         <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
//           {getIcon()}
//         </div>
//         <div>
//           <h3 className="text-white font-bold capitalize">{type}</h3>
//           <p className="text-gray-300 text-sm">
//             {isProcessing ? 'Posting...' : 'Ready'}
//           </p>
//         </div>
//       </div>
//       <div className="absolute left-0 top-1/2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
//     </div>
//   );
// };

// // Agent Node Component
// const AgentNode = ({ id, position, type, onMouseDown }) => {
//   const getAgentConfig = () => {
//     switch (type) {
//       case 'research':
//         return {
//           icon: <BookOpen className="w-8 h-8 text-blue-400" />,
//           color: 'border-blue-500',
//           label: 'Research Agent',
//           status: 'Analyzing trends'
//         };
//       case 'marketing':
//         return {
//           icon: <Megaphone className="w-8 h-8 text-pink-400" />,
//           color: 'border-pink-500',
//           label: 'Marketing Agent',
//           status: 'Optimizing content'
//         };
//       default:
//         return {
//           icon: <Bot className="w-8 h-8 text-gray-400" />,
//           color: 'border-gray-500',
//           label: 'Agent',
//           status: 'Processing'
//         };
//     }
//   };

//   const config = getAgentConfig();

//   return (
//     <div
//       style={{ left: position.x, top: position.y }}
//       className={`absolute p-4 rounded-lg border-2 backdrop-blur-sm bg-slate-900/75 shadow-lg w-64 ${config.color}`}
//       onMouseDown={(e) => onMouseDown(e, id)}
//     >
//       <div className="flex items-center gap-3">
//         <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
//           {config.icon}
//         </div>
//         <div>
//           <h3 className="text-white font-bold">{config.label}</h3>
//           <p className="text-gray-300 text-sm">
//             {config.status}
//             <span className="ml-2 inline-block w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
//           </p>
//         </div>
//       </div>
//       <div className="absolute left-0 top-1/2 w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
//       <div className="absolute right-0 top-1/2 w-3 h-3 bg-gray-400 rounded-full transform translate-x-1/2 -translate-y-1/2" />
//     </div>
//   );
// };

// // Source Node Component
// const SourceNode = ({ id, position, onMouseDown }) => (
//   <div
//     style={{ left: position.x, top: position.y }}
//     className="absolute p-4 rounded-lg border-2 border-teal-500 backdrop-blur-sm bg-slate-900/75 shadow-lg w-64"
//     onMouseDown={(e) => onMouseDown(e, id)}
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
//         <Twitter className="w-8 h-8 text-teal-400" />
//       </div>
//       <div>
//         <h3 className="text-white font-bold">Twitter Feed</h3>
//         <p className="text-teal-300 text-sm">Mining Rate: 60/min</p>
//       </div>
//     </div>
//     <div className="absolute right-0 top-1/2 w-3 h-3 bg-teal-400 rounded-full transform translate-x-1/2 -translate-y-1/2" />
//   </div>
// );

// // Processor Node Component
// const ProcessorNode = ({ id, position, onMouseDown }) => (
//   <div
//     style={{ left: position.x, top: position.y }}
//     className="absolute p-4 rounded-lg border-2 border-purple-500 backdrop-blur-sm bg-slate-900/75 shadow-lg w-64"
//     onMouseDown={(e) => onMouseDown(e, id)}
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
//         <Brain className="w-8 h-8 text-purple-400" />
//       </div>
//       <div>
//         <h3 className="text-white font-bold">Content Filter</h3>
//         <p className="text-purple-300 text-sm">
//           Processing
//           <span className="ml-2 inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
//         </p>
//       </div>
//     </div>
//     <div className="absolute left-0 top-1/2 w-3 h-3 bg-purple-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
//     <div className="absolute right-0 top-1/2 w-3 h-3 bg-purple-400 rounded-full transform translate-x-1/2 -translate-y-1/2" />
//   </div>
// );

// // Storage Node Component
// const StorageNode = ({ id, position, onMouseDown }) => (
//   <div
//     style={{ left: position.x, top: position.y }}
//     className="absolute p-4 rounded-lg border-2 border-orange-500 backdrop-blur-sm bg-slate-900/75 shadow-lg w-64"
//     onMouseDown={(e) => onMouseDown(e, id)}
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
//         <Database className="w-8 h-8 text-orange-400" />
//       </div>
//       <div>
//         <h3 className="text-white font-bold">Tweet Storage</h3>
//         <p className="text-orange-300 text-sm">1,250 items stored</p>
//       </div>
//     </div>
//     <div className="absolute left-0 top-1/2 w-3 h-3 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
//     <div className="absolute right-0 top-1/2 w-3 h-3 bg-orange-400 rounded-full transform translate-x-1/2 -translate-y-1/2" />
//   </div>
// );

// const AgentPipeline = () => {
//   const [nodes, setNodes] = useState([
//     { id: 'source', type: 'source', position: { x: 100, y: 100 } },
//     { id: 'processor', type: 'processor', position: { x: 400, y: 100 } },
//     { id: 'storage', type: 'storage', position: { x: 700, y: 100 } },
//     { id: 'research', type: 'research', position: { x: 400, y: 300 } },
//     { id: 'marketing', type: 'marketing', position: { x: 700, y: 300 } },
//     { id: 'twitter', type: 'platform', platformType: 'twitter', position: { x: 1000, y: 50 } },
//     { id: 'telegram', type: 'platform', platformType: 'telegram', position: { x: 1000, y: 200 } },
//     { id: 'discord', type: 'platform', platformType: 'discord', position: { x: 1000, y: 350 } }
//   ]);

//   const [connections, setConnections] = useState([
//     {
//       id: 'source-processor',
//       from: 'source',
//       to: 'processor',
//       resources: [
//         { id: 't1', type: 'tweet', position: 0.2 },
//         { id: 't2', type: 'tweet', position: 0.6 }
//       ]
//     },
//     {
//       id: 'processor-storage',
//       from: 'processor',
//       to: 'storage',
//       resources: [
//         { id: 'a1', type: 'analysis', position: 0.3 }
//       ]
//     },
//     {
//       id: 'storage-research',
//       from: 'storage',
//       to: 'research',
//       resources: [
//         { id: 'r1', type: 'research', position: 0.5 }
//       ]
//     },
//     {
//       id: 'storage-marketing',
//       from: 'storage',
//       to: 'marketing',
//       resources: [
//         { id: 'm1', type: 'marketing', position: 0.4 }
//       ]
//     },
//     {
//       id: 'marketing-twitter',
//       from: 'marketing',
//       to: 'twitter',
//       resources: [
//         { id: 'p1', type: 'post', position: 0.7 }
//       ]
//     },
//     {
//       id: 'marketing-telegram',
//       from: 'marketing',
//       to: 'telegram',
//       resources: [
//         { id: 'p2', type: 'post', position: 0.2 }
//       ]
//     },
//     {
//       id: 'marketing-discord',
//       from: 'marketing',
//       to: 'discord',
//       resources: [
//         { id: 'p3', type: 'post', position: 0.9 }
//       ]
//     }
//   ]);

//   const [processingPlatforms, setProcessingPlatforms] = useState({});
//   const [draggingNode, setDraggingNode] = useState(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

//   const handleMouseDown = (e, nodeId) => {
//     e.preventDefault();
//     const node = nodes.find((n) => n.id === nodeId);
//     setDraggingNode(nodeId);
//     setDragOffset({
//       x: e.clientX - node.position.x,
//       y: e.clientY - node.position.y,
//     });
//   };

//   const handleMouseMove = (e) => {
//     if (draggingNode) {
//       setNodes((prev) =>
//         prev.map((node) =>
//           node.id === draggingNode
//             ? {
//                 ...node,
//                 position: {
//                   x: e.clientX - dragOffset.x,
//                   y: e.clientY - dragOffset.y,
//                 },
//               }
//             : node
//         )
//       );
//     }
//   };

//   const handleMouseUp = () => {
//     setDraggingNode(null);
//   };

//   // Animate resources
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setConnections(prev =>
//         prev.map(conn => ({
//           ...conn,
//           resources: conn.resources.map(resource => ({
//             ...resource,
//             position: (resource.position + 0.005) % 1,
//           }))
//         }))
//       );
//     }, 16);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div
//       className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//     >
//       {/* Render connections with moving resources */}
//       {connections.map(connection => {
//         const fromNode = nodes.find(n => n.id === connection.from);
//         const toNode = nodes.find(n => n.id === connection.to);
//         if (fromNode && toNode) {
//           return (
//             <ConnectionLine
//               key={connection.id}
//               start={{
//                 x: fromNode.position.x + 256,
//                 y: fromNode.position.y + 40
//               }}
//               end={{
//                 x: toNode.position.x,
//                 y: toNode.position.y + 40
//               }}
//               resources={connection.resources}
//             />
//           );
//         }
//         return null;
//       })}

//       {/* Render nodes */}
//       {nodes.map(node => {
//         const props = {
//           key: node.id,
//           id: node.id,
//           position: node.position,
//           onMouseDown: handleMouseDown
//         };

//         if (node.type === 'platform') {
//           return (
//             <PlatformNode
//               {...props}
//               type={node.platformType}
//               isProcessing={processingPlatforms[node.id]}
//             />
//           );
//         }

//         if (node.type === 'research' || node.type === 'marketing') {
//           return <AgentNode {...props} type={node.type} />;
//         }

//         switch (node.type) {
//           case 'source':
//             return <SourceNode {...props} />;
//           case 'processor':
//             return <ProcessorNode {...props} />;
//           case 'storage':
//             return <StorageNode {...props} />;
//           default:
//             return null;
//         }
//       })}

//       <style>{`
//         .animate-flow {
//           animation: flow 1s linear infinite;
//         }
        
//         @keyframes flow {
//           from {
//             stroke-dashoffset: 8;
//           }
//           to {
//             stroke-dashoffset: 0;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AgentPipeline;