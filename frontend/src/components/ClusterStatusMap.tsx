'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, TrendingUp, AlertCircle } from 'lucide-react';

export const ClusterStatusMap = () => {
  // Mock data for a mini status grid
  const clusters = [
    { name: 'Core Registry', health: 98, load: 12, status: 'Healthy' },
    { name: 'Analytics Hub', health: 84, load: 22, status: 'Unstable' },
    { name: 'Governance API', health: 100, load: 5, status: 'Healthy' },
    { name: 'Surgeon Node-1', health: 96, load: 15, status: 'Healthy' },
    { name: 'Pipeline Queue', health: 42, load: 78, status: 'Critical' },
    { name: 'Web-01 Prod', health: 99, load: 8, status: 'Healthy' },
  ];

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
               <Activity size={16} />
            </div>
            <div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Infrastructure Vitals</h4>
               <p className="text-sm font-black text-slate-800 tracking-tight">Active Cluster Distribution</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Stability: Normal</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {clusters.map((c, i) => (
          <div key={i} className="group relative">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="p-4 bg-white/60 rounded-2xl border border-slate-50 group-hover:border-brand-200 transition-all cursor-default"
             >
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[8px] font-black text-slate-400 uppercase truncate pr-2">{c.name}</span>
                   <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Healthy' ? 'bg-emerald-500' : c.status === 'Critical' ? 'bg-rose-500 animate-ping' : 'bg-amber-500'}`} />
                </div>
                <div className="flex items-end justify-between">
                   <h5 className="text-xl font-black text-slate-800 tracking-tight">{c.health}%</h5>
                   <div className="flex flex-col items-end">
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">{c.load}% LOAD</span>
                   </div>
                </div>
                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${c.health}%` }}
                     className={`h-full ${c.status === 'Healthy' ? 'bg-emerald-500' : c.status === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`}
                   />
                </div>
             </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};
