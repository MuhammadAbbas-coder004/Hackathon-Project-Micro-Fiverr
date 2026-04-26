import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '@/utils/api';
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
  Navigation
} from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const EditProfile = () => {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    coverImage: user?.coverImage || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAvatarUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      { cloudName: 'dfu6dxt8o', uploadPreset: 'user-img' },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, avatar: result.info.secure_url }));
        }
      }
    );
    myWidget.open();
  };

  const handleCoverUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      { cloudName: 'dfu6dxt8o', uploadPreset: 'user-img' },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, coverImage: result.info.secure_url }));
        }
      }
    );
    myWidget.open();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
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
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans pb-32 relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      
      {/* ── Background Assets (Optimized) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#4f46e515,transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 space-y-8 sm:space-y-12 relative z-10">
        
        {/* ── Header (Smooth) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="px-6 py-4 sm:px-10 sm:py-6 bg-[#0c0f16]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] sm:rounded-full ring-1 ring-white/5 flex items-center gap-4 sm:gap-8 shadow-2xl"
           >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 shrink-0">
                 <User size={24} className="sm:size-32" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                 <div className="flex items-center gap-2 text-indigo-500">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Identity Node</span>
                 </div>
                 <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">Profile <span className="text-indigo-500">Studio</span></h1>
              </div>
           </motion.div>

           <Link to="/dashboard" className="px-8 py-4 bg-[#0c0f16]/80 backdrop-blur-xl border border-white/10 rounded-full text-[11px] font-black text-white uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-3 w-fit shadow-xl ring-1 ring-white/5 group">
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /> Dashboard
           </Link>
        </div>

        {/* ── Hero Section ── */}
        <div className="relative group/hero">
           {/* Cover Photo */}
           <div 
             onClick={handleCoverUpload}
             className="h-48 sm:h-64 md:h-80 w-full rounded-[32px] sm:rounded-[64px] overflow-hidden bg-[#0c0f16] border-2 border-white/5 shadow-2xl cursor-pointer relative ring-1 ring-white/5"
           >
              {formData.coverImage ? (
                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-1000 group-hover/hero:scale-105 opacity-80" />
              ) : (
                <div className="w-full h-full bg-indigo-500/5 flex flex-col items-center justify-center text-indigo-500/20">
                   <ImageIcon size={48} strokeWidth={1} />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-4">Upload Cover Node</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                 <div className="px-6 py-3 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                    <Camera size={16} /> Update Cover
                 </div>
              </div>
           </div>

           {/* Avatar Container */}
           <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-12 md:left-20 flex items-end gap-6 sm:gap-10">
              <div className="relative group/avatar" onClick={handleAvatarUpload}>
                 <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-[#0c0f16] rounded-full p-2 sm:p-3 shadow-2xl relative z-10 cursor-pointer border-2 border-white/10 overflow-hidden transition-all group-hover/avatar:scale-105 ring-1 ring-white/10 backdrop-blur-2xl">
                    <div className="w-full h-full rounded-full overflow-hidden relative bg-indigo-500/10 border border-white/5">
                       {formData.avatar ? (
                         <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-4xl sm:text-6xl font-black uppercase">
                           {formData.name.charAt(0) || 'U'}
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="absolute bottom-1 right-1 w-10 h-10 sm:w-14 sm:h-14 bg-indigo-600 rounded-full border-4 border-[#F9FBFF] shadow-xl flex items-center justify-center text-white z-20">
                    <BadgeCheck size={20} sm:size={28} />
                 </div>
              </div>
              
              <div className="pb-4 sm:pb-16 space-y-2 sm:space-y-4">
                 <div className="px-8 py-4 bg-[#0c0f16]/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-full ring-1 ring-white/5 shadow-2xl">
                    <h2 className="text-xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-none truncate max-w-[180px] sm:max-w-none">
                       {formData.name || 'Anonymous Node'}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                       <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">Elite Member</div>
                       <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{formData.location || 'Global Node'}</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ── Bento Form Grid ── */}
        <div className="pt-24 sm:pt-32 grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Form Section */}
           <div className="lg:col-span-8 space-y-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                 
                 <div className="bg-[#0c0f16] border border-white/10 p-8 sm:p-12 rounded-[40px] sm:rounded-[60px] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                    
                    <div className="relative space-y-12">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                             <User size={24} />
                          </div>
                          <div>
                             <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Core Identity</h3>
                             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Define your professional metadata</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4 group">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 block">Full Name / Alias</label>
                             <div className="relative">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500/40 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input 
                                  type="text" name="name" value={formData.name} onChange={handleChange}
                                  className="w-full h-16 bg-white/[0.03] border-2 border-white/5 rounded-2xl pl-16 pr-6 text-white text-lg font-bold outline-none focus:bg-white/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-800"
                                  placeholder="Robert Fox" required
                                />
                             </div>
                          </div>
                          <div className="space-y-4 group">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 block">Geographic Node</label>
                             <div className="relative">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500/40 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input 
                                  type="text" name="location" value={formData.location} onChange={handleChange}
                                  className="w-full h-16 bg-white/[0.03] border-2 border-white/5 rounded-2xl pl-16 pr-6 text-white text-lg font-bold outline-none focus:bg-white/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-800"
                                  placeholder="New York, USA"
                                />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4 group">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 block">Node Bio / Manifesto</label>
                          <div className="relative">
                             <BookOpen className="absolute left-6 top-6 text-indigo-500/40 group-focus-within:text-indigo-500 transition-colors" size={18} />
                             <textarea 
                               name="bio" value={formData.bio} onChange={handleChange} rows={5}
                               className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[32px] pl-16 pr-6 py-6 text-white text-lg font-bold outline-none focus:bg-white/5 focus:border-indigo-500/30 transition-all leading-relaxed resize-none placeholder:text-slate-800"
                               placeholder="Initialize your professional story..."
                             />
                          </div>
                       </div>

                       <div className="space-y-8">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 block">Skill Modules</label>
                          <div className="relative group/skill">
                             <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500/40" size={18} />
                             <input 
                               type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                               className="w-full h-16 bg-white/[0.03] border-2 border-white/5 rounded-2xl pl-16 pr-32 text-white text-lg font-bold outline-none focus:bg-white/5 focus:border-indigo-500/30 transition-all placeholder:text-slate-800"
                               placeholder="Add skill node..."
                             />
                             <button 
                               type="button" onClick={addSkill}
                               className="absolute right-2.5 top-2.5 bottom-2.5 px-6 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                             >
                               Inject
                             </button>
                          </div>
                          <div className="flex flex-wrap gap-4">
                             {formData.skills.map(s => (
                               <motion.span 
                                 key={s} 
                                 initial={{ scale: 0.9, opacity: 0 }}
                                 animate={{ scale: 1, opacity: 1 }}
                                 className="px-5 py-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border border-indigo-500/20 shadow-lg group/tag hover:border-indigo-500/50 transition-colors"
                               >
                                  {s} <X size={14} className="cursor-pointer hover:text-rose-500 transition-colors" onClick={() => removeSkill(s)} />
                               </motion.span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ y: -2 }}
                      type="submit" disabled={loading}
                      className="w-full py-6 bg-indigo-600 text-white font-black text-[16px] uppercase tracking-[0.4em] rounded-[32px] flex items-center justify-center gap-5 shadow-2xl transition-all hover:bg-[#0c0f16] group"
                    >
                      {loading ? <Activity className="animate-spin" /> : <><Save size={24} className="group-hover:scale-110 transition-transform" /> Sync Identity Node</>}
                    </motion.button>
                 </div>
              </form>
           </div>

           {/* Side Column */}
           <div className="lg:col-span-4 space-y-10">
              <div className="bg-indigo-600 rounded-[40px] sm:rounded-[56px] p-10 text-white shadow-2xl relative overflow-hidden group border-2 border-white/10">
                 <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <Award size={100} strokeWidth={1} />
                 </div>
                 <div className="relative z-10 space-y-8">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                       <Award size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Elite <br/>Status</h3>
                       <div className="px-4 py-1.5 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">Top 1% Global</div>
                    </div>
                    <p className="text-indigo-50/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Your professional node is fully verified and prioritized in searches.</p>
                 </div>
              </div>

              <div className="bg-[#0c0f16] border border-white/10 p-10 rounded-[40px] sm:rounded-[56px] shadow-2xl space-y-10 ring-1 ring-white/5">
                 <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Sync Progress</h4>
                    <span className="text-2xl font-black text-white">75%</span>
                 </div>
                 
                 <div className="space-y-8">
                    {[
                      { label: 'VISUAL_META', active: formData.avatar && formData.coverImage, icon: <ImageIcon size={16}/> },
                      { label: 'CORE_MANIFESTO', active: formData.bio && formData.skills.length > 0, icon: <BookOpen size={16}/> },
                      { label: 'IDENTITY_TAG', active: formData.phone, icon: <ShieldCheck size={16}/> }
                    ].map((step, i) => (
                      <div key={i} className="flex items-center justify-between group/step">
                         <div className="flex items-center gap-6">
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500", 
                               step.active ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20" : "bg-white/5 text-slate-600 border-white/5")}>
                               {step.icon}
                            </div>
                            <span className={cn("text-[11px] font-black uppercase tracking-widest transition-colors", step.active ? "text-white" : "text-slate-600")}>{step.label}</span>
                         </div>
                         {step.active ? (
                           <CheckCircle2 size={24} className="text-emerald-500" />
                         ) : (
                           <div className="w-6 h-6 rounded-lg border-2 border-dashed border-white/5 group-hover/step:border-indigo-500/30 transition-colors" />
                         )}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#0c0f16] rounded-[40px] sm:rounded-[56px] p-10 border border-white/10 text-white shadow-2xl relative overflow-hidden group hover:bg-black transition-all cursor-pointer">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={80} fill="currentColor" />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                       <Zap size={24} className="text-amber-500 fill-amber-500" />
                       <h4 className="text-xl font-black uppercase tracking-widest">Premium Node</h4>
                    </div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Unlock advanced logistics and global tracking modules.</p>
                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                       Initialize Upgrade
                    </button>
                 </div>
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
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-12 py-6 bg-indigo-600 text-white rounded-full font-black text-[14px] uppercase tracking-[0.4em] flex items-center gap-4 shadow-[0_20px_50px_rgba(79,70,229,0.4)] border border-white/20"
          >
            <Sparkles size={24} className="animate-pulse" /> Sync Complete
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditProfile;
