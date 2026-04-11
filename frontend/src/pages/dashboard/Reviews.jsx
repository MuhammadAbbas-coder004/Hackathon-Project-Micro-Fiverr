import React from 'react';
import { Star, ThumbsUp, MessageCircle, Calendar } from 'lucide-react';

const Reviews = () => {
  const mockReviews = [
    { id: 1, provider: 'John Doe', rating: 5, comment: 'Excellent work on the plumbing leak. Very professional and fast.', date: 'Oct 24, 2024' },
    { id: 2, provider: 'Sarah Smith', rating: 4, comment: 'Great job with the wiring, but arrived a bit late.', date: 'Sep 12, 2024' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Reviews & Feedback</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage the ratings and reviews you've provided to professionals.</p>
        </div>
        <div className="flex border border-slate-100 rounded-[1.5rem] p-1 bg-white shadow-sm overflow-hidden text-[10px] font-black uppercase tracking-widest">
           <button className="px-6 py-3 bg-slate-900 text-white rounded-xl shadow-lg">Given</button>
           <button className="px-6 py-3 text-slate-400 hover:text-slate-900">Pending</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mockReviews.map((rev) => (
          <div key={rev.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group">
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl font-bold text-indigo-600 transition-transform group-hover:rotate-6">
                      {rev.provider.charAt(0)}
                   </div>
                   <div>
                      <h4 className="font-black text-slate-900 leading-none mb-1">{rev.provider}</h4>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < rev.rating ? 'currentColor' : 'none'} className={i < rev.rating ? 'text-amber-400' : 'text-slate-200'} />
                        ))}
                      </div>
                   </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rev.date}</span>
             </div>
             
             <p className="text-slate-600 font-medium leading-relaxed italic mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-50 group-hover:bg-indigo-50/10 group-hover:border-indigo-50 transition-all">
                "{rev.comment}"
             </p>

             <div className="flex items-center gap-4 pt-6">
                <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-black text-[10px] uppercase tracking-widest transition-all">
                  Edit Review
                </button>
             </div>
          </div>
        ))}

        <div className="col-span-full mt-10 p-12 bg-white rounded-[3rem] border border-dashed border-indigo-200 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-4xl mb-6">✍️</div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">Leave a New Review</h3>
           <p className="text-slate-500 font-medium max-w-sm mb-10">Only jobs marked as "Completed" in your history can be reviewed.</p>
           <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all hover:scale-105 uppercase text-xs tracking-widest">
             See Completed Jobs
           </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
