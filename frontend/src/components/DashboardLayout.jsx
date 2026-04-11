import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

// shadcn/ui
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// Icons
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  MessageSquare,
  Star,
  Wallet,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronRight,
  User,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

/* ─────────────────────────────────────────
   Nav config per role
───────────────────────────────────────── */
const freelancerNav = [
  { label: 'Overview',    icon: LayoutDashboard, href: '/dashboard/provider' },
  { label: 'My Services', icon: Briefcase,        href: '/dashboard/provider/services' },
  { label: 'Orders',      icon: ShoppingBag,      href: '/dashboard/provider/orders' },
  { label: 'Messages',    icon: MessageSquare,    href: '/dashboard/provider/messages',  badge: 3 },
  { label: 'Reviews',     icon: Star,             href: '/dashboard/provider/reviews' },
  { label: 'Earnings',    icon: Wallet,           href: '/dashboard/provider/earnings' },
];

const customerNav = [
  { label: 'Overview',   icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Browse',     icon: ShoppingBag,     href: '/dashboard/browse' },
  { label: 'My Orders',  icon: Briefcase,       href: '/dashboard/orders' },
  { label: 'Messages',   icon: MessageSquare,   href: '/dashboard/messages', badge: 1 },
  { label: 'Favourites', icon: Star,            href: '/dashboard/favourites' },
  { label: 'Wallet',     icon: Wallet,          href: '/dashboard/wallet' },
];

const bottomNav = [
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { label: 'Help',     icon: HelpCircle, href: '/dashboard/help' },
];

/* ─────────────────────────────────────────
   Single nav item
───────────────────────────────────────── */
const NavItem = ({ item, collapsed }) => {
  const Icon = item.icon;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
               ${isActive
                 ? 'bg-primary text-primary-foreground shadow-sm'
                 : 'text-muted-foreground hover:text-foreground hover:bg-accent'
               }
               ${collapsed ? 'justify-center px-2' : ''}
              `
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge className="h-5 min-w-5 px-1.5 text-[10px] leading-none">
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
            {item.badge && <Badge className="h-4 px-1 text-[10px]">{item.badge}</Badge>}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

/* ─────────────────────────────────────────
   Sidebar content (shared between desktop & Sheet)
───────────────────────────────────────── */
const SidebarContent = ({ user, navItems, collapsed, onLogout }) => {
  const isFreelancer = user?.role === 'freelancer';
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Briefcase className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-base tracking-tight">FreelanceHub</span>
        )}
      </div>

      <Separator />

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <Badge
            variant={isFreelancer ? 'default' : 'secondary'}
            className="text-[11px] font-medium"
          >
            {isFreelancer ? 'Freelancer' : 'Customer'}
          </Badge>
        </div>
      )}

      {/* Main nav */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="flex flex-col gap-0.5">
          {navItems.map(item => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom nav */}
      <div className="px-2 pb-2">
        <Separator className="mb-2" />
        <nav className="flex flex-col gap-0.5">
          {bottomNav.map(item => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      <Separator />

      {/* User profile */}
      <div className={`p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center gap-3 w-full rounded-lg p-2 hover:bg-accent transition-colors text-left
                          ${collapsed ? 'justify-center' : ''}`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground leading-tight truncate">{user?.email}</p>
                </div>
              )}
              {!collapsed && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
};

/* ─────────────────────────────────────────
   Top bar (mobile + notification bell)
───────────────────────────────────────── */
const TopBar = ({ user, navItems, onLogout, notifications }) => (
  <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4 gap-3 sticky top-0 z-40">

    {/* Mobile sidebar sheet */}
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <SidebarContent user={user} navItems={navItems} collapsed={false} onLogout={onLogout} />
      </SheetContent>
    </Sheet>

    {/* Page breadcrumb / title — slot for Outlet to fill if desired */}
    <div className="flex-1" />

    {/* Bell */}
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {notifications > 0 && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
      )}
    </Button>

    {/* Avatar shortcut on mobile */}
    <Avatar className="h-8 w-8 md:hidden">
      <AvatarImage src={user?.avatar} />
      <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
      </AvatarFallback>
    </Avatar>

  </header>
);

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

  const navItems = user?.role === 'freelancer' ? freelancerNav : customerNav;
  const sidebarW = collapsed ? 'w-[60px]' : 'w-60';

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`
          hidden md:flex flex-col fixed inset-y-0 left-0 z-30
          border-r bg-background
          transition-all duration-200 ease-in-out
          ${sidebarW}
        `}
      >
        <SidebarContent
          user={user}
          navItems={navItems}
          collapsed={collapsed}
          onLogout={handleLogout}
        />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed
            ? <PanelLeftOpen  className="h-3 w-3" />
            : <PanelLeftClose className="h-3 w-3" />
          }
        </button>
      </aside>

      {/* ── Main area ── */}
      <div
        className={`
          flex flex-col flex-1 min-h-screen
          transition-all duration-200 ease-in-out
          ${collapsed ? 'md:ml-[60px]' : 'md:ml-60'}
        `}
      >
        {/* Top bar — visible on all sizes for bell/mobile menu */}
        <TopBar
          user={user}
          navItems={navItems}
          onLogout={handleLogout}
          notifications={4}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6 pb-20">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;