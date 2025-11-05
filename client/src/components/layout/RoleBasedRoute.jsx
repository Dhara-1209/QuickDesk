// client/src/components/layout/RoleBasedRoute.jsx

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RoleBasedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  // Don't render anything until we know the user's status
  if (loading) {
    return <p className="text-black text-center mt-8">Loading...</p>;
  }

  // If the user is logged in AND their role is included in the allowed roles, show the page.
  if (user && roles.includes(user.role)) {
    return children;
  }

  // Otherwise, redirect them to the home page.
  return <Navigate to="/" replace />;
};

export default RoleBasedRoute;