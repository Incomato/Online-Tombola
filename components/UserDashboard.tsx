
import React from 'react';
import type { User, Ticket, Prize } from '../types';

interface UserDashboardProps {
  user: User;
  tickets: Ticket[];
  prizesWon: Prize[];
  prizes: Prize[];
  onTopUp: (amount: number) => void;
}

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3.375a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75z" clipRule="evenodd" />
    </svg>
);


const UserDashboard: React.FC<UserDashboardProps> = ({ user, tickets, prizesWon, prizes, onTopUp }) => {

  const getPrizeDetails = (prizeId: string): Prize | undefined => {
    return prizes.find(p => p.id === prizeId);
  };

  return (
    <div className="space-y-8 animate-scale-in">
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-white">Welcome, {user.name}!</h2>
        <div className="flex items-center justify-between mt-4">
            <p className="text-xl text-indigo-400">Current Balance: ${user.balance.toLocaleString()}</p>
            <button
                onClick={() => onTopUp(100)}
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>Top Up $100</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-white">My Tickets ({tickets.length})</h3>
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {tickets.length > 0 ? (
              tickets.map(ticket => {
                const prize = getPrizeDetails(ticket.prizeId);
                return (
                  <div key={ticket.id} className="bg-slate-700 p-3 rounded-lg flex items-center space-x-4">
                     <img src={prize?.image} alt={prize?.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0 bg-slate-600"/>
                     <div className="flex-grow overflow-hidden">
                       <p className="font-semibold text-indigo-300 truncate">{prize?.name || 'Unknown Prize'}</p>
                       <p className="font-mono text-xs text-slate-500 truncate">TICKET ID: {ticket.id}</p>
                     </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                 <TrophyIcon className="w-16 h-16 text-slate-600" />
                 <p className="text-slate-400 mt-4">You haven't purchased any tickets yet. <br />Go to the raffle to get started!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-white">My Winnings ({prizesWon.length})</h3>
          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {prizesWon.length > 0 ? (
              prizesWon.map(prize => (
                <div key={prize.id} className="bg-slate-700 p-4 rounded-lg flex items-center space-x-4">
                  <img src={prize.image} alt={prize.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0"/>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-bold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-amber-400 flex-shrink-0">
                            <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.071L12 4.44l-1.036-1.037a.75.75 0 00-1.071-1.071l-1.5 1.5a.75.75 0 000 1.071l1.036 1.037-1.875 1.875a.75.75 0 000 1.071l1.5 1.5a.75.75 0 001.071 0L12 9.56l1.875 1.875a.75.75 0 001.071 0l1.5-1.5a.75.75 0 000-1.071l-1.875-1.875 1.036-1.037a.75.75 0 000-1.071l-1.5-1.5z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M3 10.5a.75.75 0 00.75.75h16.5a.75.75 0 000-1.5H3.75a.75.75 0 00-.75.75zM4.5 15a.75.75 0 00.75.75h13.5a.75.75 0 000-1.5H5.25a.75.75 0 00-.75.75zM6 18.75A.75.75 0 006.75 19.5h10.5a.75.75 0 000-1.5H6.75a.75.75 0 00-.75.75z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{prize.name}</span>
                    </p>
                    <p className="text-sm text-slate-300 mt-1 truncate">{prize.description}</p>
                  </div>
                </div>
              ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <TrophyIcon className="w-16 h-16 text-slate-600" />
                    <p className="text-slate-400 mt-4">No prizes won yet. <br />Good luck in the next draw!</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
