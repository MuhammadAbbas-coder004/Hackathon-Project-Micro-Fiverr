import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Star, MessageSquare, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeHires, setActiveHires] = useState([]);
  
  const actions = [
    { label: 'Find Freelancers', desc: 'Browse available local talents.', icon: Search, to: '/services', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'My Past Hires', desc: 'View complete jobs and reviews.', icon: Briefcase, to: '/active-hires', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Messages', desc: 'Communicate with freelancers.', icon: MessageSquare, to: '/chat', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-4 border-background shadow-sm overflow-hidden">
              {user?.avatar ? (
                <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary uppercase">{user?.name?.charAt(0)}</span>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm font-medium">
              Ready to hire top talents today?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button asChild className="flex-1 md:flex-none gap-2">
            <Link to="/services">
              <Search size={16} /> Browse Services
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {actions.map((act, i) => (
          <Link key={i} to={act.to} className="block group h-full">
            <Card className="border-border/50 shadow-none hover:shadow-md transition-all h-full">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${act.bg} ${act.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <act.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{act.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{act.desc}</p>
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
               {/* Display active hires here */}
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
