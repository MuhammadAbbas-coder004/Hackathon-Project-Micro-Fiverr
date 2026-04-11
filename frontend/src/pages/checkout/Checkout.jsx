import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldCheck, CreditCard, Lock, CheckCircle2,
  Sparkles, Loader2, ArrowRight, Receipt, LayoutDashboard,
  User, Calendar, KeyRound, Banknote,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// shadcn/ui
import { Button }   from '@/components/ui/Button';
import { Input }    from '@/components/ui/Input';
import { Label }    from '@/components/ui/label';
import { Badge }    from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/Card';

/* ─── Loading ─── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-purple-50">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <p className="text-sm text-slate-500 font-medium">Loading service…</p>
    </div>
  </div>
);

/* ─── Error ─── */
const ErrorScreen = ({ serviceId }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 px-4 text-center gap-6">
    <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
      <ShieldCheck className="h-7 w-7" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Service Not Found</h1>
      <p className="text-slate-500 text-sm">
        ID <code className="text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded text-xs">{serviceId}</code> is unavailable.
      </p>
    </div>
    <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-xl px-6">
      <Link to="/services">Back to Marketplace</Link>
    </Button>
  </div>
);

/* ─── Success / Receipt ─── */
const SuccessScreen = ({ completedData, service }) => (
  <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4 py-10">
    <Card className="w-full max-w-md shadow-lg border border-purple-100 overflow-hidden">

      {/* Receipt header */}
      <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Payment Receipt</p>
          <h2 className="text-white font-bold text-lg mt-0.5">Micro Fiverr</h2>
        </div>
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Status badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Status</span>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-semibold">
            ✓ Successful
          </Badge>
        </div>

        <Separator />

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Transaction ID', value: (completedData._id || 'TXN').slice(-10) },
            { label: 'Amount Paid',    value: `Rs. ${completedData.amount?.toLocaleString()}` },
            { label: 'Client',         value: completedData.payerName || 'Verified Client' },
            { label: 'Card',           value: `•••• ${completedData.cardLast4 || '8892'}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{label}</p>
              <p className="font-bold text-slate-900 truncate">{value}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Service</p>
          <p className="font-semibold text-slate-900 text-sm truncate">{service?.title}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            className="border-purple-100 hover:bg-purple-50 rounded-xl font-semibold text-sm"
            onClick={() => window.print()}
          >
            <Receipt className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-sm">
            <Link to="/active-hires">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

/* ─── Card input field ─── */
const CardField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-slate-600">{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <Input
        {...props}
        className="pl-9 h-10 border-purple-100 focus-visible:ring-purple-500 focus-visible:border-purple-400"
      />
    </div>
  </div>
);

/* ─── Main Checkout ─── */
const Checkout = () => {
  const { serviceId } = useParams();
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
      await new Promise(r => setTimeout(r, 1500));
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
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">

        {/* Page title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Payment form ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Amount */}
            <Card className="border border-purple-100 shadow-sm">
              <CardHeader className="pb-4 pt-5 px-5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-purple-600" /> Payment Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-purple-600 pointer-events-none">
                    Rs.
                  </span>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={e => setCustomAmount(Number(e.target.value))}
                    className="pl-12 h-11 border-purple-100 focus-visible:ring-purple-500 text-base font-bold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card info */}
            <Card className="border border-purple-100 shadow-sm">
              <CardHeader className="pb-4 pt-5 px-5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-purple-600" /> Card Details
                </CardTitle>
                <CardDescription className="text-xs">Your card info is never stored.</CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">
                <CardField label="Card Number" icon={CreditCard}
                  type="text" name="number" value={cardData.number}
                  onChange={handleCardChange} placeholder="1234 5678 9012 3456"
                />
                <CardField label="Name on Card" icon={User}
                  type="text" name="name" value={cardData.name}
                  onChange={handleCardChange} placeholder="Ali Hassan"
                />
                <div className="grid grid-cols-2 gap-4">
                  <CardField label="Expiry" icon={Calendar}
                    type="text" name="expiry" value={cardData.expiry}
                    onChange={handleCardChange} placeholder="MM / YY"
                  />
                  <CardField label="CVV" icon={KeyRound}
                    type="password" name="cvv" value={cardData.cvv}
                    onChange={handleCardChange} placeholder="•••"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Error */}
            {payError && (
              <Alert variant="destructive" className="py-2 px-3 text-xs border-red-200">
                <AlertDescription>{payError}</AlertDescription>
              </Alert>
            )}

            {/* Pay button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-all"
            >
              {processing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
              ) : (
                <><Lock className="mr-2 h-4 w-4" /> Pay Rs. {customAmount.toLocaleString()}</>
              )}
            </Button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 pt-1">
              {[
                { icon: ShieldCheck, label: 'SSL Encrypted'   },
                { icon: Lock,        label: 'Secure Payment'  },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-slate-400">
                  <Icon className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-[11px] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:col-span-2">
            <Card className="border border-purple-100 shadow-sm sticky top-6">
              <CardHeader className="pb-4 pt-5 px-5">
                <CardTitle className="text-sm font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">

                {/* Service image + title */}
                {service?.image && (
                  <div className="rounded-xl overflow-hidden aspect-video">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <p className="font-bold text-slate-900 text-sm leading-snug">{service?.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    by <span className="text-purple-600 font-semibold">{service?.providerId?.name || 'Pro Agent'}</span>
                  </p>
                </div>

                <Separator className="border-purple-50" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium">Rs. {customAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform fee</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                </div>

                <Separator className="border-purple-50" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-purple-600 text-lg">Rs. {customAmount.toLocaleString()}</span>
                </div>

                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Protected by Micro Fiverr's secure payment system.
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;