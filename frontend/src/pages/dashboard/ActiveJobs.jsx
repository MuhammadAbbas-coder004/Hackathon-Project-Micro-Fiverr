import React from 'react';
import { MessageSquare, Phone, User, CheckCircle, Sparkles, Activity, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const ActiveJobs = ({ activeJobs = [] }) => {
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
             <Activity size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Live Operations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Active <span className="text-indigo-500">Flow</span></h1>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {activeJobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full bg-[#0c0f16]/40 backdrop-blur-3xl rounded-[60px] p-24 text-center border-2 border-dashed border-white/5 ring-1 ring-white/5"
          >
             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
               <Briefcase size={40} className="text-slate-700" />
             </div>
             <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">No active streams</h3>
             <p className="text-slate-500 max-w-sm mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">Your professional pipeline is currently idle. Secured nodes will materialize here upon deployment.</p>
          </motion.div>
        ) : (
          activeJobs.map((job, i) => (
            <motion.div 
              key={job._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[48px] shadow-2xl hover:bg-[#0c0f16]/80 transition-all duration-500 group relative overflow-hidden ring-1 ring-white/5"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[60px] -mr-24 -mt-24 group-hover:bg-indigo-600/10 transition-colors" />
              
              <div className="relative flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight uppercase leading-none group-hover:text-indigo-400 transition-colors mb-2">{job.title}</h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Client: {job.postedBy?.name}</p>
                </div>
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black rounded-full uppercase border border-indigo-500/20 tracking-[0.2em] shadow-sm">In Operation</span>
              </div>
              
              <div className="relative grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-colors">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Deal Price</p>
                   <p className="text-2xl font-black text-white tracking-tighter">${job.budget}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 hover:border-white/10 transition-colors">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Next Milestone</p>
                   <p className="text-2xl font-black text-white tracking-tighter">Delivery</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between gap-6">
                <div className="flex gap-3">
                   <button className="w-14 h-14 bg-white/5 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center border border-white/5 shadow-xl">
                      <MessageSquare size={20} />
                   </button>
                   <button className="w-14 h-14 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center border border-white/5 shadow-xl">
                      <User size={20} />
                   </button>
                </div>
                <button className="flex-grow py-5 px-8 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl group/btn">
                  <CheckCircle size={20} className="group-hover/btn:scale-110 transition-transform" /> Sync Delivery
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;
