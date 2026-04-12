import React from 'react';
import { 
  MdAssignment, 
  MdLocationOn, 
  MdAttachMoney, 
  MdAccessTime, 
  MdChat, 
  MdChevronRight,
  MdCheckCircle,
  MdInfo,
  MdHistory,
  MdTrendingUp
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MyApplications = () => {
  // Mock data for applications
  const applications = [
    {
      id: 1,
      jobTitle: 'Fix Leaking Pipes in Kitchen',
      budget: 150,
      status: 'In Progress',
      appliedDate: '2 days ago',
      clientName: 'Jane Cooper',
      location: 'Downtown, San Francisco',
      category: 'Plumbing'
    },
    {
      id: 2,
      jobTitle: 'Full House Deep Cleaning',
      budget: 250,
      status: 'Open',
      appliedDate: '5 hours ago',
      clientName: 'Robert Fox',
      location: 'Oakland, CA',
      category: 'Cleaning'
    },
    {
      id: 3,
      jobTitle: 'Math Tutor for High School',
      budget: 45,
      status: 'Completed',
      appliedDate: '1 week ago',
      clientName: 'Guy Hawkins',
      location: 'Remote',
      category: 'Tutoring'
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return 'bg-[#f97316]/20 text-[#f97316]';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400';
      case 'Completed': return 'bg-emerald-500/20 text-emerald-400';
      case 'Rejected': return 'bg-rose-500/20 text-rose-400';
      default: return 'bg-white/5 text-white/40';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <MdAccessTime size={14} />;
      case 'In Progress': return <MdInfo size={14} />;
      case 'Completed': return <MdCheckCircle size={14} />;
      default: return <MdHistory size={14} />;
    }
  };

  return (
    <div className="space-y-10 pb-20 overflow-hidden">
      {/* Abstract Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[11px] font-black text-[#f97316] uppercase tracking-[0.4em] leading-none italic">Log_Relay</span>
             <MdTrendingUp className="text-[#f97316]" size={16} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Project<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Matrix</span>
          </h1>
          <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.2em] mt-4">Tracking and managing your active project applications.</p>
        </div>
        
        <div className="flex">
          <div className="px-8 py-4 bg-white/5 rounded-[28px] ring-1 ring-white/10 flex items-center gap-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <MdAssignment size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active_Relays</p>
              <p className="text-xl font-black text-white leading-none">{applications.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {applications.map((app, idx) => (
          <motion.div 
            key={app.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-[#111113] rounded-[48px] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-500 shadow-2xl ring-1 ring-white/5 hover:ring-[#f97316]/20 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f97316]/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex-1 space-y-6 relative z-10">
              <div className="flex flex-wrap items-center gap-4">
                <span className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center gap-2 ${getStatusStyle(app.status)}`}>
                  {getStatusIcon(app.status)}
                  {app.status}
                </span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MdAccessTime size={14} className="text-[#f97316]" />
                  Deployed {app.appliedDate}
                </span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-[#f97316] transition-colors leading-none uppercase">
                  {app.jobTitle}
                </h3>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl ring-1 ring-white/5 text-white/80 transition-all hover:bg-white/10">
                    <MdAttachMoney size={18} className="text-[#f97316]" />
                    <span className="font-black text-[15px]">${app.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                    <MdLocationOn size={16} className="text-white/20" />
                    {app.location}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                    <MdAssignment size={16} className="text-white/20" />
                    Tier: {app.category}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10 pt-4 md:pt-0">
              {app.status === 'In Progress' || app.status === 'Completed' ? (
                <Link 
                  to={`/chat`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 h-16 px-10 bg-[#f97316] text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[28px] transition-all shadow-[0_15px_35px_-10px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95"
                >
                  <MdChat size={20} />
                  Open_Relay
                </Link>
              ) : (
                <button className="flex-1 md:flex-none flex items-center justify-center gap-3 h-16 px-10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 font-bold rounded-[28px] transition-all active:scale-95 text-[11px] uppercase tracking-[0.3em] ring-1 ring-white/10">
                  Inspect_Data
                </button>
              )}
              <div className="hidden md:flex w-12 h-12 rounded-2xl bg-white/5 items-center justify-center text-white/10 group-hover:text-[#f97316] group-hover:bg-[#f97316]/10 transition-all">
                 <MdChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats summary HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-10">
        {[
          { label: 'Open_Feeds', val: '01', sub: 'Standby' },
          { label: 'Live_Hires', val: '01', sub: 'Deployed', active: true },
          { label: 'Success_Logs', val: '01', sub: 'Archived' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#111113] p-10 rounded-[44px] ring-1 ring-white/5 shadow-2xl flex flex-col items-center justify-center text-center space-y-2 group hover:ring-[#f97316]/20 transition-all">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] group-hover:text-[#f97316]/40 transition-colors uppercase">{stat.label}</p>
            <p className={`text-5xl font-black tracking-tighter ${stat.active ? 'text-[#f97316]' : 'text-white'} leading-none`}>{stat.val}</p>
            <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
