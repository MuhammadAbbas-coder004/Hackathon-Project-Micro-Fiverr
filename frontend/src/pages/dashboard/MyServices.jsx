import React from 'react';
import { Plus, Edit2, Trash2, Tag, DollarSign, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MyServices = ({ services = [] }) => {
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
             <Tag size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Logistical Units</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">My <span className="text-indigo-500">Gigs</span></h1>
          </div>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Create Service
        </motion.button>
      </div>

      {services.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0c0f16]/40 backdrop-blur-3xl border-2 border-dashed border-white/5 rounded-[60px] p-24 text-center ring-1 ring-white/5"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Tag size={40} className="text-slate-700" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">No Active Nodes</h3>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto text-sm font-bold uppercase tracking-widest leading-relaxed">Your professional service grid is currently empty. Initialize your first node to start operations.</p>
          <button className="text-indigo-400 font-black text-[11px] uppercase tracking-[0.4em] hover:text-white transition-colors">Documentation Node</button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, i) => (
            <motion.div 
              key={service._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl hover:bg-[#0c0f16]/80 transition-all duration-500 overflow-hidden ring-1 ring-white/5"
            >
               <div className="h-56 relative overflow-hidden">
                  <div className="absolute top-6 left-6 z-20 bg-[#0c0f16]/80 backdrop-blur-xl px-4 py-2 rounded-2xl text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] border border-white/10 ring-1 ring-white/5">
                    {service.category}
                  </div>
                  <img 
                    src={service.image || `https://source.unsplash.com/random/400x300?${service.category}`} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f16] to-transparent opacity-60" />
               </div>
               
               <div className="p-10 space-y-6">
                  <div className="space-y-2">
                     <h4 className="text-xl font-black text-white tracking-tight uppercase leading-tight group-hover:text-indigo-400 transition-colors">{service.title}</h4>
                     <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{service.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Base Rate</span>
                      <span className="text-2xl font-black text-white tracking-tighter">${service.price}</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center border border-white/5">
                        <Edit2 size={18} />
                      </button>
                      <button className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-white/5">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServices;
