import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import socket from '../../utils/socket';
import { ArrowLeft, Navigation, MapPin, Search, Clock, Shield } from 'lucide-react';

const clientMarker = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color: #ef4444; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);'></div>`,
  iconSize: [15, 15],
  iconAnchor: [7, 7]
});

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 16);
  return null;
};

const LiveClientTracking = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const clientInfo = location.state?.client;

  const [clientPos, setClientPos] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    if (!socket || !bookingId) return;

    socket.emit("join_tracking", bookingId);

    socket.on("client_location_received", (data) => {
       console.log("📍 Client location received:", data);
       setClientPos({ lat: data.lat, lng: data.lng });
       setLastSeen(new Date());
    });

    return () => socket.off("client_location_received");
  }, [bookingId]);

  return (
    <div className="h-screen w-screen relative font-['Outfit'] overflow-hidden bg-[#F4F7FE]">
      
      {/* 🧭 HEADER */}
      <div className="absolute top-6 md:top-10 left-6 md:left-10 z-[1000] flex items-center gap-4 md:gap-6">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link 
              to="/dashboard/provider" 
              className="w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-2xl rounded-2xl md:rounded-3xl flex items-center justify-center text-[#1B2559] shadow-xl border border-white hover:scale-105 active:scale-95 transition-all"
            >
               <ArrowLeft size={24} />
            </Link>
         </motion.div>
         
         <motion.div 
           initial={{ opacity: 0, y: -20 }} 
           animate={{ opacity: 1, y: 0 }}
           className="bg-[#1B2559] backdrop-blur-2xl px-6 md:px-10 py-4 md:py-5 rounded-[24px] md:rounded-[32px] shadow-2xl border border-white/10"
         >
            <h1 className="text-md md:text-xl font-black text-white tracking-tight leading-none mb-2">Tracking Client</h1>
            <div className="flex items-center gap-3">
               <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-[#41D352] rounded-full animate-ping absolute"></span>
                  <span className="w-2.5 h-2.5 bg-[#41D352] rounded-full relative"></span>
               </div>
               <p className="text-[10px] md:text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">
                  {clientInfo?.clientName || 'Live Session Active'}
               </p>
            </div>
         </motion.div>
      </div>

      {/* 🗺️ MAP */}
      <div className="h-full w-full z-0 relative">
         <div className="absolute inset-0 bg-indigo-900/5 pointer-events-none z-10" />
         <MapContainer center={[24.8607, 67.0011]} zoom={14} zoomControl={false} className="h-full w-full">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            {clientPos && (
               <>
                  <ChangeView center={clientPos} />
                  <Marker position={clientPos} icon={clientMarker}>
                     <Popup>Client's Current Location</Popup>
                  </Marker>
               </>
            )}
         </MapContainer>
      </div>

      {/* 📄 TELEMETRY HUD */}
      <div className="absolute bottom-6 md:bottom-10 left-6 right-6 md:left-auto md:right-10 md:w-[420px] z-[1000]">
         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white/90 backdrop-blur-3xl rounded-[40px] md:rounded-[56px] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-white space-y-10"
         >
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#F4F7FE] rounded-2xl flex items-center justify-center text-[#4845D2] shadow-inner border border-white">
                     <Navigation size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-[#1B2559] tracking-tighter">Live Link</h3>
                     <p className="text-[11px] font-black text-[#41D352] uppercase tracking-widest mt-1">Encrypted Stream</p>
                  </div>
               </div>
               <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4845D2] animate-pulse" />
                  <span className="text-[10px] font-black text-[#4845D2] tracking-tighter uppercase tracking-widest">Active</span>
               </div>
            </div>

            <div className="grid gap-6">
               <div className="bg-[#F4F7FE]/50 backdrop-blur-sm p-6 rounded-[32px] border border-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1B2559]/20 shadow-sm">
                        <Clock size={20} />
                     </div>
                     <span className="text-[12px] font-black text-[#7D8592] uppercase tracking-widest">Sync Clock</span>
                  </div>
                  <span className="text-md font-black text-[#1B2559] tracking-tighter">{lastSeen ? lastSeen.toLocaleTimeString() : 'INITIATING...'}</span>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#F4F7FE]/50 p-5 rounded-[32px] border border-white text-center shadow-sm">
                     <p className="text-[10px] font-black uppercase text-[#7D8592] mb-2 tracking-widest opacity-40">Status</p>
                     <p className="text-md font-black text-[#1B2559] tracking-tighter">POSITION_LOCKED</p>
                  </div>
                  <div className="bg-[#F4F7FE]/50 p-5 rounded-[32px] border border-white text-center shadow-sm">
                     <p className="text-[10px] font-black uppercase text-[#7D8592] mb-2 tracking-widest opacity-40">Frequency</p>
                     <p className="text-md font-black text-[#1B2559] tracking-tighter">2.4 GHZ</p>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-[#F4F7FE]">
               <Shield size={16} className="text-[#4845D2]/40" />
               <span className="text-[10px] font-black uppercase text-[#7D8592] tracking-widest opacity-40">Secure Session End-to-End</span>
            </div>
         </motion.div>
      </div>

    </div>
  );
};

export default LiveClientTracking;
