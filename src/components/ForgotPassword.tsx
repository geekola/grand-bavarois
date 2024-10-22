// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError('');
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary font-header">Reset Password</h2>
        {error && <p className="text-red-500 mb-4 text-center text-sm font-sans">{error}</p>}
        {success ? (
          <div className="text-center">
            <p className="text-green-500 mb-4 text-sm font-sans">
              Password reset email sent. Please check your inbox.
            </p>
            <Link to="/login" className="text-primary hover:text-opacity-80 transition-colors text-sm font-sans">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-sans" htmlFor="email">
                Email
              </label>
              <input
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm font-sans"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors text-sm font-sans"
              type="submit"
            >
              Send Reset Email
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-primary hover:text-opacity-80 transition-colors text-sm font-sans">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;