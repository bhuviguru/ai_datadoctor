'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, ShieldCheck, Zap } from 'lucide-react';

// Static Mock Data defined outside component to maintain React purity
const MOCK_NODES = Array.from({ length: 120 }).map((_, i) => ({
  id: i,
  status: Math.random() > 0.95 ? 'critical' : Math.random() > 0.85 ? 'warning' : 'healthy'
}));

export const MetadataHealthMap = ({ onNodeClick }: { onNodeClick?: (id: number) => void }) => {
  return (
    <div className="card-premium p-8 bg-white/40 border-slate-200/40">
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-brand-400 shadow-lg">
             <Database size={20} />
           </div>
           <div>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Enterprise Registry Scan</h4>
             <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">Global Metadata Health Map</p>
           </div>
        </div>
        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-slate-800">{MOCK_NODES.filter(n => n.status === 'healthy').length}</span> Healthy
           </div>
           <div className="w-px h-3 bg-slate-200" />
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              <span className="text-slate-800">{MOCK_NODES.filter(n => n.status === 'critical').length}</span> Critical
           </div>
        </div>
      </div>

      <div className="max-h-56 overflow-y-auto pr-4 custom-scrollbar mb-10">
        <div className="grid grid-cols-12 sm:grid-cols-15 md:grid-cols-20 gap-2">
          {MOCK_NODES.map((node) => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.5, zIndex: 10 }}
              onClick={() => onNodeClick?.(node.id)}
              className={`aspect-square rounded-[4px] border transition-all duration-300 relative group cursor-crosshair ${
                node.status === 'healthy' ? 'bg-emerald-500/20 border-emerald-500/10 hover:bg-emerald-500/60 transition-colors' :
                node.status === 'warning' ? 'bg-amber-400/30 border-amber-400/20 hover:bg-amber-400/60' :
                'bg-rose-500/50 border-rose-500/30 hover:bg-rose-500/90 shadow-[0_0_10px_rgba(244,63,94,0.35)]'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-900 text-[10px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all scale-75 group-hover:scale-100 uppercase tracking-widest z-50 shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/5">
                Asset N-{node.id} • {node.status}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50 border border-slate-100 p-6 rounded-4xl">
         <div className="flex items-center gap-10">
            <div className="space-y-1.5">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Layer</p>
               <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-sm font-black text-slate-800">AES-256 Verified</span>
               </div>
            </div>
            <div className="w-px h-10 bg-slate-200 hidden md:block" />
            <div className="space-y-1.5">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Connectivity</p>
               <div className="flex items-center gap-2">
                  <Database size={16} className="text-brand-500" />
                  <span className="text-sm font-black text-slate-800">Cloud Nexus Online</span>
               </div>
            </div>
         </div>
         <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/30 active:scale-95 border border-slate-700 w-full md:w-auto justify-center">
            <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
               <Zap size={14} className="text-brand-400" />
            </div>
            Full Matrix Re-Sync
         </button>
      </div>
    </div>
  );
};
