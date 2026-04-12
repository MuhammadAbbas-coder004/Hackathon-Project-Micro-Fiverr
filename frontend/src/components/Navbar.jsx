import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

// Shadcn UI Components
import { Button } from '../components/ui/Button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetTrigger, SheetClose,
} from '../components/ui/sheet';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ShoppingBag, 
  Radio, 
  Menu, 
  X,
  User,
  LayoutGrid,
  MessageSquare,
  LogOut,
  ChevronDown,
  Zap,
} from 'lucide-react';

const navLinks = [
  { label: 'Home',        href: '/',         icon: Home },
  { label: 'Marketplace', href: '/services', icon: ShoppingBag },
  { label: 'Live Radar',  href: '/radar',    icon: Radio },
];

const Logo = () => {
  const { user } = useAuth();
  const isFreelancer = user?.role === 'freelancer';

  return (
    <Link to={isFreelancer ? "/dashboard/provider" : "/"} className="flex items-center gap-2 group outline-none">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-orange-500 rounded-lg blur-[2px] opacity-10 group-hover:opacity-30 transition-opacity" 
        />
        <Zap className="relative h-6 w-6 text-orange-500 fill-orange-500/20 group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight text-white">
          MICRO<span className="text-orange-500 font-black">FIVERR</span>
        </span>
        <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-0.5">Elite Freelance Network</span>
      </div>
    </Link>
  );
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">

        {/* ══ LEFT: Logo ══ */}
        <Logo />

        {/* ══ CENTER: Desktop Nav ══ */}
        <div className="hidden md:flex items-center gap-8">
          {user?.role !== 'freelancer' && navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'relative flex items-center gap-2 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors group',
                location.pathname === href ? 'text-white' : 'text-white/40 hover:text-white'
              )}
            >
              <Icon size={14} className={cn("transition-transform group-hover:-translate-y-0.5", location.pathname === href ? "text-orange-500" : "")} />
              {label}
              
              {/* Animated Underline */}
              {location.pathname === href && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover Underline (Subtle) */}
              <div className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
            </Link>
          ))}
        </div>

        {/* ══ RIGHT: Actions ══ */}
        <div className="flex items-center gap-4">
          
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                asChild
                className="h-9 px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="h-9 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-black shadow-lg shadow-orange-500/10 border-none transition-all hover:scale-105 active:scale-95"
              >
                <Link to="/register">Join Network</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full p-0.5 pr-3 hover:bg-white/5 transition-all outline-none border border-white/5 group">
                    <Avatar className="h-8 w-8 border border-white/10 bg-zinc-900 group-hover:border-orange-500/50 transition-colors">
                      <AvatarFallback className="bg-zinc-800 text-white font-bold text-[10px]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown size={14} className="text-white/30 group-hover:text-white transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 mt-4 p-3 rounded-[24px] bg-black/90 border border-white/10 shadow-3xl text-white backdrop-blur-2xl"
                >
                  <DropdownMenuLabel className="px-4 py-4 mb-2 bg-white/5 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-orange-500/20">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate">{user?.name}</p>
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{user?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer font-medium py-3 px-4 mb-1 transition-all">
                    <Link to="/dashboard" className="flex items-center gap-3">
                      <LayoutGrid size={16} className="text-orange-500" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-white/10 focus:text-white cursor-pointer font-medium py-3 px-4 mb-1 transition-all">
                    <Link to="/chat" className="flex items-center gap-3">
                      <MessageSquare size={16} className="text-orange-500" /> Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 mx-2 my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl text-red-400 focus:bg-red-500/10 focus:text-red-400 font-bold cursor-pointer py-3 px-4 transition-all"
                  >
                    <LogOut size={16} className="mr-3" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* ══ MOBILE: FULL SHUTTER DROP ══ */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl w-10 h-10 text-white/70 hover:text-white hover:bg-white/5 active:scale-90 transition-all">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="top" hideClose className="h-auto w-full bg-black/95 backdrop-blur-3xl border-b border-white/10 text-white p-0 flex flex-col focus:outline-none rounded-b-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Shutter Header */}
                <div className="h-20 px-8 flex items-center justify-between">
                  <Logo />
                  <SheetClose asChild>
                    <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-all active:scale-90">
                      <X size={24} />
                    </button>
                  </SheetClose>
                </div>

                {/* Shutter Body (Links) */}
                <div className="flex flex-col justify-start pt-4 px-8 gap-1">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 mb-8 px-4">Navigation</p>
                    <div className="space-y-2">
                      {navLinks.map(({ href, label, icon: Icon }, index) => (
                        <SheetClose asChild key={href}>
                          <Link
                            to={href}
                            className={cn(
                              'flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all group',
                              location.pathname === href
                                ? 'bg-orange-500 text-black'
                                : 'hover:bg-white/5 text-white/60 hover:text-white'
                            )}
                          >
                            <div className="flex items-center gap-6">
                              <Icon size={22} className={cn("transition-transform group-hover:scale-110", location.pathname === href ? "text-black" : "text-orange-500")} />
                              <span className="text-2xl font-bold tracking-tight">{label}</span>
                            </div>
                            <Zap size={16} className={cn("opacity-0 group-hover:opacity-100 transition-opacity", location.pathname === href ? "opacity-100" : "")} />
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Shutter Footer (Account) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-8 pt-4 pb-10"
                >
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-4">
                      <SheetClose asChild>
                        <Button asChild variant="ghost" className="h-11 rounded-xl border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/5">
                          <Link to="/login">Sign In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild className="h-11 rounded-xl bg-orange-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-500/20 shadow-orange-500/10">
                          <Link to="/register">Join Network</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 px-5 py-3 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-orange-500/20">
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <p className="font-bold text-lg text-white leading-tight">{user?.name}</p>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">{user?.role}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                        <SheetClose asChild>
                          <Button asChild variant="ghost" className="h-11 rounded-xl bg-white/5 text-white/60 hover:text-white font-bold text-[10px] uppercase tracking-widest border border-white/5">
                            <Link to="/dashboard">Dashboard</Link>
                          </Button>
                        </SheetClose>
                        <Button
                          onClick={() => { handleLogout(); }}
                          className="h-11 rounded-xl bg-red-500/10 text-red-500 font-bold text-[10px] uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                        >
                          Sign Out
                        </Button>
                       </div>
                    </div>
                  )}
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;