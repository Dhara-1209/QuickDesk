// client/src/components/layout/Navbar.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl text-gray-900 hover:text-indigo-600" style={{ fontWeight: '900' }}>
          QuickDesk
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            // If user is logged in, show these links
            <>
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-gray-700">Hello, {user.displayName || 'User'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'Support Agent' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'End User' ? 'Customer' : user.role}
                </span>
              </div>
              <Link to="/" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600">Profile</Link>
              {user.role === 'Admin' && (
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-indigo-600 flex items-center">
                  <span className="mr-1">⚙️</span> Admin
                </Link>
              )}
              {user.role === 'Support Agent' && (
                <Link to="/agent/dashboard" className="text-gray-700 hover:text-indigo-600 flex items-center">
                  <span className="mr-1">🛠️</span> Agent
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-semibold text-white"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is not logged in, show these links
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link
                to="/signup"
                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-semibold text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;