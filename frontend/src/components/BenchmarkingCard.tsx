'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, BarChart3, TrendingUp, Zap } from 'lucide-react';

interface BenchmarkingCardProps {
  score: number;
}

export const BenchmarkingCard = ({ score }: BenchmarkingCardProps) => {
  const percentile = score > 90 ? 'Top 5%' : score > 80 ? 'Top 15%' : 'Top 50%';
  const status = score > 80 ? 'EXPERT' : 'STABILIZING';

  return (
    <div className="bg-slate-900 rounded-4xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/20 transition-all" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 shadow-sm border border-teal-500/20">
                  <Trophy size={18} />
               </div>
               <div>
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Surgeon Benchmark</h3>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Global OpenMetadata Standards</p>
               </div>
           </div>
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">{status}</span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                 <Target size={12} className="text-slate-500" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Rank</span>
              </div>
              <p className="text-xl font-black text-white tracking-tighter">{percentile}</p>
           </div>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                 <TrendingUp size={12} className="text-slate-500" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Health Index</span>
              </div>
              <p className="text-xl font-black text-white tracking-tighter">{score}%</p>
           </div>
        </div>

        <div className="space-y-3">
           <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Cluster Efficiency</span>
              <span>{score}%</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className="h-full bg-linear-to-r from-teal-500 to-emerald-400"
              />
           </div>
           <p className="text-[9px] font-bold text-slate-500 italic text-center">Your metadata cluster is performing better than {score - 10}% of organizations.</p>
        </div>
      </div>
    </div>
  );
};
