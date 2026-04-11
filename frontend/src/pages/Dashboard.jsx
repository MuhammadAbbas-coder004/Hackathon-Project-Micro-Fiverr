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

/* ─────────────────────────────────────────────
   Navbar
───────────────────────────────────────────── */
const Navbar = ({ user, onLogout }) => {
  const isFreelancer = user?.role === 'freelancer';
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const navLinks = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { label: 'Settings', icon: Settings, href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">

        {/* Left — Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-10">
              <nav className="flex flex-col gap-1">
                {navLinks.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
                <Separator className="my-2" />
                <button
                  onClick={onLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">
              FreelanceHub
            </span>
          </div>
        </div>

        {/* Center — Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </nav>

        {/* Right — Bell + User menu */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 h-10">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm leading-none">{user?.name}</p>
                  <p className="text-xs text-muted-foreground leading-none">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
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
    <div className="border-b bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {isFreelancer ? (
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground font-medium">
            {isFreelancer ? 'Provider Dashboard' : 'Customer Dashboard'}
          </span>
        </div>

        <Badge variant={isFreelancer ? 'default' : 'secondary'} className="text-xs">
          {isFreelancer ? 'Freelancer' : 'Customer'}
        </Badge>

        <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
          Welcome back, <strong>{user?.name?.split(' ')[0] || 'there'}</strong> 👋
        </span>
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