import React from 'react';
import { Search, Filter, Star, MapPin, TrendingUp } from 'lucide-react';

const BrowseServicesDashboard = () => {
  const services = [
    {
      id: 1,
      title: 'Full House Deep Cleaning',
      provider: 'CleanPro Solutions',
      price: 120,
      rating: 4.9,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=400',
      category: 'Cleaning',
      description: 'Complete sanitization and deep cleaning of all rooms, including kitchen and bathrooms. We use eco-friendly materials.'
    },
    {
      id: 2,
      title: 'Emergency Plumbing Repair',
      provider: 'John The Plumber',
      price: 85,
      rating: 4.8,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=400',
      category: 'Maintenance',
      description: '24/7 emergency service for leaks, pipe bursts, and drain cleaning. Arriving within 30 minutes in the metro area.'
    },
    {
      id: 3,
      title: 'Professional Home Tutor',
      provider: 'Academic Excellence',
      price: 45,
      rating: 5.0,
      reviews: 54,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400',
      category: 'Education',
      description: 'Expert tutoring for high school students in Mathematics, Physics, and English. Personalized learning plans.'
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Browse Services</h1>
          <p className="text-slate-500 font-medium tracking-tight">Hire top-rated professionals for your home or business needs.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl flex items-center px-6 py-3 w-full md:w-80 focus-within:ring-2 ring-indigo-50 transition-all shadow-sm">
            <Search size={18} className="text-indigo-600 mr-3" />
            <input type="text" placeholder="Search services..." className="bg-transparent border-none outline-none text-sm font-bold w-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service) => (
          <div key={service.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
             <div className="h-56 bg-slate-100 relative overflow-hidden">
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-slate-100 z-10 shadow-sm">
                  {service.category}
                </div>
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black">{service.rating}</span>
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">({service.reviews} Reviews)</span>
                  </div>
                </div>
             </div>
             <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{service.title}</h4>
                </div>
                <p className="text-xs font-bold text-indigo-600 opacity-60 uppercase tracking-widest mb-4">Provided by {service.provider}</p>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Price</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">${service.price}</span>
                  </div>
                  <button 
                    onClick={() => alert(`Contacting ${service.provider}...`)}
                    className="px-6 py-3.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all text-xs uppercase tracking-widest shadow-xl shadow-slate-100"
                  >
                    Contact Provider
                  </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
         <div className="relative z-10 max-w-xl">
           <div className="flex items-center gap-2 mb-4">
             <TrendingUp size={20} className="text-indigo-200" />
             <span className="text-xs font-black uppercase tracking-widest text-indigo-200">Featured Provider</span>
           </div>
           <h2 className="text-4xl font-black mb-4">Premium Cleaning Services</h2>
           <p className="text-indigo-100 text-lg mb-8 font-medium">Book a top-rated professional for your next deep cleaning project and get 20% off your first hiring.</p>
           <button className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform">
             Check availability
           </button>
         </div>
         <div className="absolute right-[-10%] top-[-20%] w-[50%] h-[150%] bg-white/5 skew-x-[-20deg]"></div>
      </div>
    </div>
  );
};

export default BrowseServicesDashboard;
