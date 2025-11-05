// client/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleBasedRoute from './components/layout/RoleBasedRoute'; // 1. Import RoleBasedRoute
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AgentDashboardPage from './pages/agent/AgentDashboardPage'; // 2. Import AgentDashboardPage
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // 3. Import AdminDashboardPage

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes for any logged-in user */}
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/create-ticket"
            element={<ProtectedRoute><CreateTicketPage /></ProtectedRoute>}
          />
          <Route
            path="/ticket/:ticketId"
            element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>}
          />

          {/* 3. Add the new route protected by role */}
          <Route
            path="/agent/dashboard"
            element={
              <RoleBasedRoute roles={['Support Agent']}>
                <AgentDashboardPage />
              </RoleBasedRoute>
            }
          />

          {/* 4. Add the admin dashboard route */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleBasedRoute roles={['Admin']}>
                <AdminDashboardPage />
              </RoleBasedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;