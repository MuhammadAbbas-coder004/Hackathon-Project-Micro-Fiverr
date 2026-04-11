import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, User, Mail, Lock, ShieldCheck,
  ArrowRight, UserPlus, Briefcase, GraduationCap,
} from 'lucide-react';

// shadcn/ui
import { Button }   from '@/components/ui/Button';
import { Input }    from '@/components/ui/Input';
import { Label }    from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from '@/components/ui/Card';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';

/* ── Success screen ── */
const SuccessScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
    <Card className="w-full max-w-sm text-center shadow-lg border border-purple-100 py-10 px-6">
      <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
        <ShieldCheck className="h-7 w-7" />
      </div>
      <CardTitle className="text-xl font-bold text-slate-900 mb-2">Account Created!</CardTitle>
      <CardDescription className="text-slate-500 text-sm leading-relaxed">
        Welcome aboard. Redirecting you to login…
      </CardDescription>
    </Card>
  </div>
);

/* ── Field wrapper ── */
const Field = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-slate-600">{label}</Label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      {children}
    </div>
  </div>
);

/* ── Main ── */
const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'client', location: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRole = (val) => {
    setFormData(prev => ({ ...prev, role: val }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.location)
      return setError('Please fill in all fields.');

    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) { setSuccess(true); setTimeout(() => navigate('/login'), 2000); }
      else setError(result.message);
    } catch { setError('An unexpected error occurred.'); }
    finally { setLoading(false); }
  };

  if (success) return <SuccessScreen />;

  const inputCls = 'pl-9 h-10 border-purple-100 focus-visible:ring-purple-500 focus-visible:border-purple-400';

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4 pt-24 pb-12">
      <Card className="w-full max-w-md shadow-lg border border-purple-100">

        {/* Header */}
        <CardHeader className="text-center space-y-3 pt-7 pb-5">
          <div className="mx-auto w-11 h-11 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-md relative">
            <UserPlus className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Create Account</CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Pakistan's local services marketplace
            </CardDescription>
          </div>
        </CardHeader>

        {/* Form */}
        <CardContent className="px-6">
          {error && (
            <Alert variant="destructive" className="py-2 px-3 text-xs mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <Field label="Full Name" icon={User}>
              <Input
                type="text" name="name" value={formData.name}
                onChange={handleChange} placeholder="e.g. Ali Hassan"
                className={inputCls} required
              />
            </Field>

            {/* 2-col grid on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Address" icon={Mail}>
                <Input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="name@gmail.com"
                  className={inputCls} required
                />
              </Field>

              <Field label="Location" icon={MapPin}>
                <Input
                  type="text" name="location" value={formData.location}
                  onChange={handleChange} placeholder="Karachi, Sindh"
                  className={inputCls} required
                />
              </Field>

              <Field label="Password" icon={Lock}>
                <Input
                  type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••"
                  className={inputCls} required
                />
              </Field>

              {/* Role select */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">I want to</Label>
                <Select value={formData.role} onValueChange={handleRole}>
                  <SelectTrigger className="h-10 border-purple-100 focus:ring-purple-500 text-sm">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5" /> Hire Talent
                      </span>
                    </SelectItem>
                    <SelectItem value="freelancer">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5" /> Sell Skills
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit" disabled={loading}
              className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm mt-1"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-4 px-6 pb-7 pt-2">
          <div className="flex items-center gap-3 w-full">
            <Separator className="flex-1" />
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">or</span>
            <Separator className="flex-1" />
          </div>

          <p className="text-sm text-slate-500 text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center gap-0.5 transition-colors"
            >
              Sign in <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium">Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium">Verified</span>
            </div>
          </div>
        </CardFooter>

      </Card>
    </div>
  );
};

export default Register;