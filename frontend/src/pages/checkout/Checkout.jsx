import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldCheck, CreditCard, Lock, CheckCircle2,
  Sparkles, Loader2, ArrowRight, Receipt, LayoutDashboard,
  User, Calendar, KeyRound, Banknote, Shield, Zap, Activity,
  ChevronLeft, Fingerprint, Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// shadcn/ui
import { Button }   from '../../components/ui/Button';
import { Input }    from '../../components/ui/Input';
import { Label }    from '../../components/ui/label';
import { Badge }    from '../../components/ui/Badge';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '../../components/ui/Card';

const cn = (...classes) => classes.filter(Boolean).join(' ');

/* ─── Loading ─── */
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0e14] relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none" />
    <div className="relative z-10 flex flex-col items-center gap-6">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] animate-pulse">Initializing Payment Node...</p>
    </div>
  </div>
);

/* ─── Error ─── */
const ErrorScreen = ({ serviceId }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0e14] px-4 text-center gap-10 relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none" />
    <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[32px] flex items-center justify-center shadow-2xl border border-rose-500/20 ring-1 ring-white/5">
      <ShieldCheck className="h-10 w-10" />
    </div>
    <div className="space-y-2">
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Connection Failed</h1>
      <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
        Node ID <code className="text-indigo-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 mx-1">{serviceId}</code> Not Detected
      </p>
    </div>
    <Button asChild className="bg-indigo-600 hover:bg-indigo-500 rounded-2xl px-10 h-14 font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all">
      <Link to="/services">Back to Nexus</Link>
    </Button>
  </div>
);

/* ─── Success / Receipt ─── */
const SuccessScreen = ({ completedData, service }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0b0e14] px-4 py-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none" />
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-xl"
    >
      <Card className="border border-white/10 bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[48px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
        
        {/* Receipt header */}
        <div className="bg-indigo-600 px-10 py-10 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.1] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-2">Transmission Successful</p>
            <h2 className="text-white font-black text-3xl uppercase tracking-tighter leading-none">Nexus Receipt</h2>
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-[24px] flex items-center justify-center text-white shadow-2xl border border-white/30 relative z-10">
            <CheckCircle2 size={32} />
          </div>
        </div>

        <CardContent className="p-10 space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Protocol Status</span>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Verified</span>
            </div>
          </div>

          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={20} />
             </div>
             <div>
                <p className="text-emerald-400 font-black text-[11px] uppercase tracking-widest">Payment Received</p>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">Freelancer Node Updated Successfully</p>
             </div>
          </div>

          <Separator className="bg-white/5" />

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Transaction Details</p>
            <div className="space-y-3">
              {[
                { label: 'TXN Node', value: (completedData._id || 'TXN').slice(-12).toUpperCase() },
                { label: 'Payer Identity', value: completedData.payerName || 'Verified Client' },
                { label: 'Freelancer Node', value: service?.providerId?.name || 'Pro Expert' },
                { label: 'Asset Title', value: service?.title },
                { label: 'Settlement Value', value: `Rs. ${completedData.amount?.toLocaleString()}`, highlight: true },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-tight truncate max-w-[200px]",
                    item.highlight ? "text-indigo-400" : "text-white"
                  )}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Zap size={24} />
             </div>
             <div className="min-w-0">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Access Protocol</p>
                <p className="font-black text-white text-sm truncate uppercase tracking-tight leading-none">Initialization Complete</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl h-14 font-black text-[10px] uppercase tracking-[0.2em] text-white"
              onClick={() => window.print()}
            >
              <Receipt className="mr-3 h-4 w-4" /> Print
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-500 rounded-2xl h-14 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20">
              <Link to="/dashboard">
                <LayoutDashboard className="mr-3 h-4 w-4" /> Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

/* ─── Card input field ─── */
const CardField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-3">
    <Label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">{label}</Label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors z-10">
        <Icon size={18} />
      </div>
      <Input
        {...props}
        className="pl-12 h-14 bg-white/5 border-white/10 rounded-[20px] text-white font-bold text-sm outline-none focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 transition-all ring-1 ring-white/5 shadow-2xl"
      />
    </div>
  </div>
);

/* ─── Main Checkout ─── */
const Checkout = () => {
  const { serviceId } = useParams();
  const navigate      = useNavigate();
  const { token }     = useAuth();

  const [service,       setService]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [processing,    setProcessing]    = useState(false);
  const [completed,     setCompleted]     = useState(false);
  const [completedData, setCompletedData] = useState(null);
  const [payError,      setPayError]      = useState('');
  const [customAmount,  setCustomAmount]  = useState(0);
  const [cardData,      setCardData]      = useState({ number: '', name: '', expiry: '', cvv: '' });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/services/${serviceId}`);
        setService(res.data);
        setCustomAmount(res.data.price);
      } catch {
        try {
          const res2 = await axios.get(`/api/service/${serviceId}`);
          setService(res2.data);
          setCustomAmount(res2.data.price);
        } catch { setError('Service not found.'); }
      } finally { setLoading(false); }
    };
    if (serviceId) fetch();
  }, [serviceId]);

  const handleCardChange = e =>
    setCardData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePayment = async () => {
    setPayError('');
    if (!service) return setPayError('Service data not loaded. Please refresh.');
    if (customAmount <= 0) return setPayError('Please enter a valid amount.');

    const freelancerId = service.providerId?._id || service.providerId || service.userId;
    if (!freelancerId) return setPayError('Freelancer info missing. Please refresh.');

    const payload = {
      freelancerId,
      serviceId: service._id || serviceId,
      amount: Number(customAmount),
      cardInfo: { name: cardData.name || 'Demo Client' },
    };

    setProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 2000)); // Hype delay
      const res = await axios.post('/api/payment/fake-payment', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCompletedData({
          ...res.data.transaction,
          payerName: cardData.name || 'Verified Client',
          cardLast4: cardData.number ? cardData.number.slice(-4) : '8892',
        });
        setCompleted(true);
      }
    } catch (err) {
      setPayError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally { setProcessing(false); }
  };

  if (loading)                   return <PageLoader />;
  if (!service || error)         return <ErrorScreen serviceId={serviceId} />;
  if (completed && completedData) return <SuccessScreen completedData={completedData} service={service} />;

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-4 py-20 relative overflow-hidden selection:bg-indigo-600 selection:text-white font-sans">
      
      {/* Decorative Assets */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none opacity-40" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10">

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-10 flex items-center gap-3 text-slate-500 hover:text-white transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
             <ChevronLeft size={20} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">Return to Nexus</span>
        </button>

        {/* Page title */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
            <h4 className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.5em]">Secure Transaction Node</h4>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none">Checkout <span className="text-indigo-500">Flow</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Left: Payment form ── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Amount */}
            <div className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-[40px] shadow-2xl ring-1 ring-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
                 <Banknote size={48} strokeWidth={1} />
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Sparkles size={16} />
                   </div>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest">Initialization Amount</h3>
                </div>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-indigo-500 pointer-events-none">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={e => setCustomAmount(Number(e.target.value))}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-[32px] pl-20 pr-8 text-4xl font-black text-white outline-none focus:border-indigo-500/50 transition-all tracking-tighter"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4">Values are synced in real-time with the local currency node.</p>
              </div>
            </div>

            {/* Card info */}
            <div className="bg-[#0c0f16]/60 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-[40px] shadow-2xl ring-1 ring-white/5 space-y-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors">
                 <CreditCard size={48} strokeWidth={1} />
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Fingerprint size={16} />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Identity Access</h3>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">End-to-end encrypted session</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <CardField label="Card Signal" icon={CreditCard}
                    type="text" name="number" value={cardData.number}
                    onChange={handleCardChange} placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="md:col-span-2">
                  <CardField label="Identity Holder" icon={User}
                    type="text" name="name" value={cardData.name}
                    onChange={handleCardChange} placeholder="Full legal name..."
                  />
                </div>
                <CardField label="Temporal Expiry" icon={Calendar}
                  type="text" name="expiry" value={cardData.expiry}
                  onChange={handleCardChange} placeholder="MM / YY"
                />
                <CardField label="Security Key (CVV)" icon={KeyRound}
                  type="password" name="cvv" value={cardData.cvv}
                  onChange={handleCardChange} placeholder="•••"
                />
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {payError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/20 text-rose-500 rounded-[20px] p-4 text-[10px] font-black uppercase tracking-widest">
                    <AlertDescription className="flex items-center gap-2">
                      <Shield size={14} /> {payError}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pay button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full h-20 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[32px] text-[12px] uppercase tracking-[0.4em] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 group disabled:opacity-50"
            >
              {processing ? (
                <><Activity className="h-5 w-5 animate-spin" /> Syncing Nodes...</>
              ) : (
                <><Lock size={20} className="group-hover:translate-x-[-2px] transition-transform" /> Initialize Payment Rs. {customAmount.toLocaleString()}</>
              )}
            </Button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-10 pt-4 opacity-40">
              {[
                { icon: ShieldCheck, label: 'SSL-256 Bit'   },
                { icon: Lock,        label: 'Auth-Secure'  },
                { icon: Cpu,         label: 'Direct Node'  }
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-400">
                  <Icon size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-5">
            <div className="bg-[#0c0f16]/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 sm:p-10 shadow-2xl ring-1 ring-white/5 sticky top-28 space-y-10 overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                 <h3 className="text-lg font-black text-white uppercase tracking-tighter">Nexus Manifest</h3>
                 <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-full px-4 py-1 font-black text-[9px] uppercase tracking-widest">v1.0.4</Badge>
              </div>

              {/* Service image + title */}
              <div className="space-y-8 relative z-10">
                {service?.image && (
                  <div className="rounded-[32px] overflow-hidden aspect-[16/10] border border-white/10 shadow-2xl relative group-hover:scale-[1.02] transition-transform duration-700">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="space-y-4">
                  <p className="font-black text-white text-2xl leading-tight uppercase tracking-tight line-clamp-3">{service?.title}</p>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 w-fit">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm uppercase">
                      {service?.providerId?.name?.charAt(0) || 'P'}
                    </div>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      Managed by <span className="text-white ml-1">{service?.providerId?.name || 'Vetted Agent'}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-5 pt-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-600">Base Node Cost</span>
                    <span className="text-white">Rs. {customAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-slate-600">Platform Gas Fee</span>
                    <span className="text-emerald-500">Node-Free</span>
                  </div>
                  <Separator className="bg-white/5" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[13px] font-black text-white uppercase tracking-[0.2em]">Final Node Value</span>
                    <span className="font-black text-indigo-500 text-3xl tracking-tighter leading-none">Rs. {customAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] p-6 flex items-start gap-4 ring-1 ring-white/5">
                  <ShieldCheck size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-indigo-300 leading-relaxed uppercase tracking-widest">
                    Protected by Nexus Shield. Funds are escrowed until node verification is complete.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
