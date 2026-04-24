import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { 
  User, 
  MapPin, 
  Image as ImageIcon, 
  Save, 
  ShieldCheck, 
  Camera,
  CheckCircle2,
  Phone,
  BookOpen,
  Wrench,
  X,
  Activity,
  Globe,
  Star,
  BadgeCheck,
  Briefcase,
  ChevronRight,
  Zap,
  Award,
  Sparkles,
  Heart,
  Navigation,
  Shield,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Database
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    coverImage: user?.coverImage || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    skills: user?.skills || [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    visible: true,
    comms: true,
    shield: false,
  });

  const toggleSetting = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        avatar: user.avatar || '',
        coverImage: user.coverImage || '',
        bio: user.bio || '',
        phone: user.phone || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleAvatarUpload = () => {
    window.cloudinary.createUploadWidget(
      { cloudName: 'dfu6dxt8o', uploadPreset: 'user-img' },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, avatar: result.info.secure_url }));
        }
      }
    ).open();
  };

  const handleCoverUpload = () => {
    window.cloudinary.createUploadWidget(
      { cloudName: 'dfu6dxt8o', uploadPreset: 'user-img' },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, coverImage: result.info.secure_url }));
        }
      }
    ).open();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', formData);
      updateUser(res.data?.user || formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-32 relative select-none">
      
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="px-8 py-5 bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-[32px] sm:rounded-full ring-1 ring-white/5 flex items-center gap-6 shadow-2xl"
         >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
               <SettingsIcon size={24} />
            </div>
            <div>
               <div className="flex items-center gap-2 text-indigo-500 mb-1">
                  <Sparkles size={12} className="animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node Config</span>
               </div>
               <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Identity <span className="text-indigo-500">Settings</span></h1>
            </div>
         </motion.div>
      </div>

      {/* ── Hero Section (Mirroring Profile) ── */}
      <div className="relative group/hero">
         <div 
           onClick={handleCoverUpload}
           className="h-48 sm:h-64 md:h-72 w-full rounded-[32px] sm:rounded-[56px] overflow-hidden bg-[#0c0f16] border-2 border-white/5 shadow-2xl cursor-pointer relative ring-1 ring-white/5"
         >
            {formData.coverImage ? (
              <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover/hero:scale-105" />
            ) : (
              <div className="w-full h-full bg-indigo-500/5 flex flex-col items-center justify-center text-indigo-500/10">
                 <Database size={48} strokeWidth={1} />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4">Static Data Header</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
               <div className="px-6 py-3 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Camera size={16} /> Update Matrix
               </div>
            </div>
         </div>

         <div className="absolute -bottom-10 left-8 sm:left-16 flex items-end gap-6">
            <div className="relative group/avatar" onClick={handleAvatarUpload}>
               <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#0c0f16] rounded-full p-2 shadow-2xl cursor-pointer border-2 border-white/10 overflow-hidden ring-1 ring-white/10 backdrop-blur-2xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-indigo-500/10 border border-white/5">
                     {formData.avatar ? (
                       <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-3xl font-black uppercase">
                         {formData.name.charAt(0) || 'U'}
                       </div>
                     )}
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full border-4 border-[#0c0f16] shadow-xl flex items-center justify-center text-white">
                  <BadgeCheck size={16} />
               </div>
            </div>
         </div>
      </div>

      {/* ── Bento Content ── */}
      <div className="pt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         <div className="lg:col-span-8 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
               <div className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 rounded-[40px] sm:rounded-[56px] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                  <div className="space-y-10">
                     <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                           <User size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Core identity</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 block">Display Name</label>
                           <input 
                             type="text" name="name" value={formData.name} onChange={handleChange}
                             className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-base font-bold outline-none focus:border-indigo-500/40 ring-1 ring-white/5 transition-all"
                             placeholder="Robert Fox"
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 block">Temporal Location</label>
                           <input 
                             type="text" name="location" value={formData.location} onChange={handleChange}
                             className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-base font-bold outline-none focus:border-indigo-500/40 ring-1 ring-white/5 transition-all"
                             placeholder="San Francisco, CA"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-2 block">Professional Manifesto</label>
                        <textarea 
                          name="bio" value={formData.bio} onChange={handleChange} rows={5}
                          className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 text-white text-base font-bold outline-none focus:border-indigo-500/40 ring-1 ring-white/5 transition-all resize-none leading-relaxed"
                          placeholder="Initialize identity background..."
                        />
                     </div>
                  </div>
               </div>

               <div className="flex gap-6">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit" disabled={loading}
                    className="flex-1 py-6 bg-indigo-600 text-white font-black text-[14px] uppercase tracking-[0.4em] rounded-[32px] flex items-center justify-center gap-4 shadow-2xl hover:bg-indigo-500 transition-all disabled:opacity-50"
                  >
                    {loading ? <Activity className="animate-spin" /> : <><Save size={20} /> Sync Node</>}
                  </motion.button>
               </div>
            </form>
         </div>

         <div className="lg:col-span-4 space-y-10">
            <div className="bg-[#0c0f16]/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] sm:rounded-[56px] shadow-2xl space-y-10 ring-1 ring-white/5">
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] text-center">Privacy Control</h4>
               
               <div className="space-y-6">
                  {[
                    { key: 'visible', label: 'Visible in Matrix', icon: <Globe size={18}/> },
                    { key: 'comms', label: 'Comms Active', icon: <Bell size={18}/> },
                    { key: 'shield', label: 'Identity Shield', icon: <Shield size={18}/> }
                  ].map((item, i) => {
                    const isActive = privacySettings[item.key];
                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleSetting(item.key)}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl ring-1 ring-white/5 cursor-pointer hover:bg-white/10 transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className={cn("transition-colors", isActive ? "text-indigo-400" : "text-slate-500")}>{item.icon}</div>
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">{item.label}</span>
                         </div>
                         <div className={cn("w-11 h-6 rounded-full p-1 transition-all duration-500 relative", isActive ? "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]" : "bg-white/10")}>
                            <motion.div 
                              animate={{ x: isActive ? 20 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="w-4 h-4 bg-white rounded-full shadow-sm" 
                            />
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="bg-indigo-600/10 border-2 border-dashed border-indigo-500/20 p-10 rounded-[40px] sm:rounded-[56px] flex flex-col items-center justify-center text-center gap-6 group hover:border-indigo-500/40 transition-all cursor-pointer">
               <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Lock size={24} />
               </div>
               <div>
                  <h5 className="text-lg font-black text-white uppercase tracking-tighter">Security Protocol</h5>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Rotate Access Keys</p>
               </div>
            </div>
         </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 bg-emerald-600 text-white rounded-full font-black text-[12px] uppercase tracking-[0.4em] flex items-center gap-4 shadow-2xl border border-white/20"
          >
            <Sparkles size={20} className="animate-pulse" /> Node Synchronized
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
