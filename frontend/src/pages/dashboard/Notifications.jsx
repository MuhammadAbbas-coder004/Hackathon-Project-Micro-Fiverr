import React from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, MessageSquare, DollarSign, Briefcase } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'New Message',
      desc: 'Alex Johnson sent you a message about the HVAC project.',
      time: '2 mins ago',
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      unread: true,
    },
    {
      id: 2,
      type: 'success',
      title: 'Payment Received',
      desc: 'Your payment for "Plumbing Fix" has been processed.',
      time: '1 hour ago',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      unread: true,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Deadline Approaching',
      desc: 'Your job "Electrical Wiring" is due in 5 hours.',
      time: '3 hours ago',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      unread: false,
    },
    {
      id: 4,
      type: 'info',
      title: 'New Job Matching your Skills',
      desc: 'A new job "Kitchen Remodel Assistance" matches your profile.',
      time: 'Yesterday',
      icon: Briefcase,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      unread: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-500">Stay updated with your latest activities and alerts.</p>
        </div>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer relative ${notif.unread ? 'bg-indigo-50/10' : ''}`}
            >
              {notif.unread && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
              )}
              <div className={`${notif.bg} ${notif.color} w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`}>
                <notif.icon size={24} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-bold text-slate-900 ${notif.unread ? 'text-indigo-600' : ''}`}>{notif.title}</h4>
                  <span className="text-xs font-medium text-slate-400">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {notifications.length === 0 && (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell size={32} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No notifications yet</h3>
          <p className="text-slate-500">We'll notify you when something important happens.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
