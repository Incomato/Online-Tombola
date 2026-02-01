
import React, { useEffect } from 'react';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Duration matches the animation in index.html

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 w-full max-w-sm z-[100]">
      <div className="bg-slate-800/80 backdrop-blur-sm border-2 border-green-500 text-white p-4 rounded-lg shadow-2xl animate-slide-in-out flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-green-400">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-grow pt-0.5">
          <p className="font-semibold">{message}</p>
        </div>
        <div className="flex-shrink-0">
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
