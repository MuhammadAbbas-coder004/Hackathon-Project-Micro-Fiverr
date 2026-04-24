import React, { useState } from 'react';
import { Send, MapPin, DollarSign, Tag, Briefcase, FileText, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    category: 'Home Service',
  });

  const categories = ['Home Service', 'Technical', 'Education', 'Events', 'Commercial', 'Other'];
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadImg, setUploadImg] = useState('');

  const openWidget = () => {
    window.cloudinary.createUploadWidget(
      {
        cloudName: 'dfu6dxt8o',
        uploadPreset: 'user-img',
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Upload success:", result.info);
          setUploadImg(result.info.secure_url);
        }
      }
    ).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.budget || !formData.location || !formData.description) {
      setMessage('Please fill all fields');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const postData = { ...formData, image: uploadImg };
      await axios.post('/api/jobs', postData, config);
      setMessage('Job posted successfully! It will now appear on the home page.');
      setFormData({
        title: '',
        description: '',
        budget: '',
        location: '',
        category: 'Home Service',
      });
      setUploadImg('');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-12 pb-20">
      
      {/* Header (Liquid) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-8 py-6 bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] ring-1 ring-white/5 shadow-2xl flex items-center gap-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
           <Briefcase size={28} />
        </div>
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-1">
             <Sparkles size={14} className="animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Deploy Request</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">Post New <span className="text-indigo-500">Job</span></h1>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 rounded-[48px] sm:rounded-[64px] shadow-2xl p-10 sm:p-16 ring-1 ring-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-12 p-6 rounded-3xl font-black uppercase tracking-widest text-[11px] text-center border ${message.includes('Error') || message.includes('fill') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}
          >
            {message}
          </motion.div>
        )}

        <form className="space-y-12 relative" onSubmit={handleSubmit}>
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Job Title</label>
             <div className="flex items-center gap-5 bg-white/5 border border-white/10 p-6 rounded-3xl focus-within:border-indigo-500/40 transition-all ring-1 ring-white/5 group">
                <Briefcase size={20} className="text-indigo-400 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                <input 
                  type="text" 
                  placeholder="DEFINE_NODE_TITLE" 
                  className="bg-transparent border-none outline-none text-lg font-black w-full text-white tracking-tight uppercase placeholder:text-slate-700"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Budget Allocation ($)</label>
                <div className="flex items-center gap-5 bg-white/5 border border-white/10 p-6 rounded-3xl focus-within:border-indigo-500/40 transition-all ring-1 ring-white/5 group">
                   <DollarSign size={20} className="text-indigo-400 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                   <input 
                     type="number" 
                     placeholder="250" 
                     className="bg-transparent border-none outline-none text-lg font-black w-full text-white tracking-tight placeholder:text-slate-700"
                     value={formData.budget}
                     onChange={(e) => setFormData({...formData, budget: e.target.value})}
                   />
                </div>
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Geo Node</label>
                <div className="flex items-center gap-5 bg-white/5 border border-white/10 p-6 rounded-3xl focus-within:border-indigo-500/40 transition-all ring-1 ring-white/5 group">
                   <MapPin size={20} className="text-indigo-400 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                   <input 
                     type="text" 
                     placeholder="TARGET_LOCATION" 
                     className="bg-transparent border-none outline-none text-lg font-black w-full text-white tracking-tight uppercase placeholder:text-slate-700"
                     value={formData.location}
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                   />
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 block">Category Node</label>
             <div className="flex flex-wrap gap-4">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   type="button"
                   onClick={() => setFormData({...formData, category: cat})}
                   className={`px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                     formData.category === cat 
                     ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-600/20 ring-1 ring-white/20' 
                     : 'bg-white/5 border-white/10 text-slate-500 hover:border-indigo-500/30 hover:text-indigo-400 ring-1 ring-white/5'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Detailed Specifications</label>
             <div className="flex items-start gap-5 bg-white/5 border border-white/10 p-8 rounded-[32px] focus-within:border-indigo-500/40 transition-all ring-1 ring-white/5 group">
                <FileText size={20} className="text-indigo-400 opacity-40 group-focus-within:opacity-100 transition-opacity mt-1" />
                <textarea 
                  rows="5" 
                  placeholder="Initialize detailed requirements stream..." 
                  className="bg-transparent border-none outline-none text-lg font-bold w-full resize-none text-slate-200 leading-relaxed placeholder:text-slate-700"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 block">Visual Asset (Optional)</label>
             <div className="flex flex-col items-center gap-6 p-12 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02] hover:bg-white/5 transition-all ring-1 ring-white/5">
                {uploadImg ? (
                  <div className="relative group">
                    <img src={uploadImg} alt="Preview" className="w-48 h-48 object-cover rounded-[32px] shadow-2xl border border-white/10" />
                    <button 
                      type="button"
                      onClick={() => setUploadImg('')}
                      className="absolute -top-3 -right-3 bg-rose-500 text-white p-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Tag size={14} className="rotate-45" />
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={openWidget}
                    className="flex flex-col items-center gap-4 text-indigo-400 hover:text-white transition-colors group"
                  >
                    <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                       <Send className="rotate-[-45deg]" size={28} />
                    </div>
                    <span className="font-black text-[11px] uppercase tracking-[0.3em]">Upload Visual Asset</span>
                  </button>
                )}
             </div>
          </div>

          <div className="pt-8">
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type="submit" 
               disabled={loading}
               className="w-full flex items-center justify-center gap-5 py-6 bg-indigo-600 text-white font-black text-[13px] uppercase tracking-[0.4em] rounded-full shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50"
             >
                {loading ? <Activity className="animate-spin" size={22} /> : <><Send size={22} /> Deploy Job Node</>}
             </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
