import React from 'react';
import { MessageSquare, Phone, User, CheckCircle } from 'lucide-react';

const ActiveJobs = ({ activeJobs = [] }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Active Work</h1>
        <p className="text-slate-500">Currently ongoing projects and tasks.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {activeJobs.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-20 text-center border border-slate-100">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🏗️</div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No active jobs</h3>
             <p className="text-slate-500">When you're hired, your active projects will appear here.</p>
          </div>
        ) : (
          activeJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h4>
                  <p className="text-sm text-slate-500">Client: {job.postedBy?.name}</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase border border-blue-100">In Progress</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Deal Price</p>
                   <p className="text-lg font-bold text-slate-900">${job.budget}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Next Milestone</p>
                   <p className="text-lg font-bold text-slate-900">Delivery</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                   <button className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                      <MessageSquare size={18} />
                   </button>
                   <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-200 transition-all shadow-sm">
                      <User size={18} />
                   </button>
                </div>
                <button className="flex-grow py-3 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Submit Work
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;
