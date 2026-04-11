import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
        // Filter services belonging to the current provider
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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Services</h1>
          <p className="text-muted-foreground">Manage and update your service offerings.</p>
        </div>
        <Button asChild className="gap-2 h-11 px-6 rounded-xl font-bold">
          <Link to="/dashboard/provider/services/create">
            <Plus size={20} />
            Create New Service
          </Link>
        </Button>
      </header>

      {/* Filter and View Toggle bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search your services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border border-input rounded-xl py-2.5 pl-11 pr-4 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-xl border border-input">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={18} />
            </button>
          </div>
          <Button variant="outline" className="gap-2 rounded-xl">
            <Filter size={18} />
            Filters
          </Button>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="text-muted-foreground">Try adjusting your search or create a new service.</p>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {filteredServices.map((service) => (
            viewMode === 'grid' ? (
              <Card key={service._id} className="overflow-hidden group hover:border-primary/30 transition-all duration-300 flex flex-col border-slate-200/60 dark:border-slate-800/60">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 py-1 px-2.5 bg-black/50 backdrop-blur-md rounded-lg text-white text-[10px] font-bold border border-white/10 uppercase tracking-wider">
                    {service.category}
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Price</span>
                      <span className="text-xl font-bold text-primary">${service.price}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="text-amber-400 fill-amber-400" size={14} />
                        <span className="font-bold text-sm">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t flex gap-2">
                    <Button variant="outline" asChild className="flex-1 rounded-xl">
                      <Link to={`/dashboard/provider/services/edit/${service._id}`}>
                        <Edit2 size={16} className="mr-2" /> Edit
                      </Link>
                    </Button>
                    <Button variant="outline" className="px-3 rounded-xl text-destructive hover:bg-destructive/10">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={service._id} className="p-4 hover:border-primary/30 transition-all border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-6">
                  <img src={service.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">{service.category}</span>
                    </div>
                    <h3 className="font-bold truncate">{service.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-primary font-bold text-lg">${service.price}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="text-amber-400 fill-amber-400" size={14} />
                        <span className="font-semibold text-xs text-muted-foreground">4.8 (24 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild className="rounded-xl">
                      <Link to={`/dashboard/provider/services/edit/${service._id}`}><Edit2 size={18} /></Link>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl text-destructive hover:bg-destructive/10"><Trash2 size={18} /></Button>
                  </div>
                </div>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServices;

