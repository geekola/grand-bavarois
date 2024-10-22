import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { Menu, X, LogOut, User, Settings, Home, Info, DollarSign, Mail, HelpCircle, Plus, Sun, Moon } from 'lucide-react';

function Header() {
  const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="bg-secondary shadow-md dark:bg-dark-surface">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center text-xl font-bold text-white font-header" onClick={handleLinkClick}>
            Spatial Mods
          </Link>
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-white"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <nav 
            className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-16 left-0 right-0 bg-secondary md:top-0 z-20 dark:bg-dark-surface`}
            id="mobile-menu"
          >
            <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0">
              <li className="my-2 md:my-0">
                <Link to="/" className="text-white hover:text-primary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                  <Home size={16} className="mr-1" aria-hidden="true" />
                  <span>HOME</span>
                </Link>
              </li>
              <li className="my-2 md:my-0">
                <Link to="/about" className="text-white hover:text-primary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                  <Info size={16} className="mr-1" aria-hidden="true" />
                  <span>ABOUT</span>
                </Link>
              </li>
              <li className="my-2 md:my-0">
                <Link to="/pricing" className="text-white hover:text-primary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                  <DollarSign size={16} className="mr-1" aria-hidden="true" />
                  <span>PRICING</span>
                </Link>
              </li>
              <li className="my-2 md:my-0">
                <Link to="/faq" className="text-white hover:text-primary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                  <HelpCircle size={16} className="mr-1" aria-hidden="true" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li className="my-2 md:my-0">
                <Link to="/contact" className="text-white hover:text-primary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                  <Mail size={16} className="mr-1" aria-hidden="true" />
                  <span>CONTACT</span>
                </Link>
              </li>
              {!user && (
                <>
                  <li className="my-2 md:my-0">
                    <Link to="/login" className="text-white hover:text-primary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                      <User size={16} className="mr-1" aria-hidden="true" />
                      <span>LOGIN</span>
                    </Link>
                  </li>
                  <li className="my-2 md:my-0">
                    <Link to="/register" className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-opacity-90 transition-colors flex items-center" onClick={handleLinkClick}>
                      <span>SIGN UP</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
      {user && (
        <div className="bg-primary dark:bg-dark-primary">
          <div className="container mx-auto px-4 py-2">
            <nav>
              <ul className="flex flex-wrap justify-center space-x-4">
                <li>
                  <Link to="/dashboard" className="text-white hover:text-secondary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                    <User size={16} className="mr-1" aria-hidden="true" />
                    <span>DASHBOARD</span>
                  </Link>
                </li>
                <li>
                  <Link to="/ar-builder" className="text-white hover:text-secondary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                    <Plus size={16} className="mr-1" aria-hidden="true" />
                    <span>CREATE</span>
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="text-white hover:text-secondary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                    <Settings size={16} className="mr-1" aria-hidden="true" />
                    <span>SETTINGS</span>
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-white hover:text-secondary transition-colors duration-200 text-xs flex items-center" onClick={handleLinkClick}>
                    <HelpCircle size={16} className="mr-1" aria-hidden="true" />
                    <span>FAQ</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="text-white hover:text-secondary transition-colors duration-200 text-xs flex items-center"
                    aria-label="Logout"
                  >
                    <LogOut size={16} className="mr-1" aria-hidden="true" />
                    <span>LOGOUT</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;