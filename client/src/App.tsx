import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AgentCreator from "./pages/AgentCreator";
import ChatToAgent from "./pages/ChatToAgent";
import SocialFeed from "./pages/SocialFeed";
import AgentGallery from "./pages/AgentGallery";
import TokenLaunch from './pages/TokenLaunch';
import "./App.css";
import SocialDashboard from "./pages/SocialDashboard";
import CookieDotFunDataTesting from "./pages/cookieDotFunDataTesting";
import TwitterTrade from "./pages/TwitterTrade/AISocialManager";
import Login from "./pages/Account/Login";
import SignUp from './pages/Account/SignUp';
import ForgotPassword from './pages/Account/ForgotPassword';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();

  // Helper function to determine if link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <AuthProvider>
      <div id="root" className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
            <Navbar />

            {/* Main Content */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/agent-creator" element={<AgentCreator />} />
              <Route path="/agent-gallery" element={<AgentGallery />} />
              <Route path="/social-feed" element={<SocialFeed />} />
              <Route path="/chat-to-agent" element={<ChatToAgent />} />
              <Route path="/token-launch" element={<TokenLaunch />} />
              <Route path="/social-dashboard" element={<SocialDashboard />} />
              <Route path="/cookie-fun-testing" element={<CookieDotFunDataTesting />} />
              <Route path="/twitter-trade" element={<TwitterTrade />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-slate-900/80 py-6 text-center text-sm text-gray-400 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <p>
              © {new Date().getFullYear()} ARAI AI Creator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;