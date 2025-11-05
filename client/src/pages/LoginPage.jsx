// client/src/pages/LoginPage.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RoleExplanationBanner from '../components/RoleExplanationBanner';

// --- Icon Components ---
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
// Removed GoogleIcon and Google login button per request


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Something went wrong');
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // This div now just centers its content, it doesn't try to be full-screen
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        <RoleExplanationBanner page="login" />
        <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back!</h2>
            <div className="w-24 h-1.5 bg-indigo-300 mx-auto mb-4"></div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 font-medium mb-2">📋 Access Information:</p>
              <div className="text-xs text-blue-600 space-y-1">
                <p><span className="font-medium">🟢 Customers:</span> Can create and track support tickets</p>
                <p><span className="font-medium">🔵 Support Agents:</span> Can respond to customer tickets</p>
                <p><span className="font-medium">🟣 Administrators:</span> Can manage users and assign agent roles</p>
              </div>
              <p className="text-xs text-blue-500 mt-2 italic">Your role is automatically detected after login</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Form content... */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon /></div>
              <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon /></div>
              <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="text-right mb-6"><Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot Password?</Link></div>
            {error && <p className="text-red-500 text-sm text-center my-4">{error}</p>}
            <button type="submit" className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-bold text-lg text-white">Log In</button>
          </form>
          {/* Social login removed */}
          <p className="text-center text-sm text-gray-400 mt-8">Don't have an account?{' '}<Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;