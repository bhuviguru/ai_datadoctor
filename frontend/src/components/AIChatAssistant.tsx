'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Loader2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { askAI } from '@/services/api';

export const AIChatAssistant = () => {
  const { isAdmin, isEngineer, isViewer } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chat, setChat] = useState([
    { role: 'bot', content: 'Protocol initialized. I am your AI Insight Layer. How may I assist with your metadata surveillance today?' }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isTyping, isOpen]);

  if (isViewer) return null; // Viewers do not have access to the AI stabilization agent

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;
    
    const userMsg = { role: 'user', content: message };
    setChat(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);
    
    const { response } = await askAI(message);
    setIsTyping(false);
    setChat(prev => [...prev, { role: 'bot', content: response }]);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[420px] bg-white rounded-4xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-8 flex justify-between items-center relative">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-lg">
                  <Bot size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-tight">AI Data Surgeon</h4>
                  <span className="text-[9px] text-brand-400 font-bold uppercase tracking-widest mt-1 block">Vector-Based Analytics</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="relative z-10 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors text-white"
              >
                <X size={20} />
              </button>
              <Sparkles size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </div>
            
            <div ref={scrollRef} className="h-[400px] overflow-y-auto p-8 space-y-6 bg-slate-50/30">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[85%] p-5 rounded-3xl text-[11px] font-bold leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                    <span className="block mt-2 opacity-50 text-[8px] uppercase tracking-widest">
                       {msg.role === 'bot' ? 'Surgeon Analysis' : 'Steward Query'}
                    </span>
                  </motion.div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-brand-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synthesizing Insight...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
               {(isAdmin || isEngineer) ? (
                 <div className="relative group">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Consult the surgeon..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!message.trim() || isTyping}
                      className="absolute right-2 top-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-500 transition-all disabled:opacity-30 disabled:hover:bg-slate-900"
                    >
                      <Send size={16} />
                    </button>
                 </div>
               ) : (
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center gap-3">
                    <Lock size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chat Locked for Viewers</span>
                 </div>
               )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-linear-to-br from-brand-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
            <MessageSquare size={28} />
            <div className="absolute top-0 right-0 w-3 h-3 bg-brand-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
