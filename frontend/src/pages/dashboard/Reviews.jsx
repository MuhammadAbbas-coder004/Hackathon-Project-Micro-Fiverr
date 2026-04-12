import React from 'react';
import { Star, Pencil, MessageSquare, Star as StarIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

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
  'bg-orange-500/10 text-orange-500',
  'bg-emerald-500/10 text-emerald-500',
  'bg-orange-500/10 text-orange-500',
  'bg-sky-500/10 text-sky-500',
  'bg-pink-500/10 text-pink-500',
];

const getAvatarColor = (name = '') =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];

const StarRating = ({ rating, max = 5 }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#f97316' : 'none'}
        stroke={i < rating ? '#f97316' : '#27272a'}
        strokeWidth={2}
      />
    ))}
  </div>
);

const Reviews = () => {
  const avgRating =
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-1 min-h-[calc(100vh-160px)]">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-widest uppercase">
            Reviews & <span className="text-orange-500">Feedback</span>
          </h1>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
            Manage ratings and reviews you've dispatched to experts.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex border border-white/5 rounded-2xl p-1.5 bg-zinc-900/50 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest w-fit shadow-2xl">
          <button className="px-6 py-3 bg-orange-500 text-black rounded-xl shadow-[0_10px_30px_rgba(249,115,22,0.3)]">
            Given
          </button>
          <button className="px-6 py-3 text-zinc-600 hover:text-white transition-colors">
            Pending
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total signals', value: mockReviews.length, sub: 'Lifetime data' },
          { label: 'Global rating', value: avgRating.toFixed(1), sub: 'Out of 5.0' },
          { label: 'Awaiting', value: 0, sub: 'Pending response' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-zinc-900/40 border border-white/5 rounded-[2rem] px-8 py-8 relative overflow-hidden group hover:border-orange-500/20 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/10 transition-all" />
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">{s.label}</p>
            <p className="text-5xl font-black text-white tracking-tight leading-none group-hover:text-orange-500 transition-colors">
              {s.value}
            </p>
            <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-4 flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-orange-500/40" />
               {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-black/40 border border-white/5 rounded-[3rem] p-10 hover:border-orange-500/30 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Card header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-5">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0 transition-transform group-hover:rotate-6",
                    getAvatarColor(rev.provider)
                  )}
                >
                  {rev.provider.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-black text-white uppercase tracking-tight mb-2">
                    {rev.provider}
                  </p>
                  <StarRating rating={rev.rating} />
                </div>
              </div>
              <span className="text-[9px] font-black text-zinc-600 bg-zinc-900/50 border border-white/5 px-4 py-2 rounded-full uppercase tracking-widest">
                {rev.date}
              </span>
            </div>

            {/* Comment */}
            <p className="text-sm font-medium text-zinc-400 leading-relaxed bg-zinc-900/30 border-l-4 border-orange-500 rounded-r-[2rem] px-8 py-6 mb-8 relative z-10 italic group-hover:bg-zinc-900/50 transition-colors">
              "{rev.comment}"
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 relative z-10">
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border border-white/5 hover:bg-orange-500 hover:text-black hover:border-orange-500 rounded-xl px-6 py-3 transition-all active:scale-95">
                <Pencil size={14} strokeWidth={3} />
                Modify Record
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Leave new review CTA */}
      <div className="border-2 border-dashed border-white/5 rounded-[3.5rem] p-16 text-center bg-zinc-900/20 backdrop-blur-sm relative overflow-hidden group hover:border-orange-500/20 transition-all">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 duration-500">
          <Pencil size={32} strokeWidth={3} className="text-orange-500" />
        </div>
        <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">
          Dispatch New <span className="text-orange-500">Signal</span>
        </h3>
        <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">
          Only tasks marked as "CONCLUDED" in technical history can be evaluated.
        </p>
        <button className="px-12 py-5 bg-orange-500 hover:bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-orange-500/20 active:scale-95">
          Review Concluded Tasks
        </button>
      </div>
    </div>
  );
};

export default Reviews;