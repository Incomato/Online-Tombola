
import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  setView: (view: 'raffle' | 'dashboard' | 'admin') => void;
  currentView: 'raffle' | 'dashboard' | 'login' | 'admin';
}

const NavButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout, setView, currentView }) => {
  const isAdmin = user.name.toLowerCase() === 'admin';
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
             <h1 className="text-2xl font-bold text-white">
                <span className="text-indigo-400">Online</span> Tombola
             </h1>
             <nav className="hidden md:flex space-x-4">
                <NavButton onClick={() => setView('raffle')} isActive={currentView === 'raffle'}>
                    Raffle
                </NavButton>
                <NavButton onClick={() => setView('dashboard')} isActive={currentView === 'dashboard'}>
                    My Dashboard
                </NavButton>
                {isAdmin && (
                    <NavButton onClick={() => setView('admin')} isActive={currentView === 'admin'}>
                        Admin
                    </NavButton>
                )}
             </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-indigo-300 font-semibold">
                Balance: ${user.balance.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
         <div className="md:hidden flex justify-center pb-2 space-x-2">
            <NavButton onClick={() => setView('raffle')} isActive={currentView === 'raffle'}>
                Raffle
            </NavButton>
            <NavButton onClick={() => setView('dashboard')} isActive={currentView === 'dashboard'}>
                My Dashboard
            </NavButton>
            {isAdmin && (
                <NavButton onClick={() => setView('admin')} isActive={currentView === 'admin'}>
                    Admin
                </NavButton>
            )}
         </div>
      </div>
    </header>
  );
};

export default Header;
