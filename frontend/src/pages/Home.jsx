import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaMapMarker,
  FaLocationArrow,
  FaArrowRight,
  FaShieldAlt,
  FaStar,
  FaGlobe,
  FaBolt,
  FaChartLine,
  FaUsers,
  FaTerminal,
  FaLayerGroup,
  FaBriefcase,
  FaCommentDots,
  FaBox,
  FaRocket,
  FaShieldVirus,
  FaMicrochip,
  FaSync,
  FaEllipsisV,
  FaCube,
  FaCrosshairs,
  FaBullseye,
  FaExpand,
  FaBell,
  FaMapPin
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const cn = (...classes) => classes.filter(Boolean).join(' ');

/* ─── Modern Tabs ─── */
const Tabs = ({ value, onValueChange, children, className }) => (
  <div className={cn('w-full', className)}>
    {React.Children.map(children, (c) => React.isValidElement(c) ? React.cloneElement(c, { activeValue: value, onValueChange }) : c)}
  </div>
);
const TabsList = ({ children, activeValue, onValueChange, className }) => (
  <div className={cn('flex overflow-x-auto items-center gap-1 p-1.5 bg-slate-900/50 border border-white/5 rounded-full backdrop-blur-2xl no-scrollbar w-fit', className)}>
    {React.Children.map(children, (c) => React.isValidElement(c) ? React.cloneElement(c, { activeValue, onValueChange }) : c)}
  </div>
);
const TabsTrigger = ({ value, children, activeValue, onValueChange, className }) => {
  const isActive = activeValue === value;
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "px-6 py-2 rounded-full text-[11px] font-black transition-all duration-500 uppercase tracking-widest shrink-0 whitespace-nowrap",
        isActive 
          ? "bg-indigo-600/90 text-white" 
          : "text-slate-500 hover:text-slate-300 hover:bg-white/5",
        className
      )}
    >
      <span className="flex items-center gap-2 pointer-events-none">{children}</span>
    </button>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const stats = [
    { label: 'Network Experts', value: '12K+', icon: <FaUsers size={16} /> },
    { label: 'Uptime Protocol', value: '99.9%', icon: <FaShieldAlt size={16} /> },
    { label: 'Global Nodes', value: '25+', icon: <FaGlobe size={16} /> },
    { label: 'Trust Index', value: '4.9/5', icon: <FaStar size={16} className="fill-indigo-400 text-indigo-400" /> },
  ];

  const categories = [
    { value: 'all', label: 'Overview', icon: <FaLayerGroup size={12} /> },
    { value: 'Home Service', label: 'Home', icon: <FaBolt size={12} /> },
    { value: 'Technical', label: 'Engineering', icon: <FaMicrochip size={12} /> },
    { value: 'Education', label: 'Academic', icon: <FaShieldAlt size={12} /> },
    { value: 'Design', label: 'Creative', icon: <FaBox size={12} /> },
  ];

  const filteredServices = services.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || s.category === category;
    return matchSearch && matchCategory;
  });

  const scrollToMarketplace = () =>
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 selection:bg-indigo-600 selection:text-white font-sans tracking-tight">
      
      {/* ══════════════════════════════════════════════
          HERO: SOFT DARK DESIGN
      ══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center max-w-6xl mx-auto">
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/10 mb-12 backdrop-blur-xl"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/70">Intelligence Network Online</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[9rem] font-black text-center tracking-tighter leading-[0.85] mb-12 text-slate-50"
            >
              HIRE THE <br />
              <span className="text-indigo-500/90">EXPERT.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="max-w-2xl text-center text-slate-500 text-lg md:text-xl font-medium mb-20 leading-relaxed"
            >
              Access Pakistan's most elite professional marketplace. Direct 
              booking, live logistical tracking, and zero-risk payments.
            </motion.p>

            {/* Pro-Search Tool (Liquid Shape) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="w-full max-w-4xl p-1.5 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-full flex flex-row items-center gap-1 sm:gap-2 ring-1 ring-white/5"
            >
              <div className="flex-1 flex items-center px-4 sm:px-8 w-full min-w-0">
                <FaSearch className="text-indigo-500/60 mr-2 sm:mr-4 shrink-0" size={14} />
                <input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none text-slate-100 text-[11px] sm:text-lg h-10 sm:h-12 w-full placeholder:text-slate-700 font-bold outline-none shadow-none"
                />
              </div>
              <Button
                onClick={scrollToMarketplace}
                className="w-auto h-8 sm:h-12 px-3 sm:px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[9px] sm:text-[11px] uppercase tracking-widest rounded-full transition-all duration-500 group active:scale-95 shrink-0 ml-1 mr-1 sm:mr-0"
              >
                Search <FaArrowRight size={12} className="hidden sm:inline-block ml-3 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-48 w-full max-w-6xl">
              {stats.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="group relative p-8 rounded-[40px] bg-[#0c0f16]/40 backdrop-blur-xl transition-all duration-700 hover:bg-[#0c0f16]/60 border border-white/10 ring-1 ring-white/5 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors" />
                  
                  <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                       {React.isValidElement(s.icon) ? React.cloneElement(s.icon, { size: 24 }) : null}
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="block text-4xl font-black text-slate-50 tracking-tighter group-hover:text-indigo-400 transition-colors">
                        {s.value}
                      </span>
                      <span className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        {s.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARKETPLACE SECTION
      ══════════════════════════════════════════════ */}
      <section id="marketplace" className="py-40 border-y border-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-12 mb-24">
            <div className="max-w-xl text-center">
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-slate-50">
                THE <span className="text-indigo-500/90">COLLECTION</span>
              </h2>
              <p className="text-slate-600 font-black tracking-[0.4em] text-[10px] uppercase">Elite Professional Index</p>
            </div>

            <Tabs value={category} onValueChange={setCategory} className="w-full flex justify-center">
              <TabsList className="mx-auto">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value} className="flex items-center gap-2">
                    {cat.icon}
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {loadingServices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => <div key={i} className="h-[500px] bg-white/[0.02] border border-white/[0.05] rounded-[56px] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredServices.slice(0, 6).map((service, idx) => (
                  <motion.div
                    key={service._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: idx * 0.05 }}
                    className="group"
                  >
                    <Card className="relative border-white/10 bg-[#0c0f16]/40 backdrop-blur-3xl rounded-[32px] overflow-hidden transition-all duration-700 hover:bg-[#0c0f16]/60 hover:border-indigo-500/40 ring-1 ring-white/5 border-2 shadow-none">
                      {/* Animated Glow */}
                      <div className="absolute -top-[20%] -right-[20%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-colors pointer-events-none" />

                      <CardHeader className="p-3 relative h-56 overflow-hidden">
                        <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                           <img
                             src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800'}
                             alt={service.title}
                             className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f16]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                          <Badge className="bg-indigo-600/90 backdrop-blur-xl text-white border-0 font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-widest">
                            {service.category}
                          </Badge>
                          {idx % 2 === 0 && (
                            <div className="bg-emerald-500/90 backdrop-blur-xl text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                               <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                               Live Link
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="p-8 pb-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center font-black text-white bg-indigo-600 rounded-xl shadow-lg border border-white/20">
                              {service.providerId?.name?.charAt(0) || 'P'}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-black text-slate-100 leading-tight">{service.providerId?.name || 'Pro Expert'}</span>
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                <FaMapMarker className="text-indigo-500/80" size={10} /> {service.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                              <FaStar size={10} className="fill-indigo-500 text-indigo-500" />
                              <span className="text-[10px] font-black text-slate-200">
                                {service.providerId?.rating || '0'} 
                                <span className="text-slate-500 ml-1">({service.providerId?.reviewCount || 0})</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 opacity-60">
                              <FaChartLine size={10} className="text-indigo-400" />
                              <span className="text-[10px] font-black text-slate-200">{service.views || 0}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-black leading-tight tracking-tight text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 uppercase h-12">
                          {service.title}
                        </h3>
                      </CardContent>

                      <CardFooter className="p-8 pt-0 flex items-center justify-between">
                        <div>
                          <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Base Protocol</span>
                          <span className="text-2xl font-black text-white tracking-tighter">Rs.{service.price?.toLocaleString()}</span>
                        </div>
                        <Button asChild className="bg-white text-black hover:bg-indigo-600 hover:text-white rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest h-11 transition-all duration-500 active:scale-95 group/btn border border-transparent hover:border-white/20">
                          <Link to={`/checkout/${service._id}`} className="flex items-center gap-2">
                            Initialize <FaArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE TRACKING: DRIBBBLE RADAR
      ══════════════════════════════════════════════ */}
      <section className="py-52 relative overflow-hidden bg-black/20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            
            <div className="space-y-12">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Logistical Intelligence</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight text-white">
                PRECISION <br />
                <span className="text-indigo-500">TRACKING.</span>
              </h2>
              
              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
                Experience tracking as it should be. A high-fidelity, real-time 
                radar interface designed for the elite professional ecosystem.
              </p>
            </div>

            <div className="relative flex justify-center perspective-1000">
              <motion.div 
                initial={{ opacity: 0, rotateY: 15, x: 50 }}
                whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-full max-w-[450px] aspect-[1/1.3] bg-[#0c0f16]/40 backdrop-blur-3xl rounded-[40px] p-1 border border-white/10 ring-1 ring-white/5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative h-full flex flex-col z-10">
                  <div className="p-10 pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/90 flex items-center justify-center text-white">
                        <FaCrosshairs size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white leading-none mb-1">Deep Scan</h3>
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Active Link</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 relative mt-8 flex items-center justify-center">
                    <div className="absolute w-[80%] aspect-square border border-white/[0.03] rounded-full" />
                    <div className="absolute w-[60%] aspect-square border border-white/[0.04] rounded-full" />
                    <div className="absolute w-[40%] aspect-square border border-white/[0.05] rounded-full" />
                    <div className="absolute w-[20%] aspect-square border border-white/[0.08] rounded-full" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute w-[85%] aspect-square z-10 pointer-events-none"
                    >
                      <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full" 
                           style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(79, 70, 229, 0.3) 350deg, transparent 360deg)' }} />
                      <div className="absolute top-[50%] left-[50%] w-1/2 h-[2px] bg-gradient-to-r from-transparent to-indigo-400 origin-left" />
                    </motion.div>
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-[25%] right-[25%] z-20"
                    >
                      <div className="relative">
                         <div className="absolute -inset-4 border border-indigo-500/30 rounded-lg animate-[pulse_2s_infinite]" />
                         <div className="absolute -top-4 -left-4 w-2 h-2 border-t border-l border-indigo-500" />
                         <div className="absolute -top-4 -right-4 w-2 h-2 border-t border-r border-indigo-500" />
                         <div className="absolute -bottom-4 -left-4 w-2 h-2 border-b border-l border-indigo-500" />
                         <div className="absolute -bottom-4 -right-4 w-2 h-2 border-b border-r border-indigo-500" />
                         <div className="w-4 h-4 bg-indigo-500 rounded-full" />
                      </div>
                    </motion.div>
                    <div className="relative z-30 w-20 h-20 flex items-center justify-center">
                       <div className="absolute inset-0 bg-indigo-600 rounded-full blur-2xl opacity-20 animate-pulse" />
                       <div className="relative w-full h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[30px] flex items-center justify-center text-indigo-400">
                          <FaBullseye size={32} />
                       </div>
                    </div>
                  </div>

                  <div className="p-10 pt-0">
                    <Button className="w-full h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 group/scan">
                       <span className="flex items-center gap-3">
                          Initialize Full Scan
                          <FaSync size={16} className="group-hover/scan:rotate-180 transition-transform duration-700" />
                       </span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
