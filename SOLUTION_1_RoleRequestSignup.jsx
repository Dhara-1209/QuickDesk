// Enhanced SignupPage with Role Request System
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RoleExplanationBanner from '../components/RoleExplanationBanner';

// Icon Components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const SignupPageWithRoleRequest = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestedRole, setRequestedRole] = useState('End User');
  const [agentJustification, setAgentJustification] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const signupData = {
        name,
        email,
        password,
        requestedRole,
        agentJustification: requestedRole === 'Support Agent' ? agentJustification : '',
        adminCode: requestedRole === 'Admin' ? adminCode : ''
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Something went wrong');
      }

      login(data.token);
      navigate('/');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">🎯 Choose Your Access Level</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/50 rounded p-3 text-center">
              <div className="text-2xl mb-2">👤</div>
              <p className="font-semibold text-gray-800">Customer</p>
              <p className="text-gray-600">Create & track support tickets</p>
            </div>
            <div className="bg-white/50 rounded p-3 text-center">
              <div className="text-2xl mb-2">🛠️</div>
              <p className="font-semibold text-gray-800">Support Agent</p>
              <p className="text-gray-600">Requires approval</p>
            </div>
            <div className="bg-white/50 rounded p-3 text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="font-semibold text-gray-800">Administrator</p>
              <p className="text-gray-600">Requires admin code</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <div className="w-24 h-1.5 bg-indigo-300 mx-auto mb-8"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon /></div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon /></div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon /></div>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as:
              </label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="End User">👤 Customer (Immediate Access)</option>
                <option value="Support Agent">🛠️ Support Agent (Requires Approval)</option>
                <option value="Admin">⚙️ Administrator (Requires Admin Code)</option>
              </select>
            </div>

            {/* Agent Justification */}
            {requestedRole === 'Support Agent' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Why do you want to be a Support Agent? *
                </label>
                <textarea
                  placeholder="Please explain your experience, qualifications, or reason for wanting to help customers..."
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows="3"
                  required
                  value={agentJustification}
                  onChange={(e) => setAgentJustification(e.target.value)}
                />
                <p className="text-xs text-blue-600 mt-1">
                  Your request will be reviewed by an administrator
                </p>
              </div>
            )}

            {/* Admin Code */}
            {requestedRole === 'Admin' && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Administrator Access Code *
                </label>
                <input
                  type="password"
                  placeholder="Enter admin access code"
                  className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                />
                <p className="text-xs text-purple-600 mt-1">
                  Contact your system administrator for the access code
                </p>
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center my-4">{error}</p>}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-bold text-lg text-white"
              >
                {requestedRole === 'End User' ? 'Create Account' : 
                 requestedRole === 'Support Agent' ? 'Request Agent Account' : 'Create Admin Account'}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPageWithRoleRequest;