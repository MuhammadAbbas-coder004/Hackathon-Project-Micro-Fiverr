import React from 'react';
import { Search, MapPin, DollarSign, Filter, Briefcase } from 'lucide-react';

const BrowseJobs = ({ jobs = [] }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Jobs</h1>
          <p className="text-slate-500">Find the perfect project for your next gig.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl flex items-center px-4 py-2 w-full md:w-64">
            <Search size={18} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search tasks..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🔍</div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
             <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                  💼
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
                      <MapPin size={14} /> {job.location || 'Remote'}
                    </span>
                    <span className="flex items-center gap-1.5 font-black text-emerald-600">
                      <DollarSign size={14} /> ${job.budget}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-6 py-3 border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all text-sm">
                  View Detail
                </button>
                <button className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-slate-900 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 text-sm">
                  Message Provider
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
