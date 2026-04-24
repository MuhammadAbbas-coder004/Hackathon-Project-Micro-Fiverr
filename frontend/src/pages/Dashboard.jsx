import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import ProviderDashboard from './ProviderDashboard';

// shadcn/ui imports
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

// Icons (lucide-react is included with shadcn)
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Bell,
  ChevronDown,
  Briefcase,
  ShoppingBag,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Loading skeleton shown while auth is checked
───────────────────────────────────────────── */
const AuthCheckingSkeleton = () => (
  <div className="min-h-screen bg-background flex flex-col">
    {/* Navbar skeleton */}
    <div className="border-b h-16 px-4 md:px-8 flex items-center justify-between">
      <Skeleton className="h-8 w-32" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-24 hidden md:block" />
      </div>
    </div>

    {/* Content skeleton */}
    <div className="flex-1 p-6 md:p-10 space-y-6 max-w-7xl mx-auto w-full">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  </div>
);

const Navbar = ({ user, onLogout }) => {
  const isFreelancer = user?.role === 'freelancer';
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const navLinks = [
    { label: 'Control Center', icon: LayoutDashboard, href: '#' },
    { label: 'System Settings', icon: Settings, href: '#' },
  ];

  return (
    <header className="sticky top-4 z-50 w-[95%] max-w-7xl mx-auto bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-full ring-1 ring-white/5 transition-all duration-500 mb-6 px-6">
      <div className="h-20 flex items-center justify-between gap-4">

        {/* Left — Logo */}
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white/60 hover:text-white hover:bg-white/5 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0b0e14]/95 backdrop-blur-3xl border-r border-white/10 p-0 w-80">
              <div className="p-10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-black text-xl tracking-tighter text-white uppercase">HUB</span>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map(({ label, icon: Icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  ))}
                  <div className="h-px bg-white/5 my-4" />
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Terminate Session
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-4 ring-indigo-600/10">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter text-white uppercase hidden sm:block">
              NODE<span className="text-indigo-500">DASH</span>
            </span>
          </div>
        </div>

        {/* Center — Desktop nav links */}
        <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
          {navLinks.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-8 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </a>
          ))}
        </nav>

        {/* Right — Bell + User menu */}
        <div className="flex items-center gap-4">
          <button className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all group">
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[#0b0e14] animate-pulse" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full p-1 pr-4 bg-white/5 hover:bg-white/10 transition-all outline-none border border-white/10 ring-1 ring-white/5 group">
                <Avatar className="h-10 w-10 border-2 border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-[10px] font-black bg-indigo-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                   <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none hidden md:block">
                     {user?.name?.split(' ')[0]}
                   </span>
                   <span className="text-[7px] font-bold text-indigo-400/70 uppercase tracking-widest mt-1 hidden md:block">
                     Online
                   </span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-600 group-hover:text-white transition-all hidden md:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-[#050505] border-white/10 rounded-[36px] p-4 mt-6 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-300"
            >
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
              
              <DropdownMenuLabel className="px-6 py-6 mb-4 relative z-10">
                <div className="flex items-center gap-5">
                   <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                      <AvatarFallback className="bg-indigo-600 text-white font-black text-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#050505] rounded-full shadow-lg shadow-emerald-500/50" 
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1.5 opacity-80">Authenticated</p>
                    <p className="font-black text-xl text-white tracking-tighter leading-none mb-1">{user?.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <p className="text-[10px] font-bold text-slate-500 lowercase tracking-wide opacity-70">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-6 mb-4" />
              
              <div className="space-y-1.5 relative z-10 px-1">
                <DropdownMenuItem className="px-6 py-5 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-between group cursor-pointer border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <User className="h-5 w-5" />
                    </div>
                    Identity Protocol
                  </div>
                  <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover:opacity-40 transition-all translate-x-2 group-hover:translate-x-0" />
                </DropdownMenuItem>
                <DropdownMenuItem className="px-6 py-5 rounded-[24px] bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-between group cursor-pointer border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Settings className="h-5 w-5" />
                    </div>
                    Node Configuration
                  </div>
                  <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover:opacity-40 transition-all translate-x-2 group-hover:translate-x-0" />
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-white/5 my-4 mx-6" />
              
              <div className="px-1 mb-1">
                <DropdownMenuItem
                  className="px-6 py-5 rounded-[24px] bg-red-500/5 hover:bg-red-600 hover:text-white transition-all duration-300 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-5 cursor-pointer border border-red-500/10 hover:border-red-500 group shadow-lg hover:shadow-red-500/20"
                  onClick={onLogout}
                >
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
                    <LogOut className="h-5 w-5" />
                  </div>
                  Terminate Session
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

/* ─────────────────────────────────────────────
   Role banner — shown just below navbar
───────────────────────────────────────────── */
const RoleBanner = ({ user }) => {
  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="bg-transparent mb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-white/5 rounded-full px-8 py-3 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full animate-pulse ${isFreelancer ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              {isFreelancer ? 'Provider Protocol' : 'Customer Protocol'}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <Badge variant={isFreelancer ? 'default' : 'secondary'} className="bg-indigo-600/20 text-indigo-400 border-indigo-500/30 rounded-full px-4 text-[9px] font-black uppercase tracking-widest">
            {isFreelancer ? 'Freelancer' : 'Customer'}
          </Badge>

          <span className="text-[10px] font-bold text-slate-500 ml-auto hidden sm:block">
            Access Granted: <strong className="text-white ml-1 uppercase">{user?.name?.split(' ')[0] || 'there'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Dashboard component
───────────────────────────────────────────── */
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  /* Auth check in progress */
  if (loading) return <AuthCheckingSkeleton />;

  /* User not found — redirect handled in useEffect */
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Role context banner */}
      <RoleBanner user={user} />

      {/* Dashboard content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {user.role === 'freelancer' ? (
          <ProviderDashboard />
        ) : (
          <CustomerDashboard />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
