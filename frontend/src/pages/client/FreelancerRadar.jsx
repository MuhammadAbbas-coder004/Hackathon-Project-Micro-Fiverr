import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import socket from '../../utils/socket';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin, Star, Send, Shield, X, Radio, Users,
  StopCircle, Zap, Activity, ShieldCheck, Search,
  Navigation, ChevronRight, Signal, Wifi
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
        background:${isSelected ? '#f97316' : '#111111'};
        border-radius:50%;
        border:3px solid ${isSelected ? '#f97316' : '#f97316'};
        box-shadow: 0 0 ${isSelected ? '20px' : '10px'} rgba(249,115,22,${isSelected ? '0.8' : '0.4'});
        display:flex;align-items:center;justify-content:center;
      "></div>
      ${isSelected ? `<div style="
        position:absolute;inset:-8px;
        border:2px solid rgba(249,115,22,0.3);
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
  <div className="h-screen w-full flex items-center justify-center bg-black">
    <div className="flex flex-col items-center gap-8">
      {/* Radar animation */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border border-orange-500/10" />
        <div className="absolute inset-4 rounded-full border border-orange-500/20" />
        <div className="absolute inset-8 rounded-full border border-orange-500/30" />
        <div className="absolute inset-12 rounded-full bg-orange-500/10 flex items-center justify-center">
          <Radio className="h-6 w-6 text-orange-500 animate-pulse" />
        </div>
        {/* Sweep */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 h-16 w-[2px] bg-gradient-to-t from-orange-500/0 to-orange-500/80 origin-bottom"
            style={{ animation: 'radarSweep 2s linear infinite' }}
          />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="font-black text-white text-sm uppercase tracking-[0.4em]">Scanning Nearby Area</p>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Synchronizing GPS Matrix…</p>
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
        "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group relative",
        isSelected
          ? "bg-orange-500/10 border border-orange-500/30"
          : "border border-transparent hover:bg-white/5 hover:border-white/5"
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12 rounded-xl border border-orange-500/20 shadow-lg">
          <AvatarImage src={`https://ui-avatars.com/api/?name=${freelancer.name}&background=f97316&color=000`} />
          <AvatarFallback className="bg-zinc-900 text-orange-500 font-black text-sm">{initials}</AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("font-black text-sm uppercase tracking-tight leading-none truncate mb-2",
          isSelected ? "text-orange-500" : "text-white group-hover:text-white")}
        >
          {freelancer.name}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
            <span className="text-[10px] font-bold text-zinc-500">{freelancer.rating || '5.0'}</span>
          </div>
          {freelancer.location && (
            <>
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="text-[10px] font-bold text-zinc-600 truncate">{freelancer.location}</span>
            </>
          )}
        </div>
      </div>

      <ChevronRight size={16} className={cn("shrink-0 transition-all", isSelected ? "text-orange-500" : "text-zinc-700 group-hover:text-zinc-400")} />
    </motion.div>
  );
};

/* ─── Bottom Sheet Card (when marker clicked) ─── */
const FreelancerDetailPanel = ({ selected, sharing, onStartSharing, onStopSharing, onClose }) => {
  const initials = selected.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'F';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute bottom-8 left-8 right-8 z-[2000] max-w-xl mx-auto"
      >
        <div className="bg-zinc-950/95 backdrop-blur-3xl border border-white/10 shadow-[0_50px_120px_rgba(0,0,0,0.9)] rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 blur-[60px] rounded-full pointer-events-none" />
          
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-2xl bg-white/5 hover:bg-orange-500/20 hover:text-orange-500 text-zinc-500 flex items-center justify-center transition-all active:scale-90"
          >
            <X size={18} />
          </button>

          <div className="p-8 space-y-6 relative z-10">
            {/* Profile */}
            <div className="flex items-center gap-6 pr-12">
              <div className="relative">
                <Avatar className="h-20 w-20 rounded-2xl border-2 border-orange-500/30 shadow-2xl">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${selected.name}&background=f97316&color=000`} />
                  <AvatarFallback className="bg-zinc-900 text-orange-500 font-black text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-emerald-500 border-4 border-zinc-950" />
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-white text-2xl uppercase tracking-tighter leading-none">{selected.name}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/5 px-3 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                    <span className="text-xs font-black text-white">{selected.rating || '5.0'}</span>
                  </div>
                  {selected.location && (
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">{selected.location}</span>
                  )}
                </div>
              </div>
            </div>

            {selected.bio && (
              <p className="text-sm text-zinc-400 leading-relaxed border-l-4 border-orange-500/40 bg-orange-500/5 px-5 py-4 rounded-r-2xl italic">
                "{selected.bio}"
              </p>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {sharing ? (
                <button
                  onClick={onStopSharing}
                  className="w-full h-14 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all border border-red-500/30 flex items-center justify-center gap-3 active:scale-95"
                >
                  <StopCircle size={18} /> Terminate Signal
                </button>
              ) : (
                <button
                  onClick={onStartSharing}
                  className="w-full h-14 bg-orange-500 hover:bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-[0_20px_40px_rgba(249,115,22,0.3)] flex items-center justify-center gap-3 active:scale-95"
                >
                  <Send size={18} /> Broadcast Live Location
                </button>
              )}
              {sharing && (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live link active — encrypted</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 pt-1">
                <ShieldCheck size={14} className="text-zinc-700" />
                <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Main Component ─── */
const FreelancerRadar = () => {
  const { user, token }     = useAuth();
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
    <div className="h-screen w-full flex overflow-hidden bg-black selection:bg-orange-500 selection:text-black">

      {/* ── LEFT SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="w-[340px] shrink-0 bg-zinc-950 border-r border-zinc-900 flex flex-col z-[500] relative overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="p-6 pb-4 border-b border-zinc-900 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                    </div>
                    <h1 className="text-xs font-black text-white uppercase tracking-[0.3em]">Radar HUD</h1>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest pl-5">Live Node Registry</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 px-3 py-2 rounded-xl">
                  <Signal size={12} className="text-orange-500" />
                  <span className="text-[10px] font-black text-zinc-400">{freelancers.length} Active</span>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search freelancers..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-white/5 rounded-2xl text-sm text-white placeholder:text-zinc-700 outline-none focus:border-orange-500/30 transition-all font-medium"
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="px-6 py-4 grid grid-cols-3 gap-2 border-b border-zinc-900">
              {[
                { label: 'Nearby', value: freelancers.length, accent: false },
                { label: 'Radius', value: '10 KM', accent: true },
                { label: 'Online', value: freelancers.length, accent: false },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">{s.label}</p>
                  <p className={cn("text-lg font-black leading-none", s.accent ? "text-orange-500" : "text-white")}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Freelancer List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a transparent' }}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 opacity-30 py-20">
                  <Radio size={40} className="text-zinc-600" />
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">
                    {searchQ ? 'No results found' : 'Zero signals in range'}
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
            <div className="p-5 border-t border-zinc-900">
              <Link
                to="/"
                className="flex items-center justify-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-orange-500 transition-colors"
              >
                <Zap size={14} />
                Back to Command Center
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAP PANEL ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-6 left-6 z-[1000] flex items-center gap-2.5 bg-zinc-900/90 backdrop-blur-xl border border-white/5 hover:border-orange-500/30 px-4 py-3 rounded-2xl text-zinc-400 hover:text-orange-500 transition-all shadow-2xl"
        >
          {sidebarOpen
            ? <><X size={16} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Close Panel</span></>
            : <><Radio size={16} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Radar</span></>
          }
        </button>

        {/* Top-right status bar */}
        <div className="absolute top-6 right-6 z-[1000] flex items-center gap-3">
          {sharing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl px-4 py-2.5 rounded-2xl"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">LIVE SIGNAL ACTIVE</span>
            </motion.div>
          )}
          <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-xl border border-white/5 px-4 py-2.5 rounded-2xl shadow-2xl">
            <Wifi size={14} className="text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{freelancers.length} Nodes</span>
          </div>
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
                <div className="text-xs font-bold text-zinc-900 p-1">📍 You are here</div>
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
                <div className="flex items-center gap-3 p-1.5 min-w-[160px]">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 text-xs font-black border border-orange-500/20 shrink-0">
                    {f.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-zinc-900 leading-tight">{f.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-2.5 w-2.5 fill-orange-500 text-orange-500" />
                      <span className="text-[10px] text-zinc-500">{f.rating || '5.0'}</span>
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

        {/* Empty state */}
        {!loading && freelancers.length === 0 && !selected && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-3xl border border-white/5 rounded-2xl px-8 py-5 shadow-2xl">
              <Radio className="h-5 w-5 text-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">No active nodes detected in range</span>
            </div>
          </div>
        )}
      </div>

      {/* Global styles */}
      <style>{`
        .leaflet-container { background: #09090b !important; }
        .leaflet-popup-content-wrapper {
          background: rgba(9,9,11,0.95) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 16px !important;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8) !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.05) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          margin: 90px 16px !important;
          background: rgba(9,9,11,0.9) !important;
        }
        .leaflet-control-zoom a {
          background: transparent !important;
          color: #71717a !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          transition: color 0.2s, background 0.2s !important;
        }
        .leaflet-control-zoom a:hover { 
          background: rgba(249,115,22,0.1) !important; 
          color: #f97316 !important;
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