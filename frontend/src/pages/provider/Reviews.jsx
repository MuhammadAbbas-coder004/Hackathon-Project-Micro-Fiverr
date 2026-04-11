import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquare, Calendar, Loader2, Star } from 'lucide-react';
import api from '@/utils/api';
import StarRating from '@/components/ui/StarRating';

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
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Client Reviews</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Feedback from your previous collaborations</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 w-fit">
          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          <span className="text-lg font-black">{averageRating} Average Rating</span>
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-2 border-slate-100 rounded-[2.5rem] bg-white">
            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-slate-200" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No reviews yet</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">Reviews from your clients will appear here once you complete projects.</p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review._id} className="border-slate-100 rounded-[2rem] bg-white shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg font-black border border-indigo-100">
                        {review.reviewer?.name?.charAt(0) || review.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg leading-tight mb-1">
                          {review.reviewer?.name || review.userName || 'Verified Client'}
                        </p>
                        <StarRating value={review.rating} readonly size={16} />
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-indigo-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  {review.serviceTitle && (
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-500 mt-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                       <span>Service: {review.serviceTitle}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
