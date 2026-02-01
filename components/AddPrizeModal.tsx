
import React, { useState } from 'react';
import type { Prize } from '../types';

interface AddPrizeModalProps {
  onAdd: (prizeData: Omit<Prize, 'id' | 'winner'>) => void;
  onClose: () => void;
}

const AddPrizeModal: React.FC<AddPrizeModalProps> = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ticketPrice: 10,
    maxTickets: 100,
    image: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    ticketPrice: '',
    maxTickets: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumericField = name === 'ticketPrice' || name === 'maxTickets';
    setFormData(prev => ({
      ...prev,
      [name]: isNumericField ? (value === '' ? '' : parseFloat(value)) : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string,
        }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors = { name: '', description: '', ticketPrice: '', maxTickets: '' };
    let isValid = true;

    if (formData.name.trim() === '') {
      newErrors.name = 'Prize name cannot be empty.';
      isValid = false;
    }

    if (formData.description.trim() === '') {
      newErrors.description = 'Description cannot be empty.';
      isValid = false;
    }

    if (isNaN(Number(formData.ticketPrice)) || Number(formData.ticketPrice) <= 0) {
      newErrors.ticketPrice = 'Ticket price must be a positive number.';
      isValid = false;
    }
    
    if (isNaN(Number(formData.maxTickets)) || Number(formData.maxTickets) <= 0) {
      newErrors.maxTickets = 'Max tickets must be a positive number.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd({
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        maxTickets: Number(formData.maxTickets),
        image: formData.image || `https://picsum.photos/seed/${formData.name.replace(/\s+/g, '-')}/600/400`,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-scale-in"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full border-2 border-indigo-500"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-white mb-6">Add New Prize</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">Prize Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 bg-slate-900 border rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-slate-700'}`}
            />
            {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 bg-slate-900 border rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-500' : 'border-slate-700'}`}
            />
            {errors.description && <p className="text-sm text-red-400 mt-1">{errors.description}</p>}
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-300">Prize Image</label>
            {imagePreview && <img src={imagePreview} alt="Prize Preview" className="mt-2 rounded-md max-h-40 w-full object-cover" />}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-200 file:text-indigo-700 hover:file:bg-indigo-300 cursor-pointer"
            />
             <p className="text-xs text-slate-500 mt-1">If no image is uploaded, a random one will be generated based on the prize name.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ticketPrice" className="block text-sm font-medium text-slate-300">Ticket Price ($)</label>
              <input
                type="number"
                id="ticketPrice"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`mt-1 block w-full px-3 py-2 bg-slate-900 border rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.ticketPrice ? 'border-red-500' : 'border-slate-700'}`}
              />
              {errors.ticketPrice && <p className="text-sm text-red-400 mt-1">{errors.ticketPrice}</p>}
            </div>
            <div>
              <label htmlFor="maxTickets" className="block text-sm font-medium text-slate-300">Max Tickets</label>
              <input
                type="number"
                id="maxTickets"
                name="maxTickets"
                value={formData.maxTickets}
                onChange={handleChange}
                min="1"
                step="1"
                className={`mt-1 block w-full px-3 py-2 bg-slate-900 border rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.maxTickets ? 'border-red-500' : 'border-slate-700'}`}
              />
              {errors.maxTickets && <p className="text-sm text-red-400 mt-1">{errors.maxTickets}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Save Prize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrizeModal;
