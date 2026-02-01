import React from 'react';
import type { Prize } from '../types';

interface BuyConfirmationModalProps {
  prize: Prize;
  quantity: number;
  onConfirm: () => void;
  onClose: () => void;
}

const BuyConfirmationModal: React.FC<BuyConfirmationModalProps> = ({ prize, quantity, onConfirm, onClose }) => {
  const totalCost = prize.ticketPrice * quantity;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-scale-in"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-indigo-500 text-center"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white mb-4">Confirm Purchase</h2>
        <p className="text-slate-300 mb-6">
          Are you sure you want to buy <span className="font-bold text-indigo-400">{quantity}</span> ticket{quantity > 1 ? 's' : ''} for the <span className="font-bold text-white">{prize.name}</span>?
        </p>
        <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-xl text-slate-200">Total Cost: <span className="font-bold text-green-400">${totalCost.toLocaleString()}</span></p>
        </div>
        <div className="flex justify-center space-x-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Confirm & Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyConfirmationModal;
