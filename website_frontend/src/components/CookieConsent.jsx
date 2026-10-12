import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export default function CookieConsent({ forceShow, onCloseForce }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('dronedb_cookie_consent');
    if (!consent || forceShow) setVisible(true);
  }, [forceShow]);

  const handleAccept = () => {
    localStorage.setItem('dronedb_cookie_consent', 'accepted');
    setVisible(false);
    if (onCloseForce) onCloseForce();
  };

  const handleReject = () => {
    localStorage.setItem('dronedb_cookie_consent', 'rejected');
    setVisible(false);
    if (onCloseForce) onCloseForce();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-[#131b2e]/95 backdrop-blur-xl border border-white/15 p-5 rounded-2xl shadow-2xl">
      <div className="flex items-start space-x-3 mb-3">
        <div className="p-2 rounded-xl bg-[#0041e8]/20 text-[#00c4cc] shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-1">Cookie Preferences</h4>
          <p className="text-xs text-gray-300 leading-relaxed">We use cookies to improve your browsing experience and analyze site traffic per our Privacy Policy.</p>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
        <button onClick={handleReject} className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors">Reject All</button>
        <button onClick={handleAccept} className="px-4 py-1.5 rounded-lg bg-[#0041e8] hover:bg-[#0036c2] text-white text-xs font-semibold shadow-md transition-colors">Accept All</button>
      </div>
    </div>
  );
}
