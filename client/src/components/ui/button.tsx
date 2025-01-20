import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-lg text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 