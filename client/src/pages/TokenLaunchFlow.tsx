import React, { useState } from 'react';
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface TokenFlowData {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  logo: File | null;
  website: string;
  xLink: string;
  telegram: string;
  solAmount: string;
  walletCount: number;
  mevTip: '0.00003' | '0.0001' | '0.0003';
  blockEngine: string;
}

const nodeBaseStyle = {
  background: '#0f172a',
  color: '#fff',
  border: '1px solid rgba(59, 130, 246, 0.5)',
  borderRadius: '8px',
  padding: '16px',
  width: 300,
  boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)',
  fontSize: '14px',
};

const getNodeStyle = (type: string) => ({
  ...nodeBaseStyle,
  borderColor: {
    'token': 'rgba(29, 161, 242, 0.5)',
    'social': 'rgba(147, 51, 234, 0.5)',
    'wallet': 'rgba(249, 115, 22, 0.5)',
    'mev': 'rgba(59, 130, 246, 0.5)',
    'launch': 'rgba(236, 72, 153, 0.5)',
    'infrastructure': 'rgba(249, 115, 22, 0.5)',
  }[type] || 'rgba(59, 130, 246, 0.5)',
  boxShadow: `0 0 10px ${
    {
      'token': 'rgba(29, 161, 242, 0.2)',
      'social': 'rgba(147, 51, 234, 0.2)',
      'wallet': 'rgba(249, 115, 22, 0.2)',
      'mev': 'rgba(59, 130, 246, 0.2)',
      'launch': 'rgba(236, 72, 153, 0.2)',
      'infrastructure': 'rgba(249, 115, 22, 0.2)',
    }[type] || 'rgba(59, 130, 246, 0.2)'
  }`,
  width: 200,
});

const TokenLaunchFlow = () => {
  const [flowData, setFlowData] = useState<TokenFlowData>({
    tokenName: '',
    tokenSymbol: '',
    tokenDescription: '',
    logo: null,
    website: '',
    xLink: '',
    telegram: '',
    solAmount: '',
    walletCount: 1,
    mevTip: '0.00003',
    blockEngine: 'https://mainnet.block-engine.jito.wtf'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Define positions for the two windows with more vertical space between them
  const uiWindow = {
    x: 50,
    y: 50,
    width: 1200,  // Increased width to accommodate nodes
    height: 250,  // Reduced height
  };

  const infrastructureWindow = {
    x: 50,
    y: 400,  // More space between windows
    width: 1200,
    height: 200,
  };

  const nodes: Node[] = [
    // UI Window Title
    {
      id: 'ui-window-title',
      type: 'group',
      position: { x: uiWindow.x, y: uiWindow.y - 40 },
      data: {
        label: (
          <div className="flex items-center gap-2 text-white">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 font-mono">Token Launch Interface</span>
          </div>
        )
      },
      style: {
        width: uiWindow.width,
        background: 'transparent',
      }
    },

    // UI Flow Nodes - Horizontally spaced
    {
      id: 'wallet',
      type: 'input',
      position: { x: uiWindow.x + 50, y: uiWindow.y + 80 },
      data: {
        label: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <span className="font-semibold">Wallet</span>
              <span className="ml-auto text-sm text-green-400">Connected</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded text-green-400">
              Balance: 420 SOL
            </div>
          </div>
        )
      },
      style: getNodeStyle('wallet')
    },
    {
      id: 'token-details',
      type: 'token',
      position: { x: uiWindow.x + 280, y: uiWindow.y + 80 },
      data: { 
        label: (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"/>
              </svg>
              <span className="font-semibold">Token Details</span>
              <span className="ml-auto text-sm text-blue-400">Required</span>
            </div>
            <input
              type="text"
              placeholder="Token Name"
              className="bg-slate-800/50 p-2 rounded border border-blue-500/20"
              value={flowData.tokenName}
              onChange={(e) => setFlowData(prev => ({ ...prev, tokenName: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Token Symbol"
              className="bg-slate-800/50 p-2 rounded border border-blue-500/20"
              value={flowData.tokenSymbol}
              onChange={(e) => setFlowData(prev => ({ ...prev, tokenSymbol: e.target.value }))}
            />
            <textarea
              placeholder="Token Description"
              className="bg-slate-800/50 p-2 rounded border border-blue-500/20 h-20"
              value={flowData.tokenDescription}
              onChange={(e) => setFlowData(prev => ({ ...prev, tokenDescription: e.target.value }))}
            />
          </div>
        ),
        status: 'editing'
      },
      style: getNodeStyle('token')
    },
    {
      id: 'social-links',
      type: 'social',
      position: { x: uiWindow.x + 510, y: uiWindow.y + 80 },
      data: { 
        label: (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
              <span className="font-semibold">Social Links</span>
              <span className="ml-auto text-sm text-purple-400">Optional</span>
            </div>
            <input
              type="text"
              placeholder="Website URL"
              className="bg-slate-800/50 p-2 rounded border border-purple-500/20"
              value={flowData.website}
              onChange={(e) => setFlowData(prev => ({ ...prev, website: e.target.value }))}
            />
            <input
              type="text"
              placeholder="X (Twitter) Link"
              className="bg-slate-800/50 p-2 rounded border border-purple-500/20"
              value={flowData.xLink}
              onChange={(e) => setFlowData(prev => ({ ...prev, xLink: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Telegram Link"
              className="bg-slate-800/50 p-2 rounded border border-purple-500/20"
              value={flowData.telegram}
              onChange={(e) => setFlowData(prev => ({ ...prev, telegram: e.target.value }))}
            />
          </div>
        ),
        status: 'editing'
      },
      style: getNodeStyle('social')
    },
    {
      id: 'mev-config',
      type: 'mev',
      position: { x: uiWindow.x + 740, y: uiWindow.y + 80 },
      data: { 
        label: (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <span className="font-semibold">MEV Configuration</span>
              <span className="ml-auto text-sm text-blue-400">Auto</span>
            </div>
            <div className="flex gap-2">
              <button 
                className={`px-3 py-1 rounded ${flowData.mevTip === '0.00003' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800/50'}`}
                onClick={() => setFlowData(prev => ({ ...prev, mevTip: '0.00003' }))}
              >
                Default
              </button>
              <button 
                className={`px-3 py-1 rounded ${flowData.mevTip === '0.0001' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800/50'}`}
                onClick={() => setFlowData(prev => ({ ...prev, mevTip: '0.0001' }))}
              >
                High
              </button>
              <button 
                className={`px-3 py-1 rounded ${flowData.mevTip === '0.0003' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800/50'}`}
                onClick={() => setFlowData(prev => ({ ...prev, mevTip: '0.0003' }))}
              >
                Ultra
              </button>
            </div>
          </div>
        ),
        status: 'ready'
      },
      style: getNodeStyle('mev')
    },
    {
      id: 'launch',
      type: 'launch',
      position: { x: uiWindow.x + 970, y: uiWindow.y + 80 },
      data: { 
        label: (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.13 22.19l-1.63-3.83c-.24-.56-.2-1.23.13-1.75l2.74-4.3c-1.89-.01-3.64-.9-4.78-2.41l-2.01-2.67c-.8-1.07-.76-2.54.09-3.56l.12-.15c1.16-1.4 3.25-1.55 4.59-.27l3.16 3.02c.45.43.99.78 1.59 1.02l6.05 2.42c1.85.74 2.09 3.27.4 4.38l-3.65 2.4c-.44.29-.95.45-1.47.45h-1.18c-.81 0-1.54.49-1.84 1.24l-1.57 3.87c-.43 1.05-1.89 1.39-2.74.64zm.02-1.5l1.42.07-.37-.93.14.86h-1.19z"/>
              </svg>
              <span className="font-semibold">Launch & Buy</span>
              <span className="ml-auto text-sm text-pink-400">Final</span>
            </div>
            <input
              type="text"
              placeholder="SOL Amount"
              className="bg-slate-800/50 p-2 rounded border border-pink-500/20"
              value={flowData.solAmount}
              onChange={(e) => setFlowData(prev => ({ ...prev, solAmount: e.target.value }))}
            />
            <button className="bg-gradient-to-r from-blue-500 to-pink-500 p-2 rounded text-white font-medium">
              Launch Token
            </button>
          </div>
        ),
        status: 'ready'
      },
      style: getNodeStyle('launch')
    },

    // Infrastructure Window Title
    {
      id: 'infrastructure-window-title',
      type: 'group',
      position: { x: infrastructureWindow.x, y: infrastructureWindow.y - 40 },
      data: {
        label: (
          <div className="flex items-center gap-2 text-white">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 font-mono">Blockchain Infrastructure</span>
          </div>
        )
      },
      style: {
        width: infrastructureWindow.width,
        background: 'transparent',
      }
    },

    // Infrastructure Nodes - Evenly spaced
    {
      id: 'jito-mev',
      position: { x: infrastructureWindow.x + 50, y: infrastructureWindow.y + 80 },
      data: {
        label: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span className="font-semibold">Jito MEV</span>
              <span className="ml-auto text-sm text-blue-400">Processing</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className={`h-1 rounded ${i < currentStep ? 'bg-blue-400' : 'bg-slate-600'}`} />
              ))}
            </div>
          </div>
        )
      },
      style: getNodeStyle('infrastructure')
    },
    {
      id: 'validators',
      position: { x: infrastructureWindow.x + 350, y: infrastructureWindow.y + 80 },
      data: {
        label: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span className="font-semibold">Validators</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {['1.5%', '2%', '3%', '1%', '0.5%'].map((stake, i) => (
                <div key={i} className="text-xs text-center text-purple-400">
                  {stake}
                </div>
              ))}
            </div>
          </div>
        )
      },
      style: getNodeStyle('infrastructure')
    },
    {
      id: 'block-building',
      position: { x: infrastructureWindow.x + 650, y: infrastructureWindow.y + 80 },
      data: {
        label: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              </svg>
              <span className="font-semibold">Block Building</span>
            </div>
            <div className="space-y-1">
              <div className="h-1 bg-orange-400 rounded w-3/4" />
              <div className="h-1 bg-orange-400 rounded w-1/2" />
              <div className="h-1 bg-orange-400 rounded w-1/4" />
            </div>
          </div>
        )
      },
      style: getNodeStyle('infrastructure')
    },
    {
      id: 'consensus',
      position: { x: infrastructureWindow.x + 950, y: infrastructureWindow.y + 80 },
      data: {
        label: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="font-semibold">Consensus</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-6 bg-slate-800/50 rounded" />
              ))}
            </div>
          </div>
        )
      },
      style: getNodeStyle('infrastructure')
    },

    // Window Backgrounds
    {
      id: 'ui-window-bg',
      type: 'group',
      position: { x: uiWindow.x, y: uiWindow.y },
      style: {
        width: uiWindow.width,
        height: uiWindow.height,
        background: 'rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '8px',
        zIndex: -1,
      }
    },
    {
      id: 'infrastructure-window-bg',
      type: 'group',
      position: { x: infrastructureWindow.x, y: infrastructureWindow.y },
      style: {
        width: infrastructureWindow.width,
        height: infrastructureWindow.height,
        background: 'rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(249, 115, 22, 0.2)',
        borderRadius: '8px',
        zIndex: -1,
      }
    },
  ];

  const edges: Edge[] = [
    // UI Flow Edges - Straight horizontal connections
    {
      id: 'e-wallet-token',
      source: 'wallet',
      target: 'token-details',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#818cf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
    },
    {
      id: 'e-token-social',
      source: 'token-details',
      target: 'social-links',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#818cf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
    },
    {
      id: 'e-social-wallet',
      source: 'social-links',
      target: 'wallet',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#818cf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
    },
    {
      id: 'e-wallet-mev',
      source: 'wallet',
      target: 'mev-config',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#818cf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
    },
    {
      id: 'e-mev-launch',
      source: 'mev-config',
      target: 'launch',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#818cf8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
    },

    // Infrastructure Flow Edges
    {
      id: 'e-jito-validators',
      source: 'jito-mev',
      target: 'validators',
      type: 'smoothstep',
      animated: isPlaying,
      style: { stroke: '#f97316', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
    },
    {
      id: 'e-validators-building',
      source: 'validators',
      target: 'block-building',
      type: 'smoothstep',
      animated: isPlaying,
      style: { stroke: '#f97316', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
    },
    {
      id: 'e-building-consensus',
      source: 'block-building',
      target: 'consensus',
      type: 'smoothstep',
      animated: isPlaying,
      style: { stroke: '#06b6d4', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' },
    },

    // Cross-Window Connections - Make them more visible
    {
      id: 'e-launch-jito',
      source: 'launch',
      target: 'jito-mev',
      type: 'smoothstep',
      animated: isPlaying,
      style: { 
        stroke: 'url(#gradient)',
        strokeWidth: 3,  // Thicker for visibility
        strokeDasharray: '5,5'
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
    },
    {
      id: 'e-consensus-complete',
      source: 'consensus',
      target: 'launch',
      type: 'smoothstep',
      animated: isPlaying,
      style: { 
        stroke: 'url(#gradient)',
        strokeWidth: 3,  // Thicker for visibility
        strokeDasharray: '5,5'
      },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
    },
  ];

  // Animation control
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Start the animation sequence
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCurrentStep(step);
        if (step >= 5) {
          clearInterval(interval);
          setIsPlaying(false);
          setCurrentStep(0);
        }
      }, 1000);
    }
  };

  return (
    <div className="h-screen bg-[#0B1120]">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={togglePlay}
          className="bg-slate-800 p-2 rounded-full hover:bg-slate-700"
        >
          {isPlaying ? <Pause className="text-white" /> : <Play className="text-white" />}
        </button>
      </div>
      <div className="h-full">
        <ReactFlow 
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          defaultZoom={0.8}  // Show more of the diagram by default
        >
          <Background color="#1E293B" gap={16} />
          <Controls className="fill-white" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </ReactFlow>
      </div>
    </div>
  );
};

export default TokenLaunchFlow; 