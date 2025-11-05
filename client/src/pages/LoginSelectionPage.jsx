// client/src/pages/LoginSelectionPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LoginSelectionPage = () => {
  return (
    <div className="flex items-center justify-center py-12 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to QuickDesk</h1>
          <p className="text-xl text-gray-600">Choose how you'd like to access the system</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Customer Login */}
          <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-200 text-center hover:shadow-2xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">I'm a Customer</h3>
            <p className="text-gray-600 mb-6">Need help with a product or service? Create and track support tickets.</p>
            <div className="space-y-3">
              <Link 
                to="/login?type=customer" 
                className="block w-full py-3 px-4 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-white transition-colors"
              >
                Login as Customer
              </Link>
              <Link 
                to="/signup?type=customer" 
                className="block w-full py-3 px-4 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-lg font-semibold transition-colors"
              >
                Sign Up as Customer
              </Link>
            </div>
          </div>

          {/* Support Agent Login */}
          <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-200 text-center hover:shadow-2xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12l8-8M4 4l8 8m0 0v8m0-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">I'm a Support Agent</h3>
            <p className="text-gray-600 mb-6">Help customers by responding to and resolving support tickets.</p>
            <div className="space-y-3">
              <Link 
                to="/login?type=agent" 
                className="block w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white transition-colors"
              >
                Login as Agent
              </Link>
              <p className="text-sm text-gray-500">
                <strong>New Agent?</strong><br/>
                Contact your administrator to get agent access.
              </p>
            </div>
          </div>

          {/* Administrator Login */}
          <div className="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-200 text-center hover:shadow-2xl transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">I'm an Administrator</h3>
            <p className="text-gray-600 mb-6">Manage users, assign agent roles, and oversee the support system.</p>
            <div className="space-y-3">
              <Link 
                to="/login?type=admin" 
                className="block w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold text-white transition-colors"
              >
                Login as Administrator
              </Link>
              <p className="text-sm text-gray-500">
                <strong>System Administrators Only</strong><br/>
                Requires admin credentials
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            <strong>Note:</strong> All users use the same login system. Your role determines what you can access after login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionPage;