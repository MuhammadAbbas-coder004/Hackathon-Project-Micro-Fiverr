import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Star, 
  Users, 
  Briefcase,
  ClipboardList,
  MessageSquare,
  Zap,
  ArrowRight,
  ShieldCheck,
  Plus,
  LogOut,
  Navigation,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LocationSender from '../../components/tracking/LocationSender';
import socket from '../../utils/socket';
import { api } from '../../utils/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const ProviderDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [vendorStats, setVendorStats] = useState({
    servicesCount: 0,
    activeBookings: 0,
    rating: user?.rating || 4.9,
    earnings: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);
  const [activeBookingId, setActiveBookingId] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await api.get('/bookings/provider/stats');
        const bookingsRes = await api.get('/bookings/provider');
        const servicesRes = await api.get('/services');
        
        const myServices = servicesRes.data.filter(s => s.providerId === user._id);
        const active = bookingsRes.data.find(b => b.status === 'active' || b.status === 'Paid');
        
        if (active) setActiveBookingId(active._id);

        setVendorStats({
          servicesCount: myServices.length,
          activeBookings: bookingsRes.data.filter(b => b.status === 'active' || b.status === 'Paid').length,
          rating: user?.rating || 4.9,
          earnings: statsRes.data.totalEarned
        });

        setBalance(statsRes.data.balance);
        
      } catch (err) {
        console.error("Error fetching provider stats", err);
      }
    };
    if (user?._id) fetchStats();
  }, [user]);

  const toggleOnline = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    socket.emit("set_online", { userId: user?._id, isOnline: newStatus });
  };

  useEffect(() => {
    if (user?._id) {
       socket.emit("set_online", { userId: user._id, isOnline: isOnline });
    }
  }, [user, isOnline]);

  useEffect(() => {
    socket.on("payment_received", (data) => {
      setBalance(prev => prev + Number(data.amount));
      setNotifications(prev => [data, ...prev]);
    });
    return () => socket.off("payment_received");
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { label: 'Active services', value: vendorStats.servicesCount, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Orders', value: vendorStats.activeBookings, icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Avg. Rating', value: vendorStats.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Earnings', value: `$${balance.toLocaleString()}`, icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background shadow-sm overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary uppercase">{user?.name?.charAt(0)}</span>
              )}
            </div>
            <div className={`absolute bottom-0 right-0 w-5 h-5 border-2 border-background rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight italic">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-medium">
              Freelancer Portal •  
              <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                {isOnline ? 'Online' : 'Offline'}
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={toggleOnline} className="flex-1 md:flex-none h-11 px-6 rounded-xl">
            {isOnline ? 'Go Offline' : 'Set Active'}
          </Button>
          <Button asChild className="flex-1 md:flex-none gap-2 h-11 px-6 rounded-xl font-bold">
            <Link to="/dashboard/provider/services/create">
              <Plus size={16} /> New Service
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="flex-1 md:flex-none gap-2 h-11 px-6 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 font-bold border border-red-100"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-border/50 shadow-none hover:shadow-md transition-all rounded-2xl group cursor-pointer hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-foreground mt-2">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} strokeWidth={2.5} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-none rounded-[32px] overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                  <CardDescription>Manage your ongoing tasks and performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 border-dashed" asChild>
                  <Link to="/dashboard/provider/orders">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                    <span>View Orders</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 border-dashed" asChild>
                  <Link to="/dashboard/provider/messages">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <span>Messages</span>
                  </Link>
                </Button>
            </CardContent>
          </Card>

          {activeBookingId && (
            <Card className="border-primary/20 bg-primary/5 rounded-[32px]">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                    <Navigation className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Active Service in Progress</h3>
                    <p className="text-sm text-muted-foreground">Tracking client and providing real-time updates</p>
                  </div>
                </div>
                <Button onClick={() => navigate(`/track-client/${activeBookingId}`)}>
                  Track Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
           {activeBookingId && <LocationSender bookingId={activeBookingId} userId={user?._id} />}
           
           <Card className="bg-primary text-primary-foreground border-none rounded-[32px] overflow-hidden shadow-xl shadow-primary/20">
             <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl shrink-0">
                    <ShieldCheck size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold leading-none">Pro freelancer</h3>
                    <p className="text-primary-foreground/80 text-sm mt-3 leading-relaxed">
                      Maintain your high rating to stay in the priority list for new clients.
                    </p>
                    <Button size="sm" variant="secondary" className="mt-6 w-full font-bold h-10 rounded-xl">View Achievements</Button>
                  </div>
                </div>
             </CardContent>
           </Card>

           <Card className="border-border/50 shadow-none rounded-[32px]">
             <CardHeader className="pb-3 px-6 pt-6">
               <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-black">Dashboard Shortcuts</CardTitle>
             </CardHeader>
             <CardContent className="p-2 pt-0 flex flex-col gap-1">
                 <Link to="/dashboard/provider/services" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                       <Briefcase size={18} />
                    </div>
                    <div>
                       <h4 className="font-bold text-sm text-foreground uppercase tracking-tight">My Services</h4>
                       <p className="text-muted-foreground text-[10px] font-bold mt-0.5">Edit & Manage gigs</p>
                    </div>
                 </Link>
                 <Link to="/dashboard/provider/reviews" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                       <Star size={18} />
                    </div>
                    <div>
                       <h4 className="font-bold text-sm text-foreground uppercase tracking-tight">Reviews</h4>
                       <p className="text-muted-foreground text-[10px] font-bold mt-0.5">See client feedback</p>
                    </div>
                 </Link>
                 <Link to="/dashboard/provider/earnings" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors shrink-0">
                       <Wallet size={18} />
                    </div>
                    <div>
                       <h4 className="font-bold text-sm text-foreground uppercase tracking-tight">Earnings</h4>
                       <p className="text-muted-foreground text-[10px] font-bold mt-0.5">Wallet & Transfers</p>
                    </div>
                 </Link>
             </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default ProviderDashboard;

