// client/src/components/RoleExplanationBanner.jsx
import React from 'react';

const RoleExplanationBanner = ({ page }) => {
  if (page === 'signup') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">🚀 How QuickDesk Works</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/50 rounded p-3">
            <div className="flex items-center mb-2">
              <span className="text-green-600 font-bold">👤 Step 1:</span>
            </div>
            <p className="text-gray-700"><strong>Create Account</strong><br/>Sign up as a customer to get support</p>
          </div>
          <div className="bg-white/50 rounded p-3">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 font-bold">🎯 Step 2:</span>
            </div>
            <p className="text-gray-700"><strong>Your Role</strong><br/>System assigns you as "End User" automatically</p>
          </div>
          <div className="bg-white/50 rounded p-3">
            <div className="flex items-center mb-2">
              <span className="text-purple-600 font-bold">⚡ Step 3:</span>
            </div>
            <p className="text-gray-700"><strong>Access Dashboard</strong><br/>Create tickets, track progress</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Want to be a Support Agent?</strong> Contact an administrator after creating your account.
            <br/>
            <strong>🔧 First user?</strong> You'll automatically become the system administrator!
          </p>
        </div>
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">🔐 Login Information</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/50 rounded p-3 text-center">
            <div className="text-2xl mb-2">🟢</div>
            <p className="font-semibold text-gray-800">End User</p>
            <p className="text-gray-600">Create & track tickets</p>
          </div>
          <div className="bg-white/50 rounded p-3 text-center">
            <div className="text-2xl mb-2">🔵</div>
            <p className="font-semibold text-gray-800">Support Agent</p>
            <p className="text-gray-600">Help customers</p>
          </div>
          <div className="bg-white/50 rounded p-3 text-center">
            <div className="text-2xl mb-2">🟣</div>
            <p className="font-semibold text-gray-800">Administrator</p>
            <p className="text-gray-600">Manage system</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-center">
          <p className="text-sm text-blue-800">
            <strong>🎯 Your dashboard and features are automatically selected based on your account type</strong>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default RoleExplanationBanner;