import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  User, 
  MapPin, 
  Image as ImageIcon, 
  Save, 
  ArrowLeft, 
  ShieldCheck, 
  Camera,
  CheckCircle2,
  Phone,
  BookOpen,
  Wrench,
  X
} from 'lucide-react';

const EditProfile = () => {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    skills: user?.skills || [],
    lat: user?.lat || null,
    long: user?.long || null
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Cloudinary Widget Setup
  const handleUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dfu6dxt8o',
        uploadPreset: 'user-img',
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Upload success:", result.info);
          setFormData(prev => ({ ...prev, avatar: result.info.secure_url }));
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
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.put('/api/auth/profile', formData, config);
      // Update user in context AND localStorage so avatar persists after logout
      if (res.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser(formData); // fallback: save what we have
      }
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
    <div className="max-w-5xl mx-auto p-4 sm:p-8 font-['Outfit'] space-y-10 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 leading-none tracking-tight">Edit Your Profile</h1>
            <p className="text-slate-500 font-medium text-sm">Manage your personal details and identity.</p>
          </div>
        </div>
        {success && (
          <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 font-black text-sm flex items-center gap-2 animate-in slide-in-from-right-4">
             <CheckCircle2 size={18} />
             Changes Saved!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* PROFILE PREVIEW */}
        <div className="bg-white p-10 border border-slate-100 rounded-[3rem] shadow-sm flex flex-col items-center text-center space-y-6">
           <div className="relative group p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-500 rounded-[2.5rem] shadow-2xl shadow-indigo-100">
              <div 
                onClick={handleUpload}
                className="w-32 h-32 bg-white rounded-[2.2rem] flex items-center justify-center text-indigo-600 text-4xl font-black overflow-hidden relative border-4 border-white cursor-pointer"
              >
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  formData.name.charAt(0) || 'U'
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                   <Camera size={24} />
                </div>
              </div>
           </div>
           <div>
             <h3 className="text-2xl font-black text-slate-900">{formData.name || 'Your Name'}</h3>
             <div className="flex items-center justify-center gap-2 mt-1 text-slate-400 font-bold text-xs uppercase tracking-widest">
               <MapPin size={12} className="text-indigo-400" />
               {formData.location || 'Location Not Set'}
             </div>
           </div>
           <div className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={12} />
              {user?.role?.toUpperCase() || 'USER'}
           </div>
        </div>

        {/* PROFILE FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-10 md:p-14 border border-slate-100 rounded-[3.5rem] shadow-2xl shadow-indigo-100/50 space-y-8 relative overflow-hidden">
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Abuzar Dev"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-800 text-base outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Location</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-grow">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={20} />
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Karachi, Sindh"
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-800 text-base outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-medium"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((pos) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              lat: pos.coords.latitude, 
                              long: pos.coords.longitude,
                              location: "Current Location Detected"
                            }));
                            alert("Location Coordinates Captured!");
                          });
                        }
                      }}
                      className="px-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-xs hover:bg-indigo-600 transition-all"
                    >
                      PIN GPS
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-800 text-base outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-medium"
                    />
                  </div>
                </div>

                {/* Avatar URL (Hidden but updated by Widget) */}
                <input type="hidden" name="avatar" value={formData.avatar} />
             </div>

             {/* Bio */}
             <div className="space-y-3 group">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Professional Bio</label>
               <div className="relative">
                 <BookOpen className="absolute left-6 top-8 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={20} />
                 <textarea 
                   name="bio"
                   value={formData.bio}
                   onChange={handleChange}
                   rows={4}
                   placeholder="Describe what you do..."
                   className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-[2rem] text-slate-800 text-base outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-medium resize-none"
                 />
               </div>
             </div>

             {/* Skills */}
             <div className="space-y-3 group">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 block group-focus-within:text-indigo-600 transition-colors">Skills (Press Enter to add)</label>
               <div className="relative">
                 <Wrench className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" size={20} />
                 <input 
                    type="text" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="e.g. Web Development"
                    className="w-full pl-16 pr-24 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] text-slate-800 text-base outline-none transition-all focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 font-medium"
                 />
                 <button 
                  type="button"
                  onClick={addSkill}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-black transition-colors"
                 >
                   ADD
                 </button>
               </div>
               {/* Skills list */}
               <div className="flex flex-wrap gap-2 px-2 mt-2">
                 {formData.skills.map((skill, index) => (
                   <span key={index} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-xs flex items-center gap-2">
                     {skill}
                     <button type="button" onClick={() => removeSkill(skill)}><X size={14} /></button>
                   </span>
                 ))}
               </div>
             </div>

             {/* Save Button */}
             <div className="pt-6">
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full py-5 bg-indigo-600 hover:bg-black text-white font-black text-lg rounded-[2.5rem] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
               >
                 {loading ? 'Saving...' : (
                   <>
                     <Save size={22} className="group-hover:scale-110 transition-transform" />
                     Save Changes
                   </>
                 )}
               </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
