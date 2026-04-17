'use client';

import React from 'react';
import { ShieldAlert, Zap, Cpu, BellRing, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export const SurgeonConsole = ({ onAutoFix }: { onAutoFix: () => void }) => {
   const { isAdmin, isEngineer, isViewer } = useAuth();

   return (
      <div className="bg-slate-900 rounded-4xl p-8 text-white shadow-2xl relative overflow-hidden group border border-white/5">
         {/* Background Glow */}
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all" />

         <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/5 shadow-xl shadow-brand-500/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                     <Cpu size={28} className="text-teal-400 animate-pulse" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight leading-none mb-2">AI Surgeon Mode</h3>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">
                        {isAdmin ? 'Full Sovereign Access' : isEngineer ? 'Surgical specialist Active' : 'Observation Mode'}
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <span className={`w-2 h-2 ${isViewer ? 'bg-slate-600' : 'bg-teal-500'} rounded-full animate-ping`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surveillance Pulse</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
               <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default group/card">
                  <div className="flex items-center gap-3 mb-6">
                     <ShieldAlert size={18} className="text-rose-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/card:text-slate-300">Anomaly Signal</span>
                  </div>
                  <p className="text-4xl font-black mb-1 text-white tracking-tight">0% Drift</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stability: Optimal Threshold</p>
               </div>

               <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all cursor-default group/card">
                  <div className="flex items-center gap-3 mb-6">
                     <BellRing size={18} className="text-amber-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/card:text-slate-300">Neural Load</span>
                  </div>
                  <p className="text-4xl font-black mb-1 text-white tracking-tight">NOMINAL</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{"Wait time < 120ms"}</p>
               </div>
            </div>

            <div className="flex items-center justify-between p-4 pl-10 bg-white/5 rounded-4xl border border-white/10 backdrop-blur-md relative overflow-hidden group/bar">
               {/* Subtle flow indicator */}
               <div className={`absolute bottom-0 left-0 h-[2px] bg-teal-500/30 transition-all duration-3000 ${isAdmin || isEngineer ? 'w-full' : 'w-0'}`} />

               <div className="flex items-center gap-5 relative z-10">
                  <Zap size={22} className={isViewer ? 'text-slate-600' : 'text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)] animate-pulse'} />
                  <p className="text-[13px] font-bold text-slate-300 tracking-tight">
                     {isAdmin ? 'Sovereign Clearance: Direct system mutation authorized.' : isEngineer ? 'Engineer Clearance: Pre-emptive stabilization authorized.' : 'Access Restricted: Elevated clearance required for stabilization.'}
                  </p>
               </div>

               <button
                  onClick={onAutoFix}
                  disabled={isViewer}
                  className={`relative flex items-center gap-3 px-12 py-5 rounded-2xl shadow-2xl transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.25em] overflow-hidden group/btn ${isViewer
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none'
                        : 'bg-teal-500 hover:bg-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] border-none'
                     }`}
               >
                  {/* Shimmer Effect */}
                  {!isViewer && (
                     <div className="absolute inset-x-0 h-full w-20 top-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                  )}

                  {isViewer ? (
                     <><Lock size={14} /> <span>Locked</span></>
                  ) : (
                     <span className="relative z-10">Initiate Stabilization</span>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};




