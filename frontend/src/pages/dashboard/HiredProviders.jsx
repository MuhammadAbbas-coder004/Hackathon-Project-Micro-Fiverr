import React from 'react';
import { Mail, MessageSquare, Star, Clock, UserCheck } from 'lucide-react';

const HiredProviders = () => {
  const providers = [
    {
      id: 1,
      name: 'John Doe',
      service: 'Home Plumbing',
      rating: 4.9,
      completedJobs: 124,
      lastActive: '10 mins ago',
      status: 'In Progress'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      service: 'Electrician Pro',
      rating: 4.8,
      completedJobs: 89,
      lastActive: '2 hours ago',
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Hired Professionals</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage and communicate with the experts working on your projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {providers.map((p) => (
          <div key={p.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl font-black text-indigo-600 shadow-inner group-hover:rotate-3 transition-transform">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">{p.name}</h3>
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                    <Star size={14} className="fill-indigo-600" /> {p.rating} • {p.completedJobs} Jobs Done
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Service Provided</span>
                  <span className="text-lg font-black text-slate-700">{p.service}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Last Active</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-50">
                    <Clock size={14} className="text-indigo-400" /> {p.lastActive}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-8 border-t border-slate-50">
              <button 
                onClick={() => alert(`Opening chat with ${p.name}...`)}
                className="flex-grow py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all text-sm shadow-md"
              >
                Chat Now
              </button>
              {p.status !== 'Completed' && (
                <button 
                  onClick={() => alert(`Marking job with ${p.name} as complete...`)}
                  className="flex-grow py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-sm border border-emerald-100"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
           <div className="text-5xl mb-4">👤</div>
           <h3 className="text-xl font-bold text-slate-900">No hired providers yet.</h3>
           <p className="text-slate-500">Post a job to find and hire the best professionals.</p>
        </div>
      )}
    </div>
  );
};

export default HiredProviders;
