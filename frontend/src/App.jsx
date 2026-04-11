import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Define roles clearly for the application
export const ROLES = {
  CLIENT: 'client',
  FREELANCER: 'freelancer',
  ADMIN: 'admin'
};

// Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import MyServices from './pages/provider/MyServices';
import CreateService from './pages/provider/CreateService';
import MyApplications from './pages/provider/MyApplications';
import Orders from './pages/provider/Orders';
import Reviews from './pages/provider/Reviews';
import Earnings from './pages/provider/Earnings';

// Client Pages (Restricted Experience)
import LeaveReview from './pages/client/LeaveReview';
import ActiveHires from './pages/client/ActiveHires';
import CustomerDashboard from './pages/CustomerDashboard';

// Booking & Tracking
import ServiceDetail from './pages/services/ServiceDetail';
import Checkout from './pages/checkout/Checkout';
import LiveTracking from './pages/tracking/LiveTracking';
import FreelancerRadar from './pages/client/FreelancerRadar';
import LiveClientTracking from './pages/provider/LiveClientTracking';
import TrackingRequestModal from './components/tracking/TrackingRequestModal';

// Common Pages
import BrowseJobs from './pages/jobs/BrowseJobs';
import JobDetail from './pages/jobs/JobDetail';
import ServiceListing from './pages/services/ServiceListing';
import ChatPage from './pages/ChatPage';
import EditProfile from './pages/profile/EditProfile';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';



const freelancerRoutes = [
  { path: '',                  element: <ProviderDashboard /> },  // /dashboard/provider
  { path: 'services',          element: <MyServices /> },         // /dashboard/provider/services
  { path: 'services/create',   element: <CreateService /> },      // /dashboard/provider/services/create
  { path: 'services/edit/:id', element: <CreateService /> },      // /dashboard/provider/services/edit/:id
  { path: 'applications',      element: <MyApplications /> },     // /dashboard/provider/applications
  { path: 'orders',            element: <Orders /> },             // /dashboard/provider/orders
  { path: 'messages',          element: <ChatPage /> },           // /dashboard/provider/messages
  { path: 'reviews',           element: <Reviews /> },            // /dashboard/provider/reviews
  { path: 'earnings',          element: <Earnings /> },           // /dashboard/provider/earnings
  { path: 'profile',           element: <EditProfile /> },        // /dashboard/provider/profile
];

const clientRoutes = [
  { path: '',                  element: <CustomerDashboard /> },   // /dashboard/client
  { path: 'chat',              element: <ChatPage /> },            // /dashboard/client/chat
  { path: 'profile',           element: <EditProfile /> },         // /dashboard/client/profile
];



const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-white font-['Inter']">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);



const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (user?.role === ROLES.FREELANCER) {
    return <Navigate to="/dashboard/provider" replace />;
  } else if (user?.role === ROLES.CLIENT) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/" replace />;
};



const mapRoutes = (routes) =>
  routes.map((route, i) =>
    route.path === ''
      ? <Route key={i} index element={route.element} />
      : <Route key={i} path={route.path} element={route.element} />
  );



const PublicRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated && user?.role === ROLES.FREELANCER) {
    return <Navigate to="/dashboard/provider" replace />;
  }
  return children;
};



function App() {
  return (
    <AuthProvider>
      <Router>
        <TrackingRequestModal />
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"         element={<PublicRoute><MainLayout><Home /></MainLayout></PublicRoute>} />
          <Route path="/login"    element={<PublicRoute><MainLayout><Login /></MainLayout></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><MainLayout><Register /></MainLayout></PublicRoute>} />
          <Route path="/jobs"         element={<PublicRoute><MainLayout><BrowseJobs /></MainLayout></PublicRoute>} />
          <Route path="/jobs/:id" element={<PublicRoute><MainLayout><JobDetail /></MainLayout></PublicRoute>} />
          <Route path="/services" element={<PublicRoute><MainLayout><ServiceListing /></MainLayout></PublicRoute>} />
          <Route path="/services/:id" element={<PublicRoute><MainLayout><ServiceDetail /></MainLayout></PublicRoute>} />
          <Route path="/radar" element={<MainLayout><ProtectedRoute roles={[ROLES.CLIENT]}><FreelancerRadar /></ProtectedRoute></MainLayout>} />
          <Route path="/track-client/:bookingId" element={<ProtectedRoute roles={[ROLES.FREELANCER]}><LiveClientTracking /></ProtectedRoute>} />
          <Route path="/checkout/:serviceId" element={<MainLayout><ProtectedRoute><Checkout /></ProtectedRoute></MainLayout>} />
          <Route path="/track/:bookingId" element={<MainLayout><ProtectedRoute><LiveTracking /></ProtectedRoute></MainLayout>} />
          <Route path="/active-hires" element={<MainLayout><ProtectedRoute><ActiveHires /></ProtectedRoute></MainLayout>} />
          <Route path="/chat" element={<MainLayout><ProtectedRoute><ChatPage /></ProtectedRoute></MainLayout>} />
          <Route path="/review/:providerId" element={<MainLayout><ProtectedRoute><LeaveReview /></ProtectedRoute></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProtectedRoute><EditProfile /></ProtectedRoute></MainLayout>} />

          {/* ── Dashboard Redirector ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* ── Freelancer (Provider) Routes ── */}
          <Route
            path="/dashboard/provider"
            element={
              <ProtectedRoute roles={[ROLES.FREELANCER]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {mapRoutes(freelancerRoutes)}
          </Route>

          {/* ── Client Dashboard Routes ── */}
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute roles={[ROLES.CLIENT]}>
                <MainLayout><CustomerDashboard /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client/chat"
            element={
              <ProtectedRoute roles={[ROLES.CLIENT]}>
                <MainLayout><ChatPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client/profile"
            element={
              <ProtectedRoute roles={[ROLES.CLIENT]}>
                <MainLayout><EditProfile /></MainLayout>
              </ProtectedRoute>
            }
          />

          {/* ── Client Routes (Simplified: Browser & Chat only) ── */}
          <Route path="/active-hires" element={<MainLayout><ProtectedRoute roles={[ROLES.CLIENT]}><ActiveHires /></ProtectedRoute></MainLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;