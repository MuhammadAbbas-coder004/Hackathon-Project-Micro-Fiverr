import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import socket from '../../utils/socket';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin, Star, Send, Shield, Navigation,
  Loader2, X, Radio, Users, Locate, StopCircle,
} from 'lucide-react';

// shadcn/ui
import { Button }   from '@/components/ui/Button';
import { Badge }    from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card, CardContent,
} from '@/components/ui/Card';

/* ─── Map fly helper ─── */
const FlyToLocation = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16, { duration: 2.5 });
  }, [center, map]);
  return null;
};

/* ─── Custom map markers ─── */
const freelancerMarker = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#9333ea;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(147,51,234,0.5);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const clientMarker = L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#ef4444;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(239,68,68,0.5);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/* ─── Loading screen ─── */
const RadarLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-purple-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 flex items-center justify-center">
          <Radio className="h-7 w-7 text-purple-600 animate-pulse" />
        </div>
        <span className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-30" />
      </div>
      <div className="text-center">
        <p className="font-bold text-slate-800 text-sm">Scanning nearby area…</p>
        <p className="text-xs text-slate-400 mt-1">Finding freelancers around you</p>
      </div>
    </div>
  </div>
);

/* ─── Stat pill ─── */
const StatPill = ({ label, value, accent }) => (
  <div className="text-center px-4">
    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    <p className={`text-lg font-black leading-tight ${accent ? 'text-purple-400' : 'text-white'}`}>{value}</p>
  </div>
);

/* ─── Freelancer card (bottom sheet) ─── */
const FreelancerCard = ({ selected, sharing, onStartSharing, onStopSharing, onClose }) => {
  const initials = selected.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'F';

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-md animate-in slide-in-from-bottom-4 duration-300">
      <Card className="border border-purple-100 shadow-2xl shadow-purple-900/20 overflow-hidden">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="h-3.5 w-3.5 text-slate-500" />
        </button>

        <CardContent className="p-5 space-y-4">

          {/* Profile row */}
          <div className="flex items-center gap-4 pr-8">
            <div className="relative shrink-0">
              <Avatar className="h-14 w-14 border-2 border-purple-100">
                <AvatarImage src={selected.avatar || `https://ui-avatars.com/api/?name=${selected.name}&background=9333ea&color=fff`} />
                <AvatarFallback className="bg-purple-600 text-white font-bold text-sm">{initials}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-base leading-tight truncate">{selected.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-slate-700">{selected.rating || '5.0'}</span>
                </div>
                {selected.location && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 font-medium">
                    <MapPin className="h-2.5 w-2.5 mr-1" />{selected.location}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {selected.bio && (
            <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-purple-200 pl-3 italic">
              "{selected.bio}"
            </p>
          )}

          <Separator className="border-purple-50" />

          {/* Actions */}
          <div className="space-y-3">
            {sharing ? (
              <Button
                onClick={onStopSharing}
                variant="destructive"
                className="w-full h-10 font-semibold text-sm rounded-xl active:scale-[0.98] transition-all"
              >
                <StopCircle className="mr-2 h-4 w-4" /> Stop Sharing Location
              </Button>
            ) : (
              <Button
                onClick={onStartSharing}
                className="w-full h-10 bg-purple-600 hover:bg-purple-700 font-semibold text-sm rounded-xl active:scale-[0.98] transition-all"
              >
                <Send className="mr-2 h-4 w-4" /> Share Live Location
              </Button>
            )}

            {/* Sharing indicator */}
            {sharing && (
              <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl py-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700">Live location active</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-slate-400">
              <Shield className="h-3 w-3 text-purple-400" />
              <span className="text-[10px] font-medium">End-to-end encrypted</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ─── Main ─── */
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMyPos(coords);
      fetchNearby(coords.lat, coords.lng);
    }, () => setLoading(false));
  }, []);

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

  const handleMarkerClick = (f) => {
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

  if (loading) return <RadarLoader />;

  return (
    <div className="h-screen w-screen relative overflow-hidden">

      {/* ── Top HUD ── */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between gap-3 pointer-events-none">

        {/* Brand pill */}
        <Link
          to="/active-hires"
          className="pointer-events-auto flex items-center gap-2.5 bg-white/95 backdrop-blur border border-white shadow-lg rounded-2xl px-4 py-2.5 hover:shadow-xl transition-shadow"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-bold text-sm text-slate-900">Freelancer Radar</span>
        </Link>

        {/* Stats pill */}
        <div className="pointer-events-auto flex items-center bg-slate-900/95 backdrop-blur border border-white/10 rounded-2xl shadow-lg overflow-hidden divide-x divide-white/10">
          <StatPill label="Nearby" value={freelancers.length} />
          <StatPill label="Radius" value="10 KM" accent />
        </div>
      </div>

      {/* ── Map ── */}
      <MapContainer
        center={myPos ? [myPos.lat, myPos.lng] : [24.8607, 67.0011]}
        zoom={14}
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <FlyToLocation center={focusPos} />

        {myPos && <Marker position={[myPos.lat, myPos.lng]} icon={clientMarker} />}

        {freelancers.map(f => (
          <Marker
            key={f._id}
            position={[f.lat, f.long]}
            icon={freelancerMarker}
            eventHandlers={{ click: () => handleMarkerClick(f) }}
          >
            <Popup className="custom-popup">
              <div className="flex items-center gap-2 p-1 min-w-[140px]">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold shrink-0">
                  {f.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 leading-tight">{f.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] text-slate-500">{f.rating || '5.0'}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ── Freelancer bottom card ── */}
      {selected && (
        <FreelancerCard
          selected={selected}
          sharing={sharing}
          onStartSharing={startSharing}
          onStopSharing={stopSharing}
          onClose={() => { setSelected(null); stopSharing(); }}
        />
      )}

      {/* ── Empty state hint (no freelancers, no card) ── */}
      {!loading && freelancers.length === 0 && !selected && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur border border-slate-100 rounded-2xl px-4 py-3 shadow-lg text-sm text-slate-500">
            <Users className="h-4 w-4 text-purple-400" />
            No freelancers found nearby. Try expanding your area.
          </div>
        </div>
      )}

    </div>
  );
};

export default FreelancerRadar;