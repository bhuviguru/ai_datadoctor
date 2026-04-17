'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Activity, ExternalLink } from 'lucide-react';
import { LineageData, LineageNode } from '@/services/api';

interface LineageGraphProps {
  lineage: LineageData;
  miniVersion?: boolean;
  status?: string;
}

export const LineageGraph = ({ lineage, miniVersion = false, status = 'Healthy' }: LineageGraphProps) => {
  if (!lineage) return null;

  const isCritical = status === 'Critical';

  return (
    <div className={`relative overflow-hidden ${miniVersion ? 'p-8 rounded-2xl bg-white shadow-sm' : 'card-premium p-12 bg-white/40 backdrop-blur-xl rounded-[3rem]'}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#0d9488 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Upstream */}
        <div className="flex flex-col gap-4 relative">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left mb-2">Upstream Origin</span>
          {lineage.upstream.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 w-48 group hover:border-teal-500 hover:shadow-lg transition-all"
            >
               <Database size={16} className="text-slate-400 group-hover:text-teal-500" />
               <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate">{node.name}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase">{node.type}</span>
               </div>
            </motion.div>
          ))}
          {/* Animated SVG Path for connection */}
          <svg className="absolute -right-32 top-1/2 -translate-y-1/2 w-32 h-20 pointer-events-none hidden md:block overflow-visible">
            <motion.path
              d="M 0 40 Q 60 40 120 40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            {lineage.upstream.length > 0 && <motion.circle r="3" fill="#14b8a6" initial={{ cx: 0, cy: 40 }} animate={{ cx: 120 }} transition={{ duration: 3, repeat: Infinity }} />}
          </svg>
        </div>

        {/* Target Node (Focal Point) */}
        <div className="relative isolate">
          <div className={`absolute inset-0 ${isCritical ? 'bg-rose-500/20' : 'bg-teal-500/20'} rounded-full blur-3xl scale-150 animate-pulse`} />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative p-8 rounded-3xl bg-slate-900 border-2 ${isCritical ? 'border-rose-500/50' : 'border-teal-500/50'} w-52 text-center shadow-2xl`}
          >
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 border border-teal-500/30 rounded-full">
                <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest">Target Node</span>
             </div>
             <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 ${isCritical ? 'bg-rose-500/20 text-rose-500' : 'bg-teal-500/20 text-teal-500'}`}>
                <Activity size={24} className={isCritical ? 'animate-pulse' : ''} />
             </div>
             <h4 className="text-sm font-black text-white tracking-widest uppercase">{lineage.tableId}</h4>
             <p className={`text-[8px] font-black mt-2 uppercase tracking-widest ${isCritical ? 'text-rose-400 animate-pulse' : 'text-teal-400'}`}>
                Status: {status}
             </p>
          </motion.div>
        </div>

        {/* Downstream */}
        <div className="flex flex-col gap-4 relative">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-right mb-2">Downstream Vector</span>
          {/* Animated SVG Path from focus to downstream */}
          <svg className="absolute -left-32 top-1/2 -translate-y-1/2 w-32 h-20 pointer-events-none hidden md:block overflow-visible">
            <motion.path
              d="M 0 40 Q 60 40 120 40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
            />
            {lineage.downstream.length > 0 && <motion.circle r="3" fill="#14b8a6" initial={{ cx: 0, cy: 40 }} animate={{ cx: 120 }} transition={{ duration: 3, delay: 1, repeat: Infinity }} />}
          </svg>
          {lineage.downstream.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between w-48 group hover:border-teal-500 hover:shadow-lg transition-all"
            >
               <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 truncate">{node.name}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase">{node.type}</span>
               </div>
               <ExternalLink size={14} className="text-slate-300 group-hover:text-teal-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
