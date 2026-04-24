import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaLock, 
  FaArrowRight, 
  FaShieldAlt, 
  FaFingerprint,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa';

import { Button }   from '../components/ui/Button';
import { Input }    from '../components/ui/Input';
import { Label }    from '../components/ui/label';

const Login = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'freelancer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError('Complete all fields');
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (result.user.role === 'freelancer') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
      else setError(result.message);
    } catch {
      setError('System failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Background HUD Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E')]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none opacity-40" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
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
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Secure Link</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 space-y-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 group overflow-hidden shadow-lg shadow-indigo-500/20">
               <FaFingerprint size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
              Log<span className="text-indigo-500">In</span>
            </h1>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">
              Authorized Personnel Only
            </p>
          </div>

          {/* Error Message */}
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
            
            {/* Protocol ID */}
            <div className="space-y-2">
              <Label className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] ml-1">Protocol ID</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors">
                  <FaEnvelope size={12} />
                </div>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="EMAIL"
                  className="h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white placeholder:text-slate-800 focus-visible:ring-1 focus-visible:ring-indigo-500/30 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Access Key */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">Key</Label>
                <Link to="#" className="text-[8px] font-black text-white/20 hover:text-indigo-500 uppercase tracking-widest transition-colors">Recover</Link>
              </div>
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

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-white hover:bg-indigo-600 text-black hover:text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-full transition-all duration-500 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? 'AUTHORIZING...' : 'AUTHORIZE ACCESS'}
            </Button>
          </form>

          {/* Footer Meta */}
          <div className="mt-10 text-center space-y-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              New identity?{' '}
              <Link to="/register" className="text-white hover:text-indigo-400 font-black transition-colors ml-1 uppercase">
                Register
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

export default Login;
