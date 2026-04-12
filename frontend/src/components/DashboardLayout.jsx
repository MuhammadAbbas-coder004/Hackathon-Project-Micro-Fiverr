import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// ── react-icons replace lucide ──
import {
  MdDashboard,
  MdWork,
  MdShoppingBag,
  MdChat,
  MdStar,
  MdAccountBalanceWallet,
  MdSettings,
  MdLogout,
  MdNotifications,
  MdMenu,
  MdChevronRight,
  MdPerson,
  MdHelpOutline,
  MdKeyboardArrowLeft,
  MdSearch,
  MdFormatListBulleted,
  MdAccessTime,
  MdAddCircleOutline,
  MdTrendingUp,
} from 'react-icons/md';
import { Zap, PanelLeft, PanelLeftClose } from 'lucide-react';
import { motion } from 'framer-motion';

const navGroups = {
  freelancer: [
    { 
      label: 'Main', 
      items: [
        { label: 'Overview',    Icon: MdDashboard,            href: '/dashboard/provider' },
        { label: 'My Services', Icon: MdStar,                 href: '/dashboard/provider/services', badge: '3' },
        { label: 'Applications', Icon: MdFormatListBulleted,  href: '/dashboard/provider/applications', badge: '5' },
        { label: 'Active Jobs',  Icon: MdAccessTime,          href: '/dashboard/provider/active', badge: '2' },
      ]
    },
    {
      label: 'Work',
      items: [
        { label: 'Post a Job',      Icon: MdAddCircleOutline,   href: '/dashboard/provider/services/create' },
        { label: 'My Posted Jobs',  Icon: MdWork,               href: '/dashboard/provider/jobs' },
        { label: 'Chat',            Icon: MdChat,               href: '/dashboard/provider/messages', badge: '3', badgeRed: true },
      ]
    },
    {
      label: 'Account',
      items: [
        { label: 'Reviews',         Icon: MdStar,               href: '/dashboard/provider/reviews' },
        { label: 'Notifications',   Icon: MdNotifications,      href: '/dashboard/provider/notifications' },
        { label: 'Settings',        Icon: MdSettings,           href: '/dashboard/provider/settings' },
      ]
    }
  ],
  customer: [
    { 
      label: 'Main', 
      items: [
        { label: 'Overview',   Icon: MdDashboard,            href: '/dashboard' },
        { label: 'Browse',     Icon: MdShoppingBag,          href: '/dashboard/browse' },
        { label: 'My Orders',  Icon: MdWork,                 href: '/dashboard/orders' },
      ]
    },
    {
      label: 'Account',
      items: [
        { label: 'Messages',   Icon: MdChat,                 href: '/dashboard/messages', badge: 1 },
        { label: 'Favourites', Icon: MdStar,                 href: '/dashboard/favourites' },
        { label: 'Wallet',     Icon: MdAccountBalanceWallet, href: '/dashboard/wallet' },
      ]
    }
  ]
};

/* ─────────────────────────────────────────
   Single nav item
───────────────────────────────────────── */
const NavItem = ({ item, collapsed }) => {
  const { Icon } = item;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={item.href}
            end={item.href === '/dashboard' || item.href === '/dashboard/provider'}
            className={({ isActive }) =>
              `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-1
               ${isActive
                 ? 'bg-[#f97316]/20 text-[#f97316]'
                 : 'text-white/60 hover:text-white hover:bg-white/5'
               }
               ${collapsed ? 'justify-center px-2' : ''}
              `
            }
          >
            <Icon size={17} className={`shrink-0 ${item.badgeRed ? 'text-red-500' : ''}`} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate leading-none">{item.label}</span>
                {item.badge && (
                  <Badge className={`h-4 min-w-4 px-1.5 text-[9px] leading-none border-none
                    ${item.badgeRed ? 'bg-red-500/20 text-red-500' : 'bg-[#f97316]/20 text-[#f97316]'}`}>
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {item.badge && (
              <Badge className="h-4 px-1 text-[10px] bg-orange-500 hover:bg-orange-500">
                {item.badge}
              </Badge>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

/* ─────────────────────────────────────────
   Sidebar content
───────────────────────────────────────── */
const SidebarContent = ({ user, navItems, collapsed, onLogout, onToggle }) => {
  const isFreelancer = user?.role === 'freelancer';
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="flex flex-col h-full">

      {/* Official Website Logo Section */}
      <div className={`p-6 pb-2 flex items-center justify-between gap-3 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <motion.div 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-orange-500 rounded-lg blur-[2px] opacity-20" 
            />
            <Zap className="relative h-6 w-6 text-orange-500 fill-orange-500/20" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-black tracking-tighter text-white uppercase">
                Micro<span className="text-[#f97316]">Fiverr</span>
              </span>
              <span className="text-[6px] font-bold text-white/20 uppercase tracking-[0.2em] mt-0.5">Nexus_Network</span>
            </div>
          )}
        </div>

        {/* Sidebar Internal Toggle */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            title="Close sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      {/* User Status Section */}
      <div className={`px-6 py-4 flex items-center gap-4 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="relative shrink-0">
          <div className="absolute -inset-1 blur-sm bg-gradient-to-r from-[#f97316] to-orange-400 opacity-20" />
          <Avatar className="h-[38px] w-[38px] rounded-xl relative ring-1 ring-white/10">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-[12px] bg-white/5 text-white font-bold uppercase">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-white leading-tight truncate">{user?.name || 'User'}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
              <p className="text-[10px] text-white/50 font-bold tracking-widest uppercase">Elite Node</p>
            </div>
          </div>
        )}
      </div>

      {/* Main nav groups */}
      <ScrollArea className="flex-1 px-2.5 py-4">
        {navGroups[user.role].map(group => (
          <div key={group.label} className="mb-6">
            {!collapsed && (
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.12em] px-3 mb-2">
                {group.label}
              </p>
            )}
            <nav className="flex flex-col gap-0.5">
              {group.items.map(item => (
                <NavItem key={item.href} item={item} collapsed={collapsed} />
              ))}
            </nav>
          </div>
        ))}
      </ScrollArea>

      {/* Attractive Logout area */}
      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          className={`group flex items-center gap-3 w-full rounded-2xl p-3.5 text-white/30 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300
                      ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
            <MdLogout size={18} className="shrink-0" />
          </div>
          {!collapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em]">Logout</span>}
        </button>
      </div>

    </div>
  );
};

/* ─────────────────────────────────────────
   Top bar
───────────────────────────────────────── */
const TopBar = ({ user, navItems, onLogout, notifications, collapsed, setCollapsed }) => {
  const isFreelancer = user?.role === 'freelancer';
  const displayTitle = location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview';

  return (
    <header className="h-[64px] bg-[#0a0a0a] flex items-center px-6 gap-6 sticky top-0 z-40 border-b border-white/5">

      <div className="flex items-center gap-4">
        {/* ChatGPT Style Sidebar Toggle (Visible when collapsed) */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden md:flex p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            title="Expand sidebar"
          >
            <PanelLeft size={20} />
          </button>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:bg-white/5">
              <MdMenu size={22} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[220px] p-0 bg-[#1a1a2e] border-none">
            <SidebarContent user={user} navItems={navItems} collapsed={false} onLogout={onLogout} onToggle={() => {}} />
          </SheetContent>
        </Sheet>
      </div>

      <h1 className="text-[15px] font-bold text-white capitalize leading-none pt-0.5 tracking-tight">
        {displayTitle}
      </h1>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Topbar Actions */}
        <div className="flex items-center justify-center w-[32px] h-[32px] bg-white/5 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
          <MdSearch size={17} className="text-slate-400" />
        </div>

        <div className="relative flex items-center justify-center w-[32px] h-[32px] bg-white/5 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
          <MdNotifications size={17} className="text-slate-400" />
          <span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-[#ef4444] rounded-full border-[1.5px] border-[#0a0a0a]" />
        </div>

        <div className="w-[32px] h-[32px] bg-[#f97316] rounded-full flex items-center justify-center text-[11px] font-bold text-white uppercase cursor-pointer hover:scale-105 transition-transform">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>

    </header>
  );
};

/* ─────────────────────────────────────────
   Main layout
───────────────────────────────────────── */
const DashboardLayout = () => {
  const [user, setUser]           = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const navigate                  = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) setUser(JSON.parse(data));
    else navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = user?.role === 'freelancer' ? [] : []; // We use navGroups now
  const sidebarW = collapsed ? 'w-[68px]' : 'w-[220px]';

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] font-sans text-slate-300">

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col flex-shrink-0 z-30 bg-[#0a0a0a] border-r border-white/5 transition-all duration-300 ease-in-out ${sidebarW}`}
      >
        <SidebarContent
          user={user}
          navItems={navItems}
          collapsed={collapsed}
          onLogout={handleLogout}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
        <TopBar
          user={user}
          navItems={navItems}
          onLogout={handleLogout}
          notifications={4}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6 pb-24">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;