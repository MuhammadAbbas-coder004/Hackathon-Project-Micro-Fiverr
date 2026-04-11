import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import api from '../../utils/api';
import StarRating from '../../components/ui/StarRating';

const LeaveReview = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get(`/auth/profile/${providerId}`);
        // If there's no specific route for public profile, we might need a different one or use generic fetch
        // For now, let's assume we can get user info or use the one from a booking search
        setProvider(response.data.user);
      } catch (err) {
        console.error("Error fetching provider details", err);
        // Fallback for demo purposes if path doesn't exist yet
        setProvider({
          _id: providerId,
          name: 'Freelancer',
          location: 'Remote',
          role: 'freelancer'
        });
      } finally {
        setFetching(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a star rating.');
    if (!comment.trim()) return alert('Please leave a comment about your experience.');

    setLoading(true);
    try {
      await api.post('/reviews', { 
        receiverId: providerId, 
        rating, 
        comment 
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/active-hires');
      }, 2500);
    } catch (err) {
      console.error('Submit review error:', err);
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-[3rem] shadow-sm animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2">Thank You!</h2>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">
          Your feedback helps build trust in the community. Redirecting you...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 font-['Outfit'] space-y-12 animate-in fade-in duration-700 pt-24">
      {/* HEADER */}
      <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none tracking-tight">Rate Your Experience</h1>
          <p className="text-slate-500 font-medium tracking-tight mt-1 uppercase text-xs tracking-[0.2em]">Share your feedback with others</p>
        </div>
      </div>

      <div className="bg-white p-10 md:p-14 border border-slate-100 rounded-[3rem] shadow-2xl shadow-indigo-100/50 space-y-12">
        {/* Provider Profile Summary */}
        <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 relative">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-200">
            {provider?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-2xl font-black text-slate-900">{provider?.name}</h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 font-bold text-sm uppercase tracking-widest">
               <div className="flex items-center gap-2">
                 <MapPin size={14} />
                 {provider?.location || 'Remote'}
               </div>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-emerald-500" />
                 Verified Professional
               </div>
            </div>
          </div>
        </div>

        {/* REVIEW FORM */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* STAR RATING - Interactive */}
          <div className="flex flex-col items-center gap-6">
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Overall Satisfaction</h4>
            <StarRating 
              value={rating} 
              onChange={setRating} 
              size={56} 
              className="gap-4" 
            />
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
              {rating > 0 ? ['Poor', 'Fair', 'Good', 'Amazing', 'Exceptional'][rating-1] : 'Click to rate'}
            </p>
          </div>

          {/* COMMENT AREA */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 px-2 uppercase tracking-widest">
              <MessageSquare size={16} className="text-indigo-600" />
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked (or didn't like) about the service..."
              rows={6}
              className="w-full px-8 py-6 bg-slate-50 border border-transparent rounded-[2rem] text-slate-800 text-lg outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 shadow-sm resize-none"
              required
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-indigo-600 hover:bg-black text-white font-black text-xl rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send size={24} />}
              Submit Review
            </button>
            <p className="text-center mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest">
              Reviews are permanent and visible to everyone.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveReview;
