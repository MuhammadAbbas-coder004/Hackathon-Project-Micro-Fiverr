import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Shadcn UI Components
import { Button } from './ui/Button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetTrigger, SheetClose,
} from './ui/sheet';

import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaLayerGroup,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaBolt,
  FaShieldAlt,
  FaSearch,
  FaBell,
  FaPlus,
  FaTachometerAlt
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/', icon: <FaHome size={14} /> },
    { title: 'Marketplace', path: '/services', icon: <FaLayerGroup size={14} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        scale: isScrolled ? 0.98 : 1,
        backgroundColor: isScrolled ? "rgba(11, 14, 20, 0.6)" : "rgba(11, 14, 20, 0.4)"
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] font-sans w-[95%] max-w-5xl py-3 px-6 backdrop-blur-2xl border border-white/10 rounded-full ring-1 ring-white/5 transition-all duration-500"
    >
      <div className="w-full">
        <div className="flex items-center justify-between px-2 sm:px-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group outline-none overflow-hidden whitespace-nowrap">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <FaBolt className="relative h-5 w-5 sm:h-7 sm:w-7 text-indigo-500 fill-indigo-500 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <span className="hidden sm:inline text-[20px] font-extrabold tracking-tight text-white uppercase leading-none">
              MICRO<span className="text-indigo-500 font-black">FIVERR</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1 sm:gap-2 bg-white/5 p-1 sm:p-1.5 rounded-full border border-white/5 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-3 py-2 sm:px-8 sm:py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2 sm:gap-3",
                  isActive(link.path)
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
                title={link.title}
              >
                {link.icon}
                <span className="hidden sm:inline">{link.title}</span>
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-2 sm:gap-5">
            {isAuthenticated ? (
              <>
                <button className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all">
                  <FaBell size={18} />
                </button>
                
                <Link to="/profile" className="flex items-center gap-2 sm:gap-3 rounded-full p-1 sm:p-1.5 sm:pr-4 bg-white/5 hover:bg-white/10 transition-all outline-none border border-white/10 ring-1 ring-white/5 group">
                  <div className="relative">
                    <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border border-indigo-500/30">
                      <AvatarFallback className="bg-indigo-600 text-white font-black text-[10px]">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-[#0b0e14] rounded-full" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{user?.name?.split(' ')[0]}</span>
                    <span className="text-[7px] font-bold text-indigo-400/70 uppercase tracking-widest mt-1">Active</span>
                  </div>
                </Link>

                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center justify-center gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] group outline-none"
                  title="Logout"
                >
                  <FaSignOutAlt size={14} className="group-hover:scale-110 sm:group-hover:-translate-x-1 transition-all" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/login" className="px-4 py-2 sm:px-8 sm:py-3 rounded-full text-[10px] sm:text-[11px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                  Login
                </Link>
                <Button asChild className="bg-white text-black hover:bg-indigo-600 hover:text-white rounded-full px-5 sm:px-10 h-9 sm:h-12 font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
