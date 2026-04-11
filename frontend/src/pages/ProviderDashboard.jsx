import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [services, applied, active] = await Promise.all([
          axios.get('/api/services/provider', config),
          axios.get('/api/jobs/applied', config).catch(() => ({ data: [] })),
          axios.get('/api/jobs/active', config).catch(() => ({ data: [] })),
        ]);

        setData({
          services: services.data || [],
          appliedJobs: applied.data || [],
          activeJobs: active.data || [],
          reviews: [],
          notifications: [],
        });
      } catch (err) {
        console.error('Error fetching freelancer dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <Overview
            stats={{
              earnings: 1250,
              active: data.activeJobs.length,
              completed: 8,
              rating: 4.9,
              gigs: data.services.length,
            }}
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
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Setting up your workspace...</p>
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
