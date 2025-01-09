import React from 'react';
import logo from '../assets/logo.png'; // Import your logo image

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-cyan-900 to-orange-900 shadow-xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Replace the h1 with an img tag for your logo */}
        <img src={logo} alt="ARAI AI Logo" className="h-12" />

        {/* You can add other header elements here, if needed */}
      </div>
    </header>
  );
};

export default Header;