'use client';

import React, { useState } from 'react';
import { Activity, RefreshCw, Search, User, Settings, X, Globe, Bell, Lock, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from './ConfirmModal';
import { useAuth } from '@/context/AuthContext';

export const Navbar = ({ onScan, isScanning, onSearch, searchTerm }: { onScan: () => void, isScanning: boolean, onSearch: (val: string) => void, searchTerm: string }) => {
  const { user, role, isAdmin, isEngineer, isViewer, logout: globalLogout } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'notifications' | 'settings' | 'profile' | null>(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const toggleMenu = (menu: 'notifications' | 'settings' | 'profile') => {
    setActiveMenu(prev => prev === menu ? null : menu);
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  };

  const handleSignOut = () => {
    globalLogout();
  };

  const handleNotificationClick = (msg: string) => {
    playNotificationSound();
    console.log(`Notification Insight: ${msg}`);
  };


  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => window.location.reload()}
            className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white cursor-pointer hover:rotate-6 transition-transform shadow-lg shadow-teal-500/20"
          >
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1e293b] leading-tight">AI Data Doctor</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-70">Metadata Health Surveillance</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
              <div className={`w-2 h-2 ${isAdmin ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : isEngineer ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'} rounded-full animate-pulse`} />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 {isAdmin ? 'System: Sovereign' : isEngineer ? 'System: Professional' : 'System: Audit Only'}
              </span>
          </div>

          {(isAdmin || isEngineer) && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden xl:flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full border border-white/10 shadow-xl"
            >
                <Lock size={10} className="text-teal-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Mutation: Authorized</span>
            </motion.div>
          )}

          <div className="flex items-center gap-6 relative">
            {/* Global Search Functionality */}
            <div className="flex items-center relative gap-4">
              <AnimatePresence>
                 {isSearching && (
                   <motion.input
                     autoFocus
                     initial={{ width: 0, opacity: 0 }}
                     animate={{ width: 240, opacity: 1 }}
                     exit={{ width: 0, opacity: 0 }}
                     type="text"
                     value={searchTerm}
                     onChange={(e) => onSearch(e.target.value)}
                     placeholder="Search nodes, tables, clusters..."
                     onKeyDown={(e: React.KeyboardEvent) => e.key === 'Escape' && setIsSearching(false)}
                     className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                   />
                 )}
              </AnimatePresence>
              <button 
                onClick={() => {
                  if (isSearching) onSearch('');
                  setIsSearching(!isSearching);
                }}
                className={`p-2 rounded-lg transition-all ${isSearching ? 'bg-teal-50 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                title="Global Metadata Search"
              >
                {isSearching ? <X size={20} /> : <Search size={22} />}
              </button>
            </div>


            {/* Settings Trigger - Locked for Viewers */}
            {(isAdmin || isEngineer) && (
              <button 
                onClick={() => toggleMenu('settings')}
                className={`p-2 rounded-lg transition-all ${activeMenu === 'settings' ? 'bg-teal-50 text-teal-600 rotate-90' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                title="System Configuration"
              >
                <Settings size={22} />
              </button>
            )}

            {/* Notifications / User */}
            <button 
              onClick={() => {
                toggleMenu('notifications');
                if (activeMenu !== 'notifications') playNotificationSound();
              }}
              className={`p-2 rounded-lg transition-all relative ${activeMenu === 'notifications' ? 'bg-teal-50 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              title="Surveillance Alerts"
            >
               <Bell size={22} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#f8fafc]"></span>
            </button>

            <button 
              onClick={() => toggleMenu('profile')}
              className={`p-2 rounded-lg transition-all ${activeMenu === 'profile' ? 'bg-teal-50 text-teal-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              title="User Access Logs"
            >
               <User size={22} />
            </button>
            
            <button 
              onClick={onScan}
              disabled={isScanning || isViewer}
              className={`btn-checkup active:scale-95 transition-transform ${isViewer ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              {isScanning ? <RefreshCw className="animate-spin" size={18} /> : (isViewer ? <Lock size={18} /> : <RefreshCw size={18} />)}
              <span className="select-none font-bold uppercase tracking-wider text-[10px]">
                 {isScanning ? 'Scanning...' : (isViewer ? 'Protected' : 'Run Checkup')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Settings/Notification/Profile Sub-menus */}
      <AnimatePresence>
        {activeMenu === 'settings' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-24 right-64 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-60"
          >
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Engine Controls</h4>
             <div className="space-y-4">
                {[
                  { icon: <Globe size={14} />, label: 'Cloud Connectors' },
                  { icon: <Lock size={14} />, label: 'Access Control' },
                  { icon: <RefreshCw size={14} />, label: 'Scan Interval' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-all">
                    <div className="text-slate-400 group-hover:text-teal-600">{item.icon}</div>
                    <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeMenu === 'notifications' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-24 right-48 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-60"
          >
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Surveillance Alerts</h4>
             <div className="space-y-3">
                {[
                  { time: '2m ago', msg: 'Anomalous schema drift on CoreDB' },
                  { time: '1h ago', msg: 'New ingestion agent registered' }
                ].map((n, i) => (
                  <div 
                    key={i} 
                    onClick={() => handleNotificationClick(n.msg)}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-teal-50 cursor-pointer transition-colors"
                  >
                    <p className="text-[11px] font-bold text-slate-800">{n.msg}</p>
                    <span className="text-[9px] font-black text-slate-400 uppercase mt-1 block">{n.time}</span>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeMenu === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-24 right-32 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-60"
          >
             <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 ${isViewer ? 'bg-slate-400' : 'bg-teal-500'} rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md shadow-teal-500/20`}>
                      {role[0]}
                   </div>
                   <div>
                       <p className="text-[13px] font-black text-slate-900 leading-none mb-1">{role} Session</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Access Level: {isAdmin ? 'ADMIN' : isEngineer ? 'ENGINEER' : 'VIEWER'}</p>
                   </div>
                </div>
             </div>
             <div className="p-6 space-y-4">
                {[
                   { label: 'Clear All Sessions', desc: 'Force session reset', danger: true, action: () => { globalLogout(); } },
                   { label: 'Sign Out', desc: 'Terminate session', danger: true, action: () => setIsSignOutModalOpen(true) }
                ].map((item, i) => (
                   <div 
                    key={i} 
                    onClick={item.action}
                    className={`group cursor-pointer p-2 rounded-lg transition-colors ${item.danger ? 'hover:bg-rose-50' : 'hover:bg-slate-50'}`}
                   >
                      <p className={`text-[12px] font-bold ${item.danger ? 'text-rose-600' : 'text-slate-800'}`}>{item.label}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{item.desc}</p>
                   </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <ConfirmModal 
      isOpen={isSignOutModalOpen}
      onClose={() => setIsSignOutModalOpen(false)}
      onConfirm={handleSignOut}
      title="Terminate Session"
      message="You are about to sign out of the AI Data Surgeon. All active diagnostic traces and real-time streams will be severed. Proceed?"
      confirmText="Sign Out"
      danger
    />
    </>
  );
};
