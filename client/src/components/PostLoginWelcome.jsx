// client/src/components/PostLoginWelcome.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PostLoginWelcome = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  // Handle pending role requests
  if (user.roleStatus === 'pending') {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">⏳</span>
              <div>
                <h2 className="text-2xl font-bold text-amber-800">Welcome, {user.displayName}!</h2>
                <p className="text-sm text-amber-600">Your Support Agent request is pending approval</p>
              </div>
            </div>
            <p className="text-lg mb-4 text-amber-700">
              While waiting for admin approval, you can use all customer features to create and track support tickets.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/create-ticket"
                className="px-4 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                Create New Ticket
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-lg font-semibold bg-white/50 hover:bg-white/75 text-amber-800 border border-amber-200 transition-colors"
              >
                View My Profile
              </Link>
            </div>
          </div>
          <div className="ml-4 text-right">
            <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              Status: Pending Agent Approval
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white/30 rounded border border-amber-200">
          <p className="text-sm text-amber-700">
            <strong>💡 Want to check your request status?</strong> Visit your profile page or contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  const roleConfig = {
    'End User': {
      icon: '🎫',
      color: 'green',
      title: 'Welcome, Customer!',
      description: 'You can create support tickets and track their progress.',
      actions: [
        { label: 'Create New Ticket', link: '/create-ticket', primary: true },
        { label: 'View My Profile', link: '/profile', primary: false }
      ]
    },
    'Support Agent': {
      icon: '🛠️',
      color: 'blue',
      title: 'Welcome, Support Agent!',
      description: 'You can help customers by responding to their tickets.',
      actions: [
        { label: 'Agent Dashboard', link: '/agent/dashboard', primary: true },
        { label: 'View My Profile', link: '/profile', primary: false }
      ]
    },
    'Admin': {
      icon: '⚙️',
      color: 'purple',
      title: 'Welcome, Administrator!',
      description: 'You have full access to manage users and the system.',
      actions: [
        { label: 'Admin Dashboard', link: '/admin/dashboard', primary: true },
        { label: 'Manage Users', link: '/admin/users', primary: false },
        { label: 'View My Profile', link: '/profile', primary: false }
      ]
    }
  };

  const config = roleConfig[user.role] || roleConfig['End User'];
  const colorClasses = {
    green: 'from-green-50 to-emerald-50 border-green-200 text-green-800',
    blue: 'from-blue-50 to-indigo-50 border-blue-200 text-blue-800',
    purple: 'from-purple-50 to-violet-50 border-purple-200 text-purple-800'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[config.color]} border rounded-lg p-6 mb-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">{config.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{config.title}</h2>
              <p className="text-sm opacity-75">Logged in as: {user.displayName}</p>
            </div>
          </div>
          <p className="text-lg mb-4">{config.description}</p>
          <div className="flex flex-wrap gap-3">
            {config.actions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  action.primary
                    ? `bg-${config.color}-600 hover:bg-${config.color}-700 text-white`
                    : `bg-white/50 hover:bg-white/75 ${colorClasses[config.color]}`
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="ml-4 text-right">
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/50`}>
            Role: {user.role}
          </div>
        </div>
      </div>
      
      {user.role === 'End User' && (
        <div className="mt-4 p-3 bg-white/30 rounded border border-white/50">
          <p className="text-sm">
            <strong>💡 Want to become a Support Agent?</strong> Contact your system administrator to request agent access.
          </p>
        </div>
      )}
    </div>
  );
};

export default PostLoginWelcome;