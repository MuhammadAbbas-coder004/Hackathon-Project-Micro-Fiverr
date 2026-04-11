import React, { useState } from 'react';
import JobCard from '../components/JobCard';

const JobListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock Jobs for UI Demonstration
  const mockJobs = [
    {
      _id: '1',
      title: 'Emergency AC Gas Recharge',
      description: 'My AC is not cooling. Need a professional for gas leak check and recharge. Home visit in Gulshan Area.',
      budget: '3500',
      location: 'Gulshan, Karachi',
      category: 'Maintenance',
      postedDate: '10 mins ago'
    },
    {
      _id: '2',
      title: 'Home Math Tutor (Class 9-10)',
      description: 'Looking for an experienced female tutor for O-Levels Mathematics. 3 days a week, 2 hours per session.',
      budget: '15000',
      location: 'DHA Phase 6, Lahore',
      category: 'Tutoring',
      postedDate: '1 hour ago'
    },
    {
      _id: '3',
      title: 'Full House Deep Cleaning',
      description: 'Need a team for deep cleaning of a 3-bedroom apartment including kitchen and windows. All tools provided.',
      budget: '8000',
      location: 'F-10, Islamabad',
      category: 'Cleaning',
      postedDate: '3 hours ago'
    },
    {
      _id: '4',
      title: 'Electrician for Ceiling Fan Repair',
      description: 'Two ceiling fans need bearing replacement and regulator check. Urgent repair required before morning.',
      budget: '1200',
      location: 'Nazimabad, Karachi',
      category: 'Electrical',
      postedDate: '5 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 animate-reveal">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
              Explore Available <br />
              <span className="text-indigo-600 uppercase italic">Local Jobs</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
              Find micro-jobs in your neighborhood and start earning today.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search by title, skill..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 focus:border-indigo-600 rounded-2xl outline-none shadow-sm transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white hover:bg-indigo-600 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-slate-200 shrink-0">
               Filter
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-4 pb-12 overflow-x-auto no-scrollbar animate-reveal [animation-delay:0.1s]">
          {['All Jobs', 'Maintenance', 'Tutoring', 'Cleaning', 'Electrical', 'Plumbing'].map((cat, i) => (
            <button 
              key={i} 
              className={`px-8 py-3 rounded-full text-sm font-black tracking-tight whitespace-nowrap transition-all border-2 ${
                i === 0 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-reveal [animation-delay:0.2s]">
          {mockJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
          {/* Duplicate for demo if few jobs */}
          <JobCard job={{...mockJobs[0], _id: '5', title: 'Need Kitchen Plumber'}} />
          <JobCard job={{...mockJobs[1], _id: '6', title: 'Physics Tutor Home'}} />
        </div>

        {/* Load More Button */}
        <div className="mt-24 text-center animate-reveal [animation-delay:0.3s]">
          <button className="px-12 py-5 bg-white border-2 border-slate-200 text-slate-900 hover:border-indigo-600 hover:text-indigo-600 rounded-3xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-slate-100">
             Load More Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
