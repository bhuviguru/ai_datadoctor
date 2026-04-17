'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Loader2, Sparkles, CheckCircle, Database, Shield, Zap, Info, Clock, History, Lock } from 'lucide-react';
import { LineageGraph } from './LineageGraph';
import { Issue, LineageData, fetchHistory, HistoryEntry } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface AIExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  explanation: string;
  onFix: (issue: Issue) => void;
  isFixing: boolean;
  hasFixed: boolean;
  lineage?: LineageData | null;
}

export const AIExplanationModal = ({ 
  isOpen, 
  onClose, 
  issue, 
  explanation, 
  onFix, 
  isFixing, 
  hasFixed,
  lineage
}: AIExplanationModalProps) => {
  const { role } = useAuth();

  const [viewMode, setViewMode] = React.useState<'diagnostics' | 'timeline'>('diagnostics');
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);

  const isAdmin = role === 'Admin';
  const isEngineer = role === 'Engineer';
  const isViewer = role === 'Viewer';

  React.useEffect(() => {
    if (isOpen && issue) {
       loadHistory();
    }
  }, [isOpen, issue]);

  const loadHistory = React.useCallback(async () => {
     if (!issue) return;
     setIsHistoryLoading(true);
     const tableId = issue.table === 'compliance_audit_log' ? '2' : '1';
     try {
        const data = await fetchHistory(tableId);
        setHistory(data);
     } catch {
        setHistory([]);
     } finally {
        setIsHistoryLoading(false);
     }
  }, [issue]);

  const isLoading = !explanation;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-6 sm:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="bg-white w-full max-w-5xl rounded-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row h-[85vh] max-h-[850px]"
          >
            {/* Sidebar / Context */}
            <div className="md:w-72 bg-slate-900 p-8 flex flex-col justify-between text-white border-r border-white/5 shrink-0">
               <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
                      <Bot size={22} className="fill-current" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight text-brand-400">Analysis Layer</h4>
                      <p className="text-[13px] font-bold text-white tracking-tight">Audit Agent v4.0</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Selected Node</span>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                         <Database size={14} className="text-brand-500" />
                         <span className="text-xs font-bold truncate">{issue?.table}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Anomaly Vector</span>
                       <div className="px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 text-[10px] font-black uppercase tracking-widest">
                          {issue?.type}
                       </div>
                    </div>
                  </div>
               </div>

               <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                     <Shield size={14} className={isViewer ? 'text-slate-500' : 'text-brand-500'} />
                     <span className="text-[10px] font-black uppercase tracking-widest">{role} Clearance</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider">
                    {isAdmin 
                      ? "Sovereign Administrator Access. Full authority to mutate global metadata state." 
                      : isEngineer 
                        ? "Surgical Engineer Access. Authorization to execute autonomous remediation."
                        : "Audit-Only Access. Synthesis and remediations are locked for this session."}
                  </p>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
               {/* Modal Header */}
               <div className="px-10 py-6 border-b border-slate-200/50 flex justify-between items-center bg-white shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 text-brand-600">
                        <Sparkles size={16} />
                        <h3 className="text-lg font-black tracking-tight">Root-Cause Synthesis</h3>
                     </div>
                  </div>
                  <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">
                    <X size={20} />
                  </button>
               </div>

               <div className="px-10 py-4 bg-slate-50 border-b border-slate-200/50 flex gap-6">
                  <button 
                    onClick={() => setViewMode('diagnostics')}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${viewMode === 'diagnostics' ? 'border-brand-500 text-slate-800' : 'border-transparent text-slate-400'}`}
                  >
                    <Info size={14} />
                    Current Diagnostics
                  </button>
                  <button 
                    onClick={() => setViewMode('timeline')}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${viewMode === 'timeline' ? 'border-brand-500 text-slate-800' : 'border-transparent text-slate-400'}`}
                  >
                    <History size={14} />
                    Time Machine
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-10 space-y-12">
                  {isLoading || (viewMode === 'timeline' && isHistoryLoading) ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="relative mb-8">
                        <div className="absolute inset-x-0 bottom-0 h-4 bg-brand-500/20 blur-xl animate-pulse" />
                        <Loader2 size={48} className="animate-spin text-brand-500 relative z-10" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">{viewMode === 'timeline' ? 'Calibrating Temporal Data' : 'Processing Metadata Volumetrics'}</h4>
                    </div>
                  ) : viewMode === 'timeline' ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                       <div className="flex items-center justify-between mb-8">
                          <div>
                             <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Metadata Timeline</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Audit Trail for {issue?.table}</p>
                          </div>
                       </div>
                       
                       <div className="relative space-y-4">
                          <div className="absolute left-6 top-1 bottom-0 w-px bg-slate-200" />
                          {history.map((snap, i) => (
                             <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
                             >
                                <div className={`absolute left-[21px] top-6 w-1.5 h-1.5 rounded-full z-10 ${snap.status === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                                <div className="flex justify-between items-start">
                                   <div>
                                      <p className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1">{snap.event}</p>
                                      <p className="text-[10px] font-bold text-slate-400">{new Date(snap.timestamp).toLocaleString()}</p>
                                   </div>
                                </div>
                             </motion.div>
                          ))}
                       </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <Info size={16} className="text-brand-600" />
                           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Executive Summary</h4>
                        </div>
                        <div className="card-premium p-8 bg-white text-[15px] font-medium leading-relaxed text-slate-600 border-none shadow-xl shadow-slate-200/20">
                           {explanation}
                        </div>
                      </div>

                      {lineage && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                             <Zap size={16} className="text-brand-600" />
                             <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Network Dependency Insight</h4>
                          </div>
                          <div className="bg-slate-100/50 rounded-4xl p-2 border border-slate-200/40">
                             <LineageGraph lineage={lineage} miniVersion={true} status={issue?.status} />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
               </div>

               <div className="px-10 py-8 border-t border-slate-200/50 bg-white shrink-0">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Remediation Protocol</p>
                       <p className="text-[13px] font-bold text-slate-900">
                          {isAdmin ? 'Sovereign mutation authorized' : isEngineer ? 'Surgical repair authorized' : 'Stabilization requires higher clearance'}
                       </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                        Dismiss Analysis
                      </button>
                      <button
                        onClick={() => issue && onFix(issue)}
                        disabled={isFixing || hasFixed || isLoading || isViewer}
                        className={`flex-1 sm:flex-none min-w-[220px] btn-primary py-3.5 px-8 shadow-xl shadow-brand-500/20 justify-center text-[11px] group/fix ${
                          hasFixed ? 'bg-linear-to-r from-emerald-500 to-green-600 border-none' : isViewer ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : ''
                        }`}
                      >
                        {isFixing ? (
                          <><Loader2 className="animate-spin" size={18} /><span>Calibrating Fix...</span></>
                        ) : hasFixed ? (
                          <><CheckCircle size={18} /><span>Remediation Applied</span></>
                        ) : isViewer ? (
                           <><Lock size={18} /><span>Access Restricted</span></>
                        ) : (
                          <><Zap size={18} className="text-white fill-current group-hover/fix:animate-pulse" /><span>Deploy Autonomous Fix</span></>
                        )}
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
