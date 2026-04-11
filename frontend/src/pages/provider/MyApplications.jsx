import React from 'react';
import { 
  ClipboardList, 
  MapPin, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
      title: 'Full House Deep Cleaning',
      budget: 250,
      status: 'Open',
      appliedDate: '5 hours ago',
      clientName: 'Robert Fox',
      location: 'Oakland, CA',
      category: 'Cleaning'
    },
    {
      id: 3,
      title: 'Math Tutor for High School',
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
      case 'Open': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'In Progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <Timer size={14} />;
      case 'In Progress': return <AlertCircle size={14} />;
      case 'Completed': return <CheckCircle2 size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
          <p className="text-slate-400">Track and manage your project applications.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50">
          <div className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center gap-2 text-sm font-bold">
            <ClipboardList size={16} />
            Total: {applications.length} 
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 p-6 md:p-8 rounded-[32px] group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 space-y-4 relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border flex items-center gap-1.5 ${getStatusStyle(app.status)}`}>
                  {getStatusIcon(app.status)}
                  {app.status}
                </span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} />
                  Applied {app.appliedDate}
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-2 leading-tight">
                  {app.jobTitle || app.title}
                </h3>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700/50 text-indigo-400">
                    <DollarSign size={14} className="text-emerald-500" />
                    <span className="font-bold text-sm">${app.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                    <MapPin size={14} className="text-indigo-500" />
                    {app.location}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <ClipboardList size={14} />
                    Category: {app.category}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 relative z-10">
              {app.status === 'In Progress' || app.status === 'Completed' ? (
                <Link 
                  to={`/chat/${app.id}`}
                  className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                >
                  <MessageSquare size={18} />
                  Open Chat
                </Link>
              ) : (
                <button className="w-full md:w-auto flex items-center justify-center gap-2 py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50 font-bold rounded-2xl transition-all active:scale-95 text-sm uppercase tracking-widest">
                  View Details
                </button>
              )}
              <div className="hidden md:block pl-2">
                 <ChevronRight size={24} className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Decorative background circle */}
            <div className={`absolute -right-8 -bottom-8 w-24 h-24  rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700 ${
               app.status === 'In Progress' ? 'bg-amber-500' :
               app.status === 'Completed' ? 'bg-emerald-500' :
               'bg-indigo-500'
            }`}></div>
          </div>
        ))}
      </div>

      {/* Stats summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 text-center">
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Open</p>
          <p className="text-2xl font-black text-white">01</p>
        </div>
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 text-center">
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Hired</p>
          <p className="text-2xl font-black text-amber-500">01</p>
        </div>
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 text-center">
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Done</p>
          <p className="text-2xl font-black text-emerald-500">01</p>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
