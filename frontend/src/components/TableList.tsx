'use client';

import React from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { MetadataAsset } from '@/services/api';

interface TableListProps {
  tables: MetadataAsset[];
  onRowClick: (table: MetadataAsset) => void | Promise<void>;
}

export const TableList = ({ tables, onRowClick }: TableListProps) => {
  return (
    <div className="bg-white rounded-4xl p-10 border border-slate-100 shadow-xl shadow-slate-200/20">
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-3">Vital Data Assets</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Cluster Inventory Status</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Showing {tables.length} Active Nodes</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
              <th className="text-left py-6 px-4">Focus</th>
              <th className="text-left py-6 px-4">Node Identity</th>
              <th className="text-left py-6 px-4">Health Vitals</th>
              <th className="text-left py-6 px-4">Predictive Trend</th>
              <th className="text-left py-6 px-4">Surgical Markers</th>
              <th className="py-6 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tables.map((table) => {
              const score = table.status === 'Healthy' ? 98 : table.status === 'Unstable' ? 78 : 42;
              const predictive = table.predictive_health || 95;
              const colorClass = table.status === 'Healthy' ? 'text-emerald-500' : table.status === 'Unstable' ? 'text-amber-500' : 'text-red-500';
              const dotClass = table.status === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : table.status === 'Unstable' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';

              return (
                <tr 
                  key={table.id} 
                  onClick={() => onRowClick(table)}
                  className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                >
                  <td className="py-8 px-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotClass} ${table.status !== 'Healthy' ? 'animate-pulse' : ''}`} />
                  </td>
                  <td className="py-8 px-4">
                    <div>
                      <p className="text-[16px] font-black text-slate-800 leading-none mb-2">{table.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{table.service} • v{table.schema_version || '1.0.0'}</p>
                    </div>
                  </td>
                  <td className={`py-8 px-4 font-black text-2xl tracking-tighter ${colorClass}`}>
                    {score}%
                  </td>
                  <td className="py-8 px-4">
                     <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${predictive}%` }}
                              className={`h-full transition-all ${predictive > 80 ? 'bg-emerald-500' : predictive > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                           />
                        </div>
                        <span className="text-[12px] font-black text-slate-700">{predictive}%</span>
                     </div>
                  </td>
                  <td className="py-8 px-4">
                    {score > 80 ? (
                       <div className="flex items-center gap-2 text-emerald-600/60 p-1">
                          <ShieldCheck size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Optimized</span>
                       </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                         <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-xl border ${
                           table.status === 'Critical' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                         }`}>
                           {table.status === 'Critical' ? 'Impaired Cluster' : 'Irregular Variance'}
                         </span>
                      </div>
                    )}
                  </td>
                  <td className="py-8 px-4 text-right">
                    <div className="p-2 rounded-xl group-hover:bg-slate-100 transition-colors inline-block">
                       <ChevronRight className="text-slate-300 group-hover:text-slate-900 transition-colors" size={20} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
