import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquare, Calendar, Loader2, Star, Activity, ShieldCheck, Zap } from 'lucide-react';
import api from '@/utils/api';
import StarRating from '@/components/ui/StarRating';
import { cn } from '@/utils/cn';

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
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-1 min-h-[calc(100vh-160px)]">
      
      {/* 🚀 Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-widest uppercase leading-none">
            Client <span className="text-orange-500">Feedback</span>
          </h1>
          <div className="flex items-center gap-2 pt-1">
             <Activity size={14} className="text-orange-500 animate-pulse" />
             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Performance Analytics Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="relative">
             <Star className="w-6 h-6 fill-orange-500 text-orange-500 animate-pulse" />
             <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full" />
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Status</span>
             <span className="text-xl font-black text-white tracking-tighter leading-none">{averageRating} Average Rating</span>
          </div>
        </div>
      </div>

      {/* 📁 Review Registry */}
      <div className="grid gap-8">
        {reviews.length === 0 ? (
          <div className="p-32 text-center border-dashed-2 border-2 border-white/5 rounded-[3.5rem] bg-zinc-950/20 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
            <MessageSquare className="w-20 h-20 mx-auto mb-8 text-zinc-800 opacity-20 transition-transform group-hover:scale-110" />
            <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">No signals detected</h3>
            <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest max-w-sm mx-auto">Collaboration feedback will manifest here once technical operations concluding successfully.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div 
              key={review._id} 
              className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-10 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col gap-10 relative z-10">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 text-2xl font-black border border-orange-500/10 shadow-xl group-hover:rotate-6 transition-transform">
                      {review.reviewer?.name?.charAt(0) || review.userName?.charAt(0) || 'U'}
                    </div>
                    <div className="space-y-2">
                       <p className="font-black text-white text-2xl uppercase tracking-tighter leading-none">
                        {review.reviewer?.name || review.userName || 'Verified Client'}
                      </p>
                      <div className="flex items-center gap-3">
                         <StarRating value={review.rating} readonly size={16} />
                         <div className="w-1 h-1 rounded-full bg-zinc-800" />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] leading-none">Verified Collaboration</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] bg-black/40 px-5 py-2.5 rounded-full border border-white/5 transition-all group-hover:bg-black/60">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-0 w-1.5 h-full bg-orange-500/10 rounded-full group-hover:bg-orange-500/40 transition-all duration-700" />
                  <p className="text-zinc-300 text-xl font-medium leading-relaxed italic px-4">
                    "{review.comment}"
                  </p>
                </div>

                {review.serviceTitle && (
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-orange-500/60">
                        <Zap size={14} className="text-orange-500" />
                        <span>Module: {review.serviceTitle}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-zinc-700" />
                        <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">Authenticated Signature</span>
                     </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🚀 Footer Analytics Summary */}
      <div className="flex justify-center pt-10 opacity-20">
         <div className="h-px w-32 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
      </div>
    </div>
  );
};

export default Reviews;
