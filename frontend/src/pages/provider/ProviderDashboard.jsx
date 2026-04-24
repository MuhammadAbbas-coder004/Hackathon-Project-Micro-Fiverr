import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
   MdSearch, MdNotificationsNone, MdChevronRight, MdMoreHoriz,
   MdArrowUpward, MdArrowDownward, MdAdd, MdSend, MdCallReceived,
   MdCreditCard, MdHistory, MdKeyboardArrowDown, MdScanner, MdStar
} from 'react-icons/md';
import {
   ArrowUpRight, ArrowDownLeft, Plus, Send, Download,
   CreditCard, LayoutGrid, MoreVertical, CheckCircle2, Zap, Activity, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';
import { api } from '../../utils/api';

/* --- Stat Card Component (Liquid Glass) --- */
const StatMiniCard = ({ title, amount, type }) => (
   <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] p-4 sm:p-6 flex flex-col gap-1 flex-1 shadow-2xl border border-white/10 group transition-all ring-1 ring-white/5"
   >
      <div className="flex items-center justify-between ring-1 ring-white/5 p-1.5 rounded-full pl-4 bg-white/5 backdrop-blur-sm">
         <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate mr-2">{title}</span>
         <div className="bg-white/5 rounded-full p-1.5 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0 text-slate-500">
            <MdKeyboardArrowDown size={16} />
         </div>
      </div>
      <div className="flex items-center justify-between mt-4">
         <motion.h3
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[20px] sm:text-[26px] font-black text-white tracking-tight"
         >
            {amount}
         </motion.h3>
         <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 shrink-0 ${type === 'income'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-rose-500/10'
            }`}>
            {type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
         </div>
      </div>
   </motion.div>
);

/* --- Freelancer Goal Card (Liquid Glass) --- */
const FreelancerGoalCard = ({ title, progress, current, target, colorClass, icon: Icon }) => (
   <motion.div
      whileHover={{ y: -8 }}
      className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[36px] p-6 sm:p-7 shadow-2xl border border-white/10 hover:bg-[#0c0f16]/80 transition-all group ring-1 ring-white/5"
   >
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-4">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] sm:rounded-[22px] ${colorClass} flex items-center justify-center text-white shadow-xl relative overflow-hidden group-hover:scale-110 transition-transform`}>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
               <Icon size={22} className="sm:size-[26px]" />
            </div>
            <div>
               <h4 className="text-[15px] sm:text-[17px] font-black text-white leading-tight">{title}</h4>
               <p className="text-[11px] sm:text-[12px] font-bold text-slate-500 flex items-center gap-1">
                  <Activity size={10} /> Live Stats
               </p>
            </div>
         </div>
         <div className="flex flex-col items-end shrink-0">
            <span className="text-[14px] sm:text-[16px] font-black text-white">{progress}%</span>
         </div>
      </div>
      <div className="space-y-3">
         <div className="w-full h-[8px] sm:h-[10px] bg-white/5 rounded-full overflow-hidden p-[2px] ring-1 ring-white/5">
            <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className={`h-full rounded-full ${colorClass} shadow-lg shadow-indigo-500/20`}
               transition={{ duration: 1.5, ease: "circOut" }}
            />
         </div>
         <div className="flex justify-between items-center px-1">
            <div className="flex items-baseline gap-1">
               <span className="text-[14px] sm:text-[16px] font-black text-white">{current}</span>
               <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-tighter">Now</span>
            </div>
            <div className="flex items-baseline gap-1">
               <span className="text-[12px] sm:text-[14px] font-black text-slate-500">{target}</span>
            </div>
         </div>
      </div>
   </motion.div>
);

/* --- Weekly Activity Chart (Liquid Glass) --- */
const WeeklyActivityChart = () => {
   const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
   const data = [
      { u: 30, r: 70 }, { u: 45, r: 55 }, { u: 60, r: 40 },
      { u: 20, r: 80 }, { u: 75, r: 25 }, { u: 40, r: 60 }, { u: 55, r: 45 }
   ];
   return (
      <div className="w-full h-[200px] sm:h-[260px] flex items-end justify-between px-2 sm:px-6 mt-8 sm:mt-12 relative">
         <div className="absolute inset-x-0 top-0 bottom-10 flex flex-col justify-between pointer-events-none opacity-[0.05]">
            {[...Array(5)].map((_, i) => (
               <div key={i} className="w-full h-[1px] bg-white" />
            ))}
         </div>

         {data.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-3 sm:gap-5 w-full group h-full justify-end relative z-10">
               <div className="flex flex-col items-center gap-2 w-[16px] sm:w-[24px] h-[150px] sm:h-[200px] justify-end relative">
                  <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: `${d.u}%`, opacity: 1 }}
                     className="w-full bg-white/10 rounded-t-full z-10 group-hover:bg-white/20 transition-colors"
                  />
                  <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: `${d.r}%`, opacity: 1 }}
                     className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-b-full group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all cursor-pointer relative overflow-hidden"
                  />
               </div>
               <span className="text-[10px] sm:text-[12px] font-black text-slate-600 group-hover:text-white transition-colors">{days[i]}</span>
            </div>
         ))}
      </div>
   );
};

/* --- Nexus Radar Card --- */
const NexusRadarCard = ({ active, onTrack }) => (
   <div className="bg-[#0A0D1F] rounded-[36px] sm:rounded-[44px] p-6 sm:p-10 text-white relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/5 group">
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-600/20 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
         <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
               <h3 className="text-[18px] sm:text-[22px] font-black tracking-tight">Nexus Radar</h3>
            </div>
            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mt-1">Scanning...</p>
         </div>
         <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-xl ${active ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/5'}`}>
            <MdScanner size={24} className={active ? 'text-emerald-400' : 'text-white/20'} />
         </div>
      </div>

      <div className="relative w-full h-[150px] sm:h-[180px] flex items-center justify-center mb-6 sm:mb-8">
         <div className="absolute inset-0 flex items-center justify-center scale-75 sm:scale-100">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 4, repeat: Infinity }} className="w-40 h-40 border border-white/5 rounded-full absolute" />
            <div className="w-28 h-28 border border-white/10 rounded-full absolute" />
         </div>
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-full h-full absolute inset-0 rounded-full z-0 flex items-center justify-center">
            <div className="w-1/2 h-[2px] bg-gradient-to-r from-transparent to-indigo-500/40 absolute right-0 origin-left" />
         </motion.div>
         <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] border border-white/20">
            <Zap className={active ? "text-emerald-400 fill-emerald-400/20" : "text-white/40"} size={28} />
         </div>
      </div>

      <motion.button
         whileTap={active ? { scale: 0.98 } : {}}
         onClick={onTrack}
         disabled={!active}
         className={`w-full py-4 sm:py-5 rounded-[20px] sm:rounded-[24px] text-[14px] sm:text-[15px] font-black transition-all ${active
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
            }`}
      >
         {active ? 'Track Client Link' : 'Radar Offline'}
      </motion.button>
   </div>
);

const ProviderDashboard = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [vendorStats, setVendorStats] = useState({
      servicesCount: 0, activeBookings: 0, rating: user?.rating || 4.9, earnings: 0
   });
   const [balance, setBalance] = useState(0);
   const [activeBookingId, setActiveBookingId] = useState(null);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const statsRes = await api.get('/bookings/provider/stats');
            const bookingsRes = await api.get('/bookings/provider');
            const servicesRes = await api.get('/services');
            const myServices = servicesRes.data.filter(s => s.providerId === user._id);
            const active = bookingsRes.data.find(b => b.status === 'active' || b.status === 'Paid');
            if (active) setActiveBookingId(active._id);
            setVendorStats({
               servicesCount: myServices.length,
               activeBookings: bookingsRes.data.filter(b => b.status === 'active' || b.status === 'Paid').length,
               rating: user?.rating || 4.9,
               earnings: statsRes.data.totalEarned
            });
         } catch (err) { console.error("Stats Error", err); }
      };
      if (user?._id) fetchStats();
   }, [user]);

   return (
      <div className="h-full w-full bg-transparent px-4 sm:px-8 xl:px-12 py-4 sm:py-6 flex flex-col xl:flex-row gap-8 xl:gap-12 overflow-y-auto pb-20 select-none no-scrollbar">

         {/* Left Content Column */}
         <div className="flex-[2] flex flex-col gap-8 sm:gap-12">
            
            {/* Balance + Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
               {/* Balance Card (Liquid Glass) */}
               <motion.div className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 flex flex-col justify-between shadow-2xl border border-white/10 relative overflow-hidden group ring-1 ring-white/5">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none" />
                  <div className="mb-8 relative z-10">
                     <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                        <h3 className="text-[12px] sm:text-[14px] font-black text-slate-500 uppercase tracking-[0.3em]">Portfolio Balance</h3>
                     </div>
                     <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                  </div>
                  <div className="mb-10 relative z-10">
                     <div className="flex items-baseline gap-1">
                        <span className="text-[20px] sm:text-[24px] font-black text-slate-600">$</span>
                        <h1 className="text-[48px] sm:text-[64px] font-black text-white tracking-tighter leading-none">0.00</h1>
                     </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                     <button onClick={() => navigate('/dashboard/provider/services/create')} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all">
                        Create Gig
                     </button>
                     <button className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all ring-1 ring-white/5">
                        Profile
                     </button>
                  </div>
               </motion.div>

               {/* Stat Cards Column */}
               <div className="flex flex-col gap-6 sm:gap-10">
                  <div className="flex gap-4 sm:gap-10">
                     <StatMiniCard title="Rating" amount={vendorStats.rating} type="income" />
                     <StatMiniCard title="Gigs" amount={vendorStats.servicesCount} type="expense" />
                  </div>
                  <NexusRadarCard active={!!activeBookingId} onTrack={() => navigate(`/track-client/${activeBookingId}`)} />
               </div>
            </div>

            {/* Activity Chart (Liquid Glass) */}
            <div className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[36px] sm:rounded-[44px] p-6 sm:p-12 shadow-2xl border border-white/10 relative overflow-hidden ring-1 ring-white/5">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8">
                  <div>
                     <h3 className="text-[20px] sm:text-[24px] font-black text-white tracking-tighter uppercase">Analytics</h3>
                     <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Growth report</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 ring-1 ring-white/5">
                     <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-white/20" /><span className="text-[11px] font-black text-slate-400">Views</span></div>
                     <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><span className="text-[11px] font-black text-slate-400">Orders</span></div>
                  </div>
               </div>
               <WeeklyActivityChart />
            </div>

            {/* Goals Grid (Liquid Glass) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 pb-10">
               <FreelancerGoalCard title="Views" progress={85} current="1.2k" target="2k" colorClass="bg-indigo-900" icon={Activity} />
               <FreelancerGoalCard title="Orders" progress={vendorStats.activeBookings > 0 ? 100 : 0} current={vendorStats.activeBookings} target="Max" colorClass="bg-indigo-600" icon={CheckCircle2} />
               <div className="bg-[#0c0f16]/40 border-2 border-dashed border-white/5 rounded-[36px] flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-[#0c0f16]/60 transition-all group ring-1 ring-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all"><Plus size={24} /></div>
                  <span className="mt-4 text-[13px] font-black text-slate-500 uppercase tracking-widest">Milestone</span>
               </div>
            </div>
         </div>

         {/* Right Column (Cards & Timeline) */}
         <div className="flex-[1] flex flex-col gap-8 sm:gap-12 pb-10">
            {/* ID Card (Liquid Glass) */}
            <div className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[36px] p-8 sm:p-10 shadow-2xl border border-white/10 ring-1 ring-white/5">
               <h3 className="text-[20px] font-black text-white mb-6 uppercase tracking-tight">Profile Status</h3>
               <div className="w-full h-[220px] bg-[#0A0D1F] rounded-[32px] relative overflow-hidden p-8 flex flex-col justify-between group border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
                  <div className="flex items-center justify-between relative z-10">
                     <div className="bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-400">LIVE</span>
                     </div>
                     <Zap className="text-white opacity-20" size={24} />
                  </div>
                  <div className="relative z-10">
                     <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Freelancer ID</p>
                     <p className="text-white text-[20px] font-black tracking-widest truncate">#{user?._id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                     <p className="text-white text-[14px] font-bold">Top Rated</p>
                     <p className="text-white/30 text-[12px] font-black">v1.0</p>
                  </div>
               </div>
            </div>

            {/* Timeline (Liquid Glass) */}
            <div className="flex-1 bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[36px] p-8 sm:p-10 shadow-2xl border border-white/10 ring-1 ring-white/5">
               <h3 className="text-[20px] font-black text-white mb-8 uppercase tracking-tight">Timeline</h3>
               <div className="space-y-6">
                  {[
                     { n: 'Website Build', d: '2h ago', a: 'Active', c: 'bg-indigo-600 text-white' },
                     { n: 'Brand Logo', d: '1d ago', a: 'Done', c: 'bg-emerald-500/20 text-emerald-400' }
                  ].map((h, i) => (
                     <div key={i} className="flex items-center gap-4 group">
                        <div className={`w-12 h-12 rounded-2xl ${h.c} flex items-center justify-center font-black text-[18px]`}>{h.n.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-[15px] font-black text-white truncate">{h.n}</h4>
                           <p className="text-[11px] font-bold text-slate-600">{h.d}</p>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border ${h.a === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>{h.a}</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
   );
};

export default ProviderDashboard;
