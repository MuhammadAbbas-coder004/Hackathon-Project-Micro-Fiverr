import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Navigation, MapPin, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const ActiveHires = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/bookings/user/active', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching hires:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 lg:px-12 py-32 min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-8 sm:mb-12">
        <div className="shrink-0">
           <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-1 sm:mb-2 font-['Outfit'] tracking-tight">Active Hires</h1>
           <p className="hidden sm:block text-slate-500 font-medium font-['Outfit'] uppercase text-[10px] tracking-widest">Track your current professional services</p>
        </div>
        <Link to="/" className="shrink-0 px-4 sm:px-6 py-2 sm:py-3 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-xs sm:text-sm shadow-sm hover:border-indigo-600 transition-all text-center">
          Browse<span className="hidden sm:inline"> More Services</span>
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="p-20 border-4 border-dashed border-slate-100 bg-white rounded-[3rem] text-center">
            <div className="text-5xl mb-6 opacity-20 text-indigo-600">🏗️</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No active projects</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Once you hire a professional for a gig, your active tracking will appear here.</p>
            <Link to="/" className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100">Find a Pro</Link>
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-8 snap-x no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
          {bookings.map((booking) => (
            <div key={booking._id} className="w-[300px] sm:w-[400px] shrink-0 snap-start bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col">
               <div className="flex items-start justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-indigo-50 p-0.5 overflow-hidden border-2 border-white shadow-lg shrink-0">
                       <img src={booking.providerId?.avatar || "https://ui-avatars.com/api/?name=" + booking.providerId?.name} className="w-full h-full object-cover rounded-[0.8rem] sm:rounded-[0.9rem]" />
                    </div>
                    <div>
                       <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-none mb-1 sm:mb-2 line-clamp-1">{booking.providerId?.name}</h3>
                       <p className="text-xs sm:text-sm font-black text-indigo-600 uppercase tracking-widest line-clamp-1">{booking.serviceId?.title}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">
                     Active Hire
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 py-4 sm:py-6 border-y border-slate-50 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                        <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                     </div>
                     <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Booked On</p>
                        <p className="text-xs sm:text-sm font-bold text-slate-700">{new Date(booking.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                        <MapPin size={16} className="sm:w-[18px] sm:h-[18px]" />
                     </div>
                     <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location</p>
                        <p className="text-xs sm:text-sm font-bold text-slate-700 truncate max-w-[100px] sm:max-w-[120px]">{booking.providerId?.location || 'Nearby'}</p>
                     </div>
                  </div>
               </div>

               <div className="flex gap-2 sm:gap-4 mt-auto">
                  <Link 
                    to={`/track/${booking._id}`}
                    className="flex-1 py-3 sm:py-5 bg-slate-900 hover:bg-black text-white rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-lg active:scale-95 text-xs sm:text-base"
                  >
                    <Navigation size={16} className="sm:w-5 sm:h-5 text-indigo-400" />
                    Track<span className="hidden sm:inline">ing</span>
                  </Link>
                  <Link 
                    to={`/chat`}
                    className="px-4 sm:px-6 py-3 sm:py-5 bg-white border-2 border-slate-100 hover:border-indigo-600 rounded-xl sm:rounded-2xl text-slate-900 font-black transition-all active:scale-95 text-xs sm:text-base"
                  >
                    Chat
                  </Link>
                  <Link 
                    to={`/review/${booking.providerId?._id || booking.providerId}`}
                    className="flex-1 py-3 sm:py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-lg shadow-amber-100 active:scale-95 text-xs sm:text-base"
                  >
                    Rate
                  </Link>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveHires;
