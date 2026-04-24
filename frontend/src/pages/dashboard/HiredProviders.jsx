import React from 'react';
import { Mail, MessageSquare, Star, Clock, UserCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HiredProviders = () => {
  const providers = [
    {
      id: 1,
      name: 'John Doe',
      service: 'Home Plumbing',
      rating: 4.9,
      completedJobs: 124,
      lastActive: '10 mins ago',
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      service: 'Electrician Pro',
      rating: 4.8,
      completedJobs: 89,
      lastActive: '2 hours ago',
      status: 'Completed'
    }
  ];

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
             <UserCheck size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Active Operators</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Hired <span className="text-indigo-500">Pros</span></h1>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {providers.map((p, i) => (
          <motion.div 
            key={p.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="group bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 hover:bg-[#0c0f16]/80 transition-all duration-500 flex flex-col justify-between ring-1 ring-white/5 shadow-2xl"
          >
            <div>
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-[24px] flex items-center justify-center text-3xl font-black text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{p.name}</h3>
                  <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                    <Star size={14} className="fill-indigo-400" /> {p.rating} • {p.completedJobs} Jobs Done
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] leading-none">Service Provided</span>
                  <span className="text-lg font-black text-white uppercase tracking-tight">{p.service}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] leading-none">Last Active</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                    <Clock size={14} className="text-indigo-400" /> {p.lastActive}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-white/5">
              <button 
                onClick={() => alert(`Opening chat with ${p.name}...`)}
                className="flex-grow py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/20"
              >
                Chat Now
              </button>
              {p.status !== 'Completed' && (
                <button 
                  onClick={() => alert(`Marking job with ${p.name} as complete...`)}
                  className="flex-grow py-4 bg-emerald-500/10 text-emerald-400 font-black rounded-2xl hover:bg-emerald-600 hover:text-white transition-all text-[10px] uppercase tracking-widest border border-emerald-500/20"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {providers.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-28 text-center bg-[#0c0f16]/40 backdrop-blur-3xl rounded-[60px] border-2 border-dashed border-white/5 ring-1 ring-white/5"
        >
           <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
             <UserCheck size={40} className="text-slate-700" />
           </div>
           <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">No Active Operators</h3>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Deploy a job node to discover and hire professional operators.</p>
        </motion.div>
      )}
    </div>
  );
};

export default HiredProviders;
