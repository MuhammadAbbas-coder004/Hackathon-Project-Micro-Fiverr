import React from 'react';
import { Search, MapPin, DollarSign, Filter, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BrowseJobs = ({ jobs = [] }) => {
  return (
    <div className="space-y-12">

      {/* Header (Liquid) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
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
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Browse <span className="text-indigo-500">Jobs</span></h1>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 rounded-full flex items-center px-6 py-3.5 w-full md:w-72 ring-1 ring-white/5 focus-within:border-indigo-500/40 transition-all">
            <Search size={18} className="text-slate-500 mr-3" />
            <input type="text" placeholder="Filter nodes..." className="bg-transparent border-none outline-none text-sm font-bold text-white uppercase tracking-wider w-full placeholder:text-slate-600" />
          </div>
          <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all ring-1 ring-white/5">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {jobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0c0f16]/40 backdrop-blur-3xl rounded-[60px] p-28 text-center border-2 border-dashed border-white/5 ring-1 ring-white/5"
          >
             <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-10 text-indigo-400">
               <Search size={40} />
             </div>
             <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Null Signal</h3>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No active job nodes detected. Adjusting scan parameters may yield results.</p>
          </motion.div>
        ) : (
          jobs.map((job, i) => (
            <motion.div 
              key={job._id} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl hover:bg-[#0c0f16]/80 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8 ring-1 ring-white/5 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{job.title}</h4>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-indigo-500/20">
                      <MapPin size={12} /> {job.location || 'Remote'}
                    </span>
                    <span className="flex items-center gap-1.5 font-black text-emerald-400 text-sm">
                      <DollarSign size={14} /> ${job.budget}
                    </span>
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-white/5">
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <button className="px-8 py-4 border border-white/10 rounded-2xl text-slate-400 font-black hover:bg-white/5 hover:text-white transition-all text-[10px] uppercase tracking-widest">
                  Inspect
                </button>
                <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20 transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest">
                  Initialize Comms
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
