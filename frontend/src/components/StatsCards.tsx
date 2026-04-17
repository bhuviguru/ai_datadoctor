'use client';

import { Heart, Database, AlertCircle, Zap, ShieldCheck } from 'lucide-react';

interface StatsCardsProps {
  totalTables: number;
  healthScore: number;
  criticalIssues: number;
  governanceCoverage: number;
}

export const StatsCards = ({ totalTables, healthScore, criticalIssues, governanceCoverage }: StatsCardsProps) => {
  const stats = [
    { 
      label: 'Overall Health', 
      value: `${healthScore}%`, 
      icon: <Heart size={24} className="text-[#f43f5e]" />, 
      status: 'STABLE',
      desc: 'Overall Health Index',
      color: 'bg-rose-50'
    },
    { 
      label: 'Governance Coverage', 
      value: `${governanceCoverage}%`, 
      icon: <ShieldCheck size={24} className="text-[#8b5cf6]" />, 
      status: 'TAGGING ACTIVE',
      desc: 'Metadata Governance',
      color: 'bg-purple-50'
    },
    { 
      label: 'Active Issues', 
      value: criticalIssues, 
      icon: <AlertCircle size={24} className="text-[#f59e0b]" />, 
      status: `${criticalIssues} CRITICAL`,
      desc: 'Predictive Issues',
      color: 'bg-amber-50'
    },
    { 
      label: 'Latency', 
      value: '42ms', 
      icon: <Zap size={24} className="text-brand-500" />, 
      status: 'DIAGNOSTIC ENGINE',
      desc: 'Analysis Speed',
      color: 'bg-teal-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-0">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-[1.25rem] p-6 border border-slate-100 flex flex-col justify-between h-40 relative shadow-sm hover:shadow-xl transition-all duration-500 cursor-default group">
          <div className="absolute inset-0 bg-linear-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.25rem]" />
          <div className="flex justify-between items-start w-full relative z-10">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-teal-500/10 ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
              {stat.icon}
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{stat.status}</span>
          </div>
          
          <div className="mt-4 relative z-10">
             <p className="text-[11px] font-bold text-slate-400 mb-1">{stat.desc}</p>
             <h4 className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};
