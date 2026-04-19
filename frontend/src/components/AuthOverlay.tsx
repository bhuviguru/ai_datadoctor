'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Loader2, Bot } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthOverlay = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data);
      } else {
        setError(data.message || 'Invalid surgical credentials.');
      }
    } catch (err) {
      setError('Connection failure to auth server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-slate-100/80 backdrop-blur-3xl p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-4xl shadow-2xl border border-white p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full" />
        
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-brand-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-brand-500/40 mx-auto mb-6">
             <Bot size={32} className="fill-current" />
           </div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">AI Data Doctor Pro</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify Surgical Credentials to Continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Data Identity</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="Username (admin / engineer / viewer)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    required
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Surgical Cipher</label>
              <div className="relative">
                 <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    type="password" 
                    placeholder="Cipher Key (password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:outline-hidden focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                    required
                 />
              </div>
           </div>

           {error && (
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center"
             >
               {error}
             </motion.p>
           )}

           <button 
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-5! rounded-2xl justify-center text-xs shadow-xl shadow-brand-500/20"
           >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>Access Observability Platform</span>}
           </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
             Enterprise Grade Observability • EAL6+ Certified <br/>
             © 2024 AI Data Doctor Systems
           </p>
        </div>
      </motion.div>
    </div>
  );
};
