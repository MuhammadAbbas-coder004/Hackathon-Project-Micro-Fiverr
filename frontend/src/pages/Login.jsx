import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

// shadcn/ui
import { Button }   from '@/components/ui/Button';
import { Input }    from '@/components/ui/Input';
import { Label }    from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'freelancer') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError('Please fill in all fields.');
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        if (result.user.role === 'freelancer') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
      else setError(result.message);
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4 pt-24 pb-12">
      <Card className="w-full max-w-sm shadow-lg border border-purple-100">

        {/* Header */}
        <CardHeader className="text-center space-y-3 pt-7 pb-5">
          <div className="mx-auto w-11 h-11 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-md">
            <LogIn className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>

        {/* Form */}
        <CardContent className="space-y-4 px-6">
          {error && (
            <Alert variant="destructive" className="py-2 px-3 text-xs">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-600">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="pl-9 h-10 border-purple-100 focus-visible:ring-purple-500 focus-visible:border-purple-400"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-600">
                  Password
                </Label>
                <Link
                  to="#"
                  className="text-[11px] text-purple-600 font-medium hover:text-purple-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-9 h-10 border-purple-100 focus-visible:ring-purple-500 focus-visible:border-purple-400"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm mt-1"
            >
              {loading ? 'Signing in…' : 'Sign In'}
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
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center gap-0.5 transition-colors"
            >
              Create one <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[10px] font-medium">End-to-end encrypted</span>
          </div>
        </CardFooter>

      </Card>
    </div>
  );
};

export default Login;