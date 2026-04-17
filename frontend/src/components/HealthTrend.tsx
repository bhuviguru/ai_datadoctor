'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface HealthTrendProps {
  currentScore: number;
  history: number[];
}

export const HealthTrend = ({ currentScore, history = [40, 45, 42, 50, 48, 60, 55, 70, 68, 84] }: HealthTrendProps) => {
  const data = history;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 10);

  const diff = data.length > 1 ? data[data.length - 1] - data[data.length - 2] : 0;
  const diffPercent = ((diff / (data[data.length - 2] || 1)) * 100).toFixed(1);

  return (
    <div className="card-premium p-8 bg-white/40 border-slate-200/40 min-h-[260px] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-brand-50/50 rounded-2xl flex items-center justify-center text-brand-600 shadow-xs border border-brand-100/50">
             <Activity size={22} className="animate-pulse" />
           </div>
           <div>
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-2">Network Reliability Trend</h4>
             <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Cluster Health Velocity</p>
           </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${Number(diffPercent) >= 0 ? 'text-emerald-600 bg-emerald-50 border border-emerald-100/50' : 'text-rose-600 bg-rose-50 border border-rose-100/50'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${Number(diffPercent) >= 0 ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
            {Number(diffPercent) >= 0 ? '+' : ''}{diffPercent}% vs 24h
          </div>
        </div>
      </div>

      <div className="relative h-24 w-full flex items-end gap-2 px-1 mb-10">
        {/* Subtle Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
           <div className="w-full h-px bg-slate-200" />
           <div className="w-full h-px bg-slate-200" />
           <div className="w-full h-px bg-slate-300" />
        </div>

        {data.map((val, i) => {
          // Dynamic scaling logic to ensure meaningful visual depth
          const normalizedHeight = Math.max(((val - min) / (range || 0.1)) * 90 + 10, 10);
          
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${normalizedHeight}%` }}
              transition={{ delay: i * 0.05, duration: 1, ease: [0.33, 1, 0.68, 1] }}
              className="flex-1 bg-linear-to-t from-brand-700 via-brand-500 to-brand-400 rounded-t-xl hover:from-brand-500 hover:to-brand-300 transition-all cursor-crosshair group relative shadow-xs"
            >
               {/* High-Intensity Glow on Hover */}
               <div className="absolute inset-0 bg-transparent group-hover:bg-brand-400/10 transition-colors rounded-t-xl" />
               <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10 scale-90 group-hover:scale-100">
                  {val}% RELIABILITY
               </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between mt-auto border-t border-slate-100/80 pt-10">
        <div className="flex gap-12">
           <div className="group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-3 group-hover:text-brand-500 transition-colors">Peak Vitals</p>
              <p className="text-xl font-black text-slate-800 tracking-tighter">{max}% Index</p>
           </div>
           <div className="w-px h-10 bg-slate-100/80" />
           <div className="group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-3 group-hover:text-brand-500 transition-colors">Cluster Delta</p>
              <p className="text-xl font-black text-slate-800 tracking-tighter">42ms Response</p>
           </div>
        </div>
        <button className="flex items-center gap-3 text-[10px] font-black text-brand-600 uppercase tracking-[0.3em] px-6 py-3 bg-brand-50/30 hover:bg-brand-50 rounded-2xl transition-all border border-transparent hover:border-brand-200/50">
          Pulse Log
        </button>
      </div>
    </div>
  );
};
