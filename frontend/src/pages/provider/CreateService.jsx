import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { 
  MdAdd, MdArrowBack, MdAttachMoney, MdCategory, MdDescription, MdTitle,
  MdGridView, MdAutoAwesome, MdSave, MdCheckCircle, MdLocationOn,
  MdImage, MdCameraAlt, MdInfo, MdAccessTime, MdShield, MdTrendingUp
} from 'react-icons/md';
import { Sparkles, Rocket, ChevronLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateService = () => {
  const { user } = useAuth();
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Other', location: '', image: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = ["Plumbing", "Electrical", "Tutoring", "Cleaning", "Painting", "Other", "Repairing", "Home Service", "Technical", "Education", "Events", "Design", "Commercial"];

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        setFetching(true);
        try {
          const res = await api.get(`/services/${id}`);
          setFormData({
            title: res.data.title,
            description: res.data.description,
            price: res.data.price,
            category: res.data.category,
            location: res.data.location,
            image: res.data.image
          });
        } catch (err) {
          console.error("Fetch error", err);
        } finally {
          setFetching(false);
        }
      };
      fetchService();
    }
  }, [id]);

  const handleUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      { cloudName: 'dfu6dxt8o', uploadPreset: 'user-img' },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, image: result.info.secure_url }));
        }
      }
    );
    myWidget.open();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) { alert("Upload an image!"); return; }
    setLoading(true);
    try {
      if (id) {
        await api.put(`/services/${id}`, formData);
      } else {
        await api.post('/services', formData);
      }
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard/provider/services'), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process gig.');
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 sm:w-40 sm:h-40 bg-indigo-600/20 text-indigo-400 rounded-[48px] sm:rounded-[56px] flex items-center justify-center mb-8 shadow-2xl border border-indigo-500/30 ring-1 ring-white/5">
          <MdCheckCircle size={64} />
        </motion.div>
        <h2 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tighter uppercase">Deployed</h2>
        <div className="flex items-center gap-3 text-indigo-400">
          <Rocket size={18} />
          <p className="font-black uppercase tracking-[0.4em] text-[11px] sm:text-[13px]">Active in network.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12 pb-24 px-4 sm:px-0 relative select-none">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Link to="/dashboard/provider/services" className="w-14 h-14 sm:w-16 sm:h-16 bg-white/5 border border-white/10 text-slate-400 hover:text-indigo-400 hover:bg-white/10 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all ring-1 ring-white/5">
            <ChevronLeft size={24} />
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles size={16} />
               </div>
               <span className="text-[10px] sm:text-[12px] font-black text-indigo-400 uppercase tracking-[0.4em]">{id ? 'Update' : 'Deployment'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight uppercase">{id ? 'Edit' : 'Create'} <span className="text-indigo-500">Gig</span></h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-12 items-start">
        <div className="xl:col-span-8">
           <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] sm:rounded-[64px] p-6 sm:p-16 shadow-2xl space-y-12 sm:space-y-16 border border-white/10 relative overflow-hidden ring-1 ring-white/5"
              >
                 <div className="flex items-center gap-6 border-b border-white/5 pb-8 sm:pb-10">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">01</div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">Parameters</h3>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 block">Designation</label>
                    <div className="relative">
                      <span className="absolute left-6 sm:left-10 top-6 sm:top-8 text-white/20 font-black text-xl sm:text-2xl pointer-events-none uppercase">I will</span>
                      <textarea
                        required name="title" value={formData.title} onChange={handleChange}
                        className="w-full pl-20 sm:pl-32 pr-6 sm:pr-10 py-6 sm:py-8 bg-white/5 border border-white/10 rounded-[28px] sm:rounded-[48px] text-base sm:text-3xl font-black text-white outline-none focus:border-indigo-500/40 transition-all resize-none leading-tight ring-1 ring-white/5 placeholder:text-slate-800"
                        placeholder="..." rows={2}
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 block">Category</label>
                      <select
                        name="category" value={formData.category} onChange={handleChange}
                        className="w-full px-8 h-16 sm:h-20 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl text-white font-black text-[14px] outline-none appearance-none cursor-pointer uppercase tracking-widest ring-1 ring-white/5 focus:border-indigo-500/40"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#0c0f16] text-white">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 block">Location</label>
                      <input
                        required type="text" name="location" value={formData.location} onChange={handleChange}
                        placeholder="City or Remote..."
                        className="w-full px-8 h-16 sm:h-20 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl text-white font-black text-[14px] outline-none focus:border-indigo-500/40 uppercase tracking-widest ring-1 ring-white/5 placeholder:text-slate-800"
                      />
                    </div>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] sm:rounded-[64px] p-6 sm:p-16 shadow-2xl space-y-12 sm:space-y-16 border border-white/10 relative overflow-hidden ring-1 ring-white/5"
              >
                 <div className="flex items-center gap-6 border-b border-white/5 pb-8 sm:pb-10">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">02</div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">Value</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 block">Base Price</label>
                      <div className="relative">
                        <MdAttachMoney className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400" size={28} />
                        <input
                          required type="number" name="price" value={formData.price} onChange={handleChange}
                          placeholder="0"
                          className="w-full pl-16 pr-6 h-16 sm:h-20 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl text-white text-xl sm:text-4xl font-black outline-none focus:border-indigo-500/40 ring-1 ring-white/5 placeholder:text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 block">Network Delivery</label>
                       <div className="flex items-center gap-4 h-16 sm:h-20 px-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl ring-1 ring-white/5">
                          <MdAccessTime className="text-indigo-400" size={24} />
                          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Global Sync Enabled</span>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 block">Description</label>
                    <textarea
                      required name="description" value={formData.description} onChange={handleChange}
                      rows={6} placeholder="Define service specifications..."
                      className="w-full p-8 bg-white/5 border border-white/10 rounded-[32px] text-white text-base font-bold outline-none focus:border-indigo-500/40 leading-relaxed resize-none ring-1 ring-white/5 placeholder:text-slate-800"
                    />
                 </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                 <motion.button 
                   whileTap={{ scale: 0.98 }}
                   type="submit" disabled={loading} 
                   className="w-full sm:flex-[2] h-16 sm:h-20 bg-indigo-600 text-white font-black text-lg rounded-full shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 transition-all uppercase tracking-[0.4em] disabled:opacity-50"
                 >
                    {loading ? 'Processing...' : (id ? 'Update Gig' : 'Deploy Gig')}
                 </motion.button>
                 <button type="button" onClick={() => navigate(-1)} className="w-full sm:flex-1 h-16 sm:h-20 bg-white/5 text-slate-500 font-black rounded-full border border-white/10 uppercase tracking-widest text-[11px] hover:text-white transition-all ring-1 ring-white/5">
                    Cancel
                 </button>
              </div>
           </form>
        </div>

        <div className="xl:col-span-4 space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[32px] sm:rounded-[48px] p-8 sm:p-10 shadow-2xl border border-white/10 space-y-8 ring-1 ring-white/5"
           >
              <h3 className="text-xl font-black text-white tracking-tight uppercase">Thumbnail</h3>
              <div onClick={handleUpload} className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-[28px] flex flex-col items-center justify-center text-indigo-400 cursor-pointer overflow-hidden relative group hover:bg-white/10 transition-all">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <MdCameraAlt size={40} className="opacity-40" />
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 px-6">Upload High-Fidelity Static</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex gap-4 ring-1 ring-white/5">
                 <MdInfo size={20} className="text-indigo-400 shrink-0" />
                 <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase">Optimal resolution ensures higher matrix priority.</p>
              </div>
           </motion.div>

           <div className="bg-indigo-600 rounded-[32px] sm:rounded-[48px] p-10 text-white shadow-2xl space-y-6 relative overflow-hidden">
              <Star className="absolute -top-4 -right-4 w-32 h-32 opacity-10" />
              <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">Elite <br/>Deployment</h4>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">Your gig will be synchronized across the entire network cluster immediately after approval.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
