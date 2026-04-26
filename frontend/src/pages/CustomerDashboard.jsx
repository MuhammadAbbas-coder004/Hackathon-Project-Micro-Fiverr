import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Star, MessageSquare, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

import api from '@/utils/api';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeHires, setActiveHires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveHires = async () => {
      try {
        const res = await api.get('/bookings/user/active');
        setActiveHires(res.data);
      } catch (err) {
        console.error("Error fetching active hires:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveHires();
  }, []);
  
  const actions = [
    { label: 'Find Freelancers', desc: 'Browse available local talents.', icon: Search, to: '/services', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'My Past Hires', desc: 'View complete jobs and reviews.', icon: Briefcase, to: '/active-hires', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Messages', desc: 'Communicate with freelancers.', icon: MessageSquare, to: '/chat', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="relative shrink-0">
            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 sm:border-4 border-background shadow-sm overflow-hidden">
              {user?.avatar ? (
                <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl sm:text-3xl font-bold text-primary uppercase">{user?.name?.charAt(0)}</span>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">Welcome, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-0.5 sm:mt-1 text-[10px] sm:text-sm font-medium">
              Ready to hire top talents?
            </p>
          </div>
        </div>
        <div className="flex items-center shrink-0">
          <Button asChild className="gap-2 h-10 sm:h-auto px-4 sm:px-6">
            <Link to="/services">
              <Search size={16} className="hidden sm:block" /> Browse
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 snap-x no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {actions.map((act, i) => (
          <Link key={i} to={act.to} className="block group shrink-0 w-[240px] sm:w-auto sm:flex-1 snap-start h-full">
            <Card className="border-border/50 shadow-none hover:shadow-md transition-all h-full">
              <CardContent className="p-5 sm:p-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${act.bg} ${act.color} mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <act.icon size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">{act.label}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{act.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Active Hires Overview */}
      <Card className="border-border/50 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Active Hires</CardTitle>
          <CardDescription>Freelancers you are currently working with.</CardDescription>
        </CardHeader>
        <CardContent>
          {activeHires.length > 0 ? (
            <div className="space-y-4">
               {activeHires.map((hire) => (
                 <div key={hire._id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                          {hire.providerId?.avatar ? (
                            <img src={hire.providerId.avatar} className="w-full h-full object-cover" />
                          ) : (
                            hire.providerId?.name?.charAt(0) || 'P'
                          )}
                       </div>
                       <div>
                          <p className="font-bold text-sm text-foreground">{hire.providerId?.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{hire.serviceId?.title}</p>
                       </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase tracking-widest">
                       <Link to="/active-hires">Manage</Link>
                    </Button>
                 </div>
               ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/50 rounded-xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">No Active Hires</h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">When you hire freelancers, they will appear here for easy management.</p>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/services">Find Local Experts</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
