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
    <div className="h-screen w-screen relative font-['Outfit'] overflow-hidden">
      
      {/* 🧭 HEADER */}
      <div className="absolute top-10 left-10 z-[1000] flex items-center gap-4">
         <Link to="/dashboard/provider" className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl border border-white">
            <ArrowLeft size={24} />
         </Link>
         <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-3xl shadow-2xl border border-white">
            <h1 className="text-lg font-black text-slate-900 italic tracking-tight">Tracking Client</h1>
            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               {clientInfo?.clientName || 'Live Session'}
            </p>
         </div>
      </div>

      {/* 🗺️ MAP */}
      <div className="h-full w-full z-0">
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

      {/* 📄 TELEMETRY CARD */}
      <div className="absolute bottom-10 left-10 right-10 lg:left-auto lg:w-96 z-[1000] bg-white/90 backdrop-blur-xl rounded-[3.5rem] p-10 shadow-2xl border border-white space-y-8 animate-in slide-in-from-right-10">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <Navigation size={28} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900">Link Active</h3>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 italic">Receiving Packets</p>
            </div>
         </div>

         <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Last Update</span>
               </div>
               <span className="text-sm font-black text-indigo-600">{lastSeen ? lastSeen.toLocaleTimeString() : 'WAITING...'}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Status</p>
                  <p className="text-xs font-black text-slate-900">MOVING</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Distance</p>
                  <p className="text-xs font-black text-slate-900">CALCULATING</p>
               </div>
            </div>
         </div>

         <div className="flex items-center justify-center gap-3 py-4 border-t border-slate-100">
            <Shield size={14} className="text-indigo-500 font-black" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">This link expires when sharing stops</span>
         </div>
      </div>

    </div>
  );
};

export default LiveClientTracking;
