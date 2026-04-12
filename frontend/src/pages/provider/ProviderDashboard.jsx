import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdDashboard, 
  MdStar, 
  MdPeople, 
  MdWork, 
  MdShoppingBag, 
  MdChat, 
  MdMonitorHeart, 
  MdArrowOutward, 
  MdShield, 
  MdAddCircleOutline, 
  MdLogout, 
  MdExplore, 
  MdAccountBalanceWallet, 
  MdRadar,
  MdChevronRight,
  MdCheckCircle,
  MdFiberManualRecord
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LocationSender from '../../components/tracking/LocationSender';
import socket from '../../utils/socket';
import { api } from '../../utils/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const ProviderDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [vendorStats, setVendorStats] = useState({
    servicesCount: 0,
    activeBookings: 0,
    rating: user?.rating || 4.9,
    earnings: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
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

        setBalance(statsRes.data.balance);
        
      } catch (err) {
        console.error("Error fetching provider stats", err);
      }
    };
    if (user?._id) fetchStats();
  }, [user]);

  const toggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    socket.emit("set_online", { userId: user?._id, isOnline: newStatus });
  };

  useEffect(() => {
    if (user?._id) {
       socket.emit("set_online", { userId: user._id, isOnline: isOnline });
    }
  }, [user, isOnline]);

  useEffect(() => {
    socket.on("payment_received", (data) => {
      setBalance(prev => prev + Number(data.amount));
      setNotifications(prev => [data, ...prev]);
    });
    return () => socket.off("payment_received");
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Active_Gigs', value: vendorStats.servicesCount, icon: MdWork, color: 'text-white', bg: 'bg-white/5' },
    { label: 'Orders_In_Feed', value: vendorStats.activeBookings, icon: MdShoppingBag, color: 'text-[#f97316]', bg: 'bg-[#f97316]/10' },
    { label: 'Nexus_Rating', value: vendorStats.rating, icon: MdStar, color: 'text-[#f97316]', bg: 'bg-[#f97316]/10' },
    { label: 'Wallet_Balance', value: `$${balance.toLocaleString()}`, icon: MdAccountBalanceWallet, color: 'text-white', bg: 'bg-white/5' },
  ];

  return (
    <div className="space-y-12 pb-20 overflow-hidden">
      {/* Hero HUD Section - The "WOW" Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-4"
      >
        {/* Abstract Background Glows */}
        <div className="absolute top-[-50px] left-[10%] w-[300px] h-[300px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-50px] right-[10%] w-[400px] h-[400px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative bg-[#111113]/40 backdrop-blur-2xl rounded-[48px] p-8 md:p-14 flex flex-col xl:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left z-10">
            {/* Massive Profile Avatar */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#f97316]/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-[40px] bg-gradient-to-br from-white/10 to-white/5 p-1 ring-1 ring-white/10 overflow-hidden shadow-2xl">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-[36px]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white text-5xl font-black italic">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <motion.div 
                animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`absolute bottom-4 right-4 w-10 h-10 border-[6px] border-[#111113] rounded-full z-20 shadow-2xl ${isOnline ? 'bg-[#22c55e]' : 'bg-white/20'}`} 
              />
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-center md:justify-start gap-3">
                 <span className="text-[11px] font-black text-[#f97316] uppercase tracking-[0.4em] leading-none">Elite_Digital_Nomad</span>
                 <MdCheckCircle className="text-[#22c55e]" size={16} />
               </div>
               
               <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
                 {user?.name?.split(' ')[0]}<br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Portal</span>
               </h1>

               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                 <div className="px-5 py-2.5 bg-white/5 rounded-2xl text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                   NODE: <span className="text-white/80">NX-{user?._id?.slice(-5).toUpperCase()}</span>
                 </div>
                 <div className="px-5 py-2.5 bg-white/5 rounded-2xl text-[10px] font-black text-white/40 uppercase tracking-widest">
                   STATUS: <span className={isOnline ? 'text-[#22c55e]' : 'text-white/10'}>{isOnline ? 'LIVE_TRANSMIT' : 'STANDBY'}</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-4 w-full xl:w-auto z-10">
            <button 
              onClick={toggleOnline}
              className={`flex-1 xl:w-56 h-20 rounded-[28px] flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500
                ${isOnline 
                  ? 'bg-white/5 text-white/40 hover:bg-white/10 ring-1 ring-white/10' 
                  : 'bg-[#f97316] text-white hover:bg-[#ea580c] shadow-[0_20px_50px_-10px_rgba(249,115,22,0.4)]'
                }`}
            >
              <MdMonitorHeart size={20} className={isOnline ? 'animate-pulse' : ''} />
              {isOnline ? 'Disconnect' : 'Initialize'}
            </button>
            
            <div className="flex gap-4">
              <Link to="/dashboard/provider/services/create" className="flex-1">
                <button className="w-full h-20 px-8 rounded-[28px] bg-white text-black flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#f97316] hover:text-white transition-all shadow-2xl">
                  <MdAddCircleOutline size={22} /> Add_Gig
                </button>
              </Link>

              <button 
                onClick={handleLogout}
                className="h-20 w-20 rounded-[28px] bg-white/5 flex items-center justify-center text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all ring-1 ring-white/10"
              >
                <MdLogout size={22} />
              </button>
            </div>
          </div>

          {/* Background Text Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] select-none pointer-events-none uppercase">
            Nexus
          </div>
        </div>
      </motion.div>

      {/* Stats cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative h-40"
          >
            <div className={`relative h-full ${stat.bg} rounded-[40px] transition-all duration-500 p-8 flex flex-col justify-between overflow-hidden shadow-2xl ring-1 ring-white/5 hover:ring-[#f97316]/20 bg-[#111113]`}>
               <div className="flex items-center justify-between">
                 <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</p>
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 ${stat.color} shadow-inner`}>
                   <stat.icon size={20} />
                 </div>
               </div>

               <div className="relative">
                 <h3 className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                 <div className="h-1 w-8 bg-[#f97316] rounded-full mt-3 opacity-20" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Activity Core */}
        <div className="xl:col-span-2 space-y-10">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/dashboard/provider/orders" className="group">
              <div className="h-44 bg-[#111113] rounded-[44px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:bg-[#161619] transition-all ring-1 ring-white/5 hover:ring-[#f97316]/20">
                 <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-10 transition-opacity">
                   <MdShoppingBag size={140} className="text-[#f97316]" />
                 </div>
                 <div className="space-y-2">
                   <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Operational</p>
                   <h3 className="text-2xl font-black text-white tracking-tighter">Manage Orders</h3>
                 </div>
                 <div className="flex items-center gap-3 text-[11px] font-black text-[#f97316] uppercase tracking-[0.2em] mt-4">
                   Initialize_View <MdChevronRight size={18} />
                 </div>
              </div>
            </Link>

            <Link to="/dashboard/provider/messages" className="group">
              <div className="h-44 bg-[#111113] rounded-[44px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:bg-[#161619] transition-all ring-1 ring-white/5 hover:ring-white/10">
                 <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-10 transition-opacity">
                   <MdChat size={140} className="text-white" />
                 </div>
                 <div className="space-y-2">
                   <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Encrypted</p>
                   <h3 className="text-2xl font-black text-white tracking-tighter">Nexus Comms</h3>
                 </div>
                 <div className="flex items-center gap-3 text-[11px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em] mt-4 transition-colors">
                   Open_Relay <MdChevronRight size={18} />
                 </div>
              </div>
            </Link>
          </div>

          {/* Radar Deployment */}
          {activeBookingId ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group relative">
              <div className="absolute -inset-1 blur-2xl bg-[#f97316]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-[#f97316] rounded-[56px] p-12 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden shadow-[0_30px_60px_-15px_rgba(249,115,22,0.3)]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[90px] rounded-full" />
                <div className="relative flex items-center gap-8">
                  <div className="w-24 h-24 rounded-full bg-black/20 flex items-center justify-center relative ring-1 ring-white/20">
                    <MdRadar size={48} className="text-white animate-spin duration-[4s]" />
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 border-4 border-white/20 rounded-full" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">Deployed</h3>
                    <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em] mt-3 flex items-center justify-center md:justify-start gap-3">
                       <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live_Sync_Active
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/track-client/${activeBookingId}`)}
                  className="bg-black text-white h-18 px-12 rounded-[28px] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl hover:bg-white hover:text-black"
                >
                  Command Center
                </button>
              </div>
            </motion.div>
          ) : (
             <div className="bg-[#111113] rounded-[56px] p-20 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl ring-1 ring-white/5 border-dashed border-2 border-white/5">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <MdRadar size={44} className="text-white/10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white/20 uppercase tracking-tighter">No Active Signals</h3>
                  <p className="text-[11px] font-black text-white/10 uppercase tracking-[0.4em] mt-2">Waiting for contract_pulse</p>
                </div>
             </div>
          )}
        </div>

        {/* HUD Sidebar */}
        <div className="space-y-10">
           {activeBookingId && <LocationSender bookingId={activeBookingId} userId={user?._id} />}
           
           {/* Profile Tier */}
           <div className="bg-[#111113] text-white rounded-[56px] p-12 shadow-2xl relative overflow-hidden group ring-1 ring-white/5">
             <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-[#f97316]/10 blur-[80px] rounded-full" />
              <div className="relative space-y-8">
                <div className="flex items-center justify-between">
                   <div className="bg-white/5 p-4 rounded-[28px]">
                     <MdShield size={32} className="text-[#f97316]" />
                   </div>
                   <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] italic">Pro_Node</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter leading-none text-white uppercase">Pro Executive</h3>
                  <p className="text-[12px] text-white/40 mt-4 leading-relaxed font-bold uppercase tracking-tight">
                    Network status optimal. High-ticket relays enabled.
                  </p>
                </div>
                <button className="w-full bg-[#f97316] text-white py-5 rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#ea580c] transition-all shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)]">
                   Market Metrics
                </button>
              </div>
           </div>

           {/* Quick Relay */}
           <div className="bg-[#111113] rounded-[44px] p-8 border border-white/5 space-y-8 shadow-2xl">
              <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] px-2 italic">Fast Relays</span>
              <div className="space-y-3">
                 {[
                   { label: 'Services', sub: 'Matrix Hub', icon: MdWork, link: '/dashboard/provider/services', color: 'text-white' },
                   { label: 'Earning', sub: 'Liquid Flow', icon: MdAccountBalanceWallet, link: '/dashboard/provider/earnings', color: 'text-[#f97316]' }
                 ].map((item, i) => (
                   <Link key={i} to={item.link} className="flex items-center gap-5 p-5 rounded-[28px] hover:bg-white/5 transition-all group ring-1 ring-transparent hover:ring-white/5">
                      <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-inner`}>
                         <item.icon size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-black text-white uppercase tracking-wider">{item.label}</h4>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-0.5">{item.sub}</p>
                      </div>
                      <MdChevronRight size={20} className="text-white/10 group-hover:text-[#f97316] transition-colors" />
                   </Link>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProviderDashboard;

