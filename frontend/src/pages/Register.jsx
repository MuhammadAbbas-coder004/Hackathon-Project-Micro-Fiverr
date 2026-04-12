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

// shadcn/ui
import { Button }   from '@/components/ui/Button';
import { Input }    from '@/components/ui/Input';
import { Label }    from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';

/* ── Success screen ── */
const SuccessScreen = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden font-sans">
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900/40 backdrop-blur-3xl p-10 rounded-[40px] border-b border-white/10 text-center max-w-sm w-full relative z-10"
    >
      <div className="w-20 h-20 bg-emerald-500 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
        <FaCheckCircle size={32} className="text-black" />
      </div>
      <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Account<br /><span className="text-emerald-500">Secured</span></h2>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] leading-relaxed">
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-black">
      
      {/* Background HUD Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-zinc-900/40 backdrop-blur-3xl p-6 rounded-[40px] border-b border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
          
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-orange-500 transition-colors group">
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Portal
            </Link>
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
               <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Live Registration</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 space-y-3">
            <div className="w-12 h-12 bg-orange-500 rounded-[18px] flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-4 relative group overflow-hidden">
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <FaUserPlus size={20} className="text-black relative z-10" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
              Establish<br /><span className="text-orange-500">Identity</span>
            </h1>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
              Join the elite network
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
                <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-xl flex items-center gap-2.5">
                  <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest leading-tight">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Primary Field */}
            <div className="space-y-1.5">
              <Label className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] ml-1.5">Display Name</Label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors">
                  <FaUser size={12} />
                </div>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. ALPHA_USER"
                  className="h-14 pl-16 bg-white/5 border-none rounded-2xl text-white font-bold placeholder:text-white/10 focus-visible:ring-1 focus-visible:ring-orange-500/30 transition-all font-mono shadow-inner"
                  required
                />
              </div>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] ml-1.5">Email Address</Label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors">
                    <FaEnvelope size={11} />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="mail@nexus.com"
                    className="h-12 pl-14 bg-white/5 border-none rounded-xl text-white font-bold placeholder:text-white/10 focus-visible:ring-1 focus-visible:ring-orange-500/30 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] ml-1.5">Current Region</Label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors">
                    <FaMapMarkerAlt size={11} />
                  </div>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="KARACHI_PK"
                    className="h-12 pl-14 bg-white/5 border-none rounded-xl text-white font-bold placeholder:text-white/10 focus-visible:ring-1 focus-visible:ring-orange-500/30 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] ml-1.5">Access Key</Label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors">
                    <FaLock size={12} />
                  </div>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-14 pl-16 bg-white/5 border-none rounded-2xl text-white font-bold placeholder:text-white/10 focus-visible:ring-1 focus-visible:ring-orange-500/30 transition-all font-mono shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] ml-1.5 text-center block mb-3">Identify Your Direction</Label>
                <div className="flex bg-white/5 p-1.5 rounded-[20px] relative overflow-hidden h-14">
                  {['client', 'freelancer'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRole(role)}
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-2xl transition-all duration-500 uppercase font-black text-[9px] tracking-widest ${
                        formData.role === role ? 'text-black' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {role === 'client' ? <FaBriefcase size={12} /> : <FaGraduationCap size={12} />}
                      {role === 'client' ? 'Client' : 'Freelancer'}
                      
                      {formData.role === role && (
                        <motion.div
                          layoutId="role-pill"
                          className="absolute inset-0 bg-orange-500 rounded-2xl -z-10 shadow-2xl shadow-orange-500/20"
                          initial={false}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Authorize Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-white hover:bg-orange-500 text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-[18px] transition-all duration-500 shadow-xl hover:shadow-orange-500/10 active:scale-95 disabled:opacity-50 mt-2 group"
            >
              <span className="flex items-center gap-3">
                {loading ? 'INITIALIZING...' : 'ESTABLISH'}
                <FaArrowRight className="group-hover:translate-x-0.5 transition-transform" size={10} />
              </span>
            </Button>
          </form>

          {/* Footer Metadata */}
          <div className="mt-8 text-center space-y-6">
            <div className="relative flex justify-center uppercase">
              <span className="text-[7px] font-black text-white/20 tracking-[0.6em]">System Verification</span>
            </div>

            <p className="text-[10px] font-bold text-white/40">
              Verified?{' '}
              <Link to="/login" className="text-white hover:text-orange-500 font-black uppercase tracking-widest transition-colors ml-1">
                Access
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 text-white/10 uppercase font-black text-[6px] tracking-[0.4em]">
              <div className="flex items-center gap-1.5">
                <FaShieldAlt /> Secured
              </div>
              <div className="flex items-center gap-1.5">
                <FaCheckCircle /> Verified
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;