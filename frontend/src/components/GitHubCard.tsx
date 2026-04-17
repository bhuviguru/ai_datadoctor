'use client';

import React from 'react';
import { GitBranch, GitPullRequest, GitCommit, Star, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface GitHubSummary {
  username: string;
  name: string;
  avatar: string;
  public_repos: number;
  latest_activity: {
    name: string;
    description: string;
    updated_at: string;
    stars: number;
    url: string;
  }[];
}

export const GitHubCard = ({ summary }: { summary: GitHubSummary | null }) => {
  if (!summary) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Terminal size={120} />
      </div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex items-center gap-4">
           <img src={summary.avatar} alt={summary.name} className="w-12 h-12 rounded-full border-2 border-slate-50" />
           <div>
              <h3 className="text-[17px] font-black text-slate-800 leading-none mb-1">{summary.username}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{summary.name} • Active Developer</p>
           </div>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-slate-50 rounded-full flex items-center gap-2 border border-slate-100">
              <GitBranch size={12} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-600">{summary.public_repos} Repos</span>
           </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
         <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Latest Code Pulses</h4>
         {summary.latest_activity.map((repo, i) => (
           <a 
            key={i} 
            href={repo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all group"
           >
             <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-brand-500 group-hover:text-white transition-colors">
                   <GitCommit size={14} />
                </div>
                <div>
                   <p className="text-[13px] font-black text-slate-800 mb-0.5">{repo.name}</p>
                   <p className="text-[10px] font-bold text-slate-400">Pushed {new Date(repo.updated_at).toLocaleDateString()}</p>
                </div>
             </div>
             <div className="flex items-center gap-1 text-slate-300 group-hover:text-brand-500 transition-colors">
                <Star size={12} />
                <span className="text-[11px] font-bold">{repo.stars}</span>
             </div>
           </a>
         ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <GitPullRequest size={14} className="text-teal-500" />
            <span className="text-[11px] font-bold text-slate-500 italic">Syncing dev-velocity telemetry...</span>
         </div>
         <button className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View All Repos</button>
      </div>
    </motion.div>
  );
};
