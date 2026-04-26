import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '@/utils/api';
import { useAuth } from '../../context/AuthContext';
import socket from '../../utils/socket';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Send, Shield, X, Radio, Users,
  StopCircle, Zap, Activity, ShieldCheck, Search,
  Navigation, ChevronRight, ChevronLeft, Signal, Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';

// ── Fix default Leaflet icon paths ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── Map fly helper ─── */
const FlyToLocation = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16, { duration: 2.5 });
  }, [center, map]);
  return null;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const res = (R * c).toFixed(1);
  console.log(`📐 Distance Calc: (${lat1},${lon1}) to (${lat2},${lon2}) = ${res}km`);
  return res;
};

/* ─── Custom map markers ─── */
const freelancerMarker = (isSelected, avatar, name) => L.divIcon({
  className: '',
  html: `
    <div class="marker-3d-wrapper" style="position:relative;width:100px;height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <!-- Searchlight Beam (RGB) -->
      <div style="
        position:absolute;bottom:10px;
        width:40px;height:60px;
        background:linear-gradient(to top, var(--radar-primary), transparent);
        clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
        filter:blur(5px);
        animation: beamPulse 2s infinite alternate, colorCycle 8s linear infinite;
      "></div>
      
      <!-- Drone Body -->
      <div class="marker-body" style="
        width:60px;height:60px;
        position:relative;
        animation: droneFloat 3s ease-in-out infinite;
        z-index:10;
      ">
        <!-- 4 Arms -->
        <div style="position:absolute;inset:0;border:2px solid #334155;border-radius:50%;opacity:0.5;"></div>
        <div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#334155;transform:rotate(45deg);"></div>
        <div style="position:absolute;top:50%;left:0;right:0;height:2px;background:#334155;transform:rotate(-45deg);"></div>

        <!-- Propellers (RGB) -->
        ${[0, 1, 2, 3].map(i => `
          <div style="
            position:absolute;
            width:16px;height:2px;
            background:var(--radar-primary);
            border-radius:10px;
            top:${i < 2 ? '0' : '100%'};
            left:${i % 2 === 0 ? '0' : '100%'};
            transform-origin:center;
            animation: propSpin 0.2s linear infinite, colorCycle 8s linear infinite;
            margin-top:-1px;
            margin-left:-8px;
          "></div>
        `).join('')}

        <!-- Center Core -->
        <div style="
          position:absolute;inset:10px;
          background:#1e293b;
          border-radius:12px;
          border:2px solid ${isSelected ? 'var(--radar-primary)' : '#4f46e5'};
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;
          box-shadow:0 5px 15px rgba(0,0,0,0.5);
          animation: ${isSelected ? 'colorCycleBorder 8s linear infinite' : 'none'};
        ">
          ${avatar 
            ? `<img src="${avatar}" style="width:100%;height:100%;object-fit:cover;" />` 
            : `<span style="color:white;font-weight:900;font-size:16px;">${name?.charAt(0) || 'D'}</span>`
          }
        </div>
      </div>

      <!-- Name Bubble (RGB) -->
      <div style="
        position:absolute;top:-10px;
        background:rgba(0,0,0,0.6);
        backdrop-filter:blur(4px);
        padding:2px 10px;
        border-radius:8px;
        border:1px solid var(--radar-primary);
        box-shadow:0 0 15px var(--radar-primary);
        animation: droneFloat 3s ease-in-out infinite, colorCycleBorder 8s linear infinite, colorCycleShadow 8s linear infinite;
      ">
        <span style="color:white;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;">${name || 'DRONE'}</span>
      </div>
    </div>
  `,
  iconSize: [120, 160],
  iconAnchor: [60, 130],
});

const clientMarker = L.divIcon({
  className: '',
  html: `
    <div class="marker-3d-wrapper" style="position:relative;width:100px;height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <!-- Master Searchlight (RGB) -->
      <div style="
        position:absolute;bottom:10px;
        width:60px;height:80px;
        background:linear-gradient(to top, var(--radar-primary), transparent);
        clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
        filter:blur(8px);
        animation: beamPulse 1.5s infinite alternate, colorCycle 8s linear infinite;
      "></div>
      
      <!-- Command Satellite Body -->
      <div class="marker-body" style="
        width:70px;height:70px;
        position:relative;
        animation: droneFloat 2.5s ease-in-out infinite;
        z-index:20;
      ">
        <!-- Rotating Radar Rings (RGB) -->
        <div style="
          position:absolute;inset:-10px;
          border:2px dashed var(--radar-primary);
          border-radius:50%;
          animation: propSpin 4s linear infinite, colorCycleBorder 8s linear infinite;
          opacity:0.6;
        "></div>
        <div style="
          position:absolute;inset:-20px;
          border:1px solid var(--radar-primary);
          border-radius:50%;
          animation: propSpin 8s linear reverse infinite, colorCycleBorder 8s linear infinite;
          opacity:0.3;
        "></div>

        <!-- Master Core -->
        <div style="
          position:absolute;inset:0;
          background:radial-gradient(circle at 30% 30%, #1e293b, #000000);
          border-radius:20px;
          border:3px solid var(--radar-primary);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 30px var(--radar-primary);
          animation: colorCycleBorder 8s linear infinite, colorCycleShadow 8s linear infinite;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
      </div>

      <!-- YOU / MASTER NODE Label (RGB) -->
      <div style="
        position:absolute;top:-20px;
        background:#000000;
        color:white;
        padding:2px 12px;
        border-radius:20px;
        font-size:10px;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:0.2em;
        box-shadow:0 0 20px var(--radar-primary);
        border:2px solid var(--radar-primary);
        animation: droneFloat 2.5s ease-in-out infinite, colorCycleBorder 8s linear infinite, colorCycleShadow 8s linear infinite;
      ">YOU</div>
    </div>
  `,
  iconSize: [120, 160],
  iconAnchor: [60, 130],
});

/* ─── Loading Overlay ─── */
const RadarLoader = () => (
  <div className="h-screen w-full bg-[#0c0f16] flex flex-col items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_70%)]" />
    <div className="relative">
      <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Radio className="text-indigo-500 animate-pulse" size={40} />
      </div>
    </div>
    <div className="mt-12 text-center space-y-4">
      <h2 className="text-3xl font-black text-white uppercase tracking-[0.4em] animate-pulse">Initializing Radar</h2>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Intelligence Nodes...</p>
    </div>
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="w-1/2 h-full bg-indigo-500"
      />
    </div>
  </div>
);

/* ─── Freelancer List Item in Sidebar ─── */
const FreelancerListItem = ({ freelancer, isSelected, onClick }) => {
  const initials = freelancer.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'F';
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-5 rounded-[24px] cursor-pointer transition-all duration-500 group relative",
        isSelected
          ? "bg-indigo-600/10 border border-indigo-500/30 ring-1 ring-white/5"
          : "border border-transparent hover:bg-white/5 hover:border-white/5"
      )}
    >
      <div className="relative shrink-0">
        <div className="h-14 w-14 rounded-2xl bg-[#0c0f16] flex items-center justify-center font-black text-white border border-white/10 shadow-2xl group-hover:border-indigo-500/40 transition-all overflow-hidden">
          {freelancer.avatar ? (
            <img src={freelancer.avatar} alt={freelancer.name} className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-4 border-[#0c0f16] rounded-full" />
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("font-black text-[13px] uppercase tracking-tight leading-none truncate mb-2.5 transition-colors",
          isSelected ? "text-indigo-400" : "text-white group-hover:text-indigo-400")}
        >
          {freelancer.name}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
            <Star className="h-3 w-3 fill-indigo-500 text-indigo-500" />
            <span className="text-[10px] font-black text-slate-300">{freelancer.rating || '5.0'}</span>
          </div>
          {freelancer.location && (
            <span className="text-[9px] font-black text-slate-600 truncate uppercase tracking-widest">{freelancer.location}</span>
          )}
          {freelancer.distance && (
            <div className="flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded text-[9px] font-black text-indigo-400">
               <Navigation size={10} />
               {freelancer.distance} KM
            </div>
          )}
        </div>
      </div>

      <ChevronRight size={18} className={cn("shrink-0 transition-all duration-500", isSelected ? "text-indigo-500 translate-x-1" : "text-slate-800 group-hover:text-indigo-400 group-hover:translate-x-1")} />
    </motion.div>
  );
};

/* ─── Bottom Sheet Card (when marker clicked) ─── */
const FreelancerDetailPanel = ({ selected, sharing, onStartSharing, onStopSharing, onClose }) => {
  const initials = selected.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'F';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="absolute bottom-12 left-0 right-0 z-[2000] px-6"
      >
        <div className="max-w-xl mx-auto bg-[#0c0f16]/90 backdrop-blur-3xl border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,1)] rounded-[48px] relative overflow-hidden ring-1 ring-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full bg-white/5 hover:bg-indigo-600/20 hover:text-indigo-500 text-slate-500 flex items-center justify-center transition-all active:scale-90 border border-white/10"
          >
            <X size={20} />
          </button>

          <div className="p-10 space-y-8 relative z-10">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-3xl bg-indigo-600 flex items-center justify-center font-black text-white text-3xl border-2 border-indigo-500/30 shadow-2xl overflow-hidden">
                  {selected.avatar ? (
                    <img src={selected.avatar} alt={selected.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 border-4 border-[#0c0f16] rounded-full flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-black text-white text-3xl uppercase tracking-tighter leading-none">{selected.name}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 px-4 py-1.5 rounded-full backdrop-blur-xl">
                    <Star className="h-4 w-4 fill-indigo-500 text-indigo-500" />
                    <span className="text-sm font-black text-white">{selected.rating || '5.0'}</span>
                  </div>
                  {selected.distance && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full backdrop-blur-xl">
                      <Navigation className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-black text-white">{selected.distance} KM AWAY</span>
                    </div>
                  )}
                  {selected.location && !selected.distance && (
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{selected.location}</span>
                  )}
                </div>
              </div>
            </div>

            {selected.bio && (
              <p className="text-[13px] text-slate-400 leading-relaxed border-l-4 border-indigo-500 bg-indigo-600/5 px-6 py-5 rounded-r-[24px] font-medium">
                "{selected.bio}"
              </p>
            )}

            <div className="space-y-4 pt-2">
              {sharing ? (
                <button
                  onClick={onStopSharing}
                  className="w-full h-16 bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[24px] transition-all border border-rose-500/30 flex items-center justify-center gap-4 active:scale-95 shadow-2xl shadow-rose-900/20"
                >
                  <StopCircle size={20} /> Terminate Broadcast
                </button>
              ) : (
                <button
                  onClick={onStartSharing}
                  className="w-full h-16 bg-white hover:bg-indigo-600 text-black hover:text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[24px] transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 active:scale-95"
                >
                  <Send size={20} /> Initialize Signal Sync
                </button>
              )}
              <div className="flex items-center justify-center gap-3 pt-2">
                <ShieldCheck size={16} className="text-indigo-500/40" />
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Protocol Matrix Secured v2.4</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const FreelancerRadar = () => {
  const { user, token }     = useAuth();
  const navigate            = useNavigate();
  const routerLocation      = useLocation();
  const [myPos, setMyPos]   = useState(null);
  const [freelancers, setFreelancers] = useState([]);
  const [selected, setSelected]       = useState(null);
  const [focusPos, setFocusPos]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sharing, setSharing]         = useState(false);
  const [watchId, setWatchId]         = useState(null);
  const [searchQ, setSearchQ]         = useState('');
  const [locSearch, setLocSearch]     = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleGlobalSearch = async (e) => {
    if (e) e.preventDefault();
    if (!locSearch.trim()) return;
    
    setLoading(true);
    try {
      console.log("🔍 Scanning Location:", locSearch);
      // Adding a more detailed query and limiting results
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locSearch)}&limit=1&addressdetails=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const target = data[0];
        const lat = parseFloat(target.lat);
        const lon = parseFloat(target.lon);
        
        console.log(`✅ Success! Found: ${target.display_name} at [${lat}, ${lon}]`);
        
        // Update coordinates and focus
        const newCoords = [lat, lon];
        setFocusPos(newCoords);
        setMyPos({ lat, lng: lon }); // Temporarily set myPos here to see nearby freelancers from searched point
        
        // Fetch freelancers for the new location
        await fetchNearby(lat, lon);
        
        // Close sidebar on mobile for better view
        if (window.innerWidth < 768) setSidebarOpen(false);
      } else {
        alert(`Could not find "${locSearch}". Try adding city name or country.`);
      }
    } catch (err) {
      console.error("❌ Search Error:", err);
      alert("Radar scan failed. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const focusId = params.get('f');

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMyPos(coords);
      console.log("📍 My Position:", coords);
      
      // If we have a focusId, let's make sure we get that specific freelancer
      if (focusId) {
        try {
          const res = await api.get(`/auth/user/${focusId}`);
          const focusedUser = res.data;
          console.log("🎯 Focused User Data:", focusedUser);
          if (focusedUser && focusedUser.role === 'freelancer') {
            // Calculate distance manually since this is a single fetch
            const dist = calculateDistance(coords.lat, coords.lng, focusedUser.lat || focusedUser.latitude, focusedUser.long || focusedUser.longitude);
            const userWithDist = { ...focusedUser, distance: dist };
            
            setSelected(userWithDist);
            setFocusPos([focusedUser.lat || focusedUser.latitude, focusedUser.long || focusedUser.longitude]);
          }
        } catch (err) {
          console.error("Error fetching focused user:", err);
        }
      }

      fetchNearby(coords.lat, coords.lng);
    }, (err) => {
      console.error("Geolocation error:", err);
      setLoading(false);
    });
  }, [token, routerLocation.search]);

  useEffect(() => {
    if (freelancers.length > 0) {
      const params = new URLSearchParams(routerLocation.search);
      const focusId = params.get('f');
      const focusLat = params.get('lat');
      const focusLng = params.get('lng');

      if (focusId) {
        const target = freelancers.find(f => f._id === focusId);
        if (target) {
          setSelected(target);
          setFocusPos([target.lat, target.long]);
        } else if (focusLat && focusLng) {
           // If freelancer not in list (maybe too far), manually focus on coordinates
           setFocusPos([parseFloat(focusLat), parseFloat(focusLng)]);
        }
      } else if (routerLocation.state?.focusFreelancer) {
        const target = freelancers.find(f => f._id === routerLocation.state.focusFreelancer);
        if (target) { setSelected(target); setFocusPos([target.lat, target.long]); }
      }
    }
  }, [freelancers, routerLocation]);

  const fetchNearby = async (lat, lng) => {
    try {
      const res = await api.get(`/location/nearby?lat=${lat}&lng=${lng}`);
      setFreelancers(prev => {
        // Merge with already selected freelancer if they are not in the nearby list
        const nearby = res.data;
        if (selected && !nearby.find(f => f._id === selected._id)) {
          return [selected, ...nearby];
        }
        return nearby;
      });
    } catch (err) {
      console.error('Nearby fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (f) => {
    setSelected(f);
    setFocusPos([f.lat, f.long]);
  };

  const startSharing = () => {
    if (!selected) return;
    setSharing(true);
    socket.emit('share_request', {
      clientId: user?._id, clientName: user?.name,
      freelancerId: selected._id, bookingId: 'temp_' + Date.now(),
    });
    const id = navigator.geolocation.watchPosition(pos => {
      const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMyPos(newPos);
      socket.emit('client_update_location', { bookingId: 'temp_' + Date.now(), ...newPos });
    });
    setWatchId(id);
  };

  const stopSharing = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setWatchId(null);
    setSharing(false);
  };

  const filtered = freelancers.filter(f =>
    f.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
    f.location?.toLowerCase().includes(searchQ.toLowerCase())
  );

  if (loading) return <RadarLoader />;

  return (
    <div className="h-screen w-full flex bg-[#0c0f16] overflow-hidden font-sans select-none relative">
      
      {/* ── NASA/Military Background Assets ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
      </div>
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* ── LEFT SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="w-[400px] shrink-0 bg-[#0c0f16]/80 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[500] relative overflow-hidden shadow-[50px_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Sidebar Header */}
            <div className="p-10 pb-8 relative z-10 flex flex-col gap-6">
              
              {/* Back to Home Button */}
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group w-fit"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all shadow-xl shadow-black/20">
                   <ChevronLeft size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Nexus</span>
                </div>
              </button>

              <div className="flex items-center gap-4 mt-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <Radio className="text-white animate-pulse" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Nexus <span className="text-indigo-500">Radar</span></h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1.5">Intelligence v4.0</p>
                </div>
              </div>
              <div className="h-px bg-white/5 w-full mt-2" />
            </div>

            {/* Global Location Search */}
            <div className="px-10 mb-8 relative z-10">
              <form onSubmit={handleGlobalSearch} className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-indigo-500">
                   <Search size={16} />
                   <div className="w-px h-3 bg-white/10" />
                </div>
                <input
                  type="text"
                  value={locSearch}
                  onChange={e => setLocSearch(e.target.value)}
                  placeholder="SCAN CITY OR AREA..."
                  className="w-full pl-14 pr-10 py-5 bg-white/5 border border-white/10 rounded-[24px] text-[10px] font-black text-white placeholder:text-slate-800 outline-none focus:border-indigo-500/40 transition-all uppercase tracking-[0.2em] ring-1 ring-white/5 shadow-2xl"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-white transition-colors">
                  <Navigation size={14} />
                </button>
              </form>
            </div>

            {/* Stats row */}
            <div className="px-10 py-8 grid grid-cols-3 gap-4 border-b border-white/5">
              {[
                { label: 'NODES', value: freelancers.length, accent: false },
                { label: 'RANGE', value: '15KM', accent: true },
                { label: 'SYNC', value: 'PRO', accent: false },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/5 rounded-[20px] px-4 py-4 text-center ring-1 ring-white/5">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={cn("text-lg font-black leading-none", s.accent ? "text-indigo-500" : "text-white")}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Freelancer List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 opacity-20 py-20">
                  <Radio size={48} className="text-slate-600" />
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] text-center leading-relaxed">
                    Zero signal detected <br /> in current radius
                  </p>
                </div>
              ) : (
                filtered.map(f => (
                  <FreelancerListItem
                    key={f._id}
                    freelancer={f}
                    isSelected={selected?._id === f._id}
                    onClick={() => handleSelect(f)}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-10 border-t border-white/5 bg-black/20">
              <div className="flex items-center justify-center gap-2">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Nexus Network v2.4.9</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAP PANEL ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-10 left-10 z-[1000] flex items-center gap-4 bg-[#0c0f16]/95 backdrop-blur-3xl border border-white/10 hover:border-indigo-500/50 px-6 py-4 rounded-[24px] text-slate-400 hover:text-white transition-all shadow-[0_30px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
        >
          {sidebarOpen
            ? <><X size={18} /><span className="text-[11px] font-black uppercase tracking-[0.3em]">HidE Intelligence</span></>
            : <><Radio size={18} className="text-indigo-500" /><span className="text-[11px] font-black uppercase tracking-[0.3em]">Show Radar</span></>
          }
        </button>

        {/* Top-right status bar */}
        <div className="absolute top-10 right-10 z-[1000] flex flex-col gap-4 items-end">
          <div className="flex items-center gap-4 bg-[#0c0f16]/95 backdrop-blur-3xl border border-white/10 px-6 py-4 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
            <Wifi size={16} className="text-indigo-500 animate-pulse" />
            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none">{freelancers.length} Active Nodes detected</span>
          </div>
          {sharing && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-3xl px-6 py-4 rounded-[24px] shadow-2xl ring-1 ring-white/10"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest leading-none">Broadcast active</span>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-12 right-10 z-[1000] flex flex-col gap-4">
          <button
            onClick={() => myPos && setFocusPos([myPos.lat, myPos.lng])}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all active:scale-95 group"
            title="Focus My Location"
          >
            <Navigation size={22} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Leaflet Map - Maximum 3D Depth */}
        <div className="h-full w-full perspective-2000">
           <div className="h-full w-full transition-transform duration-1000 ease-out preserve-3d" 
                style={{ 
                  transform: 'rotateX(15deg) scale(1.1)',
                  transformOrigin: 'bottom center',
                  willChange: 'transform'
                }}>
            <MapContainer
              center={myPos ? [myPos.lat, myPos.lng] : [24.8607, 67.0011]}
              zoom={14}
              zoomControl={false}
              className="h-full w-full z-0"
            >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <FlyToLocation center={focusPos} />

          {myPos && (
            <Marker position={[myPos.lat, myPos.lng]} icon={clientMarker}>
              <Popup>
                <div className="text-[10px] font-black text-indigo-500 p-3 uppercase tracking-[0.2em] bg-[#0c0f16]">📍 Deployment Node (YOU)</div>
              </Popup>
            </Marker>
          )}

          {freelancers.map(f => (
            <Marker
              key={f._id || f.id}
              position={[f.lat || f.latitude, f.long || f.longitude]}
              icon={freelancerMarker(selected?._id === (f._id || f.id) || selected?.id === (f._id || f.id), f.avatar, f.name)}
              eventHandlers={{ click: () => handleSelect(f) }}
            >
              <Popup>
                <div className="flex items-center gap-5 p-4 min-w-[200px] bg-[#0c0f16]/95">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 text-lg font-black border border-indigo-500/30 shrink-0 shadow-2xl">
                    {f.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm text-white leading-tight uppercase tracking-tight mb-1.5">{f.name}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 fill-indigo-500 text-indigo-500" />
                      <span className="text-[11px] font-black text-slate-500 leading-none">{f.rating || '5.0'}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Freelancer Detail Card */}
        {selected && (
          <div className="absolute inset-x-0 bottom-0 z-[2000] p-10 pointer-events-none">
            <FreelancerDetailPanel
              selected={selected}
              sharing={sharing}
              onStartSharing={startSharing}
              onStopSharing={stopSharing}
              onClose={() => { setSelected(null); stopSharing(); }}
            />
          </div>
        )}
        </div>
        </div>
        </div>

      <style>{`
        :root {
          --radar-primary: #4f46e5;
        }
        
        @keyframes colorCycle {
          0% { background-color: hsl(0, 70%, 60%); }
          20% { background-color: hsl(72, 70%, 60%); }
          40% { background-color: hsl(144, 70%, 60%); }
          60% { background-color: hsl(216, 70%, 60%); }
          80% { background-color: hsl(288, 70%, 60%); }
          100% { background-color: hsl(360, 70%, 60%); }
        }
        
        @keyframes colorCycleBorder {
          0% { border-color: hsl(0, 100%, 60%); }
          100% { border-color: hsl(360, 100%, 60%); }
        }
        
        @keyframes colorCycleShadow {
          0% { box-shadow: 0 0 30px hsl(0, 100%, 60%); }
          100% { box-shadow: 0 0 30px hsl(360, 100%, 60%); }
        }

        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .leaflet-container { background: transparent !important; }
        
        /* Scanline Anim */
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .marker-body:hover {
          filter: brightness(1.2) contrast(1.1);
        }
        
        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes propSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes droneFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes beamPulse {
          0% { opacity: 0.3; transform: scaleX(1); }
          100% { opacity: 0.6; transform: scaleX(1.2); }
        }
        @keyframes shadowScale {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(0.7); opacity: 0.2; }
        }
        @keyframes radarPulse {
          0%   { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          background: rgba(12,15,22,0.98) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          border-radius: 32px !important;
          box-shadow: 0 50px 100px rgba(0,0,0,0.9) !important;
          padding: 0 !important;
          backdrop-filter: blur(30px);
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          margin: 140px 40px !important;
          background: rgba(12,15,22,0.95) !important;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8) !important;
        }
        .leaflet-control-zoom a {
          background: transparent !important;
          color: #475569 !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          transition: all 0.4s !important;
          height: 44px !important;
          width: 44px !important;
          line-height: 44px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover { 
          background: rgba(79,70,229,0.2) !important; 
          color: #818cf8 !important;
        }
      `}</style>
    </div>
  );
};

export default FreelancerRadar;
