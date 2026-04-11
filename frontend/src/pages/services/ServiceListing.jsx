import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  MapPin, 
  Star, 
  MessageSquare, 
  Layers,
  Compass,
  Navigation,
  Info,
  ShoppingCart,
  Zap,
  Filter,
  ArrowUpRight,
  User,
  CheckCircle2,
  Tag
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import StarRating from '@/components/ui/StarRating';

const ServiceListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All',
    location: '',
  });

  const categories = [
    { name: 'All', icon: <Layers size={14} /> },
    { name: 'Plumbing', icon: <Zap size={14} /> },
    { name: 'Electrical', icon: <Zap size={14} /> },
    { name: 'Tutoring', icon: <Info size={14} /> },
    { name: 'Cleaning', icon: <CheckCircle2 size={14} /> },
    { name: 'Painting', icon: <Tag size={14} /> },
    { name: 'Technical', icon: <Navigation size={14} /> },
    { name: 'Home Service', icon: <Compass size={14} /> }
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
    <div className="min-h-screen bg-[#FDFDFF] font-sans pt-6">
      
      {/* ══ STICKY FILTER BAR ══ */}
      <div className="sticky top-[70px] z-40 w-full mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-3">
            <div className="flex flex-col lg:flex-row gap-3 items-center">
              
              {/* Search */}
              <div className="relative w-full lg:flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-4 h-4" />
                <Input
                  placeholder="What service are you looking for?"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-11 h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-2xl font-medium"
                />
              </div>

              {/* Location */}
              <div className="relative w-full lg:w-72 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 w-4 h-4" />
                <Input
                  placeholder="Location..."
                  value={filters.location}
                  onChange={e => setFilters({...filters, location: e.target.value})}
                  className="pl-11 h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-rose-500/20 rounded-2xl font-medium"
                />
              </div>

              {/* Filter Button */}
              <Button variant="outline" className="hidden lg:flex h-12 rounded-2xl border-slate-200 px-6 gap-2 font-bold text-slate-600">
                <Filter size={16} /> Filters
              </Button>
            </div>

            {/* Category Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto mt-3 pb-1 no-scrollbar border-t border-slate-50 pt-3">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setFilters({...filters, category: cat.name})}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                    filters.category === cat.name 
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-300" 
                      : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200 hover:text-indigo-600"
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

      {/* ══ MAIN CONTENT AREA ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* ══ SECTION HEADER (Adjusted spacing) ══ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-28 mb-10 px-2 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-2.5 h-10 bg-indigo-600 rounded-full" />
              Featured Services
            </h2>
            <p className="text-slate-500 text-sm font-medium ml-5">Handpicked professionals just for you</p>
          </div>
          
          <div className="bg-indigo-50 px-5 py-2.5 rounded-2xl flex items-center gap-2 border border-indigo-100 shadow-sm">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
              {filteredServices.length} Gigs Found
            </span>
          </div>
        </div>

        {/* ══ GRID ══ */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm mt-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Services Found</h3>
            <p className="text-slate-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map(service => (
              <Card key={service._id} className="group border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col h-full border border-slate-50">
                
                {/* Image Section */}
                <CardHeader className="p-0 relative h-56 overflow-hidden">
                  <img
                    src={service.image || `https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={service.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <Badge className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-900 border-none px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase shadow-lg">
                    {service.category}
                  </Badge>

                  <div className="absolute top-4 right-4 translate-x-16 group-hover:translate-x-0 transition-transform duration-300">
                    <Link to="/chat" className="p-3 bg-white/95 backdrop-blur-md rounded-2xl text-indigo-600 shadow-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center">
                      <MessageSquare size={18} />
                    </Link>
                  </div>
                </CardHeader>

                <CardContent className="p-6 flex-grow flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-slate-700">{service.rating || '5.0'}</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-0.5">(12)</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <ArrowUpRight size={12} /> Top Rated
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
                    {service.title.toLowerCase().startsWith('i will') ? service.title : `I will ${service.title}`}
                  </h3>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1 tracking-wider">Expert Provider</p>
                      <p className="text-sm font-bold text-slate-700 tracking-tight">{service.providerId?.name || 'Local Expert'}</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-7 pt-0 flex flex-col gap-4">
                  <div className="flex items-end justify-between border-t border-slate-100 pt-5 w-full">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price Start At</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter italic">Rs.{service.price}</p>
                    </div>
                    <Link to={`/services/${service._id}`} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                      <Info size={20} />
                    </Link>
                  </div>

                  <Button asChild className="h-13 w-full rounded-[1.25rem] bg-slate-900 hover:bg-indigo-600 text-white font-bold transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-100 gap-3 border-none text-xs uppercase tracking-widest">
                    <Link to={`/checkout/${service._id}`}>
                      <ShoppingCart size={18} />
                      Hire Professional
                    </Link>
                  </Button>
                </CardFooter>

              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceListing; 