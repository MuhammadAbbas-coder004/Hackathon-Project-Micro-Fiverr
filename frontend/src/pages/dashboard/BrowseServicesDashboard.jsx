import React from 'react';
import { Search, Filter, Star, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="space-y-12">
      
      {/* Header (Liquid) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-8 py-6 bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] ring-1 ring-white/5 shadow-2xl flex items-center gap-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
             <Search size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-1">
               <Sparkles size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Service Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Browse <span className="text-indigo-500">Services</span></h1>
          </div>
        </motion.div>

        <div className="bg-white/5 border border-white/10 rounded-full flex items-center px-6 py-3.5 w-full md:w-80 ring-1 ring-white/5 focus-within:border-indigo-500/40 transition-all">
          <Search size={18} className="text-slate-500 mr-3" />
          <input type="text" placeholder="Scan service nodes..." className="bg-transparent border-none outline-none text-sm font-bold text-white uppercase tracking-wider w-full placeholder:text-slate-600" />
        </div>
      </div>

      {/* Service Cards Grid (Liquid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, i) => (
          <motion.div 
            key={service.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="group bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl hover:bg-[#0c0f16]/80 transition-all duration-500 overflow-hidden flex flex-col ring-1 ring-white/5"
          >
             <div className="h-56 relative overflow-hidden">
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-5 py-2 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] border border-white/10 z-10 ring-1 ring-white/5">
                  {service.category}
                </div>
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="fill-indigo-400 text-indigo-400" />
                    <span className="text-sm font-black">{service.rating}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({service.reviews} Signals)</span>
                  </div>
                </div>
             </div>
             <div className="p-10 flex-grow flex flex-col">
                <h4 className="text-xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors uppercase tracking-tight mb-3">{service.title}</h4>
                <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-[0.3em] mb-5">Node: {service.provider}</p>
                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] leading-none mb-2">Rate</span>
                    <span className="text-3xl font-black text-white tracking-tighter">${service.price}</span>
                  </div>
                  <button 
                    onClick={() => alert(`Contacting ${service.provider}...`)}
                    className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/20"
                  >
                    Initialize
                  </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Featured CTA (Liquid) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-600 rounded-[48px] p-14 text-white relative overflow-hidden shadow-2xl group"
      >
         <div className="relative z-10 max-w-xl">
           <div className="flex items-center gap-3 mb-6">
             <TrendingUp size={20} className="text-indigo-200" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200">Featured Protocol</span>
           </div>
           <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter leading-none">Premium Service <br/>Nodes</h2>
           <p className="text-indigo-100/60 text-sm mb-10 font-bold uppercase tracking-widest leading-relaxed">Deploy a premium operator for your next project and receive 20% reduced allocation on first synchronization.</p>
           <button className="px-10 py-5 bg-white text-indigo-600 font-black rounded-full shadow-2xl hover:bg-[#0c0f16] hover:text-white transition-all text-[11px] uppercase tracking-[0.3em]">
             Scan Available
           </button>
         </div>
         <div className="absolute right-[-10%] top-[-20%] w-[50%] h-[150%] bg-white/5 skew-x-[-20deg] group-hover:bg-white/10 transition-colors duration-700"></div>
      </motion.div>
    </div>
  );
};

export default BrowseServicesDashboard;
