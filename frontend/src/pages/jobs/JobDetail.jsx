import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
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
  Briefcase,
  ChevronRight
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
        if (user && res.data.applicants?.includes(user._id)) {
          setHasApplied(true);
        }
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const isOwner = user?._id === (job?.postedBy?._id || job?.postedBy?.id);
  const isFreelancer = user?.role === 'freelancer';

  const handleApply = async () => {
    if (!isAuthenticated) return navigate('/login');
    setSubmitting(true);
    try {
      await api.post(`/jobs/${id}/apply`);
      setHasApplied(true);
      alert('Application sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e14]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0e14] p-6 text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Job Not Found</h2>
      <p className="text-slate-500 mb-8 uppercase text-[10px] font-black tracking-widest">The job you're looking for doesn't exist or has been removed.</p>
      <Link to="/" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl">Back to Home</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 font-['Outfit'] space-y-10 animate-in fade-in duration-700">
      {/* 🚀 HEADER & NAVIGATION */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white mb-1 leading-none tracking-tight uppercase">Project Details</h1>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">Review the full scope of this local service project.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 📝 MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0c0f16]/60 backdrop-blur-3xl p-8 md:p-12 border border-white/10 rounded-[3rem] shadow-sm relative overflow-hidden group">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-5 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                {job.category || 'GENERAL'}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <Clock size={14} />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-4xl font-black text-white mb-8 leading-tight tracking-tight uppercase">
              {job.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Budget (PKR)</p>
                <div className="flex items-center gap-2 text-indigo-500">
                   <DollarSign size={20} />
                   <span className="text-2xl font-black">Rs. {job.budget}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Location</p>
                <div className="flex items-center gap-2 text-white">
                   <MapPin size={20} className="text-indigo-400" />
                   <span className="text-xl font-black truncate">{job.location}</span>
                </div>
              </div>
              <div className="space-y-1 hidden sm:block">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Applicants</p>
                <div className="flex items-center gap-2 text-white">
                   <Briefcase size={20} className="text-indigo-400" />
                   <span className="text-xl font-black">{job.applicants?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Project Description
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line font-medium italic bg-white/5 p-8 rounded-3xl border border-white/5">
                {job.description}
              </p>
            </div>
            
            {/* Action for Freelancer */}
            {isFreelancer && (
              <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-emerald-500 font-black flex items-center gap-2 uppercase tracking-tight">
                    <Zap size={16} className="fill-current" />
                    Accepting Applications
                  </p>
                </div>
                {!hasApplied ? (
                  <button
                    onClick={handleApply}
                    disabled={submitting}
                    className="px-12 py-5 bg-indigo-600 hover:bg-white hover:text-black text-white font-black text-xl rounded-2xl transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 uppercase tracking-widest"
                  >
                    {submitting ? 'Applying...' : 'Apply Now'}
                  </button>
                ) : (
                  <div className="px-12 py-5 bg-emerald-500/10 text-emerald-500 font-black text-xl rounded-2xl border-2 border-emerald-500/20 flex items-center gap-3 uppercase tracking-widest">
                     <ShieldCheck size={24} />
                     Applied ✓
                  </div>
                )}
              </div>
            )}

            {/* Action for Client Owner */}
            {isOwner && (
               <div className="mt-12 pt-10 border-t border-white/5">
                 <Link 
                   to={`/dashboard/client/my-jobs/${job._id}/applicants`}
                   className="w-full flex items-center justify-center gap-3 py-6 bg-white hover:bg-indigo-600 text-black hover:text-white font-black text-xl rounded-2xl transition-all shadow-2xl active:scale-95 uppercase tracking-widest"
                 >
                   Manage Applications
                   <ChevronRight size={24} />
                 </Link>
               </div>
            )}
          </div>
        </div>

        {/* 👤 CLIENT INFO SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-[#0c0f16]/60 backdrop-blur-3xl p-8 border border-white/10 rounded-[3rem] shadow-sm sticky top-8">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/5">
              Project Owner
            </h3>
            
            <div className="flex flex-col items-center text-center gap-4 mb-8">
              <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-inner">
                {job.postedBy?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{job.postedBy?.name || 'Vetted Client'}</h4>
                <div className="flex items-center justify-center gap-2 mt-1 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Verified Protocol Member
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Trust Score</p>
                <p className="text-white font-black text-xl">⭐ 5.0</p>
              </div>
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                <p className="text-emerald-500 font-black text-sm uppercase tracking-widest">ACTIVE</p>
              </div>
            </div>

            <Link 
              to="/chat"
              state={{ 
                introProvider: job.postedBy,
                introMessage: `Hi! I'm interested in your job: "${job.title}"`
              }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:border-indigo-600 hover:bg-white hover:text-black text-white font-black rounded-2xl transition-all active:scale-95 group uppercase tracking-widest text-[11px]"
            >
              <MessageSquare size={18} className="text-indigo-600" />
              Contact Client
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
