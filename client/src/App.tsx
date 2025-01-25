import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import AgentCreator from "./pages/AgentCreator";
// import NodeCreator from './pages/NodeCreator'; // Removed NodeCreator import
import ChatToAgent from "./pages/ChatToAgent";
import SocialFeed from "./pages/SocialFeed";
import AgentGallery from "./pages/AgentGallery";
import TokenLaunchForm from "./pages/TokenLaunch";
import TokenLaunchFlow from "./pages/TokenLaunchFlow";
import "./App.css";

// Components
// import Header from './components/Header';

function App() {
  const location = useLocation();

  // Helper function to determine if link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-900 to-orange-900 shadow-xl">
        <div className="container mx-auto px-2 py-0 flex justify-center items-center h-20">
          <img
            src="./src/assets/araiBannerTransarent.png"
            alt="ARAI AI Logo"
            className="h-36 w-auto bg-gradient-to-r from-cyan-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
          />
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-900/80 py-4 shadow-lg backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-center space-x-8">
          <Link
            to="/"
            className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
              ${
                isActive("/")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
          >
            Home
          </Link>
          <Link
            to="/agent-creator"
            className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
              ${
                isActive("/agent-creator")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
          >
            Create Agent
          </Link>

          <Link
            to="/agent-gallery"
            className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
              ${
                isActive("/agent-gallery")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
          >
            Agent Gallery
          </Link>
          <Link
            to="/social-feed"
            className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
              ${
                isActive("/social-feed")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
          >
            Social Feed
          </Link>
          <Link
            to="/chat-to-agent"
            className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
              ${
                isActive("/chat-to-agent")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
          >
            Chat to Agent
          </Link>

          <Link
            to="/token-launch"
            className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
              ${
                isActive("/token-launch")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
          >
            Token Launch
          </Link>

          <Link
            to="/token-launch-flow"
            className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
              ${
                isActive("/token-launch-flow")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
              }`}
          >
            Token Launch Flow
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agent-creator" element={<AgentCreator />} />
          {/* <Route path="/agent-studio" element={<AgentStudio />} /> */}
          <Route path="/agent-gallery" element={<AgentGallery />} />
          <Route path="/social-feed" element={<SocialFeed />} />
          <Route path="/chat-to-agent" element={<ChatToAgent />} />
          <Route path="/token-launch" element={<TokenLaunchForm />} />
          <Route path="/token-launch-flow" element={<TokenLaunchFlow />} />
        </Routes>
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
  );
}

export default App;
