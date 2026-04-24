import React from 'react';
import { Plus, Edit2, Trash2, Users, Clock, AlertCircle, Sparkles, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const MyPostedJobs = ({ jobs = [] }) => {
  const displayJobs = jobs;

  return (
    <div className="space-y-12">

      {/* Header (Liquid) */}
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
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Deployed Nodes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">My <span className="text-indigo-500">Jobs</span></h1>
          </div>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Post New Job
        </motion.button>
      </div>

      <div className="space-y-6">
        {displayJobs.map((job, i) => (
          <motion.div 
            key={job._id} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-[#0c0f16]/80 transition-all duration-500 relative overflow-hidden ring-1 ring-white/5 shadow-2xl"
          >
            <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_#4f46e5]"></div>
            
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[24px] flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                <Briefcase size={32} />
              </div>
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h4 className="text-xl font-black text-white tracking-tight uppercase">{job.title}</h4>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border ${
                    job.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full ring-1 ring-white/5"><Clock size={14} className="text-indigo-400" /> {job.time}</div>
                   <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full ring-1 ring-white/5"><Users size={14} className="text-indigo-400" /> {job.applicants} Applicants</div>
                   <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-full">Budget: ${job.budget}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
               <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20">
                 Review Proposals
               </button>
               <div className="flex items-center gap-2">
                 <button className="p-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl hover:bg-white/10 hover:text-indigo-400 transition-all ring-1 ring-white/5">
                    <Edit2 size={18} />
                 </button>
                 <button className="p-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl hover:bg-rose-500/10 hover:text-rose-400 transition-all ring-1 ring-white/5">
                    <Trash2 size={18} />
                 </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {displayJobs.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-28 text-center bg-[#0c0f16]/40 backdrop-blur-3xl rounded-[60px] border-2 border-dashed border-white/5 ring-1 ring-white/5"
        >
           <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
             <AlertCircle size={40} className="text-slate-700" />
           </div>
           <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">No Deployed Nodes</h3>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Initialize your first job node to begin operator discovery.</p>
        </motion.div>
      )}
    </div>
  );
};

export default MyPostedJobs;
