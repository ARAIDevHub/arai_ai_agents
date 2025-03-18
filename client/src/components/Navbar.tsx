// components/Navbar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
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
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                ${isActive("/")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
                }`}
            >
              Home
            </Link>
            <Link
              to="/agent-creator"
              className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                ${isActive("/agent-creator")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
                }`}
            >
              Create Agent
            </Link>
            <Link
              to="/agent-gallery"
              className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                ${isActive("/agent-gallery")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
                }`}
            >
              Agent Gallery
            </Link>
            <Link
              to="/social-feed"
              className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                ${isActive("/social-feed")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
                }`}
            >
              Social Feed
            </Link>
            <Link
              to="/chat-to-agent"
              className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                ${isActive("/chat-to-agent")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
                }`}
            >
              Chat to Agent
            </Link>
            <Link
              to="/token-launch"
              className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                ${isActive("/token-launch")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
                }`}
            >
              Token Launch
            </Link>
            <Link
              to="/twitter-trade"
              className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                ${isActive("/twitter-trade")
                  ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                  : "text-gray-300 hover:text-cyan-400"
                }`}
            >
              Twitter Trade
            </Link>
          </div>

          <div>
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link
                to="/login"
                className={`text-lg font-semibold transition duration-300 px-4 py-2 rounded-lg
                  ${isActive("/login")
                    ? "bg-gradient-to-r from-cyan-600 to-orange-600 text-white"
                    : "text-gray-300 hover:text-cyan-400"
                  }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
