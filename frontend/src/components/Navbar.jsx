import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetTrigger, SheetClose,
} from '@/components/ui/sheet';
import {
  Sparkles, Menu, LogOut, MessageSquare, LayoutDashboard,
  Home, ShoppingBag, Radio, ChevronDown, User,
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
    <Link to={isFreelancer ? "/dashboard/provider" : "/"} className="flex items-center gap-3 group">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 scale-110 transition-all duration-300" />
        <Sparkles className="relative h-4 w-4 text-white group-hover:rotate-12 transition-transform duration-300" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-base font-black tracking-tight italic bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Micro Fiverr.
        </span>
        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.25em]">Elite Marketplace</span>
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
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-indigo-100/60 shadow-[0_2px_20px_rgba(99,102,241,0.08)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">

        {/* ══ LEFT: Logo ══ */}
        <Logo />

        {/* ══ CENTER: Nav Links ══ */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {user?.role !== 'freelancer' && navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 group',
                location.pathname === href
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/70'
              )}
            >
              <Icon className={cn(
                'h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110',
                location.pathname === href ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-400'
              )} />
              {label}
              {location.pathname === href && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </Link>
          ))}
        </div>

        {/* ══ RIGHT: Buttons + user stuff ══ */}
        <div className="hidden md:flex items-center gap-2">

          {/* Guest State: Login / Sign Up */}
          {!isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-9 px-5 rounded-xl font-bold text-[11px] uppercase tracking-widest
                           text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700
                           border border-indigo-200 hover:border-indigo-300 transition-all duration-200"
              >
                <Link to="/login">Login</Link>
              </Button>

              <Button
                size="sm"
                asChild
                className="h-9 px-5 rounded-xl font-bold text-[11px] uppercase tracking-widest
                           bg-gradient-to-r from-indigo-600 to-violet-600
                           hover:from-indigo-500 hover:to-violet-500
                           text-white shadow-md shadow-indigo-200
                           hover:shadow-lg hover:shadow-indigo-300
                           transition-all duration-200 border-0"
              >
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            /* Logged In State */
            <>
              <div className="w-px h-6 bg-indigo-100 mx-1" />

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-xl h-9 w-9 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 relative"
              >
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-xl h-9 w-9 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <Link to="/dashboard"><LayoutDashboard className="h-4 w-4" /></Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-xl px-2 h-9
                               hover:bg-indigo-50 transition-all duration-200
                               border border-transparent hover:border-indigo-200"
                  >
                    <Avatar className="h-7 w-7 ring-2 ring-indigo-200 ring-offset-1">
                      <AvatarFallback className="text-[11px] font-black bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:flex flex-col justify-center">
                      <p className="text-xs font-black leading-none text-slate-800 truncate max-w-[100px]">{user?.name || 'User'}</p>
                      <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter mt-0.5">{user?.role || 'Member'}</p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 rounded-2xl shadow-2xl shadow-indigo-100/50 border border-indigo-100/60 bg-white/95 backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="font-normal px-3 py-3 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl mb-1">
                    <p className="font-black text-sm text-slate-900">{user?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="px-2 py-0 text-[10px] font-black uppercase bg-indigo-100 text-indigo-700 border-none">
                        {user?.role || 'Member'}
                      </Badge>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-indigo-50" />
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer text-slate-600 hover:text-indigo-600">
                    <Link to="/dashboard" className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <LayoutDashboard className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer text-slate-600 hover:text-indigo-600">
                    <Link to="/chat" className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer text-slate-600 hover:text-indigo-600">
                    <Link to="/profile" className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-red-50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl text-red-500 focus:bg-red-50 focus:text-red-600 font-bold cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center mr-3">
                      <LogOut className="h-3.5 w-3.5 text-red-400" />
                    </div>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* ══ MOBILE: Hamburger ══ */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0 flex flex-col bg-white/95 backdrop-blur-xl">
            <SheetHeader className="px-6 py-5 border-b border-indigo-100/60 bg-gradient-to-br from-indigo-50/50 to-violet-50/30">
              <SheetTitle asChild><Logo /></SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4 py-4">
              {user?.role !== 'freelancer' && navLinks.map(({ href, label, icon: Icon }) => (
                <SheetClose asChild key={href}>
                  <Link
                    to={href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                      location.pathname === href
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200'
                        : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />{label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <Separator className="bg-indigo-100/60" />

            <div className="px-4 py-4 mt-auto space-y-3">
              {!isAuthenticated && (
                <>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 rounded-xl font-bold border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                      asChild
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      className="w-full h-10 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-200 border-0 transition-all duration-200"
                      asChild
                    >
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </SheetClose>
                </>
              )}

              {isAuthenticated && (
                <>
                  <Separator className="bg-indigo-100/60" />
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100">
                    <Avatar className="h-10 w-10 ring-2 ring-indigo-200 ring-offset-1">
                      <AvatarFallback className="font-black bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate text-slate-800">{user?.name}</p>
                      <Badge className="text-[10px] capitalize bg-indigo-100 text-indigo-700 border-none">{user?.role}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-semibold border-indigo-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
                        asChild
                      >
                        <Link to="/dashboard"><LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />Dashboard</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-semibold border-indigo-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
                        asChild
                      >
                        <Link to="/chat"><MessageSquare className="mr-1.5 h-3.5 w-3.5" />Messages</Link>
                      </Button>
                    </SheetClose>
                  </div>
                  <SheetClose asChild>
                    <Button
                      className="w-full rounded-xl font-bold bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 hover:border-red-200 shadow-none transition-all duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />Sign Out
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </nav>
  );
};

export default Navbar;