import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
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

/* ─── Custom map markers ─── */
const freelancerMarker = (isSelected) => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:28px;height:28px;">
      <div style="
        width:28px;height:28px;
        background:${isSelected ? '#4f46e5' : '#0c0f16'};
        border-radius:50%;
        border:3px solid ${isSelected ? '#4f46e5' : '#4f46e5'};
        box-shadow: 0 0 ${isSelected ? '20px' : '10px'} rgba(79,70,229,${isSelected ? '0.8' : '0.4'});
        display:flex;align-items:center;justify-content:center;
      "></div>
      ${isSelected ? `<div style="
        position:absolute;inset:-8px;
        border:2px solid rgba(79,70,229,0.3);
        border-radius:50%;
        animation:radarPulse 1.5s ease-out infinite;
      "></div>` : ''}
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const clientMarker = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="width:20px;height:20px;background:#ffffff;border-radius:50%;border:3px solid #09090b;box-shadow:0 0 15px rgba(255,255,255,0.5);"></div>
      <div style="position:absolute;inset:-6px;border:2px solid rgba(255,255,255,0.2);border-radius:50%;animation:radarPulse 2s ease-out infinite;"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/* ─── Loading Overlay ─── */
const RadarLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#0b0e14]">
    <div className="flex flex-col items-center gap-8">
      {/* Radar animation */}
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full border border-indigo-500/10" />
        <div className="absolute inset-6 rounded-full border border-indigo-500/20" />
        <div className="absolute inset-12 rounded-full border border-indigo-500/30" />
        <div className="absolute inset-16 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
          <Radio className="h-8 w-8 text-indigo-500 animate-pulse" />
        </div>
        {/* Sweep */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 h-20 w-[3px] bg-gradient-to-t from-indigo-500/0 to-indigo-500/80 origin-bottom blur-[1px]"
            style={{ animation: 'radarSweep 2.5s linear infinite' }}
          />
        </div>
      </div>
      <div className="text-center space-y-3">
        <p className="font-black text-white text-base uppercase tracking-[0.6em]">Scanning Nearby Nodes</p>
        <div className="flex items-center justify-center gap-3">
           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Synchronizing GPS Matrix…</p>
        </div>
      </div>
    </div>
    <style>{`
      @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
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
        <div className="h-14 w-14 rounded-2xl bg-[#0c0f16] flex items-center justify-center font-black text-white border border-white/10 shadow-2xl group-hover:border-indigo-500/40 transition-all">
          {initials}
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
                <div className="h-24 w-24 rounded-3xl bg-indigo-600 flex items-center justify-center font-black text-white text-3xl border-2 border-indigo-500/30 shadow-2xl">
                  {initials}
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
                  {selected.location && (
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMyPos(coords);
      fetchNearby(coords.lat, coords.lng);
    }, () => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (freelancers.length > 0 && routerLocation.state?.focusFreelancer) {
      const target = freelancers.find(f => f._id === routerLocation.state.focusFreelancer);
      if (target) { setSelected(target); setFocusPos([target.lat, target.long]); }
    }
  }, [freelancers, routerLocation]);

  const fetchNearby = async (lat, lng) => {
    try {
      const res = await axios.get(`/api/location/nearby?lat=${lat}&lng=${lng}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFreelancers(res.data);
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
    <div className="h-screen w-full flex overflow-hidden bg-[#0b0e14] selection:bg-indigo-600 selection:text-white relative font-sans">
      
      {/* ── LEFT SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -380, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="w-[400px] shrink-0 bg-[#0c0f16]/80 backdrop-blur-3xl border-r border-white/10 flex flex-col z-[500] relative overflow-hidden ring-1 ring-white/5"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="p-10 pb-8 border-b border-white/5 relative z-10">
              
              {/* Back to Home Button */}
              <button 
                onClick={() => navigate('/')}
                className="mb-10 flex items-center gap-3 text-slate-500 hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                   <ChevronLeft size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Nexus</span>
              </button>

              <div className="flex items-center justify-between mb-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                    </div>
                    <h1 className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Radar Matrix</h1>
                  </div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] pl-6 leading-none">Scanning active nodes...</p>
                </div>
                <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-2xl">
                  <Signal size={14} className="text-indigo-500" />
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="IDENTIFY NODE..."
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[24px] text-[11px] font-black text-white placeholder:text-slate-800 outline-none focus:border-indigo-500/40 transition-all uppercase tracking-[0.2em] ring-1 ring-white/5 shadow-2xl"
                />
              </div>
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

        {/* Leaflet Map */}
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
              key={f._id}
              position={[f.lat, f.long]}
              icon={freelancerMarker(selected?._id === f._id)}
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
          <FreelancerDetailPanel
            selected={selected}
            sharing={sharing}
            onStartSharing={startSharing}
            onStopSharing={stopSharing}
            onClose={() => { setSelected(null); stopSharing(); }}
          />
        )}
      </div>

      {/* Global styles */}
      <style>{`
        .leaflet-container { background: #0b0e14 !important; }
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
        @keyframes radarPulse {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FreelancerRadar;
