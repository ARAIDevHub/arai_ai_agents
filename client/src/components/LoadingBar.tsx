import { useState, useEffect } from 'react';

const LoadingBar = ({ progress }: { progress: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setWidth(progress);
    }, 100); // Delay to simulate dynamic loading

    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <div>
      <div className="text-white mb-2 site-text-class">Agent Image Generating...</div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-full rounded-full transition-all duration-[15000ms]" 
          style={{ 
            width: `${Math.min(Math.max(width, 0), 100)}%`,
            background: 'linear-gradient(to right, #06b6d4, #f97316)' // Updated gradient from cyan to orange
          }} 
        />
      </div>
    </div>
  );
};

export default LoadingBar; 