import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import About from './components/About';
import Pricing from './components/Pricing';
import Register from './components/Register';
import Dashboard from './components/UserDashboard';
import Login from './components/Login';
import ARBuilder from './components/ARBuilder';
import SettingsPage from './components/SettingsPage';
import Subscription from './components/Subscription';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import NotFound from './components/NotFound';
import EditCampaign from './components/EditCampaign';
import PreviewCampaign from './components/PreviewCampaign';
import CampaignAnalytics from './components/CampaignAnalytics';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    console.error('Authentication error:', error);
    return <div>An authentication error occurred. Please try again later.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/ar-builder" element={user ? <ARBuilder /> : <Navigate to="/login" replace />} />
              <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" replace />} />
              <Route path="/subscribe" element={user ? <Subscription /> : <Navigate to="/login" replace />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/edit-campaign/:id" element={user ? <EditCampaign /> : <Navigate to="/login" replace />} />
              <Route path="/preview-campaign/:id" element={user ? <PreviewCampaign /> : <Navigate to="/login" replace />} />
              <Route path="/campaign-analytics/:id" element={user ? <CampaignAnalytics /> : <Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="custom-toast-container"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;