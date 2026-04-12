import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  Zap,
  ChevronRight,
  Globe,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { 
  FaInstagram, 
  FaLinkedinIn, 
  FaFacebookF, 
  FaYoutube 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

// shadcn/ui
import { Button }    from '@/components/ui/Button';
import { Input }     from '@/components/ui/Input';
import { Badge }     from '@/components/ui/Badge';

/* ─── Refined Social Links ─── */
const socialLinks = [
  { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com', color: 'hover:text-orange-500 hover:border-orange-500/40' },
  { icon: FaLinkedinIn, label: 'LinkedIn',  href: 'https://linkedin.com',  color: 'hover:text-orange-500 hover:border-orange-500/40' },
  { icon: FaFacebookF, label: 'Facebook',  href: 'https://facebook.com',  color: 'hover:text-orange-500 hover:border-orange-500/40' },
  { icon: FaYoutube,   label: 'YouTube',   href: 'https://youtube.com',   color: 'hover:text-orange-500 hover:border-orange-500/40' },
];

const navLinks = [
  { label: 'Marketplace',       href: '/services'  },
  { label: 'Freelancer Radar',  href: '/radar'     },
  { label: 'Active Gigs',       href: '/gigs'      },
  { label: 'Success Stories',   href: '/stories'   },
  { label: 'Affiliate Program', href: '/affiliate' },
];

const contactItems = [
  { icon: Mail,   label: 'Email',        value: 'hello@microfiverr.pk' },
  { icon: MapPin, label: 'Headquarters', value: 'Tech Tower, Karachi, PK'  },
];

const legalLinks = [
  { label: 'Privacy', icon: ShieldCheck },
  { label: 'Terms',   icon: FileText },
  { label: 'Cookies', icon: Globe },
  { label: 'Security',icon: ShieldCheck }
];

/* ─── Modernized Newsletter ─── */
const Newsletter = () => {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleJoin = () => {
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] opacity-50">Insights</h4>
        <div className="h-0.5 w-8 bg-gradient-to-r from-orange-500 to-transparent rounded-full" />
      </div>
      <p className="text-zinc-500 text-sm font-medium leading-relaxed">
        Join 5,000+ top-tier freelancers receiving strategic weekly updates.
      </p>

      {submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 text-emerald-400 bg-emerald-400/5 rounded-2xl px-5 py-4 border border-emerald-400/10"
        >
          <CheckCircle2 size={18} className="shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Subscription Active</span>
        </motion.div>
      ) : (
        <div className="relative group/input">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-1000" />
          <Input
            type="email"
            placeholder="Work Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="relative h-12 bg-zinc-900/80 border-white/5 text-white placeholder:text-zinc-700 rounded-xl px-5 focus:ring-1 focus:ring-orange-500/50 transition-all outline-none"
          />
          <Button
            onClick={handleJoin}
            className="absolute right-1 top-1 h-10 px-4 bg-orange-500 hover:bg-white text-black rounded-lg transition-all shadow-[0_4px_20px_rgba(249,115,22,0.1)] hover:shadow-orange-500/20"
          >
            <ArrowRight size={16} className="group-hover/input:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
};

const FooterLogo = () => {
  const { user } = useAuth();
  const isFreelancer = user?.role === 'freelancer';

  return (
    <Link to={isFreelancer ? "/dashboard/provider" : "/"} className="flex items-center gap-2 group outline-none">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-orange-500 rounded-lg blur-[2px] opacity-10 group-hover:opacity-30 transition-opacity" 
        />
        <Zap className="relative h-6 w-6 text-orange-500 fill-orange-500/20 group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight text-white uppercase">
          MICRO<span className="text-orange-500 font-black">FIVERR</span>
        </span>
        <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-0.5">Elite Freelance Network</span>
      </div>
    </Link>
  );
};

const Footer = () => (
  <footer className="bg-black text-zinc-400 mt-auto relative overflow-hidden group/footer">
    {/* Noise Texture Overlay */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    
    {/* Advanced Background Glow Elements */}
    <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-orange-600/10 blur-[140px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" />
    <div className="absolute top-12 right-12 w-72 h-72 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none animate-bounce duration-[12000ms] opacity-50" />

    <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20 mb-28">

        {/* ══ Brand Section ══ */}
        <div className="space-y-8">
          <FooterLogo />
          <p className="text-sm font-medium leading-relaxed text-zinc-500 max-w-xs">
            The definitive platform for verified professional talent in Pakistan. Precision hiring, live tracking, and elite execution.
          </p>

          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, label, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10",
                  color
                )}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* ══ Explore ══ */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] opacity-50">Exploration</h4>
            <div className="h-0.5 w-8 bg-gradient-to-r from-orange-500 to-transparent rounded-full" />
          </div>
          <ul className="space-y-5">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight size={12} className="text-orange-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ══ Connectivity ══ */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.4em] opacity-50">Connectivity</h4>
            <div className="h-0.5 w-8 bg-gradient-to-r from-orange-500 to-transparent rounded-full" />
          </div>
          <ul className="space-y-6">
            {contactItems.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500
                                group-hover:bg-orange-500 group-hover:text-black transition-all duration-500">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-tighter text-zinc-700">{label}</p>
                  <p className="text-white text-sm font-bold tracking-tight group-hover:text-orange-500 transition-colors uppercase">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ══ Newsletter ══ */}
        <Newsletter />
      </div>

      {/* ══ Bottom Bar (True Borderless) ══ */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-800 text-center md:text-left">
          © 2026 <span className="text-zinc-700">Micro Fiverr Network.</span> <br className="md:hidden" /> Designed for the 1%.
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {legalLinks.map(({ label, icon: Icon }) => (
            <Link key={label} to="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-800 hover:text-white transition-colors group">
              <Icon size={12} className="text-zinc-900 group-hover:text-orange-500 transition-colors" />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-900 group cursor-pointer">
          Built with <Zap size={10} className="text-orange-500/40 group-hover:text-orange-500 transition-colors" /> in <span className="text-orange-500/20 group-hover:text-orange-500 transition-colors duration-500">Pakistan</span>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;