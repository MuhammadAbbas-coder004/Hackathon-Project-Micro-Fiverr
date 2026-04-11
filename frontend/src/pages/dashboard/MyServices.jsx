import React from 'react';
import { Plus, Edit2, Trash2, Tag, DollarSign } from 'lucide-react';

const MyServices = ({ services = [] }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Services</h1>
          <p className="text-slate-500">Manage the services you offer to clients.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5">
          <Plus size={20} /> Create Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Services Yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start offering your skills by creating your first service gig today.</p>
          <button className="text-indigo-600 font-bold hover:underline">Learn how it works</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
               <div className="h-48 bg-slate-100 relative">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-widest border border-slate-100">
                    {service.category}
                  </div>
                  <img 
                    src={service.image || `https://source.unsplash.com/random/400x300?${service.category}`} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
               </div>
               <div className="p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{service.title}</h4>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400 font-medium">Starting from</span>
                      <span className="text-xl font-black text-slate-900">${service.price}</span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyServices;
