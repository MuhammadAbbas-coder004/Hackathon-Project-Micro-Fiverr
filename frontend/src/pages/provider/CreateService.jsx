import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  ArrowLeft, 
  DollarSign, 
  Tag, 
  AlignLeft, 
  Type,
  LayoutGrid,
  Sparkles,
  Save,
  CheckCircle2,
  MapPin,
  Image as ImageIcon,
  Camera,
  Info,
  Clock,
  ShieldCheck
} from 'lucide-react';

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 font-['Outfit']">Gig Published! 🚀</h2>
        <p className="text-slate-500 font-medium">Your service is now live on the marketplace.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700 pb-20 font-['Outfit']">
      {/* 🚀 FIVERR STYLE HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <Link 
            to="/dashboard/provider/services" 
            className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl transition-all shadow-sm active:scale-90"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
             <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Create a New Gig</h1>
             <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
               <Sparkles size={16} className="text-amber-500" />
               Build a premium profile to attract high-paying clients.
             </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-xs uppercase tracking-widest">
           <ShieldCheck size={16} />
           Pro Seller Mode
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-8">
           <form onSubmit={handleSubmit} className="space-y-10">
              {/* Overview Section */}
              <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 space-y-10">
                 <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-2">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm">1</span>
                    <h3 className="text-xl font-black text-slate-900 italic">Gig Overview</h3>
                 </div>

                 {/* Gig Title */}
                 <div className="space-y-4 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Gig Title</label>
                    <div className="relative">
                      <span className="absolute left-6 top-6 text-slate-400 font-black text-xl italic pointer-events-none">I will</span>
                      <textarea
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full pl-20 pr-8 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-900 text-xl font-black outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 placeholder:text-slate-300 placeholder:font-medium resize-none"
                        placeholder="...do professional plumbing and leak repair"
                        rows={2}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-right px-4">80 characters max</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Category */}
                    <div className="space-y-4 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Category</label>
                      <div className="relative">
                        <LayoutGrid className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-800 text-base outline-none appearance-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-black cursor-pointer"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-orange-600 transition-colors">Service Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-400" size={20} />
                        <input
                          required
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. Karachi, Sindh"
                          className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-800 text-base outline-none transition-all focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 font-black"
                        />
                      </div>
                    </div>
                 </div>
              </div>

              {/* Pricing & Description */}
              <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 space-y-10">
                 <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-2">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm">2</span>
                    <h3 className="text-xl font-black text-slate-900 italic">Pricing & Details</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Price */}
                    <div className="space-y-4 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-emerald-600 transition-colors">Basic Service Price (PKR)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-400" size={20} />
                        <input
                          required
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-900 text-2xl font-black outline-none transition-all focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block">Delivery Time</label>
                       <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-[1.8rem] border border-transparent">
                          <Clock className="text-slate-300" size={20} />
                          <span className="text-sm font-black text-slate-600">Standard Delivery (1-2 Days)</span>
                       </div>
                    </div>
                 </div>

                 {/* Description */}
                 <div className="space-y-4 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Gig Description</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-6 top-6 text-slate-300" size={20} />
                      <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={8}
                        placeholder="Briefly describe your service! What makes you the best choice? What exactly will the client get?"
                        className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-transparent rounded-[2.5rem] text-slate-800 text-base outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-medium resize-none leading-relaxed"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-right px-4">Min 120 characters</p>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                 <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-4 py-6 bg-indigo-600 hover:bg-black text-white font-black text-xl rounded-[2.5rem] transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 group"
                 >
                    {loading ? 'Publishing...' : (
                      <>
                        <Save size={24} className="group-hover:scale-110 transition-transform" />
                        PUBLISH GIG
                      </>
                    )}
                 </button>
                 <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-12 py-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-[2.5rem] transition-all"
                 >
                    CANCEL
                 </button>
              </div>
           </form>
        </div>

        {/* RIGHT COLUMN: GIG IMAGE & TIPS */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
           {/* Gig Image Card */}
           <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4">Gig Gallery</h3>
              <div 
                onClick={handleUpload}
                className="aspect-[4/3] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-all group overflow-hidden relative"
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Gig Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                       <Camera size={32} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                      <ImageIcon size={40} className="text-slate-300" />
                    </div>
                    <p className="font-black text-[10px] uppercase tracking-widest text-center px-10">Upload your Gig Image</p>
                  </>
                )}
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                 <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-amber-700 font-semibold leading-relaxed">
                   High-quality images that showcase your work increase sales by up to 200%.
                 </p>
              </div>
           </div>

           {/* Fiverr Tips */}
           <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 relative overflow-hidden">
              <h3 className="text-xl font-black italic relative z-10">Expert Tips</h3>
              <ul className="space-y-6 relative z-10">
                 <li className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm text-slate-300 font-medium">Use keywords in your title to appear in search results.</p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm text-slate-300 font-medium">Clear descriptions lead to better client satisfaction.</p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                    <p className="text-sm text-slate-300 font-medium">Offer competitive pricing for your first few sales.</p>
                 </li>
              </ul>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
