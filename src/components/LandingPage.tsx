// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Zap, Shield } from 'lucide-react';

function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-primary to-secondary text-white">
      <header className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 font-header">Welcome to SpatialMods</h1>
        <p className="text-lg mb-8 text-white">Create stunning augmented reality experiences with ease</p>
        <Link
          to="/register"
          className="bg-white text-primary py-2 px-6 rounded-full text-base font-semibold hover:bg-opacity-90 transition-colors inline-flex items-center"
        >
          Get Started
          <ArrowRight className="ml-2" size={16} />
        </Link>
      </header>

      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose SpatialMods?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Layers className="mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Intuitive Design</h3>
            <p>Create AR experiences without any coding knowledge</p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Fast Performance</h3>
            <p>Optimized for smooth and responsive AR interactions</p>
          </div>
          <div className="text-center">
            <Shield className="mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p>Your data and creations are safe with us</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;