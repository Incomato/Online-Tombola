
import React from 'react';

interface AdminViewProps {
  onOpenAddModal: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onOpenAddModal }) => {
  return (
    <div className="animate-scale-in">
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
        <p className="text-slate-400 mt-2">Manage prizes and raffle settings.</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
         <h3 className="text-2xl font-bold mb-4 text-white">Prize Management</h3>
         <button
            onClick={onOpenAddModal}
            className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 transform hover:scale-105"
         >
            Add New Prize
         </button>
      </div>
    </div>
  );
};

export default AdminView;
