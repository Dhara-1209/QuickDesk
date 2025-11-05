// client/src/components/layout/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show a loading indicator while the context is checking for a user.
  // This prevents a flicker on page load.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  // If loading is finished and there's no user, redirect to the login page.
  if (!user) {
    // We pass the original location in the state so we can redirect back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a user is logged in, render the child component (the protected page).
  return children;
};

export default ProtectedRoute;