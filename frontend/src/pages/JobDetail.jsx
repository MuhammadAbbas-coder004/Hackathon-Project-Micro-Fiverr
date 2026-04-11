import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Star, MessageSquare, Send, CheckCircle } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Job Not Found</h2>
        <p className="text-slate-500 mb-8">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-12 uppercase tracking-widest animate-reveal">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link to="/jobs" className="hover:text-indigo-600">Jobs</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-slate-900">Job Detail</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column: Job Info */}
          <div className="lg:col-span-2 space-y-12 animate-reveal [animation-delay:0.1s]">
            {job.image && (
              <div className="w-full h-96 rounded-[3rem] overflow-hidden shadow-2xl border border-white">
                <img src={job.image} alt={job.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black tracking-widest uppercase rounded-full border border-indigo-100 mb-6">
                {job.category || 'General'}
              </span>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tighter">
                {job.title}
              </h1>
              <p className="text-slate-400 font-bold flex items-center gap-2">
                <Clock size={18} className="text-slate-300" />
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Job Description</h3>
              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          </div>

          {/* Right Column: Sidebar Action */}
          <div className="space-y-8 animate-reveal [animation-delay:0.2s]">
            {/* Action Card */}
            <div className="bg-white border-4 border-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-5 -translate-y-16 translate-x-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="mb-8">
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Estimated Budget</p>
                <p className="text-5xl font-black text-slate-900 tracking-tighter">${job.budget}</p>
              </div>

              <div className="flex items-start gap-4 mb-10 pb-10 border-b border-slate-100">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                   <MapPin size={24} />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                   <p className="text-lg font-bold text-slate-800 leading-tight">{job.location}</p>
                </div>
              </div>

              <button className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:translate-y-0">
                Apply for this Job
              </button>
              
              <Link 
                to="/chat"
                state={{
                  introProvider: job.postedBy,
                  introMessage: `Hi! I want to discuss your job posting: "${job.title}"`
                }}
                className="block text-center w-full mt-4 py-5 bg-white border-2 border-slate-200 hover:border-indigo-600 text-slate-900 rounded-3xl font-black text-xl transition-all"
              >
                Send Message
              </Link>
            </div>

            {/* Client Info Card */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.2),transparent)]"></div>
               <div className="relative z-10">
                 <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">About the Customer</h4>
                 <div className="flex items-center gap-5 mb-8">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl font-black overflow-hidden border border-white/10">
                     {job.postedBy?.avatar ? (
                       <img src={job.postedBy.avatar} alt={job.postedBy.name} className="w-full h-full object-cover" />
                     ) : (
                       job.postedBy?.name?.charAt(0)
                     )}
                   </div>
                   <div>
                     <p className="text-xl font-black">{job.postedBy?.name}</p>
                     <p className="text-sm font-bold text-slate-400">Trusted Member</p>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                     <p className="text-2xl font-black mb-1">4.9</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rating</p>
                   </div>
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                     <p className="text-2xl font-black mb-1">Verified</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
