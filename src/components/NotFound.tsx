// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================


import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <img 
          src="/images/oops-404.png" 
          alt="404 - Page Not Found" 
          className="mx-auto mb-8 max-w-full h-auto"
          style={{ maxWidth: '300px' }}
        />
        <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
        <p className="text-xl mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/" 
            className="bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-colors"
          >
            <Home className="mr-2" size={20} />
            Go to Homepage
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-400 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;