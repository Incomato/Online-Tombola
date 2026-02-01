
import React, { useState } from 'react';
import { AuthError } from '../types';

interface LoginScreenProps {
  onLogin: (name: string, pass: string) => Promise<AuthError | boolean>;
  onRegister: (name: string, pass: string) => Promise<AuthError | boolean>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthError>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const handler = mode === 'login' ? onLogin : onRegister;
    const result = await handler(name, password);
    setLoading(false);

    if (typeof result === 'object') {
      setErrors(result);
    }
  };

  const switchMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setErrors({});
    setName('');
    setPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-2xl shadow-2xl animate-scale-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Online Tombola</h1>
          <p className="mt-2 text-slate-400">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="username"
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-3 border bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.name ? 'border-red-500' : 'border-slate-700'}`}
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <p id="name-error" className="text-xs text-red-400 mt-1 pl-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              className={`appearance-none rounded-md relative block w-full px-3 py-3 border bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${errors.password ? 'border-red-500' : 'border-slate-700'}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && <p id="password-error" className="text-xs text-red-400 mt-1 pl-1">{errors.password}</p>}
          </div>
          
          {errors.form && <p className="text-sm text-red-400 text-center">{errors.form}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Register')}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button onClick={switchMode} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
