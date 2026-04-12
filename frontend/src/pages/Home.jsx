import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Star,
  Globe,
  Trophy,
  Sparkles,
  Zap,
  Activity,
  Award,
  Users,
  Target,
  Command
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

/* ─── Refined Professional UI Components ─── */
const Tabs = ({ value, onValueChange, children, className }) => (
  <div className={cn('w-full', className)}>
    {React.Children.map(children, (c) => React.cloneElement(c, { activeValue: value, onValueChange }))}
  </div>
);
const TabsList = ({ children, activeValue, onValueChange, className }) => (
  <div className={cn('flex items-center gap-1 p-1 bg-zinc-900/80 rounded-full', className)}>
    {React.Children.map(children, (c) => React.cloneElement(c, { activeValue, onValueChange }))}
  </div>
);
const TabsTrigger = ({ value, children, activeValue, onValueChange, className }) => {
  const isActive = activeValue === value;
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 uppercase tracking-wider",
        isActive 
          ? "bg-orange-500 text-black shadow-lg" 
          : "text-zinc-500 hover:text-zinc-200"
      )}
    >
      {children}
    </button>
  );
};

/* ─── Main Component ────────────────────────────────────────── */
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
        const res = await axios.get('/api/services');
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
    { label: 'Experts', value: '5,000+', icon: <Users size={16} /> },
    { label: 'Reliability', value: '99.9%', icon: <ShieldCheck size={16} /> },
    { label: 'Cities', value: '15+', icon: <Globe size={16} /> },
    { label: 'Rating', value: '4.9/5', icon: <Star size={16} className="fill-orange-500" /> },
  ];

  const categories = [
    { value: 'all', label: 'Overview' },
    { value: 'Home Service', label: 'Home' },
    { value: 'Technical', label: 'Engineering' },
    { value: 'Education', label: 'Academic' },
    { value: 'Design', label: 'Creative' },
  ];

  const filteredServices = services.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || s.category === category;
    return matchSearch && matchCategory;
  });

  const scrollToMarketplace = () =>
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 selection:bg-orange-500 selection:text-black font-sans tracking-tight">
      
      {/* ══════════════════════════════════════════════
          HERO: EDITORIAL TECH DESIGN
      ══════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        {/* Soft Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center max-w-6xl mx-auto">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 mb-10 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Network Status: Online</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-8xl lg:text-[9rem] font-black text-center tracking-tighter leading-[0.85] mb-12 text-white"
            >
              HIRE THE <br />
              <span className="text-orange-500">EXPERT.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl text-center text-zinc-500 text-lg md:text-xl font-medium mb-16 leading-relaxed"
            >
              Access Pakistan's most elite professional marketplace. Direct 
              booking, live logistical tracking, and zero-risk payments.
            </motion.p>

            {/* Pro-Search Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-3xl p-2 bg-zinc-900 rounded-[24px] shadow-2xl flex flex-col md:flex-row items-center"
            >
              <div className="flex-1 flex items-center px-6 w-full">
                <Search className="text-zinc-600 mr-4" size={20} />
                <Input
                  placeholder="What service are you looking for?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 text-white text-lg h-14 w-full placeholder:text-zinc-700 font-medium"
                />
                <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase">
                  <Command size={10} /> K
                </div>
              </div>
              <Button
                onClick={scrollToMarketplace}
                className="w-full md:w-auto h-14 px-10 bg-orange-500 hover:bg-orange-400 text-black font-bold text-base rounded-2xl transition-all shadow-lg"
              >
                Search Gigs
              </Button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-40 w-full max-w-5xl">
              {stats.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 rounded-[32px] bg-zinc-900/50 backdrop-blur-xl transition-all duration-500 hover:bg-zinc-900/80 overflow-hidden"
                >
                  {/* Subtle Glow Effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors" />
                  
                  <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4">
                    <motion.div 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="text-orange-500 mb-2"
                    >
                      {React.cloneElement(s.icon, { size: 24, strokeWidth: 2.5 })}
                    </motion.div>
                    
                    <div className="space-y-1">
                      <span className="block text-3xl font-black text-white tracking-tighter hover:text-orange-500 transition-colors">
                        {s.value}
                      </span>
                      <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
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
          MARKETPLACE: THE DIRECTORY
      ══════════════════════════════════════════════ */}
      <section id="marketplace" className="py-32 bg-zinc-950/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
            <div className="max-w-xl">
              <h2 className="text-5xl font-black mb-4 tracking-tighter text-white">
                THE <span className="text-orange-500">COLLECTION</span>
              </h2>
              <p className="text-zinc-600 font-bold tracking-wider text-[11px] uppercase">Curated Talent Index</p>
            </div>

            <Tabs value={category} onValueChange={setCategory} className="w-auto">
              <TabsList>
                {categories.map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value}>
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {loadingServices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <div key={i} className="h-96 bg-zinc-900/50 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredServices.slice(0, 6).map((service, idx) => (
                  <motion.div
                    key={service._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Card className="group border-0 bg-zinc-900/40 rounded-[32px] overflow-hidden transition-all duration-500 hover:bg-zinc-900 shadow-sm">
                      <CardHeader className="p-0 relative h-64 overflow-hidden">
                        <img
                          src={service.image || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800'}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-5 left-5">
                          <Badge className="bg-black/60 backdrop-blur-md text-orange-500 border-0 font-bold px-3 py-1 rounded-full text-[9px] uppercase tracking-widest">
                            {service.category}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-8 space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="w-10 h-10 flex items-center justify-center font-black text-orange-500 text-lg relative"
                            >
                              <div className="absolute inset-0 bg-orange-500/5 blur-xl rounded-full" />
                              <span className="relative z-10">{service.providerId?.name?.charAt(0) || 'P'}</span>
                            </motion.div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-zinc-100">{service.providerId?.name || 'Pro Expert'}</span>
                              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight flex items-center gap-1">
                                <MapPin size={10} className="text-orange-500" /> {service.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-orange-500">
                            <Star size={12} className="fill-orange-500" />
                            <span className="text-xs font-black">4.9</span>
                          </div>
                        </div>

                        <h3 className="text-2xl font-black leading-tight tracking-tight text-white group-hover:text-orange-500 transition-colors">
                          {service.title}
                        </h3>
                      </CardContent>

                      <CardFooter className="p-8 pt-0 flex items-center justify-between mt-2">
                        <div className="pt-6">
                          <span className="block text-[9px] font-bold text-zinc-700 uppercase tracking-widest mb-1">Fixed Rate</span>
                          <span className="text-2xl font-black text-white">Rs.{service.price?.toLocaleString()}</span>
                        </div>
                        <div className="pt-6">
                          <Button asChild className="group/btn bg-zinc-900 hover:bg-orange-500 text-white hover:text-black rounded-xl px-8 font-bold text-xs h-12 transition-all shadow-lg flex items-center gap-2 overflow-hidden border border-white/5">
                            <Link to={`/checkout/${service._id}`} className="flex items-center gap-2">
                              Hire 
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight size={14} />
                              </motion.div>
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-20 text-center">
            <Button asChild variant="ghost" className="text-zinc-600 hover:text-orange-500 font-bold tracking-[0.1em] text-[11px] uppercase group transition-colors">
              <Link to="/services" className="flex items-center gap-3">
                View Entire Directory
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE TRACKING: LOGISTICS HUB DESIGN
      ══════════════════════════════════════════════ */}
      <section className="py-40 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <div className="space-y-10">
              <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest shadow-sm">
                Advanced Logistics
              </Badge>
              
              <h2 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-white">
                REAL TIME <br />
                LOGISTICS.
              </h2>
              
              <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-lg">
                Your time is valuable. Monitor every milestone of your booking 
                with high-precision GPS telemetry and instant notifications.
              </p>

              <div className="flex flex-wrap gap-10">
                 <div className="flex flex-col">
                    <span className="text-5xl font-black text-white tracking-tighter">100%</span>
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mt-2">Vetted Talent</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-5xl font-black text-white tracking-tighter">05s</span>
                    <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mt-2">Update Pulse</span>
                 </div>
              </div>
            </div>

            <div className="relative flex justify-center py-20 lg:py-0">
              {/* Modern Radar Visual Element */}
              <div className="w-full max-w-2xl aspect-square relative flex items-center justify-center">
                
                {/* Outer Pulse Rings - Glow version */}
                <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
                
                {/* Scanning Radar Line */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full z-10 pointer-events-none"
                  style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(249, 115, 22, 0.2) 350deg, transparent 360deg)' }}
                />

                {/* Animated Blips (Local Experts) */}
                <motion.div 
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-[20%] right-[30%] w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] z-20"
                />
                <motion.div 
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                  className="absolute bottom-[25%] left-[25%] w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)] z-20"
                />
                
                {/* The Central HUD Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-80 bg-zinc-900/80 backdrop-blur-2xl rounded-[48px] p-10 text-center shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative z-30"
                >
                  <div className="relative w-28 h-28 mx-auto mb-10 group/icon">
                    {/* Pulsing Glow behind the container */}
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                    
                    {/* The Icon Container - Restored as requested */}
                    <div className="relative w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700 rounded-[32px] flex items-center justify-center text-black shadow-[0_20px_40px_rgba(249,115,22,0.3)] overflow-hidden">
                      <motion.div 
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        <Navigation size={48} className="fill-black/10" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-10">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Radar Pulse</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">Live Signal: Active</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-10 text-left">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">Scanning Coverage</span>
                      <span className="text-xs font-black text-orange-500 leading-none">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden p-[2px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '94%' }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                      />
                    </div>
                  </div>
 
                  <Button className="w-full rounded-2xl bg-zinc-900 hover:bg-orange-500 hover:text-black text-white font-black text-[12px] uppercase tracking-wider h-16 transition-all shadow-xl active:scale-95 border border-white/10 group/launch">
                    <span className="flex items-center justify-center gap-3">
                       Launch Interface
                       <motion.div
                         animate={{ x: [0, 5, 0] }}
                         transition={{ duration: 1.2, repeat: Infinity }}
                       >
                         <ArrowRight size={18} className="text-orange-500 group-hover/launch:text-black transition-colors" />
                       </motion.div>
                    </span>
                  </Button>
                  {/* Floating HUD Metadata Block - Anchored to central card for perfect 'touch' */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="absolute top-10 -left-[9.5rem] p-5 rounded-3xl bg-zinc-900/90 backdrop-blur-xl hidden lg:block z-40 shadow-2xl transition-all hover:scale-105"
                  >
                    <Activity size={24} className="text-orange-500 mb-3" />
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Signal Strength</div>
                    <div className="text-xl font-black text-white leading-none tracking-tight">256.4 KB/s</div>
                  </motion.div>
                </motion.div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;