import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Sparkles, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';

// shadcn/ui
import { Button }    from '@/components/ui/Button';
import { Input }     from '@/components/ui/Input';
import { Separator } from '@/components/ui/separator';
import { Badge }     from '@/components/ui/Badge';

/* ─── Social SVG Icons ─── */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

/* ─── Data ─── */
const navLinks = [
  { label: 'Marketplace',       href: '/services'  },
  { label: 'Freelancer Radar',  href: '/radar'     },
  { label: 'Active Gigs',       href: '/gigs'      },
  { label: 'Success Stories',   href: '/stories'   },
  { label: 'Affiliate Program', href: '/affiliate' },
];

const socialLinks = [
  {
    icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com',
    color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 hover:border-transparent',
  },
  {
    icon: LinkedInIcon,  label: 'LinkedIn',  href: 'https://linkedin.com',
    color: 'hover:bg-[#0077B5] hover:border-[#0077B5]',
  },
  {
    icon: FacebookIcon,  label: 'Facebook',  href: 'https://facebook.com',
    color: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
  },
  {
    icon: YouTubeIcon,   label: 'YouTube',   href: 'https://youtube.com',
    color: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
  },
];

const contactItems = [
  { icon: Mail,   label: 'Email',  value: 'hello@microfiverr.pk' },
  { icon: MapPin, label: 'Office', value: 'Tech Tower, Karachi'  },
];

const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

/* ─── Newsletter ─── */
const Newsletter = () => {
  const [email,     setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused,   setFocused]   = useState(false);

  const handleJoin = () => {
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <h4 className="text-white font-bold text-xs uppercase tracking-widest">Newsletter</h4>
        <Badge className="bg-purple-600 hover:bg-purple-600 text-[10px] px-1.5 py-0 h-4 font-semibold">5k+</Badge>
      </div>
      <p className="text-sm leading-relaxed">Weekly tips to scale your freelance business in Pakistan.</p>

      {submitted ? (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          You're in! Welcome aboard 🎉
        </div>
      ) : (
        <div className={`flex gap-2 p-1 rounded-xl border transition-all duration-200 ${
          focused ? 'border-purple-500 bg-white/5 shadow-lg shadow-purple-500/10' : 'border-white/10 bg-white/5'
        }`}>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            className="bg-transparent border-none text-white placeholder:text-slate-500 text-sm h-8
                       focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
          <Button
            size="sm"
            onClick={handleJoin}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold h-8 px-3 shrink-0 rounded-lg active:scale-95 transition-all"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

/* ─── Main Footer ─── */
const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 border-t border-white/5 mt-auto">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="space-y-5 sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white
                            shadow-lg shadow-purple-600/30 group-hover:rotate-12 group-hover:shadow-purple-500/50
                            transition-all duration-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg font-black text-white tracking-tight italic">Micro Fiverr.</span>
          </Link>

          <p className="text-sm leading-relaxed max-w-xs">
            Pakistan's premier marketplace for local talent. Connecting skilled professionals with projects that matter.
          </p>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Follow us</p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center
                              text-slate-400 hover:text-white hover:-translate-y-1 hover:shadow-lg
                              transition-all duration-200 ${color}`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-5">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-3">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-sm hover:text-purple-400 transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-purple-500 transition-all duration-200 rounded-full" />
                  {label}
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-5">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Contact</h4>
          <ul className="space-y-4">
            {contactItems.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-400
                                group-hover:bg-purple-600 group-hover:text-white shrink-0 mt-0.5 transition-all duration-200">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
                  <p className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <Newsletter />
      </div>

      <Separator className="bg-white/5 mb-8" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© 2026 Micro Fiverr. Built with ❤️ for Pakistan.</p>
        <div className="flex flex-wrap justify-center gap-5">
          {legalLinks.map(link => (
            <Link key={link} to="#" className="hover:text-purple-400 transition-colors hover:underline underline-offset-4">
              {link}
            </Link>
          ))}
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;