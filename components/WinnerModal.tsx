import React from 'react';
import type { Prize, User } from '../types';

interface WinnerModalProps {
  prize: Prize;
  winner: User;
  onClose: () => void;
}

// The animation class is now part of the component for simplicity.
const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute w-2 h-4 animate-confetti-rain" style={style}></div>
);

const WinnerModal: React.FC<WinnerModalProps> = ({ prize, winner, onClose }) => {
  // Generate a larger number of confetti pieces for a more celebratory effect.
  const confetti = Array.from({ length: 150 }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      animationDelay: `${Math.random() * 4}s`, // Spread out the start times
    };
    return <ConfettiPiece key={i} style={style} />;
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-scale-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border-2 border-amber-400 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none">
          {confetti}
        </div>
        
        <h2 className="text-4xl font-bold text-amber-300">We have a winner!</h2>
        <p className="mt-4 text-slate-300">Congratulations to</p>
        <p className="text-5xl font-extrabold text-white my-4">{winner.name}</p>
        <p className="text-slate-300">You have won the</p>
        <div className="mt-6 bg-slate-700 p-4 rounded-lg">
            <img src={prize.image} alt={prize.name} className="w-full h-48 object-cover rounded-md mx-auto mb-4" />
            <p className="text-2xl font-bold text-indigo-300">{prize.name}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-8 py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;