import React, { useState } from 'react';
import type { Prize, User } from '../types';
import BuyConfirmationModal from './BuyConfirmationModal';
import Countdown from './Countdown';

interface PrizeCardProps {
  prize: Prize;
  onBuyTickets: (prizeId: string, quantity: number) => void;
  onDrawWinner: (prizeId: string) => void;
  onEditPrize: (prize: Prize) => void;
  currentUser: User | null;
  ticketsSold: number;
  drawTime: Date;
}

const PrizeCard: React.FC<PrizeCardProps> = ({ prize, onBuyTickets, onDrawWinner, onEditPrize, currentUser, ticketsSold, drawTime }) => {
  const [quantity, setQuantity] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isConfirmingPurchase, setIsConfirmingPurchase] = useState(false);
  const [isCopied, setIsCopied] = useState(false);


  const handleBuy = () => {
    if (quantity > 0) {
      setIsConfirmingPurchase(true);
    }
  };

  const handleConfirmPurchase = () => {
    onBuyTickets(prize.id, quantity);
    setIsConfirmingPurchase(false);
  };
  
  const handleDraw = () => {
    setIsDrawing(true);
    // Simulate drawing animation time
    setTimeout(() => {
        onDrawWinner(prize.id);
        setIsDrawing(false);
    }, 3000);
  };
  
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?prizeId=${prize.id}`;
    const shareData = {
        title: `Win a ${prize.name}!`,
        text: `Check out this prize in the Online Tombola: ${prize.description}`,
        url: url,
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Share failed:', err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            alert('Could not copy link to clipboard.');
        }
    }
  };


  const remainingTickets = prize.maxTickets - ticketsSold;
  const maxAffordable = currentUser && prize.ticketPrice > 0 ? Math.floor(currentUser.balance / prize.ticketPrice) : 0;
  const maxPurchaseable = Math.max(0, Math.min(remainingTickets, maxAffordable));
  const isSoldOut = ticketsSold >= prize.maxTickets;
  const progressPercentage = prize.maxTickets > 0 ? (ticketsSold / prize.maxTickets) * 100 : 0;
  
  const handleDecrement = () => {
    setQuantity(q => Math.max(1, q - 1));
  };

  const handleIncrement = () => {
    setQuantity(q => Math.min(maxPurchaseable, q + 1));
  };

  return (
    <>
      <div className={`bg-slate-800 rounded-lg overflow-hidden shadow-xl transition-all duration-300 ease-in-out transform flex flex-col md:flex-row border-2 border-transparent ${isDrawing ? 'animate-pulse-draw pointer-events-none' : 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/30'}`}>
        <div className="relative w-full md:w-1/3 h-48 md:h-auto">
          <img src={prize.image} alt={prize.name} className="w-full h-full object-cover" />
          {isSoldOut && !prize.winner && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-bold tracking-widest transform -rotate-12 border-4 border-white px-4 py-2 rounded-lg">SOLD OUT</span>
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-2xl font-bold text-white">{prize.name}</h3>
            <p className="text-slate-400 mt-2 text-sm">{prize.description}</p>
            
            {!prize.winner && <Countdown targetDate={drawTime} />}

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold text-indigo-400">${prize.ticketPrice} / ticket</p>
                  <p className="text-sm text-slate-300">{ticketsSold} / {prize.maxTickets} tickets sold</p>
              </div>
               <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            {prize.winner ? (
              <div className="text-center bg-green-900/50 border border-green-500 p-4 rounded-lg">
                <p className="text-slate-300">Winner:</p>
                <p className="text-2xl font-bold text-green-400">{prize.winner.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {isSoldOut ? (
                   <div className="text-center bg-rose-900/50 border border-rose-500 p-3 rounded-lg">
                    <p className="text-xl font-bold text-rose-400">Sold Out! Awaiting Draw.</p>
                  </div>
                ) : (
                  <>
                    {maxPurchaseable === 0 && (
                      <div className="text-center bg-yellow-900/50 border border-yellow-500 p-3 rounded-lg">
                        <p className="text-sm font-bold text-yellow-300">Your balance is too low to purchase tickets for this prize.</p>
                      </div>
                    )}
                    <div className="flex items-stretch space-x-2">
                      <div className="flex items-center rounded-md border border-slate-700">
                        <button
                          onClick={handleDecrement}
                          disabled={quantity <= 1 || isDrawing || maxPurchaseable === 0}
                          className="px-3 bg-slate-700 text-lg font-bold text-white rounded-l-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Decrease ticket quantity"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          role="spinbutton"
                          aria-valuemin={1}
                          aria-valuemax={maxPurchaseable}
                          aria-valuenow={quantity}
                          value={Math.min(quantity, maxPurchaseable) || 1}
                          onChange={(e) => {
                              const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 1;
                              setQuantity(Math.max(1, Math.min(val, maxPurchaseable)));
                          }}
                          className="w-16 text-center bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                          disabled={isDrawing || maxPurchaseable === 0}
                        />
                        <button
                          onClick={handleIncrement}
                          disabled={quantity >= maxPurchaseable || isDrawing || maxPurchaseable === 0}
                          className="px-3 bg-slate-700 text-lg font-bold text-white rounded-r-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Increase ticket quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={handleBuy}
                        disabled={isDrawing || quantity <= 0 || quantity > maxPurchaseable}
                        className="flex-grow py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Buy {quantity} Ticket{quantity > 1 ? 's' : ''} for ${prize.ticketPrice * quantity}
                      </button>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-2">
                   <button
                    onClick={handleShare}
                    className="flex-1 py-2 px-4 text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    disabled={isDrawing}
                    title="Share this prize"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367 2.684z" />
                    </svg>
                    <span>{isCopied ? 'Copied!' : 'Share'}</span>
                  </button>
                  <button
                    onClick={() => onEditPrize(prize)}
                    className="flex-1 py-2 px-4 text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={isDrawing}
                  >
                    Edit Prize
                  </button>
                  <button
                    onClick={handleDraw}
                    disabled={ticketsSold === 0 || isDrawing}
                    className="flex-1 py-2 px-4 text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {isDrawing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Drawing...
                      </>
                    ) : (
                      'Draw Winner'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isConfirmingPurchase && (
        <BuyConfirmationModal
          prize={prize}
          quantity={quantity}
          onConfirm={handleConfirmPurchase}
          onClose={() => setIsConfirmingPurchase(false)}
        />
      )}
    </>
  );
};

export default PrizeCard;