import React from 'react';
import { Star, Pencil, MessageSquare, Star as StarIcon, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

const mockReviews = [
  {
    id: 1,
    provider: 'John Doe',
    rating: 5,
    comment: 'Excellent work on the plumbing leak. Very professional and fast.',
    date: 'Oct 24, 2024',
  },
  {
    id: 2,
    provider: 'Sarah Smith',
    rating: 4,
    comment: 'Great job with the wiring, but arrived a bit late.',
    date: 'Sep 12, 2024',
  },
];

const avatarColors = [
  'bg-indigo-500/10 text-indigo-400',
  'bg-emerald-500/10 text-emerald-400',
  'bg-indigo-500/10 text-indigo-400',
  'bg-sky-500/10 text-sky-400',
  'bg-pink-500/10 text-pink-400',
];

const getAvatarColor = (name = '') =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const StarRating = ({ rating, max = 5 }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#6366f1' : 'none'}
        stroke={i < rating ? '#6366f1' : '#1e293b'}
        strokeWidth={2.5}
      />
    ))}
  </div>
);

const Reviews = () => {
  const avgRating =
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <div className="space-y-12 min-h-[calc(100vh-160px)] pb-10">

      {/* Page header (Liquid) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-8 py-6 bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] ring-1 ring-white/5 shadow-2xl flex items-center gap-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
             <StarIcon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node Feedback</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Reviews & <span className="text-indigo-500">Signals</span></h1>
          </div>
        </motion.div>

        {/* Tab toggle (Liquid) */}
        <div className="flex border border-white/10 rounded-full p-2 bg-white/5 backdrop-blur-3xl text-[9px] font-black uppercase tracking-[0.2em] w-fit shadow-2xl ring-1 ring-white/5">
          <button className="px-8 py-3.5 bg-indigo-600 text-white rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
            Transmitted
          </button>
          <button className="px-8 py-3.5 text-slate-500 hover:text-white transition-colors">
            Awaiting
          </button>
        </div>
      </div>

      {/* Stats strip (Liquid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: 'Total signals', value: mockReviews.length, sub: 'Log history' },
          { label: 'Global rating', value: avgRating.toFixed(1), sub: 'Max Scale 5.0' },
          { label: 'Awaiting', value: 0, sub: 'Open streams' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 relative overflow-hidden group hover:bg-[#0c0f16]/80 transition-all ring-1 ring-white/5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/10 transition-all" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">{s.label}</p>
            <p className="text-6xl font-black text-white tracking-tighter group-hover:text-indigo-400 transition-colors">
              {s.value}
            </p>
            <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] mt-6 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-indigo-500/20" />
               {s.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Review cards (Liquid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {mockReviews.map((rev, i) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
            className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 hover:bg-[#0c0f16]/80 transition-all duration-500 group relative overflow-hidden ring-1 ring-white/5 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Card header */}
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-6">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 transition-transform group-hover:scale-110",
                    getAvatarColor(rev.provider)
                  )}
                >
                  {rev.provider.charAt(0)}
                </div>
                <div>
                  <p className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    {rev.provider}
                  </p>
                  <StarRating rating={rev.rating} />
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-500 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full uppercase tracking-widest ring-1 ring-white/5">
                {rev.date}
              </span>
            </div>

            {/* Comment */}
            <div className="relative z-10 p-8 bg-white/5 border-l-4 border-indigo-600 rounded-3xl rounded-tl-none mb-10 group-hover:bg-white/[0.08] transition-colors">
               <p className="text-base font-medium text-slate-300 leading-relaxed italic">
                 "{rev.comment}"
               </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 relative z-10">
              <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white border border-white/10 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-2xl px-8 py-4 transition-all active:scale-95">
                <Pencil size={16} />
                Modify Record
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leave new review CTA (Liquid) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-dashed border-white/5 rounded-[60px] p-24 text-center bg-[#0c0f16]/40 backdrop-blur-3xl relative overflow-hidden group hover:bg-[#0c0f16]/60 transition-all ring-1 ring-white/5"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-10 transition-transform group-hover:scale-110 duration-700">
          <Pencil size={40} className="text-indigo-500" />
        </div>
        <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
          Dispatch New <span className="text-indigo-500">Signal</span>
        </h3>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest max-w-sm mx-auto mb-12 leading-relaxed">
          Evaluate finalized operations to synchronize professional metrics.
        </p>
        <button className="px-14 py-6 bg-indigo-600 hover:bg-white text-white hover:text-black text-[12px] font-black uppercase tracking-[0.4em] rounded-full transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
          Review Streams
        </button>
      </motion.div>
    </div>
  );
};

export default Reviews;
