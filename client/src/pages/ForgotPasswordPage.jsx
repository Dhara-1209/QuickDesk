import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glassmorphism shadow-2xl rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Forgot Password?</h2>
            <div className="w-24 h-1.5 bg-indigo-500 mx-auto mb-8"></div>
            <p className="mb-8 text-gray-300">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form>
            <div className="mb-6">
              <input
                type="email"
                id="email"
                className="w-full pl-4 pr-4 py-3 bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email Address"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-4"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;