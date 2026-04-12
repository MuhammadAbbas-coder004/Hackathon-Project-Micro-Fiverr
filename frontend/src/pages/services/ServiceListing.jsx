import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaStar, 
  FaCommentDots, 
  FaLayerGroup,
  FaCompass,
  FaLocationArrow,
  FaInfoCircle,
  FaShoppingCart,
  FaBolt,
  FaFilter,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTag
} from 'react-icons/fa';
import { HiSparkles, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

// Shadcn UI Components
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const ServiceListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    location: '',
  });

  const categories = [
    { name: 'All', icon: <FaLayerGroup size={12} /> },
    { name: 'Plumbing', icon: <FaBolt size={12} /> },
    { name: 'Electrical', icon: <FaBolt size={12} /> },
    { name: 'Tutoring', icon: <FaInfoCircle size={12} /> },
    { name: 'Cleaning', icon: <FaCheckCircle size={12} /> },
    { name: 'Painting', icon: <FaTag size={12} /> },
    { name: 'Technical', icon: <FaLocationArrow size={12} /> },
    { name: 'Home Service', icon: <FaCompass size={12} /> }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('/api/services');
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'All' || service.category === filters.category;
    const matchesLocation =
      filters.location === '' || service.location?.toLowerCase().includes(filters.location.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-orange-500 selection:text-black relative overflow-hidden">
      
      {/* Decorative Assets */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* ══ STICKY HUD FILTER BAR ══ */}
      <div className="sticky top-[80px] z-40 w-full pt-4 group/hud">
        <div className="max-w-7xl mx-auto px-6 relative">
          {/* HUD Glow Effect */}
          <div className="absolute -inset-1 bg-orange-500/10 blur-2xl rounded-[40px] opacity-0 group-focus-within/hud:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative bg-zinc-900/60 backdrop-blur-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] rounded-[32px] p-2">
            <div className="flex flex-col lg:flex-row gap-2 items-center">
              
              {/* Search */}
              <div className="relative w-full lg:flex-1 group">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/50 group-focus-within:text-orange-500 transition-colors w-4 h-4" />
                <Input
                  placeholder="Search elite professionals..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-14 h-12 bg-transparent border-none focus-visible:ring-0 text-md font-bold placeholder:text-zinc-700 w-full"
                />
              </div>

              {/* Location */}
              <div className="relative w-full lg:w-64 group">
                <FaMapMarkerAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500/50 group-focus-within:text-orange-500 transition-colors w-4 h-4" />
                <Input
                  placeholder="Location..."
                  value={filters.location}
                  onChange={e => setFilters({...filters, location: e.target.value})}
                  className="pl-14 h-12 bg-transparent border-none focus-visible:ring-0 text-md font-bold placeholder:text-zinc-700 w-full"
                />
              </div>

              {/* Action Button */}
              <Button className="w-full lg:w-auto h-12 rounded-2xl bg-orange-500 hover:bg-white text-black px-8 gap-3 font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-orange-500/10">
                Update List
              </Button>
            </div>

            {/* Category HUD */}
            <div className="flex items-center gap-1.5 overflow-x-auto mt-2 px-2 pb-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setFilters({...filters, category: cat.name})}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap",
                    filters.category === cat.name 
                      ? "bg-orange-500 text-black shadow-lg shadow-orange-500/15" 
                      : "bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN MARKETPLACE AREA ══ */}
      <div className="max-w-7xl mx-auto px-6 pb-32 pt-24">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-20 gap-10">
          <div className="space-y-6 w-full lg:w-auto">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
               <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] opacity-40">Global Hub</h4>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[0.9] uppercase">
              Elite <br className="hidden sm:block" /> <span className="text-orange-500">Directory</span>
            </h2>
          </div>
          
          <div className="flex flex-col items-start lg:items-end gap-5 w-full lg:w-auto text-left lg:text-right">
             <div className="bg-zinc-900/50 px-6 py-4 rounded-3xl flex items-center gap-4 w-fit relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-50" />
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping relative z-10" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] relative z-10">
                  {filteredServices.length} Experts Active
                </span>
             </div>
             <p className="max-w-xs text-[10px] font-bold text-zinc-700 uppercase tracking-widest leading-relaxed">
               Professionals vetted for high-impact execution and precision results.
             </p>
          </div>
        </div>

        {/* ══ SERVICE GRID ══ */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-zinc-900/40 rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/20 rounded-[48px]">
            <FaSearch className="w-12 h-12 text-zinc-800 mb-6" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">No Experts Found</h3>
            <p className="text-zinc-600 font-bold mt-2 uppercase tracking-widest text-xs">Refine your logistical parameters</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Performance Glow Backlight */}
                <div className="absolute -inset-1 bg-orange-500/0 group-hover:bg-orange-500/5 blur-3xl rounded-[40px] transition-all duration-700 pointer-events-none" />
                
                <Card className="relative h-full border border-white/5 bg-zinc-900/40 backdrop-blur-2xl rounded-[32px] overflow-hidden transition-all duration-500 hover:border-orange-500/20 flex flex-col">
                  
                  {/* Premium Image HUD */}
                  <CardHeader className="p-0 relative h-44 overflow-hidden">
                    <img
                      src={service.image || `https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600`}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      alt={service.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    
                    {/* Floating HUD Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       <Badge className="bg-black/80 backdrop-blur-md text-orange-500 border border-white/5 px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-2xl">
                          {service.category}
                       </Badge>
                       <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 w-fit">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                          <span className="text-[8px] font-black text-white uppercase tracking-widest">Active Now</span>
                       </div>
                    </div>

                    <Link to="/chat" className="absolute top-4 right-4 w-10 h-10 bg-orange-500 rounded-2xl text-black shadow-2xl transition-all flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500 hover:bg-white text-sm">
                      <FaCommentDots size={16} />
                    </Link>
                  </CardHeader>

                  <CardContent className="p-6 flex-grow space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="flex -space-x-1">
                            {[1,2,3,4,5].map(s => (
                               <FaStar key={s} size={7} className="text-orange-500 fill-orange-500" />
                            ))}
                         </div>
                         <span className="text-[9px] font-black text-white uppercase tracking-tighter">{service.rating || '5.0'} Service</span>
                      </div>
                    </div>

                    <h3 className="font-black text-white text-lg leading-[1.1] tracking-tight group-hover:text-orange-500 transition-colors line-clamp-2 uppercase">
                      {service.title.toLowerCase().startsWith('i will') ? service.title : `I will ${service.title}`}
                    </h3>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                      <div className="w-9 h-9 rounded-xl bg-black border border-white/5 flex items-center justify-center font-black text-orange-500 shadow-inner group-hover:border-orange-500/20 transition-colors text-xs">
                        {service.providerId?.name?.charAt(0) || 'P'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest leading-none mb-1">Elite Partner</p>
                        <p className="text-xs font-black text-white truncate tracking-tight uppercase group-hover:text-orange-500 transition-colors">{service.providerId?.name || 'Verified Pro'}</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-1 leading-none">Investment At</p>
                        <p className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Rs.{service.price?.toLocaleString()}</p>
                      </div>
                      <Button asChild className="h-11 px-6 rounded-xl bg-white hover:bg-orange-500 text-black font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl transition-all border-0 hover:-translate-y-1">
                        <Link to={`/checkout/${service._id}`}>
                          Hire Pro
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>

                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ══ PAGINATION HUD ══ */}
        <div className="mt-32 text-center">
            <Button asChild variant="ghost" className="h-16 px-12 rounded-full text-zinc-800 hover:text-orange-500 font-black tracking-[0.2em] text-[10px] uppercase group transition-all">
              <Link to="/services" className="flex items-center gap-4">
                Browse Full Catalog
                <FaExternalLinkAlt size={12} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </Link>
            </Button>
          </div>
      </div>
    </div>
  );
};

export default ServiceListing;