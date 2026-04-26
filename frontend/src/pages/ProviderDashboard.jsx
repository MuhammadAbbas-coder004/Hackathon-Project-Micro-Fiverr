import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import DashboardLayout from '../components/DashboardLayout';
import Overview from './dashboard/Overview';
import MyServices from './dashboard/MyServices';
import Applications from './dashboard/Applications';
import ActiveJobs from './dashboard/ActiveJobs';
import Chat from './dashboard/Chat';
import Reviews from './dashboard/Reviews';
import Settings from './dashboard/Settings';
import Notifications from './dashboard/Notifications';
import PostJob from './dashboard/PostJob';
import MyPostedJobs from './dashboard/MyPostedJobs';

const ProviderDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [data, setData] = useState({
    services: [],
    appliedJobs: [],
    activeJobs: [],
    reviews: [],
    notifications: [],
    balance: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      console.log('📡 Fetching latest node intelligence...');
      const [services, applied, active, userMe, history] = await Promise.all([
        api.get('/services/provider'),
        api.get('/jobs/applied').catch(() => ({ data: [] })),
        api.get('/jobs/active').catch(() => ({ data: [] })),
        api.get('/auth/me').catch(() => ({ data: { user: { balance: 0 } } })),
        api.get('/payment/history').catch(() => ({ data: [] })),
      ]);

      console.log('💰 Balance detected:', userMe.data.user?.balance);
      console.log('📜 History items:', history.data.length);

      // Calculate total from history as a fallback/verification
      const historyTotal = (history.data || []).reduce((acc, item) => acc + (item.amount || 0), 0);
      const finalBalance = userMe.data.user?.balance || historyTotal || 0;

      setData({
        services: services.data || [],
        appliedJobs: applied.data || [],
        activeJobs: active.data || [],
        reviews: [],
        notifications: [],
        balance: finalBalance,
        history: history.data || [],
      });
      
      // Update localStorage to keep it in sync
      if (userMe.data.user) {
        localStorage.setItem('user', JSON.stringify(userMe.data.user));
      }
    } catch (err) {
      console.error('❌ Error fetching freelancer dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <Overview
            stats={{
              earnings: data.balance,
              active: data.activeJobs.length,
              completed: 8,
              rating: 4.9,
              gigs: data.services.length,
            }}
            history={data.history}
          />
        );
      case 'services':
        return <MyServices services={data.services} />;
      case 'post-job':
        return <PostJob />;
      case 'my-jobs':
        return <MyPostedJobs />;
      case 'applications':
        return <Applications applications={data.appliedJobs} />;
      case 'active':
        return <ActiveJobs activeJobs={data.activeJobs} />;
      case 'chat':
        return <Chat />;
      case 'reviews':
        return <Reviews reviews={data.reviews} />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[11px] animate-pulse">Initializing workspace node...</p>
      </div>
    );
  }

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </DashboardLayout>
  );
};

export default ProviderDashboard;
