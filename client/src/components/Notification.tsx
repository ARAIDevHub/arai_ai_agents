import React from 'react';

interface NotificationProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50`}
      onClick={onClose}
    >
      <div
        className={`bg-white p-4 rounded shadow-md border ${
          type === 'error' ? 'border-red-500' : type === 'success' ? 'border-green-500' : 'border-blue-500'
        }`}
      >
        <p className={`text-${type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue'}-500`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Notification; 