import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  MdAdd, 
  MdArrowBack, 
  MdAttachMoney, 
  MdCategory, 
  MdDescription, 
  MdTitle,
  MdGridView,
  MdAutoAwesome,
  MdSave,
  MdCheckCircle,
  MdLocationOn,
  MdImage,
  MdCameraAlt,
  MdInfo,
  MdAccessTime,
  MdShield,
  MdTrendingUp
} from 'react-icons/md';
import { motion } from 'framer-motion';

const CreateService = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Other',
    location: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = ["Plumbing", "Electrical", "Tutoring", "Cleaning", "Painting", "Other", "Repairing", "Home Service", "Technical", "Education", "Events", "Design", "Commercial"];

  const handleUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dfu6dxt8o',
        uploadPreset: 'user-img',
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Upload success:", result.info);
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
    if (!formData.image) {
      alert("Please upload a service image first!");
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post('/api/services', formData, config);
      setSubmitted(true);
      setTimeout(() => navigate('/dashboard/provider/services'), 2000);
    } catch (err) {
      console.error("❌ Submission Error:", err.response?.data);
      alert(err.response?.data?.message || 'Failed to create service. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 bg-[#f97316]/20 text-[#f97316] rounded-[40px] flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(249,115,22,0.3)] ring-1 ring-[#f97316]/30"
        >
          <MdCheckCircle size={64} />
        </motion.div>
        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">Node Deployed! 🚀</h2>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[11px]">Your Matrix service is now live in the inventory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 overflow-hidden">
      {/* Abstract Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
        <div className="flex items-center gap-8">
          <Link 
            to="/dashboard/provider/services" 
            className="w-16 h-16 bg-[#111113] ring-1 ring-white/5 text-white/20 hover:text-[#f97316] hover:ring-[#f97316]/20 rounded-[28px] flex items-center justify-center transition-all shadow-2xl active:scale-95 group"
          >
            <MdArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
               <span className="text-[11px] font-black text-[#f97316] uppercase tracking-[0.4em] leading-none italic">Node_Deployment</span>
               <MdAutoAwesome className="text-[#f97316]" size={16} />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Initialize<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Gig Node</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-[#f97316]/10 text-[#f97316] rounded-2xl ring-1 ring-[#f97316]/20 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
           <MdShield size={18} />
           Verified_Node_Agent
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: FORM */}
        <div className="xl:col-span-8">
           <form onSubmit={handleSubmit} className="space-y-12">
              {/* Form Block Matrix */}
              <div className="bg-[#111113] rounded-[56px] p-8 md:p-14 shadow-2xl ring-1 ring-white/5 space-y-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-[#f97316]/5 blur-[90px] rounded-full pointer-events-none" />

                 <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                    <div className="w-10 h-10 bg-[#f97316] text-white rounded-xl flex items-center justify-center font-black text-sm italic shadow-[0_0_20px_rgba(249,115,22,0.4)]">01</div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Transmission Parameters</h3>
                 </div>

                 {/* Gig Title */}
                 <div className="space-y-5 group">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] px-4 block group-focus-within:text-[#f97316] transition-colors">Gig_Designation</label>
                    <div className="relative">
                      <span className="absolute left-8 top-7 text-white/10 font-black text-2xl italic pointer-events-none uppercase italic group-focus-within:text-[#f97316]/40 transition-colors">I will</span>
                      <textarea
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full pl-28 pr-10 py-7 bg-white/5 ring-1 ring-transparent rounded-[32px] text-white text-2xl font-black outline-none transition-all focus:bg-white/10 focus:ring-[#f97316]/30 placeholder:text-white/5 resize-none leading-tight"
                        placeholder="DEPLOY_ELITE_SERVICE_HERE..."
                        rows={2}
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Category */}
                    <div className="space-y-5 group">
                      <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] px-4 block group-focus-within:text-[#f97316] transition-colors">Node_Matrix</label>
                      <div className="relative">
                        <MdGridView className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#f97316]/40 pointer-events-none" size={24} />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-20 pr-10 h-20 bg-white/5 ring-1 ring-transparent rounded-[32px] text-white text-[15px] outline-none appearance-none focus:bg-white/10 focus:ring-[#f97316]/30 font-black cursor-pointer uppercase tracking-widest"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat} className="bg-[#111113] text-white">{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-5 group">
                      <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] px-4 block group-focus-within:text-[#f97316] transition-colors">Deployment_Zone</label>
                      <div className="relative">
                        <MdLocationOn className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#f97316]/40 pointer-events-none" size={24} />
                        <input
                          required
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="GEO_COORDS..."
                          className="w-full pl-20 pr-10 h-20 bg-white/5 ring-1 ring-transparent rounded-[32px] text-white text-[15px] outline-none transition-all focus:bg-white/10 focus:ring-[#f97316]/30 font-black uppercase tracking-widest"
                        />
                      </div>
                    </div>
                 </div>
              </div>

              {/* Pricing & Description */}
              <div className="bg-[#111113] rounded-[56px] p-8 md:p-14 shadow-2xl ring-1 ring-white/5 space-y-12">
                 <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                    <div className="w-10 h-10 bg-[#f97316] text-white rounded-xl flex items-center justify-center font-black text-sm italic shadow-[0_0_20px_rgba(249,115,22,0.4)]">02</div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Relay Value & Logic</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Basic Price */}
                    <div className="space-y-5 group">
                      <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] px-4 block group-focus-within:text-[#f97316] transition-colors">Matrix_Price (PKR)</label>
                      <div className="relative">
                        <MdAttachMoney className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#f97316]/40 pointer-events-none" size={24} />
                        <input
                          required
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="000.00"
                          className="w-full pl-20 pr-10 h-20 bg-white/5 ring-1 ring-transparent rounded-[32px] text-white text-3xl font-black outline-none transition-all focus:bg-white/10 focus:ring-[#f97316]/30 placeholder:text-white/5"
                        />
                      </div>
                    </div>

                    <div className="space-y-5">
                       <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] px-4 block">Pulse_Delivery</label>
                       <div className="flex items-center gap-4 h-20 px-8 bg-white/5 rounded-[32px] ring-1 ring-transparent">
                          <MdAccessTime className="text-white/10" size={24} />
                          <span className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Standard_Sync (24-48H)</span>
                       </div>
                    </div>
                 </div>

                 {/* Description */}
                 <div className="space-y-5 group">
                    <label className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] px-4 block group-focus-within:text-[#f97316] transition-colors">Node_Manifesto</label>
                    <div className="relative">
                      <MdDescription className="absolute left-8 top-8 text-white/10 group-focus-within:text-[#f97316]/40 pointer-events-none" size={24} />
                      <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={8}
                        placeholder="INITIATE_MANIFESTO_LOGS_HERE..."
                        className="w-full pl-20 pr-10 py-8 bg-white/5 ring-1 ring-transparent rounded-[40px] text-white text-lg font-bold outline-none transition-all focus:bg-white/10 focus:ring-[#f97316]/30 placeholder:text-white/5 resize-none leading-relaxed"
                      />
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                 <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-5 h-20 bg-[#f97316] hover:bg-white text-white hover:text-black font-black text-lg rounded-[32px] transition-all shadow-[0_25px_50px_-12px_rgba(249,115,22,0.5)] active:scale-[0.98] disabled:opacity-50 group border-none outline-none cursor-pointer"
                 >
                    {loading ? 'DEPLOYING_NODE...' : (
                      <>
                        <MdSave size={24} className="group-hover:scale-110 transition-transform" />
                        DEPLOY_GIG_NODE
                      </>
                    )}
                 </button>
                 <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-14 h-20 bg-white/5 hover:bg-white/10 text-white/20 hover:text-white font-black rounded-[32px] transition-all uppercase tracking-[0.3em] text-[11px] ring-1 ring-white/5 border-none outline-none cursor-pointer"
                 >
                    CANCEL
                 </button>
              </div>
           </form>
        </div>

        {/* RIGHT COLUMN: GIG IMAGE & TIPS */}
        <div className="xl:col-span-4 space-y-10 sticky top-24">
           {/* Gig Image Card */}
           <div className="bg-[#111113] rounded-[48px] p-10 shadow-2xl ring-1 ring-white/5 space-y-8 overflow-hidden relative group">
              <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#f97316]/10 blur-[60px] rounded-full pointer-events-none" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic border-b border-white/5 pb-6">Visual Matrix</h3>
              <div 
                onClick={handleUpload}
                className="aspect-[4/3] bg-white/5 ring-1 ring-white/10 rounded-[40px] flex flex-col items-center justify-center text-white cursor-pointer transition-all hover:ring-[#f97316]/40 group overflow-hidden relative shadow-inner"
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Gig Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white scale-110 group-hover:scale-100 duration-500">
                       <MdCameraAlt size={44} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-2xl ring-1 ring-white/10">
                      <MdImage size={48} className="text-white/10 group-hover:text-[#f97316] transition-colors" />
                    </div>
                    <p className="font-black text-[10px] uppercase tracking-[0.4em] text-center px-10 text-white/20 group-hover:text-white transition-colors">Deploy_Visual_LOG</p>
                  </>
                )}
              </div>
              <div className="p-6 bg-[#f97316]/5 rounded-3xl ring-1 ring-[#f97316]/10 flex gap-4 items-start">
                 <MdInfo size={24} className="text-[#f97316] shrink-0" />
                 <p className="text-[11px] text-[#f97316]/80 font-bold leading-relaxed uppercase tracking-tight italic">
                   "Neural response is 2.5x higher with elite visual nodes. Recommend high-res matrices."
                 </p>
              </div>
           </div>

           {/* Pro Tips */}
           <div className="bg-[#111113] rounded-[48px] p-10 ring-1 ring-white/5 space-y-10 overflow-hidden relative">
              <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-blue-600/5 blur-[50px] rounded-full" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic border-b border-white/5 pb-6">Core Protocols</h3>
              <ul className="space-y-8">
                 {[
                   { color: 'bg-[#f97316]', text: 'Execute keyword injection in titles for matrix visibility.' },
                   { color: 'bg-blue-500', text: 'Clear manifesto data minimizes contract rejection.' },
                   { color: 'bg-emerald-500', text: 'Low-latency pricing accelerates initial adoption.' }
                 ].map((tip, i) => (
                  <li key={i} className="flex gap-5 group">
                    <div className={`w-2 h-2 ${tip.color} rounded-full mt-2 shrink-0 group-hover:scale-150 transition-transform duration-500 shadow-[0_0_10px_currentColor]`} />
                    <p className="text-[12px] text-white/40 font-bold uppercase tracking-tight leading-relaxed group-hover:text-white transition-colors uppercase">{tip.text}</p>
                  </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
