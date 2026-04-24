import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, Navigation, MessageSquare, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/bookings/provider');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            'active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'completed': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            'cancelled': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            'paid': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
        return colors[status?.toLowerCase()] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
    <div className="space-y-12 pb-20 relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <header className="pt-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <ShoppingBag size={22} />
          </div>
          <span className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.3em] leading-none">Order Management</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase"
        >
          Your Active<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600/40">Work Stream</span>
        </motion.h1>
        <p className="text-[14px] font-bold text-slate-500 mt-6 max-w-lg">
          Track current service requests, manage client communications, and ensure top-tier delivery standards.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-24 text-center border-2 border-dashed border-white/5 rounded-[64px] bg-[#0c0f16]/40 backdrop-blur-3xl flex flex-col items-center justify-center ring-1 ring-white/5"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
              <ShoppingBag className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-3xl font-black text-white/20 tracking-tighter uppercase">No Orders Found</h3>
            <p className="text-[14px] font-bold text-slate-600 mt-3">When clients book your services, they will appear in this stream.</p>
          </motion.div>
        ) : (
          orders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: idx * 0.05 }}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`bg-[#0c0f16]/60 backdrop-blur-3xl rounded-[48px] border border-white/10 transition-all overflow-hidden group relative ring-1 ring-white/5 ${
                order.status === 'active' ? 'shadow-[0_40px_80px_-20px_rgba(72,69,210,0.15)] ring-2 ring-indigo-500/10' : 'shadow-2xl'
              }`}
            >
              {order.status === 'active' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-pulse" />
              )}
              <div className="p-10">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
                  <div className="flex items-start md:items-center gap-8 flex-grow">
                    <div className="w-20 h-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-500 ring-1 ring-white/5">
                      <ShoppingBag className="text-indigo-400 group-hover:text-white w-8 h-8 transition-colors" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <h3 className="text-[28px] font-black text-white tracking-tighter leading-none group-hover:text-indigo-400 transition-colors uppercase">
                          {order.serviceId?.title || 'Gig Title'}
                        </h3>
                        <span className={`px-4 py-2 rounded-full border text-[11px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 text-[14px] font-bold">
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 ring-1 ring-white/5">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="text-slate-500">Client:</span>
                          <span className="text-white uppercase tracking-tighter font-black">{order.customerId?.name || 'Client Name'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2.5 text-slate-500">
                          <Clock className="w-5 h-5 opacity-30" />
                          <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                        </div>

                        {order.address && (
                          <div className="flex items-center gap-2.5 text-slate-500">
                            <MapPin className="w-5 h-5 opacity-30" />
                            <span className="truncate max-w-[200px]">{order.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 bg-white/[0.02] p-3 rounded-[32px] border border-white/5">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-16 px-8 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-[13px] uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all ring-1 ring-white/5"
                      onClick={() => navigate(`/dashboard/messages/${order.customerId?._id}`)}
                    >
                      <MessageSquare size={20} className="text-indigo-400" />
                      Message
                    </motion.button>
                    
                    {order.status === 'active' && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-16 px-8 rounded-3xl bg-indigo-600 text-white font-black text-[13px] uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                        onClick={() => navigate(`/track-client/${order._id}`)}
                      >
                        <Navigation size={20} />
                        Track Live
                      </motion.button>
                    )}
                    
                    {order.status === 'pending' && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-16 px-8 rounded-3xl bg-emerald-600 text-white font-black text-[13px] uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                      >
                        Accept Order
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Decorative side bar */}
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-r-full ${
                order.status === 'active' ? 'bg-indigo-500 shadow-[0_0_15px_#4f46e5]' : 
                order.status === 'pending' ? 'bg-amber-400' : 
                order.status === 'completed' ? 'bg-emerald-400' : 'bg-rose-400'
              }`} />
            </motion.div>
          ))
        )}
      </div>
    </div>
    );
};

export default Orders;
