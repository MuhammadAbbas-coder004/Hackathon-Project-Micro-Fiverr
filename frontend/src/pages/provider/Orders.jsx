import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle2, Navigation, MessageSquare, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';

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
            'pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            'active': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            'completed': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'cancelled': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        };
        return colors[status?.toLowerCase()] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Active Orders</h1>
                <p className="text-muted-foreground">Manage your current service requests and client communication.</p>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {orders.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-2">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                        <h3 className="text-lg font-medium">No orders yet</h3>
                        <p className="text-muted-foreground">When clients book your services, they will appear here.</p>
                    </Card>
                ) : (
                    orders.map((order) => (
                        <Card key={order._id} className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <ShoppingBag className="text-primary w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{order.serviceId?.title || 'Gig Title'}</h3>
                                                <Badge className={getStatusColor(order.status)} variant="outline">
                                                    {order.status}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-foreground italic">Client: {order.customerId?.name || 'Client Name'}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-bold">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                </div>
                                                {order.address && (
                                                    <div className="flex items-center gap-1.5 italic font-bold">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="truncate max-w-[200px]">{order.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" className="gap-2 rounded-xl h-11 px-5" onClick={() => navigate(`/dashboard/messages/${order.customerId?._id}`)}>
                                            <MessageSquare size={18} />
                                            Message
                                        </Button>
                                        {order.status === 'active' && (
                                            <Button className="gap-2 rounded-xl h-11 px-5" onClick={() => navigate(`/track-client/${order._id}`)}>
                                                <Navigation size={18} />
                                                Live Track
                                            </Button>
                                        )}
                                        {order.status === 'pending' && (
                                            <Button className="gap-2 rounded-xl h-11 px-5 bg-emerald-600 hover:bg-emerald-700">
                                                Accept Order
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;

