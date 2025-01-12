import React, { ChangeEvent } from 'react';

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const Input: React.FC<InputProps> = ({ style, ...props }) => (
  <input
    {...props}
    style={style}
    className="w-full px-3 py-2 rounded-md bg-slate-900/50 border border-orange-500/20 
               text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
  />
);

export default Input; 