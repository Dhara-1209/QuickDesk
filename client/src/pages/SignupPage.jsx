// client/src/pages/SignupPage.jsx


import React, { useState, useContext } from 'react'; // 1. Import useContext
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 2. Import AuthContext
import RoleExplanationBanner from '../components/RoleExplanationBanner';

// --- Icon Components ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

// Removed GoogleIcon



const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requestedRole, setRequestedRole] = useState('End User');
  const [agentJustification, setAgentJustification] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 3. Get the login function

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (requestedRole === 'Support Agent' && agentJustification.trim().length < 10) {
      setError('Please provide a detailed explanation (minimum 10 characters) for why you want to be a Support Agent.');
      return;
    }

    if (requestedRole === 'Admin' && !adminCode.trim()) {
      setError('Admin code is required for administrator access.');
      return;
    }

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

      // Show success message based on role status
      if (data.roleStatus === 'pending') {
        setSuccess('🎉 Account created! Your Support Agent request is pending admin approval. You can use the system as a customer while waiting.');
      } else if (data.roleStatus === 'active' && requestedRole === 'Admin') {
        setSuccess('🎉 Administrator account created successfully!');
      } else {
        setSuccess('🎉 Account created successfully!');
      }

      // Login the user
      login(data.token);
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        <RoleExplanationBanner page="signup" />
        <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <div className="w-24 h-1.5 bg-indigo-300 mx-auto mb-4"></div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700 font-medium mb-2">✨ Getting Started:</p>
              <div className="text-xs text-green-600 space-y-1">
                <p><span className="font-medium">🎯 New customers:</span> Sign up to create support tickets</p>
                <p><span className="font-medium">👥 Want to be an agent?</span> Sign up first, then contact admin</p>
                <p><span className="font-medium">⚡ First user?</span> You'll automatically become an administrator</p>
              </div>
              <p className="text-xs text-green-500 mt-2 italic">Your account type is determined after registration</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as:
              </label>
              <div className="space-y-3">
                {/* Customer Option */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  requestedRole === 'End User' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}>
                  <input
                    type="radio"
                    name="requestedRole"
                    value="End User"
                    checked={requestedRole === 'End User'}
                    onChange={(e) => setRequestedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">👤</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Customer</div>
                      <div className="text-sm text-gray-600">I need support for products/services</div>
                      <div className="text-xs text-green-600 font-medium">✅ Immediate Access</div>
                    </div>
                  </div>
                </label>

                {/* Support Agent Option */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  requestedRole === 'Support Agent' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    name="requestedRole"
                    value="Support Agent"
                    checked={requestedRole === 'Support Agent'}
                    onChange={(e) => setRequestedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">🛠️</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Support Agent</div>
                      <div className="text-sm text-gray-600">I want to help customers with their issues</div>
                      <div className="text-xs text-amber-600 font-medium">⏳ Requires Admin Approval</div>
                    </div>
                  </div>
                </label>

                {/* Administrator Option */}
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  requestedRole === 'Admin' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <input
                    type="radio"
                    name="requestedRole"
                    value="Admin"
                    checked={requestedRole === 'Admin'}
                    onChange={(e) => setRequestedRole(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">⚙️</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Administrator</div>
                      <div className="text-sm text-gray-600">I manage the support system</div>
                      <div className="text-xs text-red-600 font-medium">🔐 Requires Admin Code</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Agent Justification */}
            {requestedRole === 'Support Agent' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Why do you want to be a Support Agent? *
                </label>
                <textarea
                  placeholder="Please explain your experience, qualifications, or reason for wanting to help customers... (minimum 10 characters)"
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  rows="3"
                  required
                  value={agentJustification}
                  onChange={(e) => setAgentJustification(e.target.value)}
                />
                <p className="text-xs text-blue-600 mt-2">
                  💡 Your request will be reviewed by an administrator. You can use the system as a customer while waiting for approval.
                </p>
              </div>
            )}

            {/* Admin Code */}
            {requestedRole === 'Admin' && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Administrator Access Code *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter admin access code"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                  />
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  🔒 Contact your system administrator for the access code
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-bold text-lg text-white transition-colors ${
                  requestedRole === 'End User' ? 'bg-green-500 hover:bg-green-600' :
                  requestedRole === 'Support Agent' ? 'bg-blue-500 hover:bg-blue-600' :
                  'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {requestedRole === 'End User' ? '🎫 Create Customer Account' :
                 requestedRole === 'Support Agent' ? '🛠️ Request Agent Account' :
                 '⚙️ Create Admin Account'}
              </button>
            </div>
          </form>

          {/* Social signup removed */}

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

export default SignupPage;