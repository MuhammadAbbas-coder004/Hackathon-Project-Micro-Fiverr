import React from 'react';
import { TrendingUp, Users, CheckCircle, Star, ArrowUpRight, Clock, Activity as ActivityIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Overview = ({ stats = { earnings: 2450, active: 3, completed: 12, rating: 4.8, gigs: 5 }, history = [] }) => {
  const cards = [
    { label: 'Portfolio Balance', value: `$${stats.earnings}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Jobs', value: stats.active, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Avg. Rating', value: stats.rating, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-10">
      
      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {cards.map((card, i) => {
          const isBalance = card.label === 'Portfolio Balance';
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-[#0c0f16]/60 backdrop-blur-3xl border ${isBalance ? 'border-indigo-500/40' : 'border-white/10'} p-8 rounded-[40px] shadow-2xl ring-1 ring-white/5 hover:bg-[#0c0f16]/80 transition-all duration-500 group relative overflow-hidden`}
              style={isBalance ? { 
                boxShadow: '0 0 40px rgba(79, 70, 229, 0.1)',
                animation: 'cardBorderCycle 10s linear infinite'
              } : {}}
            >
              {isBalance && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent animate-pulse" />
              )}
              
              <div className="relative flex justify-between items-start mb-6">
                <div 
                  className={`${isBalance ? '' : card.bg + ' ' + card.color} p-4 rounded-2xl group-hover:scale-110 transition-all duration-500`}
                  style={isBalance ? { 
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    animation: 'iconColorCycle 8s linear infinite'
                  } : {}}
                >
                  <card.icon size={28} />
                </div>
                <span className="text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-3 py-1.5 rounded-full flex items-center gap-2 uppercase tracking-widest">
                  <ArrowUpRight size={14} /> +12%
                </span>
              </div>
              
              <div className="relative space-y-1">
                 <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{card.label}</h3>
                 <p 
                   className="text-4xl font-black tracking-tighter"
                   style={isBalance ? { animation: 'textColorCycle 8s linear infinite' } : { color: 'white' }}
                 >
                   {card.value}
                 </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @keyframes cardBorderCycle {
          0% { border-color: hsla(0, 70%, 50%, 0.4); }
          33% { border-color: hsla(120, 70%, 50%, 0.4); }
          66% { border-color: hsla(240, 70%, 50%, 0.4); }
          100% { border-color: hsla(360, 70%, 50%, 0.4); }
        }
        @keyframes iconColorCycle {
          0% { color: hsl(0, 100%, 70%); }
          33% { color: hsl(120, 100%, 70%); }
          66% { color: hsl(240, 100%, 70%); }
          100% { color: hsl(360, 100%, 70%); }
        }
        @keyframes textColorCycle {
          0% { color: hsl(0, 100%, 80%); text-shadow: 0 0 20px hsla(0, 100%, 50%, 0.3); }
          33% { color: hsl(120, 100%, 80%); text-shadow: 0 0 20px hsla(120, 100%, 50%, 0.3); }
          66% { color: hsl(240, 100%, 80%); text-shadow: 0 0 20px hsla(240, 100%, 50%, 0.3); }
          100% { color: hsl(360, 100%, 80%); text-shadow: 0 0 20px hsla(360, 100%, 50%, 0.3); }
        }
      `}</style>

      {/* ── Secondary Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Activity (Liquid) */}
        <div className="lg:col-span-2 bg-[#0c0f16]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] sm:rounded-[60px] shadow-2xl p-10 ring-1 ring-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
          
          <div className="relative flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <ActivityIcon size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Earnings History</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live tracking of your payments</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95"
              >
                Sync Balance
              </button>
            </div>
          </div>

          <div className="relative space-y-4">
             {history.length > 0 ? (
               history.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-[32px] hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 group/row">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover/row:bg-indigo-600 group-hover/row:text-white transition-all">
                      <TrendingUp size={20} />
                   </div>
                   <div className="flex-grow">
                     <h4 className="font-black text-white text-lg tracking-tight uppercase">{item.serviceId?.title || 'Service Payment'}</h4>
                     <p className="text-sm text-slate-500 font-medium">From {item.clientId?.name || item.clientName} • {new Date(item.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                     <span className="text-xl font-black text-emerald-400">+${item.amount}</span>
                   </div>
                </div>
               ))
             ) : (
               <div className="text-center py-20">
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No transactions detected yet.</p>
               </div>
             )}
          </div>
        </div>

        {/* Upgrade Card */}
        <div className="bg-indigo-600 rounded-[40px] sm:rounded-[60px] p-10 text-white relative overflow-hidden shadow-2xl group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
           <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp size={120} strokeWidth={1} />
           </div>
           
           <div className="relative z-10 space-y-10">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <TrendingUp size={32} />
             </div>
             
             <div className="space-y-4">
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">Upgrade <br/>Identity</h3>
                <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">Unlock unlimited node postings and 0% logistical fees for 3 cycles.</p>
             </div>

             <button className="w-full py-5 bg-white text-indigo-600 font-black text-[12px] uppercase tracking-[0.3em] rounded-3xl shadow-2xl hover:bg-slate-900 hover:text-white transition-all">
               Initialize Pro
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
