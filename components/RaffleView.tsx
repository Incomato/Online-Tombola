import React, { useMemo } from 'react';
import type { Prize, Ticket, User } from '../types';
import PrizeCard from './PrizeCard';

interface RaffleViewProps {
  prizes: Prize[];
  tickets: Ticket[];
  onBuyTickets: (prizeId: string, quantity: number) => void;
  onDrawWinner: (prizeId: string) => void;
  onEditPrize: (prize: Prize) => void;
  currentUser: User | null;
}

const RaffleView: React.FC<RaffleViewProps> = ({ prizes, tickets, onBuyTickets, onDrawWinner, onEditPrize, currentUser }) => {
  const nextDrawTime = useMemo(() => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    nextHour.setMilliseconds(0);
    return nextHour;
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-300">Current Prizes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        {prizes.map(prize => (
          <PrizeCard
            key={prize.id}
            prize={prize}
            onBuyTickets={onBuyTickets}
            onDrawWinner={onDrawWinner}
            onEditPrize={onEditPrize}
            currentUser={currentUser}
            ticketsSold={tickets.filter(t => t.prizeId === prize.id).length}
            drawTime={nextDrawTime}
          />
        ))}
      </div>
    </div>
  );
};

export default RaffleView;