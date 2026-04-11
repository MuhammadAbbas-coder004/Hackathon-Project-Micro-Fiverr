import React from 'react';
import { TrendingUp, Users, CheckCircle, Star, ArrowUpRight, Clock } from 'lucide-react';

const Overview = ({ stats = { earnings: 2450, active: 3, completed: 12, rating: 4.8 } }) => {
  const cards = [
    { label: 'Total Earnings', value: `$${stats.earnings}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Jobs', value: stats.active, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Avg. Rating', value: stats.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.bg} ${card.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
              <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                <ArrowUpRight size={12} /> +12%
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
             {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900">Job Posted: "React Developer for SaaS"</h4>
                    <p className="text-sm text-slate-500">2 hours ago • Accepting Applications</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">$450</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-sm">
           <div className="relative z-10">
             <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
             <p className="text-slate-400 text-sm mb-6">Get unlimited job postings and 0% service fees for 3 months.</p>
             <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl shadow-sm hover:bg-slate-100 transition-colors">
               Get Started
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
