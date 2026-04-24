import React from 'react';
import { Send, Clock, CheckCircle, XCircle, Sparkles, ChevronRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Applications = ({ applications = [] }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    }
  };

  return (
    <div className="space-y-12">
      
      {/* ── Header Area (Liquid) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-8 py-6 bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] ring-1 ring-white/5 shadow-2xl flex items-center gap-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
             <Briefcase size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Logistical Tracking</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">My <span className="text-indigo-500">Nodes</span></h1>
          </div>
        </motion.div>
      </div>

      {/* ── Table Container (Liquid) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] sm:rounded-[56px] shadow-2xl overflow-hidden ring-1 ring-white/5"
      >
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Project Identity</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Budget Sync</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Temporal Node</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Status Code</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-10 py-32 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">
                    No active application streams detected.
                  </td>
                </tr>
              ) : (
                applications.map((app, i) => (
                  <tr key={app._id} className="hover:bg-white/[0.03] transition-all duration-300 group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform duration-500">
                          {app.title?.charAt(0)}
                        </div>
                        <span className="font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{app.title}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 font-black text-white tracking-tighter text-xl">${app.budget}</td>
                    <td className="px-10 py-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${getStatusStyle(app.role)}`}>
                        {app.role || 'pending'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <button className="px-5 py-2.5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-full font-black text-[9px] uppercase tracking-widest transition-all border border-white/5">Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Applications;
