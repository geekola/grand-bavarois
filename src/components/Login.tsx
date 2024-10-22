// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================

import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, isFirebaseInitialized } from '../firebase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

function Login() {
  console.log('Login component rendered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseInitialized()) {
      toast.error('Firebase is not initialized. Please check your configuration.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully');
      const { planName, productId } = location.state || {};
      if (planName && productId) {
        navigate('/subscribe', { state: { planName, productId } });
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseInitialized()) {
      toast.error('Firebase is not initialized. Please check your configuration.');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully with Google');
      const { planName, productId } = location.state || {};
      if (planName && productId) {
        navigate('/subscribe', { state: { planName, productId } });
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(error.message || 'Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary font-header">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans" htmlFor="email">
              Email
            </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm font-sans"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 font-sans" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 text-sm font-sans"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors text-sm font-sans"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center text-sm font-sans"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
        </div>
        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-primary hover:text-opacity-80 transition-colors text-sm font-sans">
            Forgot Password?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-sans">Don't have an account? <Link to="/register" className="text-primary hover:text-opacity-80 transition-colors">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;