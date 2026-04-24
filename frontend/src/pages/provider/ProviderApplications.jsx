import React, { useState } from 'react';
import { 
  Briefcase, Clock, MapPin, DollarSign, MessageCircle, CheckCircle2, Timer,
  Search, MoreVertical, Activity, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ProviderApplications = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Open': return { 
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', 
        icon: <Timer size={14} className="mr-1.5" />
      };
      case 'In Progress': return { 
        color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', 
        icon: <Activity size={14} className="mr-1.5" />
      };
      case 'Completed': return { 
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
        icon: <CheckCircle2 size={14} className="mr-1.5" />
      };
      default: return { color: 'bg-white/5 text-slate-400 border-white/10', icon: null };
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === 'All' || app.status === filter;
    const matchesSearch = app.jobTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen space-y-6 sm:space-y-10 pb-24 select-none px-2 sm:px-0">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-indigo-900/5 blur-[70px] sm:blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
        <div className="space-y-2 sm:space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Briefcase size={14} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Application Feed</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase"
          >
            Manage <span className="text-indigo-500">Proposals</span>
          </motion.h1>
          <p className="text-[12px] sm:text-[14px] font-bold text-slate-500">
            Monitor and track your active project applications in real-time.
          </p>
        </div>

        {/* Stats HUD (Liquid Glass) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 sm:gap-6 p-1.5 sm:p-2 bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[24px] sm:rounded-[32px] shadow-2xl border border-white/10 w-full sm:w-auto ring-1 ring-white/5"
        >
          <div className="flex-1 sm:flex-none flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Active</p>
              <p className="text-xl sm:text-2xl font-black text-white leading-none">{applications.length}</p>
            </div>
          </div>
          <div className="h-8 sm:h-10 w-[1px] bg-white/10" />
          <div className="flex-1 sm:flex-none flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Won</p>
              <p className="text-xl sm:text-2xl font-black text-white leading-none">12</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Filter & Search (Liquid Glass) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 bg-[#0c0f16]/40 backdrop-blur-3xl p-3 sm:p-4 rounded-[24px] sm:rounded-[28px] border border-white/10 shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {['All', 'Open', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-widest transition-all duration-300 shrink-0",
                filter === status 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white border border-white/5"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name..."
            className="w-full pl-12 pr-4 h-11 sm:h-12 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl outline-none focus:border-indigo-500/50 text-xs sm:text-sm font-semibold text-white transition-all ring-1 ring-white/5 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Applications Grid (Liquid Glass) */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredApps.map((app, idx) => {
            const statusCfg = getStatusConfig(app.status);
            return (
              <motion.div
                key={app.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 sm:gap-8 border border-white/10 shadow-2xl hover:bg-[#0c0f16]/80 transition-all duration-500 overflow-hidden ring-1 ring-white/5"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 sm:w-2 bg-indigo-600 rounded-r-full opacity-80 shadow-[0_0_15px_#4f46e5]" />

                <div className="flex-1 min-w-0 space-y-3 sm:space-y-4 sm:ml-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className={cn(
                      "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] border flex items-center transition-all duration-300",
                      statusCfg.color
                    )}>
                      {statusCfg.icon}
                      {app.status}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[9px] sm:text-[11px] font-bold">
                      <Clock size={14} />
                      Applied {app.appliedDate}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors truncate uppercase">
                      {app.jobTitle}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 truncate">Client: <span className="text-white">{app.clientName}</span> • {app.category}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 bg-indigo-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-indigo-400 border border-indigo-500/20">
                      <DollarSign size={16} strokeWidth={3} />
                      <span className="text-xs sm:text-sm font-black tracking-tight">${app.budget}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest truncate">
                      <MapPin size={14} />
                      {app.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <Link 
                    to="/chat"
                    className="flex-1 sm:flex-none h-12 sm:h-16 px-6 sm:px-8 bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
                  >
                    <MessageCircle size={18} />
                    Open Channel
                  </Link>
                  <button className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-white/10 transition-all ring-1 ring-white/5">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProviderApplications;
