'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Info, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warn' | 'success' | 'ai';
  message: string;
}

interface SurveillanceFeedProps {
  events: AuditEvent[];
}

export const SurveillanceFeed = ({ events }: SurveillanceFeedProps) => {
  return (
    <div className="mx-12 bg-slate-900 rounded-4xl p-8 border border-white/5 shadow-2xl overflow-hidden relative group">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Terminal size={16} />
           </div>
           <div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Surveillance Pulse</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Real-time Metadata Ingress Logs</p>
           </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
           <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Engine</span>
        </div>
      </div>

      <div className="space-y-3 h-[180px] overflow-hidden relative">
        <AnimatePresence initial={false}>
          {events.slice(0, 5).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-start gap-4 p-3 bg-white/2 rounded-xl border border-white/5 group/item hover:bg-white/5 transition-colors"
            >
              <div className="shrink-0 mt-0.5">
                {event.type === 'info' && <Info size={12} className="text-blue-400" />}
                {event.type === 'warn' && <AlertTriangle size={12} className="text-amber-400" />}
                {event.type === 'success' && <CheckCircle size={12} className="text-emerald-400" />}
                {event.type === 'ai' && <Zap size={12} className="text-teal-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-slate-300 leading-relaxed truncate">
                   <span className="text-[9px] font-black text-slate-600 mr-2 font-mono">[{event.timestamp}]</span>
                   {event.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-slate-900 to-transparent pointer-events-none" />
      </div>

      {/* Decorative Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
    </div>
  );
};
