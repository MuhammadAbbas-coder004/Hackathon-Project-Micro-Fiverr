import React, { useState, useEffect } from 'react';
import { 
  MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList, 
  MdGridView, MdViewList, MdLayers, MdTrendingUp 
} from 'react-icons/md';
import { Sparkles, Star, Eye, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const MyServices = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        const myId = user?._id || user?.id;
        const myServices = response.data.filter(s => {
          const pid = s.providerId?._id || s.providerId;
          return pid && pid.toString() === myId.toString();
        });
        setServices(myServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id || user?.id) fetchServices();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 sm:space-y-12 pb-24 overflow-hidden relative select-none">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <MdLayers size={22} />
             </div>
             <span className="text-[10px] sm:text-[12px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-none">Nexus Inventory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
            My <span className="text-indigo-500">Gigs</span>
          </h1>
          <p className="text-[13px] sm:text-[14px] font-bold text-slate-500 max-w-md">Oversee your digital nodes and monitor real-time performance.</p>
        </div>
        
        <Link to="/dashboard/provider/services/create" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto h-16 sm:h-20 px-10 bg-indigo-600 text-white font-black text-[13px] sm:text-[14px] uppercase tracking-[0.3em] rounded-full flex items-center justify-center gap-4 hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 border border-white/10">
            <MdAdd size={24} /> Create New Gig
          </button>
        </Link>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-[#0c0f16]/40 backdrop-blur-3xl p-4 sm:p-6 rounded-[32px] sm:rounded-[40px] border border-white/10 shadow-2xl ring-1 ring-white/5">
        <div className="relative w-full xl:w-[450px] group">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" placeholder="Scan inventory..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold text-[14px] outline-none focus:border-indigo-500/50 ring-1 ring-white/5 placeholder:text-slate-600"
          />
        </div>
        
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6">
          <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 ring-1 ring-white/5">
            <button onClick={() => setViewMode('grid')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-white'}`}><MdGridView size={20} /></button>
            <button onClick={() => setViewMode('list')} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-white'}`}><MdViewList size={20} /></button>
          </div>
          <button className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all ring-1 ring-white/5">
            <MdFilterList size={20} /> Advanced Filter
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={viewMode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12" : "space-y-6 sm:space-y-8"}
        >
          {filteredServices.length > 0 ? filteredServices.map((service, idx) => (
            viewMode === 'grid' ? (
              <motion.div 
                key={service._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[44px] overflow-hidden flex flex-col shadow-2xl border border-white/10 hover:bg-[#0c0f16]/80 transition-all duration-500 ring-1 ring-white/5 group relative"
              >
                <div className="h-56 sm:h-72 overflow-hidden relative">
                  <img src={service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f16] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6 py-2 px-4 bg-black/60 backdrop-blur-xl rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 ring-1 ring-white/5">{service.category}</div>
                </div>
                
                <div className="p-8 sm:p-10 flex flex-col space-y-8 relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-black text-white line-clamp-2 leading-tight tracking-tighter uppercase group-hover:text-indigo-400 transition-colors">{service.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Views</span>
                      <div className="flex items-center gap-1.5 text-white font-black"><Eye size={12} className="text-indigo-500" />{service.views || 0}</div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Rating</span>
                      <div className="flex items-center gap-1.5 text-white font-black"><Star size={12} className="text-indigo-500 fill-indigo-500" />{service.providerId?.rating || 5.0}</div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Reviews</span>
                      <div className="flex items-center gap-1.5 text-white font-black"><MessageSquare size={12} className="text-indigo-500" />{service.providerId?.reviewCount || 0}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] mb-1">Base Rate</span>
                      <span className="text-3xl font-black text-white tracking-tighter">Rs.{service.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-3">
                      <Link to={`/dashboard/provider/services/edit/${service._id}`}>
                        <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center ring-1 ring-white/5"><MdEdit size={22} /></button>
                      </Link>
                      <button onClick={() => handleDelete(service._id)} className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"><MdDelete size={22} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={service._id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-[#0c0f16]/60 backdrop-blur-3xl p-6 sm:p-10 rounded-[44px] border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center gap-8 sm:gap-12 ring-1 ring-white/5 hover:bg-[#0c0f16]/80 transition-all group"
              >
                <div className="w-full sm:w-40 h-56 sm:h-40 rounded-[32px] overflow-hidden shrink-0 border border-white/10">
                  <img src={service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-grow min-w-0 text-center sm:text-left w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                    <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest border border-indigo-500/20 px-4 py-1.5 rounded-full bg-indigo-500/10">{service.category}</span>
                    <div className="flex items-center gap-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 ring-1 ring-white/5">
                      <div className="flex items-center gap-1.5"><Eye size={12} className="text-slate-500" /><span className="text-[11px] font-black text-white">{service.views || 0}</span></div>
                      <div className="flex items-center gap-1.5"><Star size={12} className="text-indigo-400 fill-indigo-400" /><span className="text-[11px] font-black text-white">{service.providerId?.rating || 5.0}</span></div>
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white truncate tracking-tight uppercase group-hover:text-indigo-400 transition-colors leading-none mb-4">{service.title}</h3>
                  <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Contract Value:</span>
                    <span className="text-indigo-400 font-black text-3xl tracking-tighter">Rs.{service.price?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <Link to={`/dashboard/provider/services/edit/${service._id}`} className="flex-1 sm:flex-none">
                    <button className="w-full sm:w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-600 transition-all ring-1 ring-white/5 shadow-xl"><MdEdit size={26} /></button>
                  </Link>
                  <button onClick={() => handleDelete(service._id)} className="flex-1 sm:flex-none w-full sm:w-20 h-20 rounded-[28px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-600 hover:text-white transition-all shadow-xl"><MdDelete size={26} /></button>
                </div>
              </motion.div>
            )
          )) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/5 rounded-[60px] border-2 border-dashed border-white/5">
              <MdLayers className="text-slate-800 mb-6" size={80} />
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Inventory Empty</h3>
              <p className="text-slate-600 font-bold text-sm uppercase tracking-widest">No digital gigs deployed to the network yet.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyServices;
