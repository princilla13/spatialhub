import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, User, Shield, FileText, LogOut } from 'lucide-react';

export default function Header({ onOpenAuth, onOpenPricing, currentUser, onSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="navbar-custom fixed-top fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand me-4 flex items-center">
            <img 
              src="/assets/logo-dronedb.png" 
              alt="DroneDB" 
              className="logo h-8 sm:h-9 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://dronedb.app/wp-content/themes/dronedb-theme/img/home/logo-dronedb.png";
              }}
            />
          </Link>

          {/* Desktop Navigation Links (Exact 1rem 500 weight text) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link to="/hub" className="nav-link">Hub</Link>
            <button 
              onClick={onOpenPricing}
              className="nav-link bg-transparent border-none cursor-pointer"
            >
              Pricing
            </button>
            <a 
              href="https://docs.dronedb.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link"
            >
              Docs
            </a>
            <a 
              href="https://discord.gg/e9M3vBvzge" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link"
            >
              Community
            </a>
            <a 
              href="https://github.com/DroneDB/DroneDB" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link"
            >
              GitHub
            </a>
            <a 
              href="https://dronedb.app/blog/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="nav-link"
            >
              Blog
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? <>
              <span className="text-sm font-semibold text-[#1a1a2e]">Hi, {currentUser.name}</span>
              <button onClick={onSignOut} className="btn-login flex items-center gap-1"><LogOut className="h-4 w-4" />Sign out</button>
            </> : <>
              <button onClick={() => onOpenAuth('login')} className="btn-login">Sign in</button>
              <button onClick={() => onOpenAuth('register')} className="rounded-full bg-[#0041e8] px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#0036c2]">Create account</button>
            </>}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#0041e8] hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer (Exact dronedb offcanvas style) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bg-white border-b border-gray-200 shadow-2xl p-6 transition-all animate-fadeIn">
          <div className="flex flex-col space-y-4">
            <Link to="/hub" className="flex items-center justify-between text-base font-medium text-[#1a1a2e] py-2 border-b border-gray-100">Hub</Link>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPricing && onOpenPricing();
              }}
              className="flex items-center justify-between text-base font-medium text-[#1a1a2e] py-2 border-b border-gray-100 text-left"
            >
              Pricing <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <a 
              href="https://docs.dronedb.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between text-base font-medium text-[#1a1a2e] py-2 border-b border-gray-100"
            >
              Docs
            </a>
            <a 
              href="https://discord.gg/e9M3vBvzge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between text-base font-medium text-[#1a1a2e] py-2 border-b border-gray-100"
            >
              Community
            </a>
            <a 
              href="https://github.com/DroneDB/DroneDB" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between text-base font-medium text-[#1a1a2e] py-2 border-b border-gray-100"
            >
              GitHub
            </a>
            <a 
              href="https://dronedb.app/blog/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between text-base font-medium text-[#1a1a2e] py-2 border-b border-gray-100"
            >
              Blog
            </a>

            <div className="pt-4 flex flex-col gap-3">
              {currentUser ? <button onClick={() => { setMobileMenuOpen(false); onSignOut(); }} className="w-full py-3 text-center text-base font-medium text-[#212529] bg-[#f8f9fa] border border-[#dee2e6] rounded-md transition-colors flex items-center justify-center gap-2"><LogOut className="w-4 h-4 text-gray-600" />Sign out ({currentUser.name})</button> : <>
                <button onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }} className="w-full py-3 text-center text-base font-medium text-[#212529] bg-[#f8f9fa] border border-[#dee2e6] rounded-md transition-colors flex items-center justify-center gap-2"><User className="w-4 h-4 text-gray-600" />Sign in</button>
                <button onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }} className="w-full py-3 text-center text-base font-semibold text-white bg-[#0041e8] rounded-full shadow-md transition-colors">Create account</button>
              </>}
            </div>

            {/* Mobile Footer Links */}
            <div className="pt-6 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/terms-of-service" className="hover:text-gray-900 flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#0041e8]" /> Terms
              </Link>
              <Link to="/report-abuse" className="hover:text-gray-900 flex items-center gap-1">
                <Shield className="w-3 h-3 text-red-500" /> Report Abuse
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
