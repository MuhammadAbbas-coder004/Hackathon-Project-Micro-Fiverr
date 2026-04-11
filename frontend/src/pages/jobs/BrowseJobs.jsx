import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Filter, 
  Briefcase, 
  DollarSign, 
  ChevronRight,
  Clock,
  Zap
} from 'lucide-react';

const BrowseJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    location: '',
    minBudget: '',
    maxBudget: ''
  });

  const categories = ['All', 'Plumbing', 'Electrical', 'Tutoring', 'Cleaning', 'Painting', 'Other'];

  const jobs = [
    { id: '1', title: 'Home Kitchen Plumbing Repair', budget: '5,000', location: 'Karachi', category: 'Plumbing', time: '2 hours ago', status: 'Open' },
    { id: '2', title: 'Grade 10 Math Tutor Required', budget: '12,000', location: 'Lahore', category: 'Tutoring', time: '5 hours ago', status: 'Open' },
    { id: '3', title: 'Full House Deep Cleaning', budget: '15,000', location: 'Islamabad', category: 'Cleaning', time: '1 day ago', status: 'Open' },
    { id: '4', title: 'Electrician for AC Installation', budget: '4,500', location: 'Karachi', category: 'Electrical', time: '3 hours ago', status: 'Open' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 font-['Outfit'] space-y-12 animate-in fade-in duration-700">
      {/* 🚀 HEADER */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Browse Projects</h1>
        <p className="text-slate-500 font-medium tracking-tight">Find the best local jobs in your city and start earning.</p>
      </div>

      {/* 🔍 SEARCH & FILTERS */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col lg:flex-row gap-6 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Key Search</label>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-800"
            />
          </div>
        </div>

        <div className="w-full lg:w-48 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Category</label>
          <select 
            className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-400 transition-all font-medium text-slate-800 appearance-none cursor-pointer"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="w-full lg:w-48 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="e.g. Karachi"
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-400 transition-all font-medium text-slate-800"
            />
          </div>
        </div>

        <button className="w-full lg:w-auto px-10 py-4 bg-indigo-600 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* 💼 JOBS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div 
            key={job.id}
            className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="px-5 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  {job.category}
                </span>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 bg-emerald-50 text-emerald-600`}>
                  {job.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <Clock size={12} />
                  Posted {job.time}
                </div>
              </div>

              <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-3xl group-hover:bg-indigo-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-indigo-600" />
                    <span className="text-xl font-black text-slate-900">Rs. {job.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <MapPin size={16} className="text-slate-400" />
                    {job.location}
                  </div>
                </div>
              </div>
            </div>

            <Link 
              to={`/jobs/${job.id}`}
              className="mt-8 w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl text-center transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 group-hover:shadow-indigo-200"
            >
              View Details
              <ChevronRight size={18} />
            </Link>
          </div>
        ))}
      </div>

      {/* NO JOBS PLACEHOLDER */}
      {jobs.length === 0 && (
        <div className="py-32 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
          <Briefcase size={80} className="text-slate-200 mx-auto mb-6" />
          <h3 className="text-3xl font-black text-slate-800 mb-2">No jobs found</h3>
          <p className="text-slate-500 font-medium">Try adjusting your filters or search keywords.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;
