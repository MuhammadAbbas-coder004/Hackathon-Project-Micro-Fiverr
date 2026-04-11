import React from 'react';
import { Briefcase, UserCheck, Clock, MessageSquare, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerOverview = ({ stats = { posted: 0, spent: 0, active: 0, messages: 0 } }) => {
  const cards = [
    { label: 'Total Posted Jobs', value: stats.posted, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Spent', value: `Rs. ${stats.spent.toLocaleString()}`, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Projects', value: stats.active, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 font-['Inter'] tracking-tighter">Client Dashboard</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage your projects and hired professionals.</p>
        </div>
        <Link to="/dashboard" onClick={() => window.location.hash = 'post-job'} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all hover:-translate-y-0.5 text-sm uppercase tracking-widest">
           <PlusCircle size={20} /> Post A New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`${card.bg} ${card.color} p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                <card.icon size={28} />
              </div>
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">{card.label}</h3>
            <p className="text-3xl font-black text-slate-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
            <button className="text-sm text-indigo-600 font-black uppercase tracking-widest hover:underline px-4 py-2 bg-indigo-50 rounded-xl">View All</button>
          </div>
          <div className="space-y-6">
             {[
               { icon: '💼', title: 'Job Posted: Kitchen Renovation', time: '2 hours ago', status: 'Open' },
               { icon: '💬', title: 'New Message from John Doe', time: '5 hours ago', status: 'Unread' },
               { icon: '⭐', title: 'Review Left for Sarah Smith', time: '1 day ago', status: 'Completed' }
             ].map((activity, i) => (
               <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-100 transition-colors">{activity.icon}</div>
                  <div className="flex-grow">
                    <h4 className="font-black text-slate-900 text-lg">{activity.title}</h4>
                    <p className="text-sm font-bold text-slate-400">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">{activity.status}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center">
           <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Users size={32} className="text-indigo-600" />
           </div>
           <h3 className="text-xl font-bold mb-2">Need a Pro?</h3>
           <p className="text-slate-500 text-sm mb-8">Browse the top-rated service providers in your local area.</p>
           <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
             Browse Services
           </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
