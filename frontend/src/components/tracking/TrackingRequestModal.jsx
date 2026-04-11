import React, { useState, useEffect } from 'react';
import socket from '../../utils/socket';
import { useAuth } from '../../context/AuthContext';
import { Bell, MapPin, Check, X, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrackingRequestModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("incoming_share_request", (data) => {
       console.log("🔔 Incoming tracking request:", data);
       setRequest(data);
    });

    return () => socket.off("incoming_share_request");
  }, [user]);

  const handleAccept = () => {
    socket.emit("accept_share", {
       clientId: request.clientId,
       bookingId: request.bookingId
    });
    // Redirect to map view (we'll implement this next)
    navigate(`/track-client/${request.bookingId}`, { state: { client: request } });
    setRequest(null);
  };

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
       <div className="w-full max-w-md bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white space-y-8 animate-in zoom-in-95 duration-500">
          <div className="text-center">
             <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[1.8rem] flex items-center justify-center shadow-lg mx-auto mb-6 relative">
                <Bell size={32} />
                <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-bounce"></div>
             </div>
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Track Request</h3>
             <p className="text-slate-500 font-medium mt-2">Client <span className="text-indigo-600 font-black">{request.clientName}</span> wants to share their live location with you.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                <MapPin size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Purpose</p>
                <p className="text-sm font-bold text-slate-700">Real-time meeting assistance</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => setRequest(null)}
               className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
             >
                <X size={18} /> Reject
             </button>
             <button 
               onClick={handleAccept}
               className="py-4 bg-indigo-600 hover:bg-black text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 active:scale-95"
             >
                <Check size={18} /> Accept & View
             </button>
          </div>
       </div>
    </div>
  );
};

export default TrackingRequestModal;
