
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { User, Prize, Ticket, AuthError } from './types';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import RaffleView from './components/RaffleView';
import UserDashboard from './components/UserDashboard';
import WinnerModal from './components/WinnerModal';
import EditPrizeModal from './components/EditPrizeModal';
import AdminView from './components/AdminView';
import AddPrizeModal from './components/AddPrizeModal';
import ToastNotification from './components/ToastNotification';

const INITIAL_PRIZES: Prize[] = [
  { id: 'p1', name: 'Luxury Vacation Package', description: 'A 7-day all-inclusive trip for two to the Maldives.', image: 'https://picsum.photos/seed/vacation/600/400', ticketPrice: 50, winner: null, maxTickets: 200 },
  { id: 'p2', name: 'High-End Laptop', description: 'The latest model with top-tier specs for work and play.', image: 'https://picsum.photos/seed/laptop/600/400', ticketPrice: 25, winner: null, maxTickets: 300 },
  { id: 'p3', name: 'Gourmet Coffee Machine', description: 'Become your own barista with this state-of-the-art machine.', image: 'https://picsum.photos/seed/coffee/600/400', ticketPrice: 10, winner: null, maxTickets: 500 },
  { id: 'p4', name: 'One Year of Streaming Services', description: 'Enjoy unlimited entertainment with all major streaming platforms.', image: 'https://picsum.photos/seed/stream/600/400', ticketPrice: 5, winner: null, maxTickets: 1000 },
];

type View = 'login' | 'raffle' | 'dashboard' | 'admin';

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [currentView, setCurrentView] = useState<View>('login');
  const [winnerInfo, setWinnerInfo] = useState<{ prize: Prize, winner: User } | null>(null);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [isAddingPrize, setIsAddingPrize] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data from storage on initial render
  useEffect(() => {
    try {
        const storedUsers = localStorage.getItem('tombola_users');
        const storedPrizes = localStorage.getItem('tombola_prizes');
        const storedTickets = localStorage.getItem('tombola_tickets');
        const sessionUser = sessionStorage.getItem('tombola_currentUser');

        if (storedUsers) setAllUsers(JSON.parse(storedUsers));
        
        if (storedPrizes) setPrizes(JSON.parse(storedPrizes));
        else setPrizes(INITIAL_PRIZES);
        
        if (storedTickets) setAllTickets(JSON.parse(storedTickets));
        
        if (sessionUser) {
            const user = JSON.parse(sessionUser);
            setCurrentUser(user);
            setCurrentView(user.name.toLowerCase() === 'admin' ? 'admin' : 'raffle');
        }
    } catch (error) {
        console.error("Failed to load data from storage", error);
        // Reset if data is corrupt
        setPrizes(INITIAL_PRIZES);
    }
  }, []);

  // Persist data changes to localStorage
  useEffect(() => {
      localStorage.setItem('tombola_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
      localStorage.setItem('tombola_prizes', JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
      localStorage.setItem('tombola_tickets', JSON.stringify(allTickets));
  }, [allTickets]);

  const userTickets = useMemo(() => {
    if (!currentUser) return [];
    return allTickets.filter(ticket => ticket.ownerId === currentUser.id);
  }, [allTickets, currentUser]);

  const prizesWon = useMemo(() => {
    if (!currentUser) return [];
    return prizes.filter(prize => prize.winner?.id === currentUser.id);
  }, [prizes, currentUser]);

  const handleRegister = async (name: string, password: string): Promise<AuthError | boolean> => {
    if (name.trim().length < 3) return { name: "Username must be at least 3 characters long." };
    if (password.length < 4) return { password: "Password must be at least 4 characters long." };
    if (allUsers.find(u => u.name.toLowerCase() === name.trim().toLowerCase())) {
        return { name: "This username is already taken. Please choose another." };
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        password: password, // In a real app, this should be hashed
        balance: 1000,
    };

    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    sessionStorage.setItem('tombola_currentUser', JSON.stringify(newUser));
    setCurrentView(newUser.name.toLowerCase() === 'admin' ? 'admin' : 'raffle');
    return true;
  };

  const handleLogin = async (name: string, password: string): Promise<AuthError | boolean> => {
    const user = allUsers.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
    if (!user || user.password !== password) {
        return { form: "Invalid username or password." };
    }
    
    setCurrentUser(user);
    sessionStorage.setItem('tombola_currentUser', JSON.stringify(user));
    setCurrentView(user.name.toLowerCase() === 'admin' ? 'admin' : 'raffle');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('tombola_currentUser');
    setCurrentView('login');
  };

  const handleBuyTickets = useCallback((prizeId: string, quantity: number) => {
    if (!currentUser) return;

    const prize = prizes.find(p => p.id === prizeId);
    if (!prize) return;

    const totalCost = prize.ticketPrice * quantity;
    if (currentUser.balance < totalCost) {
      alert("Not enough balance!");
      return;
    }
    
    const ticketsSold = allTickets.filter(t => t.prizeId === prizeId).length;
    if (ticketsSold + quantity > prize.maxTickets) {
        const remaining = prize.maxTickets - ticketsSold;
        alert(`Sorry, you can't buy ${quantity} tickets. Only ${remaining} ticket${remaining === 1 ? '' : 's'} remaining for this prize.`);
        return;
    }

    const newTickets: Ticket[] = Array.from({ length: quantity }, (_, i) => ({
      id: `ticket-${Date.now()}-${i}`,
      prizeId: prize.id,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
    }));

    setAllTickets(prev => [...prev, ...newTickets]);

    const updatedUser = { ...currentUser, balance: currentUser.balance - totalCost };
    setCurrentUser(updatedUser);
    setAllUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    sessionStorage.setItem('tombola_currentUser', JSON.stringify(updatedUser));
  }, [currentUser, prizes, allTickets]);

  const handleDrawWinner = useCallback((prizeId: string) => {
    const prize = prizes.find(p => p.id === prizeId);
    if (!prize || prize.winner) return;

    const relevantTickets = allTickets.filter(t => t.prizeId === prizeId);
    if (relevantTickets.length === 0) {
      alert("No tickets sold for this prize. Cannot draw a winner.");
      return;
    }

    const winningTicket = relevantTickets[Math.floor(Math.random() * relevantTickets.length)];
    const winnerUser = allUsers.find(u => u.id === winningTicket.ownerId);

    if (!winnerUser) {
        console.error("Winner account not found!");
        alert("An error occurred: the winning user's account could not be found.");
        return;
    }
    
    const { password, ...winnerData } = winnerUser; // Exclude password from prize data
    
    setToastMessage(`🎉 ${winnerUser.name} won the ${prize.name}! 🎉`);

    setPrizes(prevPrizes => prevPrizes.map(p =>
      p.id === prizeId ? { ...p, winner: winnerData } : p
    ));
    
    setWinnerInfo({ prize, winner: winnerData });
  }, [allTickets, prizes, allUsers]);

  const handleTopUpBalance = useCallback((amount: number) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, balance: currentUser.balance + amount };
    setCurrentUser(updatedUser);
    setAllUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    sessionStorage.setItem('tombola_currentUser', JSON.stringify(updatedUser));
  }, [currentUser]);

  const handleOpenEditModal = (prize: Prize) => {
    setEditingPrize(prize);
  };

  const handleCloseEditModal = () => {
    setEditingPrize(null);
  };

  const handleUpdatePrize = (updatedPrize: Prize) => {
    setPrizes(prevPrizes =>
      prevPrizes.map(p => (p.id === updatedPrize.id ? updatedPrize : p))
    );
    setEditingPrize(null);
  };
  
  const handleAddNewPrize = (prizeData: Omit<Prize, 'id' | 'winner'>) => {
    const newPrize: Prize = {
      ...prizeData,
      id: `prize-${Date.now()}`,
      winner: null,
    };
    setPrizes(prev => [newPrize, ...prev]);
    setIsAddingPrize(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'raffle':
        return <RaffleView prizes={prizes} tickets={allTickets} onBuyTickets={handleBuyTickets} onDrawWinner={handleDrawWinner} onEditPrize={handleOpenEditModal} currentUser={currentUser} />;
      case 'dashboard':
        return <UserDashboard user={currentUser!} tickets={userTickets} prizesWon={prizesWon} prizes={prizes} onTopUp={handleTopUpBalance} />;
      case 'admin':
        return <AdminView onOpenAddModal={() => setIsAddingPrize(true)} />;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans">
      {toastMessage && <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />}
      <Header user={currentUser} onLogout={handleLogout} setView={setCurrentView} currentView={currentView} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      {winnerInfo && <WinnerModal prize={winnerInfo.prize} winner={winnerInfo.winner} onClose={() => setWinnerInfo(null)} />}
      {editingPrize && <EditPrizeModal prize={editingPrize} onUpdate={handleUpdatePrize} onClose={handleCloseEditModal} />}
      {isAddingPrize && <AddPrizeModal onAdd={handleAddNewPrize} onClose={() => setIsAddingPrize(false)} />}
       <footer className="text-center py-6 text-sm text-slate-500">
          <p>Disclaimer: This is a fully functional frontend demonstration application.</p>
          <p>It does not involve real money and should not be used for actual gambling purposes.</p>
      </footer>
    </div>
  );
};

export default App;
