import React from 'react';
import { Send, Clock, CheckCircle, XCircle } from 'lucide-react';

const Applications = ({ applications = [] }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-500">Track the status of the jobs you've applied for.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Project Name</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Budget</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Applied</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium">
                  You haven't applied to any jobs yet.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        {app.title?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{app.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-900">${app.budget}</td>
                  <td className="px-8 py-6 text-sm text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(app.role)}`}>
                      {app.role || 'pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors">Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
