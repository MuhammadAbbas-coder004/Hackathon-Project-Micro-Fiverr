import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar, Clock, Sparkles } from 'lucide-react';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';

const Earnings = () => {
  const [stats, setStats] = useState({
    balance: 0,
    totalEarned: 0,
    pending: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await api.get('/bookings/provider/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pt-6">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
             <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Wallet size={22} />
             </div>
             <span className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-none">Financial Control</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase"
          >
            Earnings<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600/40">& Revenue</span>
          </motion.h1>
          <p className="text-[14px] font-bold text-slate-500 mt-6 max-w-lg">
            Monitor your revenue streams, manage withdrawals, and track your financial growth over time.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button className="group h-20 px-10 bg-indigo-600 text-white font-black text-[14px] uppercase tracking-widest rounded-full flex items-center gap-4 hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
               <DollarSign size={24} />
            </div>
            Withdraw Funds
          </button>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-indigo-600 text-white rounded-[48px] p-10 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-white/10 transition-colors" />
          <div className="flex items-center justify-between mb-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40">Available Balance</p>
            <Wallet className="w-6 h-6 opacity-40" />
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-6">${stats.balance.toFixed(2)}</h2>
          <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/5">
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span className="text-[12px] font-bold opacity-60">+12.5% vs Last Month</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[48px] p-10 border border-white/10 shadow-2xl ring-1 ring-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Earned</p>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><DollarSign size={22} /></div>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-6">${stats.totalEarned.toFixed(2)}</h2>
          <p className="text-[12px] font-bold text-slate-600">Lifetime earnings across matrix</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[48px] p-10 border border-white/10 shadow-2xl ring-1 ring-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Pending Clearance</p>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><Clock size={22} /></div>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-6">${stats.pending.toFixed(2)}</h2>
          <p className="text-[12px] font-bold text-slate-600">Funds currently in network escrow</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-2xl p-10 ring-1 ring-white/5"
      >
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-[28px] font-black text-white tracking-tighter uppercase">Recent Transactions</h3>
            <p className="text-[12px] font-bold text-slate-600 uppercase tracking-widest mt-1">Audit Log of Withdrawals & Income</p>
          </div>
          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:bg-white/10 hover:text-white transition-all ring-1 ring-white/5"><Calendar size={22} /></button>
        </div>
        
        <div className="space-y-6">
          {stats.recentTransactions.length === 0 ? (
            <div className="py-20 text-center bg-white/[0.02] rounded-[32px] border border-dashed border-white/5 ring-1 ring-white/5">
               <p className="text-slate-600 font-black uppercase tracking-widest">No recent transactions to display</p>
            </div>
          ) : (
            stats.recentTransactions.map((tx, idx) => (
              <motion.div 
                key={tx.id || idx} 
                whileHover={{ x: 10 }}
                className="flex items-center justify-between p-4 rounded-[32px] hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${tx.type === 'payout' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'} group-hover:scale-110 transition-transform`}>
                    {tx.type === 'payout' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-[17px] font-black text-white mb-1">{tx.note}</p>
                    <p className="text-[12px] font-bold text-slate-600 flex items-center gap-2 uppercase tracking-tight">
                      <Clock className="w-4 h-4" />
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${tx.type === 'payout' ? 'text-white' : 'text-emerald-400'} tracking-tighter`}>
                    {tx.type === 'payout' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {tx.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Earnings;
