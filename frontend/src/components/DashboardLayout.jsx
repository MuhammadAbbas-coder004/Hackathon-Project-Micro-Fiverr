import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdWork, MdChat, MdStar,
  MdAccountBalanceWallet, MdSettings, MdLogout, MdNotifications,
  MdPerson, MdFormatListBulleted, MdAccessTime,
  MdMoreHoriz, MdSearch, MdMenu, MdLanguage, MdMailOutline, MdChevronLeft, MdChevronRight, MdClose, MdPlayArrow
} from 'react-icons/md';
import {
  Zap, Home, BarChart2, Layers, Send, User, Folder,
  Settings, LogOut, ChevronLeft, Plus, CloudUpload, PieChart,
  LayoutGrid, CreditCard, Wallet, Activity, ArrowUpRight,
  Moon, Grid, Mail, MessageSquare, Box, Briefcase, DollarSign, Rocket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const cn = (...classes) => classes.filter(Boolean).join(' ');

/* ─── Nav Configuration ──────────────────────────────────────── */
const navConfig = {
  freelancer: {
    groups: [
      {
        label: 'Nexus',
        items: [
          { label: 'Overview',     href: '/dashboard/provider',              Icon: LayoutGrid, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
          { label: 'Earnings',     href: '/dashboard/provider/reviews',      Icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
          { label: 'Identity',     href: '/dashboard/provider/settings',     Icon: User, color: 'text-amber-400', bg: 'bg-amber-500/20' },
        ],
      },
      {
        label: 'Workforce',
        items: [
          { label: 'My Gigs',      href: '/dashboard/provider/services',     Icon: Box, badge: '8', color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
          { label: 'Proposals',    href: '/dashboard/provider/applications', Icon: Send, color: 'text-sky-400', bg: 'bg-sky-500/20' },
          { label: 'Active Jobs',  href: '/dashboard/provider/active-jobs',  Icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-500/20' },
          { label: 'Chat',         href: '/chat',                            Icon: MessageSquare, badge: '4', color: 'text-pink-400', bg: 'bg-pink-500/20' },
        ],
      },
    ],
  },
  customer: {
    groups: [
      {
        label: 'Main',
        items: [
          { label: 'Dashboard', href: '/dashboard',           Icon: LayoutGrid, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
          { label: 'Browse',    href: '/dashboard/browse',    Icon: Rocket, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
        ],
      },
      {
        label: 'Work',
        items: [
          { label: 'Orders',    href: '/dashboard/orders',    Icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
          { label: 'Messages',  href: '/dashboard/messages',   Icon: MessageSquare, badge: '2', color: 'text-pink-400', bg: 'bg-pink-500/20' },
        ],
      },
    ],
  },
};

const SidebarContent = ({ user, groups, collapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href) => {
    if (href === '/dashboard/provider' || href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* ── Logo Area ── */}
      <div className="h-[70px] sm:h-[100px] flex items-center px-4 sm:px-5 shrink-0 relative">
        <Link to={user?.role === 'freelancer' ? "/dashboard/provider" : "/"} className="flex items-center gap-2 sm:gap-3 group outline-none overflow-hidden whitespace-nowrap w-full">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-indigo-500 rounded-lg blur-[4px] opacity-20" 
            />
            <Zap className="relative h-5 w-5 sm:h-6 sm:w-6 text-indigo-500 fill-indigo-500/20" />
          </div>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col leading-none">
              <span className="text-[16px] sm:text-[20px] font-extrabold tracking-tight text-white uppercase">
                MICRO<span className="text-indigo-500 font-black">FIVERR</span>
              </span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* ── Navigation Links ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 sm:px-4 space-y-6 sm:space-y-8 no-scrollbar">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5 sm:gap-2">
            {!collapsed && <span className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-[0.2em] px-4 mb-1">{group.label}</span>}
            {group.items.map((item) => {
              const active = isActive(item.href);
              const ItemIcon = item.Icon;
              return (
                <NavLink
                  key={item.href} to={item.href} end={item.href === '/dashboard/provider' || item.href === '/dashboard'}
                  className={`relative flex items-center h-10 sm:h-12 px-2 rounded-2xl transition-all duration-300 group overflow-hidden ${
                    active 
                      ? 'bg-gradient-to-r from-white/15 to-transparent text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                  title={item.label}
                >
                  {active && <motion.div layoutId="activeNav" className="absolute left-0 top-1/4 bottom-1/4 w-0.5 sm:w-1 bg-indigo-600 rounded-r-full shadow-[0_0_15px_#4f46e5]" />}
                  <div className={`w-8 h-8 sm:w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${active ? `${item.bg} shadow-lg shadow-black/20` : 'bg-transparent group-hover:bg-white/5'}`}>
                     <ItemIcon size={16} className={active ? item.color : 'text-white/40 group-hover:text-white'} />
                  </div>
                  {!collapsed && (
                    <span className="ml-2 sm:ml-3 text-[12px] sm:text-[14px] font-semibold tracking-wide whitespace-nowrap">{item.label}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Bottom Logout ── */}
      <div className="p-2 sm:p-4 border-t border-white/10 pb-6">
         <button 
           onClick={handleLogout}
           className="w-full flex items-center h-10 sm:h-11 px-2 rounded-2xl text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-all group overflow-hidden"
         >
            <div className="w-8 h-8 sm:w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
               <LogOut size={16} />
            </div>
            {!collapsed && <span className="ml-2 sm:ml-3 text-[12px] sm:text-[14px] font-semibold">Logout</span>}
         </button>
      </div>
    </div>
  );
};


/* ─── Main Layout ────────────────────────────────────────────── */
const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 640);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) setUser(JSON.parse(data));
    else navigate('/login');
    
    const handleResize = () => { if (window.innerWidth < 640) setCollapsed(true); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  if (!user) return null;

  const role = user.role === 'freelancer' ? 'freelancer' : 'customer';
  const config = navConfig[role] || navConfig.freelancer;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0e14] font-sans text-slate-200">
      
      {/* ── SIDEBAR CONTAINER ── */}
      <aside className="relative flex flex-shrink-0 h-full z-40">
        <motion.div 
           animate={{ width: collapsed ? 80 : 280 }}
           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
           className="h-full bg-[#0a0a0a] border-r border-white/5 overflow-hidden shadow-2xl"
        >
          <SidebarContent user={user} groups={config.groups} collapsed={collapsed} />
        </motion.div>

        {/* ── ATTRACTIVE FLOATING TOGGLE BUTTON ── */}
        <button 
           onClick={() => setCollapsed(!collapsed)}
           className={cn(
             "absolute -right-3.5 top-32 w-7 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white z-50 border border-indigo-400/50 transition-all active:scale-90 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] hover:bg-indigo-500 group",
             collapsed && "animate-pulse"
           )}
        >
           <motion.div
             animate={{ rotate: collapsed ? 0 : 180 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
           >
             <MdPlayArrow size={16} className="group-hover:scale-110 transition-transform" />
           </motion.div>
        </button>
      </aside>

      {/* Main Content wrapper */}
      <div className={cn(
        "flex flex-col flex-1 min-w-0 overflow-hidden bg-transparent relative z-10 transition-all duration-300",
        !collapsed && "blur-[4px] sm:blur-none pointer-events-none sm:pointer-events-auto"
      )}>
        
        <div className="flex flex-col flex-1 overflow-hidden relative">
          
          {/* Top Navbar */}
          <div className="flex items-center justify-between h-[70px] sm:h-[100px] px-4 sm:px-10 bg-[#0b0e14]/40 backdrop-blur-xl border-b border-white/5 z-30 shrink-0">
            <div className="flex items-center gap-4 flex-1 min-w-0">
               <div className="truncate">
                  <h1 className="text-[16px] sm:text-[24px] font-black text-white leading-tight tracking-tight truncate">
                    Hi, {user?.name?.split(' ')[0]}
                  </h1>
                  <p className="hidden sm:block text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Vetted Node Active</p>
               </div>
            </div>

            <div className="flex items-center justify-end gap-3 sm:gap-6">
               <div className="flex items-center gap-3 sm:gap-4">
                  <Link to={user?.role === 'freelancer' ? "/chat" : "/chat"}>
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 cursor-pointer transition-all">
                       <Mail size={18} />
                    </div>
                  </Link>
               </div>
               
               <Link to={user?.role === 'freelancer' ? "/dashboard/provider/settings" : "/profile"}>
                 <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-indigo-600/30 p-0.5 shadow-xl shadow-black/5 cursor-pointer overflow-hidden transition-transform hover:scale-105 active:scale-95">
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=111111&color=fff`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                 </div>
               </Link>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto overflow-x-hidden relative no-scrollbar">
             <div className="p-3 sm:p-6 lg:p-10 h-full">
                <Outlet context={{ user }} />
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
