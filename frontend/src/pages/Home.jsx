import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Star,
  Globe,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import { Button } from '../components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

/* ─── Inline UI Components (Missing Radix Primitives) ─── */
const Tabs = ({ value, onValueChange, children, className }) => (
  <div className={cn('w-full', className)}>
    {React.Children.map(children, (c) => React.cloneElement(c, { activeValue: value, onValueChange }))}
  </div>
);
const TabsList = ({ children, activeValue, onValueChange, className }) => (
  <div className={cn('flex flex-wrap', className)}>
    {React.Children.map(children, (c) => React.cloneElement(c, { activeValue, onValueChange }))}
  </div>
);
const TabsTrigger = ({ value, children, activeValue, onValueChange, className }) => {
  const isActive = activeValue === value;
  return (
    <button
      onClick={() => onValueChange(value)}
      data-state={isActive ? "active" : "inactive"}
      className={cn("px-3 py-1.5 transition-all outline-none", className)}
    >
      {children}
    </button>
  );
};
const Separator = ({ className }) => <div className={cn('w-full h-px bg-border/50', className)} />;
const Avatar = ({ children, className }) => (
  <div className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)}>
    {children}
  </div>
);
const AvatarFallback = ({ children, className }) => (
  <div className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}>
    {children}
  </div>
);
const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse rounded-md bg-slate-200", className)} />
);

/* ─── Skeleton loader card ─────────────────────────────────── */
const SkeletonCard = () => (
  <Card className="overflow-hidden rounded-2xl border border-border">
    <Skeleton className="h-52 w-full rounded-none" />
    <CardContent className="p-5 space-y-3">
      <Skeleton className="h-3 w-2/3 rounded-full" />
      <Skeleton className="h-3 w-full rounded-full" />
      <Skeleton className="h-3 w-1/2 rounded-full" />
    </CardContent>
  </Card>
);

/* ─── Main Component ────────────────────────────────────────── */
const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('/api/services');
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const stats = [
    { label: 'Verified Pros',  value: '5,000+',   color: 'text-violet-600' },
    { label: 'Monthly Gigs',   value: '12,000+',  color: 'text-violet-600' },
    { label: 'Rating Avg',     value: '4.9 / 5',  color: 'text-violet-600' },
    { label: 'Hours Saved',    value: '250k+',    color: 'text-violet-600' },
  ];

  const categories = [
    { value: 'all',        label: 'All' },
    { value: 'Home Service', label: 'Home' },
    { value: 'Technical',    label: 'Technical' },
    { value: 'Education',    label: 'Education' },
    { value: 'Events',       label: 'Events' },
    { value: 'Design',       label: 'Design' },
  ];

  const filteredServices = services.filter((s) => {
    const matchSearch   = s.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || s.category === category;
    return matchSearch && matchCategory;
  });

  const scrollToMarketplace = () =>
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36 overflow-hidden">

        {/* subtle radial tint */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_55%_0%,hsl(var(--primary)/0.06),transparent)]"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Badge
                variant="secondary"
                className="gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full border border-violet-200 bg-violet-50 text-violet-700"
              >
                <Sparkles className="w-3 h-3" />
                Pakistan's top local talent platform
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Hire elite pros.{' '}
              <span className="text-violet-600">Track them live.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Connect with verified local experts, book instantly, and follow
              their arrival in real-time.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="flex w-full max-w-xl gap-2 p-1.5 bg-background border border-border rounded-xl shadow-sm"
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  placeholder="Plumber, tutor, web dev..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                />
              </div>
              <Button
                onClick={scrollToMarketplace}
                className="h-10 px-5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
              >
                Explore gigs
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.45 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 pt-2 w-full max-w-lg"
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className={`text-2xl sm:text-3xl font-bold tracking-tight ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      <Separator />

      {/* ══════════════════════════════════════════════
          MARKETPLACE
      ══════════════════════════════════════════════ */}
      <section
        id="marketplace"
        className="py-20 sm:py-28 lg:py-36 bg-muted/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="text-xs font-medium text-violet-600 border-violet-200 bg-violet-50"
              >
                Live marketplace
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                Verified{' '}
                <span className="text-violet-600">neighborhood pros</span>
              </h2>
            </div>

            {/* Category tabs */}
            <Tabs value={category} onValueChange={setCategory}>
              <TabsList className="flex-wrap h-auto gap-1 bg-muted p-1 rounded-xl">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="rounded-lg text-xs font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-none"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Cards */}
          {loadingServices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground text-sm">
              No services found. Try a different search or category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredServices.slice(0, 6).map((service, idx) => (
                  <motion.div
                    key={service._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx * 0.06 }}
                  >
                    <Card className="group overflow-hidden rounded-2xl border border-border hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300">

                      {/* Image */}
                      <CardHeader className="p-0 relative overflow-hidden">
                        <div className="relative h-52 overflow-hidden bg-muted">
                          <img
                            src={
                              service.image ||
                              'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800'
                            }
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                          {/* Category badge */}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white/90 text-violet-700 border-0 text-[10px] font-semibold backdrop-blur-sm px-2.5 py-1">
                              {service.category}
                            </Badge>
                          </div>

                          {/* Star */}
                          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                          </div>
                        </div>
                      </CardHeader>

                      {/* Body */}
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-8 h-8 rounded-lg">
                            <AvatarFallback className="rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold">
                              {service.providerId?.name?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {service.providerId?.name || 'Professional'}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin size={10} className="text-violet-400 shrink-0" />
                              <span className="truncate">{service.location}</span>
                            </p>
                          </div>
                        </div>

                        <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors">
                          I will {service.title}
                        </h3>
                      </CardContent>

                      {/* Footer */}
                      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                            Starting at
                          </p>
                          <p className="text-xl font-bold text-violet-600 tracking-tight">
                            Rs. {service.price?.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 rounded-lg text-xs font-medium"
                          >
                            <Link to={`/services/${service._id}`}>Details</Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="h-9 px-4 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"
                          >
                            <Link to={`/checkout/${service._id}`}>Book</Link>
                          </Button>
                        </div>
                      </CardFooter>

                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* View all */}
          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="h-11 px-8 rounded-xl border-border font-medium text-sm gap-2"
            >
              <Link to="/services">
                View all 1,000+ services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      <Separator />

      {/* ══════════════════════════════════════════════
          TRUST / LIVE TRACKING
      ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="rounded-3xl border border-border bg-card overflow-hidden">
            <CardContent className="p-8 sm:p-14 lg:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

                {/* Left: copy */}
                <div className="space-y-8">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 px-4 py-1.5 text-xs font-medium border border-violet-200 bg-violet-50 text-violet-700"
                  >
                    <ShieldCheck size={13} />
                    Pakistan's safest marketplace
                  </Badge>

                  <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                    Track. Safety.{' '}
                    <span className="text-violet-600">Guaranteed.</span>
                  </h2>

                  <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                    Every booking comes with a live GPS link. Follow your pro on
                    the map from the moment they leave for your location.
                  </p>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <Card className="rounded-xl border border-border p-4 space-y-2">
                      <Trophy className="text-violet-600" size={22} />
                      <p className="text-sm font-semibold">Elite talent</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Top 2% vetted experts only.
                      </p>
                    </Card>
                    <Card className="rounded-xl border border-border p-4 space-y-2">
                      <Globe className="text-violet-600" size={22} />
                      <p className="text-sm font-semibold">Countrywide</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Serving 15+ major cities.
                      </p>
                    </Card>
                  </div>
                </div>

                {/* Right: radar card */}
                <div className="flex justify-center">
                  <Card className="w-full max-w-sm rounded-2xl border border-border p-8 flex flex-col items-center gap-6 text-center shadow-sm">

                    <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white">
                      <Navigation size={30} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold tracking-tight mb-1">
                        Live radar
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        Signal pulse active
                      </p>
                    </div>

                    {/* Signal bar */}
                    <div className="w-full bg-muted rounded-xl p-4 space-y-2.5 border border-border">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-muted-foreground">Signal strength</span>
                        <span className="text-violet-600">98.2%</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '98%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, ease: 'easeOut' }}
                          className="h-full bg-violet-600 rounded-full"
                        />
                      </div>
                    </div>

                    <Button className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm">
                      Demo tracking link
                    </Button>

                  </Card>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
};

export default Home;