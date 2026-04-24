import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { 
  FaSearch, 
  FaStar, 
  FaCommentDots, 
  FaLayerGroup,
  FaCompass,
  FaBolt,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { ArrowRight, Zap, Navigation, Star, MapPin } from 'lucide-react';

// Shadcn UI Components
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const ServiceCard = ({ service, navigate, idx }) => {
  const [userRating, setUserRating] = useState(0); // Initialized as blank for user input

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.6 }}
      className="group relative h-full"
    >
      {/* Backlight Glow */}
      <div className="absolute -inset-2 bg-indigo-500/0 group-hover:bg-indigo-500/10 blur-[60px] rounded-[60px] transition-all duration-700 pointer-events-none opacity-0 group-hover:opacity-100" />
      
      <Card className="relative h-full border border-white/10 bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] overflow-hidden transition-all duration-700 hover:border-indigo-500/40 hover:-translate-y-2 flex flex-col ring-1 ring-white/5 shadow-none">
        
        <CardHeader className="p-3 relative h-56 overflow-hidden shrink-0">
          <div className="w-full h-full rounded-[24px] overflow-hidden border border-white/10 relative">
            <img
              src={service.image || `https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800`}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              alt={service.title}
            />
          </div>
          
          <div className="absolute top-8 left-8 flex flex-col gap-2">
             <Badge className="bg-indigo-600 text-white border-0 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-none ring-1 ring-white/20">
                {service.category}
             </Badge>
             <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-3 py-1 rounded-full border border-white/10 w-fit ring-1 ring-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Active Link</span>
             </div>
          </div>

          <div className="absolute top-8 right-8 flex flex-col gap-3">
            <Link to={`/chat?u=${service.providerId?._id || service.providerId}`} className="w-10 h-10 bg-white text-black transition-all flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500 hover:bg-indigo-600 hover:text-white rounded-xl shadow-none">
              <FaCommentDots size={18} />
            </Link>
            <button 
              onClick={() => navigate('/radar')}
              className="w-10 h-10 bg-indigo-600 text-white transition-all flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-700 hover:bg-white hover:text-indigo-600 rounded-xl shadow-none delay-75"
              title="Live Radar"
            >
              <Navigation size={18} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-8 pb-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                 <FaStar 
                   key={star} 
                   size={14} 
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     setUserRating(star);
                   }}
                   className={cn(
                     "cursor-pointer transition-all hover:scale-150 active:scale-90",
                     star <= userRating ? "text-indigo-500 fill-indigo-500" : "text-white/10 hover:text-indigo-400"
                   )} 
                 />
              ))}
              <span className="text-[9px] font-black text-slate-500 ml-1 uppercase tracking-widest leading-none">Sync</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
               <Star size={10} className="fill-indigo-500 text-indigo-500" />
               <span className="text-[10px] font-black text-slate-200">{userRating}.0</span>
            </div>
          </div>

          <h3 className="text-xl font-black text-white leading-tight tracking-tight uppercase line-clamp-2 h-14 group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>

          <div className="flex items-center gap-4 pt-6 mt-auto border-t border-white/5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 border border-white/20 flex items-center justify-center font-black text-white text-lg shadow-none">
              {service.providerId?.name?.charAt(0) || 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-black text-white truncate uppercase tracking-tight leading-none mb-1">{service.providerId?.name || 'Vetted Expert'}</p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={10} className="text-indigo-500" /> {service.location}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Base Price</p>
            <p className="text-2xl font-black text-white tracking-tighter leading-none">Rs.{service.price?.toLocaleString()}</p>
          </div>
          <Link to={`/checkout/${service._id}`} className="h-12 px-6 rounded-2xl bg-white hover:bg-indigo-600 text-black hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-2.5 shadow-none group/btn active:scale-95 border border-transparent hover:border-white/20">
            Access <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ServiceListing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    location: '',
  });

  const categories = [
    { name: 'All', icon: <FaLayerGroup size={12} /> },
    { name: 'Technical', icon: <FaBolt size={12} /> },
    { name: 'Home Service', icon: <FaCompass size={12} /> },
    { name: 'Education', icon: <FaInfoCircle size={12} /> },
    { name: 'Design', icon: <HiSparkles size={12} /> }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.providerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filters.category === 'All' || s.category === filters.category;
    const matchLocation = !filters.location || s.location?.toLowerCase().includes(filters.location.toLowerCase());
    return matchSearch && matchCategory && matchLocation;
  });

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans selection:bg-indigo-600 selection:text-white pb-40">
      
      {/* ══ STICKY HUD FILTER BAR ══ */}
      <div className="sticky top-[80px] z-40 w-full pt-6 group/hud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="relative bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] sm:rounded-full p-2 sm:p-3 border border-white/10 ring-1 ring-white/5 max-w-5xl mx-auto shadow-none">
            <div className="flex flex-col md:flex-row items-center w-full gap-4 px-4">
              
              {/* Search */}
              <div className="relative flex-1 group w-full">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/40 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <Input
                  placeholder="IDENTIFY SERVICE..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 sm:h-14 bg-transparent border-none focus-visible:ring-0 focus:outline-none text-[13px] font-bold placeholder:text-slate-700 w-full shadow-none text-white uppercase tracking-wider"
                />
              </div>

              <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

              {/* Location */}
              <div className="relative flex-1 group w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/40 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <Input
                  placeholder="GEO LOCATION..."
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="pl-12 h-12 sm:h-14 bg-transparent border-none focus-visible:ring-0 focus:outline-none text-[13px] font-bold placeholder:text-slate-700 w-full shadow-none text-white uppercase tracking-wider"
                />
              </div>

              <Button className="w-full md:w-auto h-12 sm:h-14 rounded-2xl sm:rounded-full bg-indigo-600 hover:bg-indigo-500 text-white px-10 gap-3 font-black uppercase text-[11px] tracking-[0.2em] shadow-none active:scale-95 transition-all">
                Sync <Zap size={16} className="animate-pulse" />
              </Button>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto mt-4 p-2 bg-black/40 border border-white/5 rounded-2xl sm:rounded-full backdrop-blur-3xl no-scrollbar mx-2 mb-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setFilters({...filters, category: cat.name})}
                  className={cn(
                    "flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 border border-transparent",
                    filters.category === cat.name 
                      ? "bg-indigo-600 text-white" 
                      : "text-slate-500 hover:text-white hover:bg-white/5 hover:border-white/10"
                  )}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-2 h-10 bg-indigo-600 rounded-full" />
               <h4 className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.5em]">Global Talent Cluster</h4>
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
              Pro <br /> <span className="text-indigo-500">Market</span>
            </h2>
          </div>
          <p className="max-w-xs text-[12px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed lg:text-right">
            High-impact professionals vetted for precision results and rapid deployment.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-[48px] animate-pulse" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/[0.02] rounded-[60px] border border-white/5 ring-1 ring-white/5">
             <FaSearch size={32} className="text-slate-800 mb-8" />
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">Zero Nodes Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredServices.map((service, index) => (
              <ServiceCard 
                key={service._id} 
                service={service} 
                navigate={navigate} 
                idx={index} 
              />
            ))}
          </div>
        )}

        <div className="text-center mt-20">
            <Link to="/services" className="inline-flex items-center gap-8 px-20 py-8 rounded-full bg-white/[0.03] border border-white/10 hover:bg-indigo-600 text-slate-500 hover:text-white font-black uppercase tracking-[0.5em] text-[11px] transition-all group">
              Extended Catalogue
              <FaExternalLinkAlt size={16} />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceListing;
