import React from 'react';
import { Briefcase, UserCheck, Clock, MessageSquare, PlusCircle, ArrowUpRight, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CustomerOverview = ({ stats = { posted: 0, spent: 0, active: 0, messages: 0 } }) => {
  const cards = [
    { label: 'Total Posted Jobs', value: stats.posted, icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Total Spent', value: `Rs. ${stats.spent.toLocaleString()}`, icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Projects', value: stats.active, icon: Clock, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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
             <Activity size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Command Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Client <span className="text-indigo-500">Dashboard</span></h1>
          </div>
        </motion.div>

        <Link to="/dashboard" onClick={() => window.location.hash = 'post-job'} className="flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all group">
           <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Post A New Job
        </Link>
      </div>

      {/* Stats Grid (Liquid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {cards.map((card, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl ring-1 ring-white/5 hover:bg-[#0c0f16]/80 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-colors" />
            
            <div className="relative flex justify-between items-start mb-6">
              <div className={`${card.bg} ${card.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={28} />
              </div>
            </div>
            
            <div className="relative space-y-1">
               <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{card.label}</h3>
               <p className="text-4xl font-black text-white tracking-tighter">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Grid (Liquid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#0c0f16]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] sm:rounded-[60px] shadow-2xl p-10 ring-1 ring-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
          
          <div className="relative flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Activity size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Recent Activity</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live tracking</p>
               </div>
            </div>
            <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border border-white/10">View All</button>
          </div>

          <div className="relative space-y-4">
             {[
               { title: 'Job Posted: Kitchen Renovation', time: '2 hours ago', status: 'Open' },
               { title: 'New Message from John Doe', time: '5 hours ago', status: 'Unread' },
               { title: 'Review Left for Sarah Smith', time: '1 day ago', status: 'Completed' }
             ].map((activity, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-[32px] hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 group/row">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover/row:bg-indigo-600 group-hover/row:text-white transition-all">
                      <ArrowUpRight size={20} />
                   </div>
                   <div className="flex-grow">
                     <h4 className="font-black text-white text-lg tracking-tight uppercase">{activity.title}</h4>
                     <p className="text-sm text-slate-500 font-medium">{activity.time}</p>
                   </div>
                   <div className="text-right">
                     <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">{activity.status}</span>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-indigo-600 rounded-[40px] sm:rounded-[60px] p-10 text-white relative overflow-hidden shadow-2xl group cursor-pointer hover:scale-[1.02] transition-transform duration-500">
           <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
              <UserCheck size={120} strokeWidth={1} />
           </div>
           
           <div className="relative z-10 space-y-10">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <UserCheck size={32} />
             </div>
             
             <div className="space-y-4">
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">Find A<br/>Pro</h3>
                <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">Browse top-rated service operators in your local area and deploy projects instantly.</p>
             </div>

             <button className="w-full py-5 bg-white text-indigo-600 font-black text-[12px] uppercase tracking-[0.3em] rounded-3xl shadow-2xl hover:bg-[#0c0f16] hover:text-white transition-all">
               Browse Services
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
