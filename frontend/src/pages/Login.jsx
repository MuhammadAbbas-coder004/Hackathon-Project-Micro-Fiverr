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
  FaArrowLeft
} from 'react-icons/fa';

// shadcn/ui
import { Button }   from '@/components/ui/Button';
import { Input }    from '@/components/ui/Input';
import { Label }    from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    if (!formData.email || !formData.password) return setError('Please fill in all fields.');
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
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 pt-24 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-black">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-orange-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-zinc-900/40 backdrop-blur-3xl p-6 rounded-[40px] border-b border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
          
          {/* Back to Home */}
          <Link to="/" className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-orange-500 transition-colors mb-6 group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>

          {/* Header */}
          <div className="mb-6 space-y-3">
            <div className="w-12 h-12 bg-orange-500 rounded-[18px] flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-4 relative group overflow-hidden">
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <FaFingerprint size={20} className="text-black relative z-10" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
              Welcome<br /><span className="text-orange-500">Back</span>
            </h1>
            <p className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em]">
              Access your portal
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-orange-500/10 p-2.5 rounded-lg flex items-center gap-2 border border-orange-500/20">
                  <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest leading-tight">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] ml-1">Email</Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors">
                  <FaEnvelope size={10} />
                </div>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@nexus.com"
                  className="h-12 pl-12 bg-white/5 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-orange-500/30 text-xs font-bold text-white placeholder:text-white/10 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <Label className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em]">Password</Label>
                <Link to="#" className="text-[7px] font-black text-white/40 hover:text-orange-500 uppercase tracking-widest transition-colors tracking-tighter">Recover</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors">
                  <FaLock size={10} />
                </div>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="h-12 pl-12 bg-white/5 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-orange-500/30 text-xs font-bold text-white placeholder:text-white/10 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-white hover:bg-orange-500 text-black font-black uppercase text-[9px] tracking-[0.4em] rounded-[18px] transition-all duration-500 shadow-xl hover:shadow-orange-500/10 active:scale-95 disabled:opacity-50 mt-2 group"
            >
              <span className="flex items-center gap-2">
                {loading ? 'WAITING...' : 'AUTHORIZE'}
                <FaArrowRight className="group-hover:translate-x-0.5 transition-transform" size={8} />
              </span>
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <div className="relative flex justify-center uppercase">
              <span className="text-[7px] font-black text-white/30 tracking-[0.6em]">Encrypted Network</span>
            </div>

            <p className="text-[9px] font-bold text-white/50">
              New identity?{' '}
              <Link to="/register" className="text-white hover:text-orange-500 font-black uppercase tracking-widest transition-colors ml-1">
                Register
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 text-white/20 pt-1">
              <FaShieldAlt size={7} />
              <span className="text-[6px] font-black uppercase tracking-[0.4em]">System Secured</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;