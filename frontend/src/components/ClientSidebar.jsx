import React from 'react';
import { 
  LayoutDashboard, 
  PlusSquare, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Search
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClientSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard/client' },
    { name: 'Post a Job', icon: PlusSquare, path: '/dashboard/client/post-job' },
    { name: 'My Posted Jobs', icon: Briefcase, path: '/dashboard/client/my-jobs' },
    { name: 'Find Freelancers', icon: Search, path: '/services' },
    { name: 'Messages', icon: MessageSquare, path: '/chat' },
    { name: 'Settings', icon: Settings, path: '/profile/edit' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-[#0f172a] text-slate-300 transition-all duration-500 z-50 border-r border-slate-800/50 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Logo Area */}
      <div className="h-24 flex items-center px-6 border-b border-slate-800/50">
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0">
          <span className="font-black text-xl">M</span>
        </div>
        {!collapsed && (
          <span className="ml-4 text-xl font-black text-white tracking-tight animate-in fade-in slide-in-from-left-2 transition-all">
            Micro<span className="text-indigo-400">Client</span>
          </span>
        )}
      </div>

      {/* Navigation menu */}
      <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon size={22} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
              {!collapsed && (
                <span className="font-bold text-sm tracking-wide whitespace-nowrap overflow-hidden">
                  {item.name}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
              {collapsed && (
                <div className="absolute left-16 px-3 py-2 bg-slate-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0 z-50 shadow-2xl border border-slate-700 font-bold">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Footer */}
      <div className="p-4 mt-auto border-t border-slate-800/50 space-y-4">
        <div className={`flex items-center gap-4 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/30 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0 font-black">
            {user?.name?.charAt(0) || 'C'}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-black text-white truncate">{user?.name || 'Customer'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Client</p>
            </div>
          )}
        </div>

        <button 
          onClick={logout}
          className={`flex items-center gap-x-4 w-full px-4 py-3.5 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition-all group relative ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          {!collapsed && <span className="font-bold text-sm tracking-wide">Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center border-4 border-[#0f172a] hover:scale-110 transition-all shadow-xl z-50"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default ClientSidebar;
