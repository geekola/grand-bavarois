// ===== CODE FREEZE =====
// This component has been finalized. Do not modify without team approval.
// Last updated: [Current Date]
// =========================

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-secondary text-white py-12 dark:bg-dark-surface">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-xl font-bold font-header">Spatial Mods</span>
            </Link>
            <p className="text-xs text-center md:text-left">&copy; 2024 Spatial Mods. All rights reserved.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors duration-200">About</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors duration-200">Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/terms-of-use" className="hover:text-primary transition-colors duration-200">Terms of Use</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;