import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdMoreVert, 
  MdEdit, 
  MdDelete, 
  MdOpenInNew,
  MdSearch,
  MdFilterList,
  MdGridView,
  MdViewList,
  MdStar,
  MdLayers,
  MdTrendingUp
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
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
        const myServices = response.data.filter(s => s.providerId === user._id);
        setServices(myServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchServices();
  }, [user]);

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 overflow-hidden">
      {/* Abstract Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[11px] font-black text-[#f97316] uppercase tracking-[0.4em] leading-none italic">Asset_Management</span>
             <MdTrendingUp className="text-[#f97316]" size={16} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Matrix<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Inventory</span>
          </h1>
          <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.2em] mt-4">Oversee and update your active service matrix nodes.</p>
        </div>
        
        <Link to="/dashboard/provider/services/create">
          <button className="h-16 px-10 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-[28px] flex items-center gap-3 hover:bg-[#f97316] hover:text-white transition-all shadow-2xl active:scale-95">
            <MdAdd size={22} /> Deploy_New_Node
          </button>
        </Link>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
        <div className="relative w-full xl:w-[450px] group">
          <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#f97316] transition-colors" size={22} />
          <input 
            type="text" 
            placeholder="FILTER_MATRIX..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111113] ring-1 ring-white/5 rounded-[28px] py-5 px-14 text-white placeholder:text-white/10 outline-none focus:ring-[#f97316]/30 transition-all font-black text-[11px] uppercase tracking-widest"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#111113] p-2 rounded-[24px] ring-1 ring-white/5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-[#f97316] text-white shadow-lg' : 'text-white/20 hover:text-white'}`}
            >
              <MdGridView size={22} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-[#f97316] text-white shadow-lg' : 'text-white/20 hover:text-white'}`}
            >
              <MdViewList size={22} />
            </button>
          </div>
          <button className="h-16 px-8 bg-white/5 ring-1 ring-white/5 rounded-[28px] flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
            <MdFilterList size={20} /> Advanced_Nodes
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredServices.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="h-[40vh] rounded-[56px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-6"
          >
            <MdLayers className="w-20 h-20 text-white/5 animate-pulse" />
            <div>
              <h3 className="text-2xl font-black text-white/20 uppercase tracking-tighter">Inventory Empty</h3>
              <p className="text-[11px] font-black text-white/10 uppercase tracking-[0.4em] mt-2">Awaiting node deployment</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "space-y-6"}
          >
            {filteredServices.map((service, idx) => (
              viewMode === 'grid' ? (
                <motion.div 
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-[#111113] rounded-[48px] overflow-hidden flex flex-col transition-all duration-500 shadow-2xl ring-1 ring-white/5 hover:ring-[#f97316]/20"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 py-2 px-4 bg-black/60 backdrop-blur-md rounded-2xl text-white text-[10px] font-black border border-white/10 uppercase tracking-widest">
                      {service.category}
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow space-y-8">
                    <h3 className="text-2xl font-black text-white group-hover:text-[#f97316] transition-colors line-clamp-2 leading-none uppercase tracking-tighter">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-auto border-t border-white/5 pt-8">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-2">Price_Point</span>
                        <span className="text-2xl font-black text-[#f97316] tracking-tighter">${service.price}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-2">Node_Rep</span>
                        <div className="flex items-center gap-2">
                          <MdStar className="text-[#f97316]" size={18} />
                          <span className="font-black text-lg text-white">4.8</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Link to={`/dashboard/provider/services/edit/${service._id}`} className="flex-1">
                        <button className="w-full h-14 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 font-black text-[10px] uppercase tracking-widest transition-all ring-1 ring-white/10 flex items-center justify-center gap-2">
                          <MdEdit size={18} /> Mod_Node
                        </button>
                      </Link>
                      <button className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all ring-1 ring-white/10">
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div key={service._id} className="bg-[#111113] p-6 rounded-[32px] ring-1 ring-white/5 hover:ring-[#f97316]/20 transition-all group">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 ring-1 ring-white/10">
                      <img src={service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[9px] text-[#f97316] font-black uppercase tracking-widest border border-[#f97316]/20 px-2 py-1 rounded-lg bg-[#f97316]/10">{service.category}</span>
                      </div>
                      <h3 className="text-xl font-black text-white truncate uppercase tracking-tighter">{service.title}</h3>
                      <div className="flex items-center gap-6 mt-2">
                        <span className="text-[#f97316] font-black text-xl tracking-tighter">${service.price}</span>
                        <div className="flex items-center gap-2">
                          <MdStar className="text-[#f97316]" size={16} />
                          <span className="font-black text-sm text-white/60">4.8 (24_logs)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <Link to={`/dashboard/provider/services/edit/${service._id}`}>
                        <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all ring-1 ring-white/5">
                          <MdEdit size={20} />
                        </button>
                      </Link>
                      <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all ring-1 ring-white/5">
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyServices;

