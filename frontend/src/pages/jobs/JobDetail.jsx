import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Calendar, 
  User, 
  MessageSquare,
  ShieldCheck,
  Send,
  Zap,
  Clock,
  Briefcase
} from 'lucide-react';
import axios from 'axios';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [hasApplied, setHasApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock data for a single job
  const job = {
    id: id || '1',
    title: 'Professional Home Plumbing Repair',
    category: 'Plumbing',
    budget: '5,000',
    location: 'Gulshan, Karachi',
    postedDate: '2 hours ago',
    status: 'open',
    description: `We are looking for a professional plumber to fix several leaking pipes in our kitchen. 
                  The leak seems to be coming from the main supply line under the sink. 
                  We have already turned off the main water valve. 
                  
                  Requirements:
                  - Experience with copper and PEX piping.
                  - Must bring own tools.
                  - Available to start immediately or within 24 hours.
                  - Good references for similar small household repairs.`,
    postedBy: {
      id: 'c123',
      name: 'Jane Cooper',
      rating: 4.8,
      memberSince: 'Jan 2024'
    },
    applicantsCount: 5,
  };

  const isOwner = user?._id === job.postedBy.id;
  const isFreelancer = user?.role === 'freelancer';

  const handleApply = async () => {
    if (!isAuthenticated) return navigate('/login');
    setSubmitting(true);
    try {
      // TODO: connect API
      // await axios.post(`/api/jobs/${id}/apply`);
      setHasApplied(true);
      alert('Application sent successfully!');
    } catch (err) {
      alert('Failed to apply.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 font-['Outfit'] space-y-10 animate-in fade-in duration-700">
      {/* 🚀 HEADER & NAVIGATION */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 leading-none tracking-tight">Project Details</h1>
            <p className="text-slate-500 font-medium text-sm">Review the full scope of this local service project.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 📝 MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-12 border border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden group">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-5 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-100">
                {job.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Clock size={14} />
                Posted {job.postedDate}
              </span>
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              {job.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Budget (PKR)</p>
                <div className="flex items-center gap-2 text-indigo-600">
                   <DollarSign size={20} />
                   <span className="text-2xl font-black">Rs. {job.budget}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Location</p>
                <div className="flex items-center gap-2 text-slate-800">
                   <MapPin size={20} className="text-indigo-400" />
                   <span className="text-xl font-black">{job.location}</span>
                </div>
              </div>
              <div className="space-y-1 hidden sm:block">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Applicants</p>
                <div className="flex items-center gap-2 text-slate-800">
                   <Briefcase size={20} className="text-indigo-400" />
                   <span className="text-xl font-black">{job.applicantsCount}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Project Description
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium italic bg-slate-50/50 p-8 rounded-3xl border border-slate-100/50">
                {job.description}
              </p>
            </div>
            
            {/* Action for Freelancer */}
            {isFreelancer && (
              <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-emerald-600 font-black flex items-center gap-2">
                    <Zap size={16} className="fill-current" />
                    Accepting Applications
                  </p>
                </div>
                {!hasApplied ? (
                  <button
                    onClick={handleApply}
                    disabled={submitting}
                    className="px-12 py-5 bg-indigo-600 hover:bg-black text-white font-black text-xl rounded-2xl transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                  >
                    {submitting ? 'Applying...' : 'Apply Now'}
                  </button>
                ) : (
                  <div className="px-12 py-5 bg-emerald-50 text-emerald-600 font-black text-xl rounded-2xl border-2 border-emerald-100 flex items-center gap-3">
                     <ShieldCheck size={24} />
                     Applied ✓
                  </div>
                )}
              </div>
            )}

            {/* Action for Client Owner */}
            {isOwner && (
               <div className="mt-12 pt-10 border-t border-slate-100">
                 <Link 
                   to={`/dashboard/client/my-jobs/${job.id}/applicants`}
                   className="w-full flex items-center justify-center gap-3 py-6 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xl rounded-2xl transition-all shadow-2xl active:scale-95"
                 >
                   Manage Applications
                   <ChevronRightIcon size={24} />
                 </Link>
               </div>
            )}
          </div>
        </div>

        {/* 👤 CLIENT INFO SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-white p-8 border border-slate-100 rounded-[3rem] shadow-sm sticky top-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-50">
              Project Owner
            </h3>
            
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div className="w-24 h-24 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600 text-3xl font-black shadow-inner">
                {job.postedBy.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900">{job.postedBy.name}</h4>
                <div className="flex items-center justify-center gap-2 mt-1 text-slate-400 font-bold text-sm">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Verified Client
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Rating</p>
                <p className="text-slate-900 font-black text-xl">⭐ {job.postedBy.rating}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Joined</p>
                <p className="text-slate-900 font-black text-sm uppercase">{job.postedBy.memberSince}</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-slate-100 hover:border-indigo-600 hover:bg-slate-50 text-slate-900 font-black rounded-2xl transition-all active:scale-95 group">
              <MessageSquare size={18} className="text-indigo-600" />
              Contact Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRightIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);

export default JobDetail;
