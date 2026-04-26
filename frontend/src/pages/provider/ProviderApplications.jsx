import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Clock, MapPin, DollarSign, Send, 
  Search, Filter, Activity, Sparkles, User, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const ProviderApplications = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetching available jobs from the market
        const res = await api.get('/jobs').catch(() => ({ data: [
            { _id: '1', title: 'Fix Leaking Pipes in Kitchen', budget: 1500, location: 'Karachi', category: 'Plumbing', createdAt: new Date() },
            { _id: '2', title: 'Math Tutor for High School', budget: 5000, location: 'Lahore', category: 'Tutoring', createdAt: new Date() },
            { _id: '3', title: 'Full House Deep Cleaning', budget: 12000, location: 'Islamabad', category: 'Cleaning', createdAt: new Date() }
        ]}));
        setJobs(res.data || []);
      } catch (err) {
        console.error('Fetch jobs failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'All' || job.category === filter;
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-10 pb-24 select-none relative">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Sparkles size={20} />
            </div>
            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Job Opportunities</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight uppercase">
            Project <span className="text-indigo-500">Board</span>
          </motion.h1>
          <p className="text-[14px] font-bold text-slate-500">Find new projects and enroll to start earning.</p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-2 bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-2xl flex items-center gap-6 ring-1 ring-white/5">
           <div className="px-8 py-4 text-center">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Available Jobs</p>
              <p className="text-3xl font-black text-white leading-none">{jobs.length}</p>
           </div>
        </motion.div>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0c0f16]/40 backdrop-blur-3xl p-4 rounded-[28px] border border-white/10 shadow-2xl ring-1 ring-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {['All', 'Plumbing', 'Tutoring', 'Cleaning'].map((cat) => (
            <button
              key={cat} onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all",
                filter === cat ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white/5 text-slate-500 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects to enroll..."
            className="w-full pl-14 pr-6 h-14 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 text-white font-bold transition-all"
          />
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length > 0 ? filteredJobs.map((job, idx) => (
            <motion.div
              key={job._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[48px] p-10 border border-white/10 shadow-2xl hover:bg-[#0c0f16]/80 transition-all duration-500 group relative overflow-hidden ring-1 ring-white/5"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[60px] -mr-24 -mt-24 group-hover:bg-indigo-600/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-8">
                <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full uppercase border border-indigo-500/20 tracking-widest">{job.category}</span>
                <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                   <Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-3xl font-black text-white tracking-tight uppercase group-hover:text-indigo-400 transition-colors mb-4 leading-tight">{job.title}</h3>
              
              <div className="flex items-center gap-6 mb-10">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-500 border border-white/5">
                       <DollarSign size={20} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Budget</p>
                       <p className="text-xl font-black text-white tracking-tighter">Rs.{job.budget?.toLocaleString()}</p>
                    </div>
                 </div>
                 <div className="w-[1px] h-10 bg-white/10" />
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/5">
                       <MapPin size={20} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Location</p>
                       <p className="text-xl font-black text-white tracking-tighter">{job.location || 'Remote'}</p>
                    </div>
                 </div>
              </div>

              <Link 
                to={`/jobs/${job._id}`}
                className="w-full h-20 bg-white text-black font-black text-[13px] uppercase tracking-[0.3em] rounded-[32px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-4 group/btn shadow-2xl"
              >
                Enroll Now <ChevronRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/5 rounded-[60px] opacity-40">
               <Briefcase size={60} className="mb-4" />
               <p className="font-black uppercase tracking-widest">No projects found</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProviderApplications;
