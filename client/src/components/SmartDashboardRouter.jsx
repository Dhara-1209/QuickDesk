// client/src/components/SmartDashboardRouter.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Import your different dashboard pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AgentDashboardPage from '../pages/agent/AgentDashboardPage';
import DashboardPage from '../pages/DashboardPage'; // Customer dashboard

const SmartDashboardRouter = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Automatically route to appropriate dashboard based on role
  switch (user.role) {
    case 'Admin':
      return <AdminDashboardPage />;
    case 'Support Agent':
      return <AgentDashboardPage />;
    case 'End User':
    default:
      return <DashboardPage />;
  }
};

export default SmartDashboardRouter;