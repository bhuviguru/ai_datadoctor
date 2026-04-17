'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Info, ShieldAlert } from 'lucide-react';

interface InsightsBarProps {
  criticalCount: number;
}

export const InsightsBar = ({ criticalCount }: InsightsBarProps) => {
  if (criticalCount === 0) return null;

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="bg-slate-900 text-white overflow-hidden border-b border-amber-500/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <AlertTriangle size={16} className="text-amber-400 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Critical Anomaly</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <p className="text-[10px] font-bold tracking-wide text-slate-300 uppercase italic">
              Cluster DRIFT: {criticalCount} high-risk nodes detected. Autonomous stabilization required.
            </p>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
               <TrendingDown size={14} className="text-rose-400" />
               <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Health -12%</span>
            </div>
            <button className="px-5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-500/10">
               Deploy Stabilizer
            </button>
         </div>
      </div>
    </motion.div>
  );
};
