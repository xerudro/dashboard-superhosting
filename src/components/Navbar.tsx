import React, { useState } from 'react';
import { Menu, X, Globe, LogIn, UserPlus, User, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useRole } from '../lib/hooks/useRole';
import { AuthModal } from './AuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const { user, logout } = useAuth();
  const { isAdmin } = useRole();

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'RO' : 'EN');
  };

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <nav className="fixed w-full bg-black/90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-orangered font-bold text-2xl">VIP</span>
                <span className="text-white font-bold text-2xl mx-2">SUPER</span>
                <span className="text-blue-500 font-bold text-2xl">HOSTING</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-orangered transition-colors">Home</Link>
              <Link to="/services" className="text-gray-300 hover:text-orangered transition-colors">Services</Link>
              <Link to="/hosting" className="text-gray-300 hover:text-orangered transition-colors">Hosting</Link>
              <Link to="/websites" className="text-gray-300 hover:text-orangered transition-colors">Web Design</Link>
              <Link to="/support" className="text-gray-300 hover:text-orangered transition-colors">Support</Link>
              <Link to="/contact" className="text-gray-300 hover:text-orangered transition-colors">Contact</Link>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={toggleLanguage} className="text-gray-300 hover:text-orangered p-2 rounded-full transition-colors">
                <Globe className="h-5 w-5" />
                <span className="ml-1">{language}</span>
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="flex items-center text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-300 hover:text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center text-white bg-orangered hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center text-gray-300 hover:text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </button>
                  <Link
                    to="/signup"
                    className="flex items-center text-white bg-orangered hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95">
            <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-orangered transition-colors">Home</Link>
            <Link to="/services" className="block px-3 py-2 text-gray-300 hover:text-orangered transition-colors">Services</Link>
            <Link to="/hosting" className="block px-3 py-2 text-gray-300 hover:text-orangered transition-colors">Hosting</Link>
            <Link to="/websites" className="block px-3 py-2 text-gray-300 hover:text-orangered transition-colors">Web Design</Link>
            <Link to="/support" className="block px-3 py-2 text-gray-300 hover:text-orangered transition-colors">Support</Link>
            <Link to="/contact" className="block px-3 py-2 text-gray-300 hover:text-orangered transition-colors">Contact</Link>
            
            <div className="flex flex-col space-y-2 px-3 py-2">
              <button onClick={toggleLanguage} className="flex items-center text-gray-300 hover:text-orangered transition-colors">
                <Globe className="h-5 w-5 mr-2" />
                {language}
              </button>
              
              {user ? (
                <>
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="flex items-center text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-300 hover:text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center text-white bg-orangered hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="flex items-center text-gray-300 hover:text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </button>
                  <Link
                    to="/signup"
                    className="flex items-center text-white bg-orangered hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer div that adjusts height based on menu state */}
      <div className={`h-16 ${isOpen ? 'md:h-16 h-[400px]' : 'h-16'} transition-all duration-300 ease-in-out`} />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default Navbar;