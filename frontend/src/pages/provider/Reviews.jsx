import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Calendar, Zap, ShieldCheck, Sparkles, Activity, Loader2 } from 'lucide-react';
import { api } from '../../utils/api';

const StarRating = ({ value = 0, size = 18 }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size} className={i <= value ? 'fill-indigo-400 text-indigo-400' : 'text-white/10'} />
    ))}
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        const userId = user._id || user.id;
        const response = await api.get('/reviews/' + userId);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 pb-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header (Liquid Glass) */}
      <header className="pt-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare size={22} />
          </div>
          <span className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-none">Client Feedback</span>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase"
            >
              Reputation<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600/40">& Reviews</span>
            </motion.h1>
            <p className="text-[14px] font-bold text-slate-500 max-w-lg mt-6">
              Your performance registry based on verified client collaborations and service deliveries.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 px-8 py-6 bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl ring-1 ring-white/5"
          >
            <div className="relative">
               <Star className="w-10 h-10 fill-indigo-400 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
            </div>
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Global Status</span>
               <span className="text-3xl font-black text-white tracking-tighter leading-none">{averageRating} Average</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Review Registry (Liquid Glass) */}
      <div className="grid gap-8">
        {reviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-32 text-center border-2 border-dashed border-white/5 rounded-[64px] bg-[#0c0f16]/40 backdrop-blur-3xl flex flex-col items-center justify-center relative overflow-hidden group ring-1 ring-white/5"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <MessageSquare className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-3xl font-black text-white/20 tracking-tighter uppercase">No Reviews Yet</h3>
            <p className="text-[14px] font-bold text-slate-600 mt-3 max-w-sm mx-auto">Feedback will appear here once your collaborations are completed successfully.</p>
          </motion.div>
        ) : (
          reviews.map((review, idx) => (
            <motion.div 
              key={review._id} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 transition-all duration-500 group relative overflow-hidden shadow-2xl hover:bg-[#0c0f16]/80 ring-1 ring-white/5"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              
              <div className="flex flex-col gap-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:rotate-6 transition-transform">
                      {review.reviewer?.name?.charAt(0) || review.userName?.charAt(0) || 'U'}
                    </div>
                    <div className="space-y-2">
                       <p className="font-black text-white text-3xl tracking-tighter leading-none uppercase">
                        {review.reviewer?.name || review.userName || 'Verified Client'}
                      </p>
                      <div className="flex items-center gap-4">
                         <div className="flex bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 ring-1 ring-white/5">
                            <StarRating value={review.rating} size={18} />
                         </div>
                         <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                         <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Verified Collaboration</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-2xl border border-white/10 ring-1 ring-white/5">
                    <Calendar className="w-4 h-4 opacity-40" />
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </div>
                </div>

                <div className="relative py-4">
                  <p className="text-white/60 text-2xl font-bold leading-relaxed px-2">
                    "{review.comment}"
                  </p>
                </div>

                {review.serviceTitle && (
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                     <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center"><Zap size={16} /></div>
                        <span>Module: {review.serviceTitle}</span>
                     </div>
                     <div className="hidden sm:flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Authenticated Registry</span>
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
