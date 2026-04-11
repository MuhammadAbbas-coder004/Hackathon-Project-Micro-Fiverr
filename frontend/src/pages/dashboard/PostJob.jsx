import React, { useState } from 'react';
import { Send, MapPin, DollarSign, Tag, Briefcase, FileText } from 'lucide-react';
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
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-['Inter']">Post a New Job</h1>
        <p className="text-slate-500">Tell us what you need and find the perfect professional in minutes.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
        {message && (
          <div className="mb-6 p-4 rounded-xl font-bold text-center bg-indigo-50 text-indigo-700">
            {message}
          </div>
        )}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-2">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
             <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-50 transition-all">
                <Briefcase size={20} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Need Kitchen Plumber for faucet leak" 
                  className="bg-transparent border-none outline-none text-base font-bold w-full"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Budget ($)</label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-50 transition-all">
                   <DollarSign size={20} className="text-slate-400" />
                   <input 
                     type="number" 
                     placeholder="250" 
                     className="bg-transparent border-none outline-none text-base font-bold w-full"
                     value={formData.budget}
                     onChange={(e) => setFormData({...formData, budget: e.target.value})}
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-50 transition-all">
                   <MapPin size={20} className="text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="e.g. New York, USA" 
                     className="bg-transparent border-none outline-none text-base font-bold w-full"
                     value={formData.location}
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                   />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Category</label>
             <div className="flex flex-wrap gap-3">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   type="button"
                   onClick={() => setFormData({...formData, category: cat})}
                   className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                     formData.category === cat 
                     ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-100' 
                     : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:text-indigo-600'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
             <div className="flex items-start gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-50 transition-all">
                <FileText size={20} className="text-slate-400 mt-1" />
                <textarea 
                  rows="5" 
                  placeholder="Explain exactly what you need help with..." 
                  className="bg-transparent border-none outline-none text-base font-medium w-full resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block">Project Image (Optional)</label>
             <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 hover:bg-slate-50 transition-all">
                {uploadImg ? (
                  <div className="relative group">
                    <img src={uploadImg} alt="Preview" className="w-40 h-40 object-cover rounded-2xl shadow-lg" />
                    <button 
                      type="button"
                      onClick={() => setUploadImg('')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Tag size={14} className="rotate-45" />
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={openWidget}
                    className="flex flex-col items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                       <Send className="rotate-[-45deg]" />
                    </div>
                    <span className="font-black text-sm uppercase tracking-widest">Click to Upload Image</span>
                  </button>
                )}
             </div>
          </div>

          <div className="pt-6">
             <button 
               type="submit" 
               disabled={loading}
               className="w-full flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-100 hover:scale-[1.01] transition-all hover:shadow-indigo-200 disabled:opacity-70"
             >
                <Send size={20} /> {loading ? 'Publishing...' : 'Publish This Job Post'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
