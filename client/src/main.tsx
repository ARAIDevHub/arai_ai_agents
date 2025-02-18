import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { AgentProvider } from './context/AgentContext';
import AppWalletProvider from './components/WalletProvider';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgentProvider>
      <AppWalletProvider>
        <Router>
          <App />
        </Router>
      </AppWalletProvider>
    </AgentProvider>
  </StrictMode>,
)
   