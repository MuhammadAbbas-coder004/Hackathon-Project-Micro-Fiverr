import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  // Use mock data if no job prop provided (for demo/UI building)
  const data = job || {
    _id: '1',
    title: 'Expert AC Technician Needed for Full Service',
    description: 'Looking for a certified professional to service three AC units in my apartment. Must bring own tools and have at least 3 years of experience.',
    budget: '5000',
    location: 'Gulshan-e-Iqbal, Karachi',
    category: 'Maintenance',
    postedDate: '2 hours ago',
    isVerified: true
  };

  return (
    <div className="group bg-white border border-slate-200 hover:border-indigo-600 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 flex flex-col h-full hover:-translate-y-2">
      {/* Card Header: Category & Date */}
      <div className="flex items-center justify-between mb-6">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] uppercase font-black tracking-widest rounded-full border border-indigo-100">
          {data.category}
        </span>
        <span className="text-xs font-bold text-slate-400">
          {data.postedDate}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex-grow">
        <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
          {data.title}
        </h3>
        <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
          {data.description}
        </p>
      </div>

      {/* Meta Info: Budget & Location */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <span className="text-sm font-bold text-slate-700">{data.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">RS {data.budget}</span>
        </div>
      </div>

      {/* Footer Button */}
      <Link 
        to={`/jobs/${data._id}`}
        className="w-full py-4 bg-slate-900 border border-slate-900 group-hover:bg-indigo-600 group-hover:border-indigo-600 text-white rounded-2xl text-center font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-slate-100 hover:shadow-indigo-200"
      >
        View Details
      </Link>
    </div>
  );
};

export default JobCard;
