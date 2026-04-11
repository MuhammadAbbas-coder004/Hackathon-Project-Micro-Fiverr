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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-black text-slate-900 mb-2 font-['Outfit'] tracking-tight">Active Hires</h1>
           <p className="text-slate-500 font-medium font-['Outfit'] uppercase text-[10px] tracking-widest">Track your current professional services</p>
        </div>
        <Link to="/" className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold text-sm shadow-sm hover:border-indigo-600 transition-all">
          Browse More Services
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 p-0.5 overflow-hidden border-2 border-white shadow-lg">
                       <img src={booking.providerId?.avatar || "https://ui-avatars.com/api/?name=" + booking.providerId?.name} className="w-full h-full object-cover rounded-[0.9rem]" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 leading-none mb-2">{booking.providerId?.name}</h3>
                       <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">{booking.serviceId?.title}</p>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">
                     Active Hire
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <Calendar size={18} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Booked On</p>
                        <p className="text-sm font-bold text-slate-700">{new Date(booking.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <MapPin size={18} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Provider Location</p>
                        <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{booking.providerId?.location || 'Nearby'}</p>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <Link 
                    to={`/track/${booking._id}`}
                    className="flex-grow py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                  >
                    <Navigation size={20} className="text-indigo-400" />
                    Live Tracking
                  </Link>
                  <Link 
                    to={`/chat`}
                    className="px-6 py-5 bg-white border-2 border-slate-100 hover:border-indigo-600 rounded-2xl text-slate-900 font-black transition-all active:scale-95"
                  >
                    Chat
                  </Link>
                  <Link 
                    to={`/review/${booking.providerId?._id || booking.providerId}`}
                    className="flex-grow py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-100 active:scale-95"
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
