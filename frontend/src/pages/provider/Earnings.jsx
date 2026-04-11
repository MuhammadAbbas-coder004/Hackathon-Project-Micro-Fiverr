import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/utils/api';

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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <Button className="gap-2">
          <DollarSign className="w-4 h-4" />
          Withdraw Funds
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium opacity-80">Available Balance</p>
              <Wallet className="w-5 h-5 opacity-80" />
            </div>
            <h2 className="text-4xl font-bold">${stats.balance.toFixed(2)}</h2>
            <div className="mt-4 flex items-center gap-1 text-xs opacity-80">
              <TrendingUp className="w-3 h-3" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold">${stats.totalEarned.toFixed(2)}</h2>
            <p className="mt-4 text-xs text-muted-foreground">Lifetime earnings across all services</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Pending Clearance</p>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <h2 className="text-4xl font-bold">${stats.pending.toFixed(2)}</h2>
            <p className="mt-4 text-xs text-muted-foreground">Funds currently in escrow</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A list of your recent income and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'payout' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {tx.type === 'payout' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{tx.note}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'payout' ? 'text-slate-900 dark:text-slate-100' : 'text-green-600'}`}>
                    {tx.type === 'payout' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Earnings;
