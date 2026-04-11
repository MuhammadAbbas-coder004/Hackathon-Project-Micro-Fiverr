import React, { useState, useEffect } from 'react';
import { User, MapPin, Code, FileText, Camera, Save, Phone } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const openWidget = () => {
    window.cloudinary.createUploadWidget(
      {
        cloudName: 'dfu6dxt8o',
        uploadPreset: 'user-img',
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setFormData({ ...formData, avatar: result.info.secure_url });
        }
      }
    ).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put('/api/auth/profile', formData, config);
      
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Profile Settings</h1>
        <p className="text-slate-500 font-medium">Update your profile info and how others see you on the platform.</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
         <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 relative">
            <button 
              type="button"
              className="absolute bottom-6 right-8 px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-white font-bold hover:bg-white/30 transition-all border border-white/30 text-xs flex items-center gap-2"
            >
               <Camera size={16} /> Change Cover
            </button>
         </div>
         <div className="px-10 pb-10">
            <div className="relative -mt-16 mb-10 text-center md:text-left">
               <div className="inline-block relative group">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] p-1.5 shadow-2xl border border-white overflow-hidden ring-4 ring-indigo-50">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover rounded-[2rem]" />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 rounded-[2rem] flex items-center justify-center text-4xl text-indigo-600 font-black">
                        {formData.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={openWidget}
                    className="absolute inset-1.5 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity rounded-[2rem] cursor-pointer border border-white/20"
                  >
                    <Camera size={28} />
                  </button>
               </div>
            </div>

            {message && (
              <div className={`mb-8 p-4 rounded-2xl font-bold text-center ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                     <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-100 transition-all">
                        <User size={18} className="text-indigo-500" />
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-transparent border-none outline-none text-base font-bold w-full text-slate-700" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                     <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-100 transition-all">
                        <MapPin size={18} className="text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="e.g. Karachi, Pakistan" 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="bg-transparent border-none outline-none text-base font-bold w-full text-slate-700" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                     <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-100 transition-all">
                        <Phone size={18} className="text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="e.g. +92 300 1234567" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-transparent border-none outline-none text-base font-bold w-full text-slate-700" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Skills (comma separated)</label>
                     <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-100 transition-all">
                        <Code size={18} className="text-indigo-500" />
                        <input 
                          type="text" 
                          placeholder="e.g. Plumbing, Electrical, Cleaning" 
                          value={formData.skills}
                          onChange={(e) => setFormData({...formData, skills: e.target.value})}
                          className="bg-transparent border-none outline-none text-base font-bold w-full text-slate-700" 
                        />
                     </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                     <div className="flex items-start gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl focus-within:ring-2 ring-indigo-100 transition-all">
                        <FileText size={18} className="text-indigo-500 mt-1" />
                        <textarea 
                          rows="4" 
                          placeholder="Tell us about your experience and services..." 
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="bg-transparent border-none outline-none text-base font-medium w-full resize-none text-slate-600"
                        ></textarea>
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 uppercase tracking-widest text-xs"
                  >
                     <Save size={18} /> {loading ? 'Saving...' : 'Save Profile Settings'}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
};

export default Settings;
