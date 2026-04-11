import React, { useState } from 'react';
import { useLocationTracking } from '../../hooks/useLocationTracking';
import { MapPin, Navigation, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const LocationSender = ({ bookingId, userId }) => {
  const { isSharing, location, error, startSharing, stopSharing } = useLocationTracking(bookingId, userId, "freelancer");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSharing ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                {isSharing ? <Navigation size={22} className="animate-pulse" /> : <MapPin size={22} />}
             </div>
             <div>
                <h3 className="text-white font-black tracking-tight text-lg">Live Location</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isSharing ? 'Currently Broadcasting' : 'Transmission Offline'}</p>
             </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${isSharing ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
             {isSharing ? 'Live' : 'Standby'}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 animate-in slide-in-from-top-2">
             <AlertCircle size={18} />
             <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        {isSharing && location && (
           <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                 <span>Telemetry</span>
                 <span className="text-indigo-400">Syncing...</span>
              </div>
              <p className="text-xs font-mono text-slate-300">LAT: {location.lat.toFixed(6)}</p>
              <p className="text-xs font-mono text-slate-300">LNG: {location.lng.toFixed(6)}</p>
           </div>
        )}

        <div className="flex flex-col gap-4">
           {isSharing ? (
             <button 
               onClick={stopSharing}
               className="w-full py-4 bg-red-600 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-500/10 active:scale-95 flex items-center justify-center gap-3"
             >
                Stop Sharing
             </button>
           ) : (
             <button 
               onClick={startSharing}
               className="w-full py-4 bg-indigo-600 hover:bg-white hover:text-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3"
             >
                Start Live Broadcast
             </button>
           )}
           
           <div className="flex items-center justify-center gap-2 text-slate-600">
              <Shield size={12} />
              <span className="text-[10px] font-black uppercase">Secure Link for Hired Client Only</span>
           </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-0 rounded-full"></div>
    </div>
  );
};

export default LocationSender;
