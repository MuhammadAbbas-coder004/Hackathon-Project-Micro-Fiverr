import React from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, MessageSquare, DollarSign, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'New Message',
      desc: 'Alex Johnson sent you a message about the HVAC project.',
      time: '2 mins ago',
      icon: MessageSquare,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      unread: true,
    },
    {
      id: 2,
      type: 'success',
      title: 'Payment Received',
      desc: 'Your payment for "Plumbing Fix" has been processed.',
      time: '1 hour ago',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      unread: true,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Deadline Approaching',
      desc: 'Your job "Electrical Wiring" is due in 5 hours.',
      time: '3 hours ago',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      unread: false,
    },
    {
      id: 4,
      type: 'info',
      title: 'New Job Matching your Skills',
      desc: 'A new job "Kitchen Remodel Assistance" matches your profile.',
      time: 'Yesterday',
      icon: Briefcase,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      unread: false,
    },
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
             <Bell size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node Alerts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Notifications</h1>
          </div>
        </motion.div>

        <button className="text-[10px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-[0.3em]">
          Clear Terminal Buffer
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl overflow-hidden ring-1 ring-white/5"
      >
        <div className="divide-y divide-white/5">
          {notifications.map((notif, i) => (
            <motion.div 
              key={notif.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 flex gap-8 hover:bg-white/5 transition-all cursor-pointer relative group ${notif.unread ? 'bg-indigo-500/[0.03]' : ''}`}
            >
              {notif.unread && (
                <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-indigo-600 rounded-r-full shadow-[0_0_15px_#4f46e5]"></div>
              )}
              <div className={`${notif.bg} ${notif.color} w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 transition-transform group-hover:scale-110 duration-500 shadow-xl`}>
                <notif.icon size={28} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`text-xl font-black uppercase tracking-tight ${notif.unread ? 'text-indigo-400' : 'text-white'}`}>{notif.title}</h4>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{notif.time}</span>
                </div>
                <p className="text-base font-medium text-slate-400 leading-relaxed max-w-2xl">{notif.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {notifications.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-32 text-center bg-[#0c0f16]/40 backdrop-blur-3xl rounded-[60px] border-2 border-dashed border-white/5 ring-1 ring-white/5"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Bell size={40} className="text-slate-700" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Null Buffer</h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No incoming signals detected in this cycle.</p>
        </motion.div>
      )}
    </div>
  );
};

export default Notifications;
