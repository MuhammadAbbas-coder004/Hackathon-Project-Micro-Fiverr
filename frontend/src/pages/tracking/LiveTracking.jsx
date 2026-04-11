import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { MapPin, Navigation, Phone, MessageSquare, ArrowLeft, Loader2, Clock, ShieldCheck } from 'lucide-react';
import socket from '../../utils/socket';
import { getDistance } from '../../utils/geo';
import { useAuth } from '../../context/AuthContext';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom pulse icon for Freelancer
const freelancerIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color: #4f46e5; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(79, 70, 229, 0.5); position: relative;'>
           <div style='position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #4f46e5; opacity: 0.6; animation: pulse 2s infinite;'></div>
         </div>`,
  iconSize: [15, 15],
  iconAnchor: [7, 7]
});

// Component to handle map center updates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const LiveTracking = () => {
  const { bookingId } = useParams();
  const { user, token } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time states
  const [providerPos, setProviderPos] = useState(null);
  const [customerPos, setCustomerPos] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [distance, setDistance] = useState("0.0");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
        
        // Initial positions from DB
        const cPos = { lat: res.data.customerId?.lat || 24.8607, lng: res.data.customerId?.long || 67.0011 };
        const pPos = { lat: res.data.providerId?.lat || 24.8601, lng: res.data.providerId?.long || 67.0019 };
        
        setCustomerPos(cPos);
        setProviderPos(pPos);
        setDistance(getDistance(cPos.lat, cPos.lng, pPos.lat, pPos.lng));
      } catch (err) {
        console.error("Error fetching tracking data:", err);
        setError("Could not load tracking details.");
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchBooking();
  }, [bookingId, token]);

  // Socket setup
  useEffect(() => {
    if (!socket || !bookingId) return;

    socket.emit("join_tracking", bookingId);

    socket.on("location_received", (data) => {
      console.log("📍 Live location signal:", data);
      const newPos = { lat: data.lat, lng: data.lng };
      setProviderPos(newPos);
      setHistory(prev => [...prev.slice(-20), newPos]);
      setLastUpdated(new Date(data.updatedAt));
      
      if (customerPos) {
        setDistance(getDistance(customerPos.lat, customerPos.lng, data.lat, data.lng));
      }
    });

    return () => {
      socket.off("location_received");
    };
  }, [bookingId, customerPos]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-['Outfit']">
      <div className="text-center space-y-6">
        <div className="relative">
           <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
           </div>
        </div>
        <p className="text-slate-900 font-black text-xl italic animate-pulse">Establishing Live Link...</p>
      </div>
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center font-['Outfit']">
      <div className="max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <div className="text-7xl mb-8">📡</div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">{error || "Signal Lost"}</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">Tracking is unavailable for this booking. Please ensure the provider has started sharing their location.</p>
        <Link to="/" className="inline-block px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95">Return to Safety</Link>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-slate-50 relative font-['Outfit'] overflow-hidden">
      {/* 🧭 NAVIGATION HEADER */}
      <div className="absolute top-8 left-8 right-8 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link to="/active-hires" className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-black/5 border border-white/50">
            <ArrowLeft size={24} />
          </Link>
          <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-2xl shadow-xl border border-white/50">
             <h1 className="text-lg font-black text-slate-900 italic tracking-tight">Live Tracker</h1>
             <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">{booking.serviceId?.title}</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl shadow-black/20 flex items-center gap-6 pointer-events-auto border border-white/10">
           <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Gap</p>
              <p className="text-xl font-black italic">{distance} <span className="text-[10px] text-indigo-400">KM</span></p>
           </div>
           <div className="w-px h-8 bg-white/10"></div>
           <div className="text-center">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal Hits</p>
              <p className="text-xl font-black text-emerald-400">{history.length}</p>
           </div>
        </div>
      </div>

      {/* 🗺️ MAP ENGINE (LEAFLET) */}
      <div className="h-full w-full z-0">
        <MapContainer 
          center={providerPos || [24.8607, 67.0011]} 
          zoom={15} 
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {providerPos && (
             <>
               <ChangeView center={providerPos} zoom={15} />
               <Marker position={providerPos} icon={freelancerIcon}>
                  <Popup className="custom-popup">
                     <div className="text-center">
                        <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest mb-1">{booking.providerId?.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold">LIVE LOCATION</p>
                     </div>
                  </Popup>
               </Marker>
               {history.length > 1 && <Polyline positions={history} pathOptions={{ color: '#4f46e5', weight: 4, dashArray: '10, 10', opacity: 0.5 }} />}
             </>
          )}

          {customerPos && (
             <Marker position={customerPos}>
                <Popup>You are here</Popup>
             </Marker>
          )}
        </MapContainer>
      </div>

      {/* 📄 FLOATING INFO CARDS */}
      <div className="absolute bottom-8 left-8 right-8 z-[1000] grid grid-cols-1 lg:grid-cols-4 gap-6 items-end pointer-events-none">
         
         {/* STATUS CARD */}
         <div className="lg:col-span-1 bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white pointer-events-auto space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-indigo-50 p-1 border border-indigo-100 overflow-hidden shadow-lg">
                  <img 
                    src={booking.providerId?.avatar || `https://ui-avatars.com/api/?name=${booking.providerId?.name}`} 
                    className="w-full h-full object-cover rounded-[0.9rem]" 
                    alt="" 
                  />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{booking.providerId?.name}</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connected</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-400 transition-all group">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                     <Phone size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Call</span>
               </button>
               <Link to="/chat" className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-400 transition-all group">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                     <MessageSquare size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Chat</span>
               </Link>
            </div>
         </div>

         {/* LIVE TELEMETRY CARD */}
         <div className="lg:col-span-2 hidden lg:flex bg-slate-900/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/10 pointer-events-auto items-center justify-between text-white gap-10">
            <div className="flex-1 space-y-6">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={14} className="text-indigo-400" />
                     Encrypted Link
                  </p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Clock size={14} className="text-indigo-400" />
                     {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Waiting...'}
                  </p>
               </div>
               
               <div className="space-y-2">
                  <div className="flex justify-between items-end">
                     <p className="text-sm font-bold text-slate-400">Transit Progress</p>
                     <p className="text-lg font-black italic">{Math.max(0, 100 - (parseFloat(distance) * 10)).toFixed(0)}%</p>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1">
                     <div 
                       className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                       style={{ width: `${Math.max(5, 100 - (parseFloat(distance) * 10))}%` }}
                     ></div>
                  </div>
               </div>
            </div>

            <div className="w-1/3 bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/20">
                  <Navigation size={22} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Speed</p>
               <p className="text-2xl font-black italic">Slow <span className="text-[10px] text-slate-500">M/S</span></p>
            </div>
         </div>

         {/* COORDS CARD */}
         <div className="lg:col-span-1 bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white pointer-events-auto">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telemetry</span>
                  <div className="px-3 py-1 bg-indigo-50 text-[9px] font-black text-indigo-600 rounded-full uppercase">Real-Time</div>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-[10px] font-bold text-slate-600 space-y-1">
                  <p>LAT: {providerPos?.lat.toFixed(6)}</p>
                  <p>LNG: {providerPos?.lng.toFixed(6)}</p>
               </div>
               <div className="bg-indigo-600 p-6 rounded-3xl text-white text-center shadow-xl shadow-indigo-100">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                  <p className="text-lg font-black italic">ON TRACK</p>
               </div>
            </div>
         </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        .leaflet-container { font-family: 'Outfit', sans-serif !important; }
        .custom-popup .leaflet-popup-content-wrapper { 
          border-radius: 1rem; 
          padding: 0.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .leaflet-div-icon { background: transparent; border: none; }
      `}} />
    </div>
  );
};

export default LiveTracking;
