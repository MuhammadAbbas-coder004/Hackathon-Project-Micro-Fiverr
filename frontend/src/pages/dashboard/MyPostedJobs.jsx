import React from 'react';
import { Plus, Edit2, Trash2, Users, Clock, AlertCircle } from 'lucide-react';

const MyPostedJobs = ({ jobs = [] }) => {
  const displayJobs = jobs;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">My Posted Jobs</h1>
          <p className="text-slate-500 font-medium">Manage your active job listings and review applications.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all hover:-translate-y-0.5 text-sm uppercase tracking-widest">
          <Plus size={20} /> Post a New Job
        </button>
      </div>

      <div className="space-y-6">
        {displayJobs.map((job) => (
          <div key={job._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-4xl group-hover:bg-indigo-50 transition-colors shadow-inner">
                💼
              </div>
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">{job.title}</h4>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                    job.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><Clock size={14} className="text-indigo-400" /> {job.time}</div>
                   <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"><Users size={14} className="text-indigo-400" /> {job.applicants} Applicants</div>
                   <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg underline">Budget: ${job.budget}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 relative z-10">
               <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-slate-200">
                  Review Proposals
               </button>
               <div className="flex items-center gap-2">
                 <button className="p-3.5 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm">
                    <Edit2 size={18} />
                 </button>
                 <button className="p-3.5 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                    <Trash2 size={18} />
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {displayJobs.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <AlertCircle size={32} className="text-slate-200" />
           </div>
           <h3 className="text-xl font-bold text-slate-900">No jobs posted yet.</h3>
           <p className="text-slate-500 mb-6">Create your first job post to start finding amazing professionals.</p>
        </div>
      )}
    </div>
  );
};

export default MyPostedJobs;
