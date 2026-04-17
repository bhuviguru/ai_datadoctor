'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsCards } from '@/components/StatsCards';
import { TableList } from '@/components/TableList';
import { HealthTrend } from '@/components/HealthTrend';
import { SurveillanceFeed, AuditEvent } from '@/components/SurveillanceFeed';
import { AIExplanationModal } from '@/components/AIExplanationModal';
import { GitHubCard } from '@/components/GitHubCard';
import { SurgeonConsole } from '@/components/SurgeonConsole';
import { BenchmarkingCard } from '@/components/BenchmarkingCard';
import { fetchTables, scanData, explainIssue, fetchLineage, fixIssue, fetchGitHubSummary, fetchLogs } from '@/services/api';
import { MetadataAsset, Issue, LineageData, GitHubSummary, SystemLog } from '@/services/api';
import { Activity, ShieldCheck, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthOverlay } from '@/components/AuthOverlay';
import { socket, connectSocket, disconnectSocket } from '@/services/socket';
import { InsightsBar } from '@/components/InsightsBar';
import { MetadataHealthMap } from '@/components/MetadataHealthMap';
import { ClusterStatusMap } from '@/components/ClusterStatusMap';
import { useAuth } from '@/context/AuthContext';
import { AIChatAssistant } from '@/components/AIChatAssistant';

export default function Dashboard() {
  const { user, isAdmin, isEngineer, isViewer, login, isLoading: isAuthLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [tables, setTables] = useState<MetadataAsset[]>([]);
  const [githubSummary, setGithubSummary] = useState<GitHubSummary | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({ globalHealth: 77, latency: 42 });

  
  // Real-time Listeners
  useEffect(() => {
    connectSocket();
    
    socket.on('metrics_update', (data) => {
       setLiveMetrics({ globalHealth: data.globalHealth, latency: data.latency });
    });

    socket.on('anomaly_detected', (data) => {
       addEvent(`[REALTIME-ALERT] ${data.table}: ${data.issue}`, 'warn');
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  // Derived Intelligence
  const criticalIssues = tables.filter(t => t.status === 'Critical').length;
  const healthScore = liveMetrics.globalHealth;
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Surveillance Feed State
  const [events, setEvents] = useState<AuditEvent[]>([]);

  const addEvent = (message: string, type: 'info' | 'warn' | 'success' | 'ai' = 'info') => {
    const newEvent: AuditEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      message
    };
    setEvents(prev => [newEvent, ...prev]);
  };
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [explanation, setExplanation] = useState('');
  const [lineage, setLineage] = useState<LineageData | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [hasFixed, setHasFixed] = useState(false);

  useEffect(() => {
    loadData();
    addEvent('Surgeon AI Engine online. Predictive monitoring active.', 'info');
    addEvent('Metadata cluster synchronized. No immediate root cause drift.', 'success');
  }, []);

  const [isSurgeryActive, setIsSurgeryActive] = useState(false);
  const [activeFixNode, setActiveFixNode] = useState<string | null>(null);

  const handleAutoFix = async () => {
     addEvent('AUTONOMOUS PROTOCOL: Initiating multi-node surgical repair...', 'ai');
     setIsSurgeryActive(true);
     try {
        const criticalNodes = tables.filter(t => t.status === 'Critical');
        for (const node of criticalNodes) {
           setActiveFixNode(node.name);
           addEvent(`Surgical focus: ${node.name}. Calibrating drift buffer...`, 'info');
           await new Promise(r => setTimeout(r, 1500));
           
           await fixIssue(node.name, 'AUTO_REPAIR', node.id);
           
           // Optimistic Update
           setTables(prev => prev.map(t => t.name === node.name ? { ...t, status: 'Healthy', predictive_health: 98 } : t));
           addEvent(`Repaired node ${node.name}. Status: Healthy. Telemetry stable.`, 'success');
        }
        await loadData();
        addEvent('Surgical remediation complete. Global vitals restored.', 'success');
     } catch (e) {
        addEvent('Surgical interrupt: Handshake failure on secure node.', 'warn');
     } finally {
        setIsSurgeryActive(false);
        setActiveFixNode(null);
     }
  };

  const loadData = async () => {
    try {
      const [tableData, githubData, logsData] = await Promise.all([
        fetchTables(),
        fetchGitHubSummary(),
        fetchLogs()
      ]);
      setTables(tableData);
      setGithubSummary(githubData);

      // Populate initial feed from backend logs
      if (logsData && logsData.length > 0) {
        setEvents(logsData.map((log: SystemLog) => ({
          id: log.id.toString(),
          timestamp: new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'info',
          message: log.message
        })));
      }

      if (githubData) {
        addEvent(`GitHub synchronized for ${githubData.username}. Velocity tracking active.`, 'success');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      addEvent('Network Error: Failed to synchronize metadata cluster.', 'warn');
    }
  };


  const handleScan = async () => {
    setIsScanning(true);
    addEvent('Global audit scan initiated...', 'info');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await scanData();
      await loadData(); // Refresh all tables after scan
      addEvent(`Scan complete. Global Health Index: ${healthScore}%`, 'success');
    } catch (error) {
      console.error('Scan failed:', error);
      addEvent('Audit scan engine failure.', 'warn');
    } finally {
      setIsScanning(false);
    }
  };

  // Resolved Role Logic is now handled by Context

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || table.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRowClick = async (table: MetadataAsset) => {
    if (table.status === 'Healthy') return;
    
    addEvent(`Extracting root cause telemetry for asset: ${table.name}`, 'ai');

    const issue: Issue = {
      table: table.name,
      tableId: table.id,
      type: table.status === 'Critical' ? 'ROOT_CAUSE_ANALYSIS' : 'PREDICTIVE_FAILURE',
      status: table.status as 'Critical' | 'Warning',
      issue: table.status === 'Critical' ? 'Critical node failure detected in upstream root.' : 'Predictive models suggest impending drift.'
    };

    setSelectedIssue(issue);
    setExplanation('');
    setLineage(null);
    setHasFixed(false);
    setIsModalOpen(true);

    try {
      const [explanationRes, lineageRes] = await Promise.all([
        explainIssue(table.name, issue.issue),
        fetchLineage(table.id)
      ]);
      setExplanation(explanationRes.explanation);
      setLineage(lineageRes);
      addEvent(`Neural synthesis complete for ${table.name}.`, 'ai');
    } catch (error) {
      console.error('Failed to fetch analysis:', error);
      setExplanation('Neural engine failed to synthesize an explanation for this asset.');
    }
  };

  const handleFix = async (issue: Issue) => {
    setIsFixing(true);
    addEvent(`Deploying autonomous fix protocol for ${issue.table}...`, 'info');
    try {
      await fixIssue(issue.table, issue.type, issue.tableId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasFixed(true);
      await loadData();
      addEvent(`Remediation successful. ${issue.table} telemetry restored to Healthy.`, 'success');
    } catch (error) {
      console.error('Remediation failed:', error);
      addEvent(`Remediation failed for ${issue.table}. Internal engine error.`, 'warn');
    } finally {
      setIsFixing(false);
    }
  };

  const globalHistory = tables.length > 0 
    ? tables[0].history.map((_, i) => 
        Math.floor(tables.reduce((acc, t) => acc + (t.history[i] || 0), 0) / tables.length)
      )
    : [40, 45, 42, 50, 48, 60, 55, 70, 68, 84];

  if (isAuthLoading || !mounted) return null;
 
  if (!user) {
    return <AuthOverlay />;
  }

  return (
    <main className="min-h-screen pb-12 bg-[#f8fafc]">
      <InsightsBar criticalCount={criticalIssues} />
      <div className="pt-16">
        <Navbar onScan={handleScan} isScanning={isScanning} onSearch={setSearchTerm} searchTerm={searchTerm} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Top Intelligence Row - 12 Column Architecture */}
        <div className="grid grid-cols-12 gap-8 items-start">
            {/* Primary Diagnostics - Left Column (8/12) */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
               {(isAdmin || isEngineer) && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                 >
                   <SurgeonConsole onAutoFix={handleAutoFix} />
                 </motion.div>
               )}
               
               <HealthTrend currentScore={healthScore} history={globalHistory} />
               
               <StatsCards 
                 totalTables={tables.length} 
                 criticalIssues={criticalIssues} 
                 healthScore={healthScore} 
                 governanceCoverage={Math.floor(tables.filter(t => t.owner !== 'Unassigned' && t.tags.length > 0).length / (tables.length || 1) * 100)}
               />

               <MetadataHealthMap onNodeClick={(id) => {
               const table = filteredTables[id % filteredTables.length];
               if (table) handleRowClick(table);
            }} />
            </div>

            {/* Auxiliary Intelligence - Right Column (4/12) */}
            <div className="col-span-12 lg:col-span-4 space-y-8 h-full">
               <BenchmarkingCard score={healthScore} />
               {isAdmin && <GitHubCard summary={githubSummary} />}
               <SurveillanceFeed events={events} />
            </div>
        </div>
 
        {/* Infrastructure Vitals */}
        <div className="pt-4 border-t border-slate-100">
           <ClusterStatusMap />
        </div>
 
        {/* Action Center - Inventory Management */}
        <div className="space-y-8 pt-8 border-t border-slate-100">
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              <div>
                 <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Metadata Inventory</h2>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-brand-500" />
                    Predictive Drift Guard: <span className="text-emerald-600">Active</span>
                    <span className="mx-2 text-slate-200">|</span>
                    <span className="text-slate-400 flex items-center gap-2">
                       <Info size={12} className="text-slate-300" />
                       Showing 100% of tracked nodes
                    </span>
                 </p>
              </div>
              <div className="flex gap-4">
                 {['All', 'Healthy', 'Critical', 'Unstable'].map((status) => (
                   <button
                     key={status}
                     onClick={() => setFilterStatus(status)}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       filterStatus === status 
                         ? 'bg-slate-900 text-white shadow-xl' 
                         : 'bg-white text-slate-400 border border-slate-100 hover:border-brand-200 shadow-sm'
                     }`}
                   >
                     {status}
                   </button>
                 ))}
              </div>
           </div>

           <TableList tables={filteredTables} onRowClick={handleRowClick} />
        </div>
        
        <footer className="pt-20 pb-16 border-t border-slate-100 mt-12">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
              <div className="flex items-center gap-3">
                 <Zap size={20} className="text-brand-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Enterprise Metadata Audit</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">v2.1.0-Premium | Hackathon Gold Edition</p>
           </div>
        </footer>
      </div>

      <AIExplanationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issue={selectedIssue}
        explanation={explanation}
        lineage={lineage}
        onFix={handleFix}
        isFixing={isFixing}
        hasFixed={hasFixed}
      />

      <AnimatePresence>
        {isSurgeryActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/80 backdrop-blur-xl"
          >
            <div className="text-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                 className="w-32 h-32 border-4 border-teal-500/20 border-t-teal-500 rounded-full mx-auto mb-8 relative"
               >
                  <div className="absolute inset-4 border-2 border-brand-400/10 border-b-brand-400 rounded-full animate-spin-reverse" />
                  <Activity size={32} className="absolute inset-0 m-auto text-teal-400 animate-pulse" />
               </motion.div>
               
               <h2 className="text-4xl font-black text-white tracking-widest uppercase mb-2">Surgical HUD Active</h2>
               <p className="text-teal-400 font-bold text-[10px] tracking-[0.4em] uppercase mb-8">Neutralizing metadata drift in real-time</p>
               
               <div className="w-96 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Node</span>
                     <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">{activeFixNode || 'SCANNING...'}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '100%' }}
                       transition={{ duration: 5, repeat: Infinity }}
                       className="h-full bg-teal-500 shadow-[0_0_15px_#14b8a6]" 
                     />
                  </div>
                  <p className="mt-4 text-[9px] font-bold text-slate-500 italic uppercase tracking-widest">Accessing Realtime DB • Updating OpenMetadata Cluster</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AIChatAssistant />
    </main>
  );
}

