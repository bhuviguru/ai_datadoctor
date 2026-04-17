'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${danger ? 'bg-rose-500' : 'bg-teal-500'}`} />
            
            <div className="flex items-center gap-4 mb-6">
               <div className={`p-3 rounded-2xl ${danger ? 'bg-rose-50 text-rose-500' : 'bg-teal-50 text-teal-500'}`}>
                  <ShieldAlert size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Access Protocol</p>
               </div>
            </div>

            <p className="text-[13px] font-medium text-slate-600 leading-relaxed mb-8">
               {message}
            </p>

            <div className="flex gap-4">
               <button 
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-slate-50 hover:bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
               >
                  Cancel
               </button>
               <button 
                onClick={() => {
                   onConfirm();
                   onClose();
                }}
                className={`flex-1 py-3 px-6 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 ${danger ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20'}`}
               >
                  {confirmText}
               </button>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors"
            >
               <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
