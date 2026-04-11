import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardList, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  PlusCircle,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const freelancerNavItems = [
    { name: 'Provider Dashboard', icon: LayoutDashboard, path: '/dashboard/provider' },
    { name: 'My Services', icon: Briefcase, path: '/dashboard/provider/services' },
    { name: 'Browse Jobs', icon: Search, path: '/jobs' },
    { name: 'My Applications', icon: ClipboardList, path: '/dashboard/provider/applications' },
    { name: 'Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const clientNavItems = [
    { name: 'Client Dashboard', icon: LayoutDashboard, path: '/dashboard/client' },
    { name: 'Post a New Job', icon: PlusCircle, path: '/dashboard/client/post-job' },
    { name: 'My Posted Jobs', icon: ClipboardList, path: '/dashboard/client/my-jobs' },
    { name: 'Browse Services', icon: Briefcase, path: '/services' },
    { name: 'Messages', icon: MessageSquare, path: '/chat' },
    { name: 'My Profile', icon: User, path: '/profile' },
  ];

  const navItems = user?.role === 'freelancer' ? freelancerNavItems : clientNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800/50 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Briefcase size={22} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Micro Fiverr</span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]' 
                    : 'hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold capitalize">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden text-ellipsis">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Provider'}</p>
              <p className="text-[11px] text-slate-400 capitalize">{user?.role || 'Freelancer'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-700/50 hover:bg-red-500/10 hover:text-red-400 text-xs font-medium transition-colors duration-200"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
