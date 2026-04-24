// Clean Modern Applications Page - Independent Version
import React, { useState } from 'react';
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
  MdTrendingUp,
  MdSearch,
  MdFilterList,
  MdWork,
  MdMoreVert
} from 'react-icons/md';
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  DollarSign, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Timer,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Star as StarIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Inlined cn utility to avoid import resolution issues
const cn = (...classes) => classes.filter(Boolean).join(' ');

const MyApplications = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Open': return { 
        color: 'bg-[#4845D2]/10 text-[#4845D2] border-[#4845D2]/20', 
        icon: <Timer size={14} className="mr-1.5" />
      };
      case 'In Progress': return { 
        color: 'bg-[#4845D2]/10 text-[#4845D2] border-[#4845D2]/20', 
        icon: <Activity size={14} className="mr-1.5" />
      };
      case 'Completed': return { 
        color: 'bg-[#4845D2]/10 text-[#4845D2] border-[#4845D2]/20', 
        icon: <CheckCircle2 size={14} className="mr-1.5" />
      };
      default: return { color: 'bg-zinc-100 text-zinc-600 border-zinc-200', icon: null };
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === 'All' || app.status === filter;
    const matchesSearch = app.jobTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen space-y-10 pb-24 select-none">
      {/* Subtle Background Accents */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#4845D2]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#4845D2]/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* ── TOP HEADER SECTION ── */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-[#4845D2] flex items-center justify-center text-white shadow-lg shadow-[#4845D2]/20">
              <Briefcase size={16} />
            </div>
            <span className="text-[11px] font-black text-[#4845D2] uppercase tracking-[0.2em]">Application Feed</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#1B2559] tracking-tight"
          >
            Manage Proposals
          </motion.h1>
          <p className="text-[14px] font-bold text-[#7D8592] opacity-60">
            Monitor and track your active project applications in real-time.
          </p>
        </div>

        {/* Stats HUD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-6 p-2 bg-white rounded-[32px] shadow-xl shadow-[#4845D2]/5 border border-white"
        >
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4845D2]/10 flex items-center justify-center text-[#4845D2]">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Active</p>
              <p className="text-2xl font-black text-[#1B2559] leading-none">{applications.length}</p>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-zinc-100" />
          <div className="flex items-center gap-4 px-6 py-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4845D2]/10 flex items-center justify-center text-[#4845D2]">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Won</p>
              <p className="text-2xl font-black text-[#1B2559] leading-none">12</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-4 rounded-[28px] border border-white shadow-lg shadow-[#4845D2]/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {['All', 'Open', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all duration-300 shrink-0",
                filter === status 
                  ? "bg-[#4845D2] text-white shadow-lg shadow-[#4845D2]/20" 
                  : "bg-white/50 text-[#1B2559]/40 hover:bg-white hover:text-[#1B2559]"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name..."
            className="w-full pl-12 pr-4 h-12 bg-white/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#4845D2]/20 text-sm font-semibold transition-all"
          />
        </div>
      </div>

      {/* ── APPLICATIONS GRID ── */}
      <div className="grid grid-cols-1 gap-6">
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
                className="group relative bg-white rounded-[32px] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 border border-white shadow-xl shadow-[#4845D2]/5 hover:shadow-2xl hover:shadow-[#4845D2]/10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#4845D2] opacity-80" />

                <div className="flex flex-1 gap-6">
                  <div className="relative shrink-0 hidden sm:block">
                    <div className="w-16 h-16 rounded-[22px] bg-[#4845D2] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#4845D2]/10">
                      {app.clientName.charAt(0)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border flex items-center shadow-sm transition-all duration-300",
                        statusCfg.color
                      )}>
                        {statusCfg.icon}
                        {app.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold">
                        <Clock size={14} />
                        Applied {app.appliedDate}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-[#1B2559] tracking-tight group-hover:text-[#4845D2] transition-colors truncate">
                        {app.jobTitle}
                      </h3>
                      <p className="text-sm font-bold text-zinc-400">Client: <span className="text-[#1B2559]">{app.clientName}</span> • {app.category}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 bg-[#4845D2]/5 px-4 py-2 rounded-xl text-[#4845D2] border border-[#4845D2]/10">
                        <DollarSign size={16} strokeWidth={3} />
                        <span className="text-sm font-black tracking-tight">${app.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-xs font-black uppercase tracking-widest">
                        <MapPin size={14} />
                        {app.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {app.status === 'In Progress' || app.status === 'Completed' ? (
                    <Link 
                      to="/dashboard/provider/messages"
                      className="flex-1 sm:flex-none h-16 px-8 bg-[#4845D2] text-white rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-[#4845D2]/20 hover:bg-[#3b38a8] hover:scale-105 active:scale-95 transition-all"
                    >
                      <MessageCircle size={18} />
                      Open Channel
                    </Link>
                  ) : (
                    <button className="flex-1 sm:flex-none h-16 px-8 bg-white border border-zinc-100 text-[#1B2559] rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-50 hover:border-zinc-200 active:scale-95 transition-all">
                      View Proposal
                    </button>
                  )}
                  <button className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-[#4845D2] hover:bg-[#4845D2]/5 transition-all">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
        {[
          { label: 'Total Value', val: '$2,450', icon: <DollarSign /> },
          { label: 'Active Tasks', val: '04', icon: <Activity /> },
          { label: 'Pending Rev', val: '$850', icon: <Clock /> },
          { label: 'Efficiency', val: '98%', icon: <Activity /> }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-white shadow-xl shadow-[#4845D2]/5 flex flex-col gap-4 group hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4845D2]/10 text-[#4845D2]">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-3xl font-black text-[#1B2559] tracking-tighter mt-1">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
