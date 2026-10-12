import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import CapabilitiesSection from '../components/CapabilitiesSection';
import CloudPlatformSection from '../components/CloudPlatformSection';
import ShowcaseSection from '../components/ShowcaseSection';
import DeveloperSection from '../components/DeveloperSection';
import TrustSection from '../components/TrustSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FinalCTASection from '../components/FinalCTASection';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import CookieConsent from '../components/CookieConsent';
import PricingModal from '../components/PricingModal';

export default function HomePage() {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [showCookiePrefs, setShowCookiePrefs] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('spatialhub_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem('spatialhub_user');
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('spatialhub_token');
    localStorage.removeItem('spatialhub_user');
    setCurrentUser(null);
  };

  const handleAuthenticated = (user) => {
    setCurrentUser(user);
    navigate('/hub');
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenPricing = () => {
    setPricingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-[#0041e8] selection:text-white">
      
      {/* Header Bar */}
      <Header 
        onOpenAuth={handleOpenAuth} 
        onOpenPricing={handleOpenPricing}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection 
          onOpenAuth={handleOpenAuth} 
        />
        <StatsSection />
        <CapabilitiesSection />
        <CloudPlatformSection onOpenAuth={handleOpenAuth} />
        <ShowcaseSection />
        <DeveloperSection />
        <TrustSection />
        <TestimonialsSection />
        <FinalCTASection onOpenAuth={handleOpenAuth} />
      </main>

      {/* Footer */}
      <Footer onOpenCookiePrefs={() => setShowCookiePrefs(true)} />

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {/* Pricing & Plans Modal */}
      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        onSelectPlan={(mode) => {
          setPricingModalOpen(false);
          handleOpenAuth(mode);
        }}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent
        forceShow={showCookiePrefs}
        onCloseForce={() => setShowCookiePrefs(false)}
      />

    </div>
  );
}
