import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaMapMarkerAlt, 
  FaUserPlus, 
  FaShieldAlt, 
  FaBriefcase, 
  FaGraduationCap,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa';

import { Button }   from '../components/ui/Button';
import { Input }    from '../components/ui/Input';
import { Label }    from '../components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../components/ui/select';

/* ── Success screen ── */
const SuccessScreen = () => (
  <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-6 relative overflow-hidden font-sans">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')]" />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900/40 backdrop-blur-3xl p-12 rounded-[40px] border border-white/10 text-center max-w-sm w-full relative z-10"
    >
      <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
        <FaCheckCircle size={32} className="text-white" />
      </div>
      <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4 leading-none">Account<br /><span className="text-emerald-500">Secured</span></h2>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-relaxed">
        Identity established. Accessing network protocols...
      </p>
    </motion.div>
  </div>
);

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'client', location: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRole = (val) => {
    setFormData(prev => ({ ...prev, role: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.location)
      return setError('Complete all fields');

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) { 
        setSuccess(true); 
        setTimeout(() => navigate('/login'), 2000); 
      }
      else setError(result.message);
    } catch { 
      setError('System failure'); 
    } finally { 
      setLoading(false); 
    }
  };

  if (success) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-start justify-center px-6 pt-24 pb-12 relative overflow-hidden font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Background HUD Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-indigo-600/5 rounded-full blur-[160px] pointer-events-none opacity-40" />
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-zinc-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 ring-1 ring-white/5 shadow-2xl">
          
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-indigo-400 transition-colors group">
              <FaArrowLeft size={10} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </Link>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Active Node</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 space-y-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 group overflow-hidden shadow-lg shadow-indigo-500/20">
               <FaUserPlus size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
              Sign<span className="text-indigo-500">Up</span>
            </h1>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">
              Initialize Elite Access
            </p>
          </div>

          {/* Error Feed */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl flex items-center gap-3 px-6">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Digital Alias */}
            <div className="space-y-2">
              <Label className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Alias</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors">
                  <FaUser size={12} />
                </div>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="USERNAME"
                  className="h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-800 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Email & Region Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Email</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors">
                    <FaEnvelope size={11} />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="EMAIL"
                    className="h-14 pl-11 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white placeholder:text-slate-800 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Region</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors">
                    <FaMapMarkerAlt size={11} />
                  </div>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="LOCATION"
                    className="h-14 pl-11 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold text-white placeholder:text-slate-800 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Key</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors">
                  <FaLock size={12} />
                </div>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="PASSWORD"
                  className="h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-800 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Role</Label>
              <div className="flex bg-white/5 p-1 rounded-2xl relative overflow-hidden h-12">
                {['client', 'freelancer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRole(role)}
                    className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-2xl transition-all duration-500 uppercase font-black text-[8px] tracking-widest ${
                      formData.role === role ? 'text-white' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {role === 'client' ? <FaBriefcase size={11} /> : <FaGraduationCap size={11} />}
                    {role === 'client' ? 'Client' : 'Freelancer'}
                    
                    {formData.role === role && (
                      <motion.div
                        layoutId="role-pill-mini"
                        className="absolute inset-0 bg-indigo-600 rounded-2xl -z-10 shadow-lg shadow-indigo-600/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-white hover:bg-indigo-600 text-black hover:text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-full transition-all duration-500 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? 'INITIALIZING...' : 'Create Account'}
            </Button>
          </form>

          {/* Footer Metadata */}
          <div className="mt-10 text-center space-y-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Member?{' '}
              <Link to="/login" className="text-white hover:text-indigo-400 font-black transition-colors ml-1 uppercase">
                Login
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 text-white/10 uppercase font-black text-[7px] tracking-[0.4em]">
              <div className="flex items-center gap-2">
                <FaShieldAlt /> Secured
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle /> Protocol V3
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
