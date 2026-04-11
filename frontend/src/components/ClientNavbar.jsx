import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ClientNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Only show client links when logged in as client
  const isClient = user?.role === 'client';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/90 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm'
        : 'bg-white/70 backdrop-blur-md py-4 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300 font-bold text-lg">
            M
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Micro<span className="text-indigo-600">Fiverr</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Public links - always visible */}
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            Browse Services
          </Link>

          {/* Freelancer-only links */}
          {isAuthenticated && user?.role === 'freelancer' && (
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition-colors ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Dashboard
            </Link>
          )}

          {/* Client-only links */}
          {isAuthenticated && isClient && (
            <>
              <Link
                to="/chat"
                className={`text-sm font-semibold transition-colors ${location.pathname === '/chat' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                Messages
              </Link>
              <Link
                to="/#live-location"
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Live Location
              </Link>
            </>
          )}

          {/* Login/Register links (when not logged in) */}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons / Profile */}
        <div className="hidden lg:flex items-center gap-4">
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              {/* User badge */}
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user?.name}</p>
                <span className="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
              {/* Avatar */}
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm border-2 border-white shadow-sm overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Log out"
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-2xl py-6 px-5 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          <Link to="/" className="text-base font-bold text-slate-900 py-2.5 border-b border-slate-50">
            Browse Services
          </Link>

          {isAuthenticated && user?.role === 'freelancer' && (
            <Link to="/dashboard" className="text-base font-bold text-slate-900 py-2.5 border-b border-slate-50">
              Dashboard
            </Link>
          )}

          {isAuthenticated && isClient && (
            <>
              <Link to="/chat" className="text-base font-bold text-slate-900 py-2.5 border-b border-slate-50">
                Messages
              </Link>
              <Link to="/#live-location" className="text-base font-bold text-slate-900 py-2.5 border-b border-slate-50">
                Live Location
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" className="w-full py-3.5 text-center font-bold text-slate-900 bg-slate-100 rounded-2xl">
                Log In
              </Link>
              <Link to="/register" className="w-full py-3.5 text-center font-bold text-white bg-indigo-600 rounded-2xl">
                Get Started Free
              </Link>
            </div>
          ) : (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">{user?.role}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3.5 text-center font-bold text-red-600 bg-red-50 rounded-2xl"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default ClientNavbar;
