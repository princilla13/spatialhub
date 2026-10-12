import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldAlert } from 'lucide-react';

export default function Footer({ onOpenCookiePrefs }) {
  return (
    <footer className="bg-[#0b0f19] text-gray-300 text-xs pt-16 pb-12 border-t border-gray-800 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/logo-dronedb.svg" 
                alt="DroneDB" 
                className="h-7 w-auto object-contain brightness-0 invert" 
                onError={(e) => { e.target.onerror = null; e.target.src = "/assets/logo-dronedb.png"; }} 
              />
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              The Open-Source Platform for Geospatial Data Management
            </p>
            <div className="pt-2 text-[11px] text-gray-400 space-y-1">
              <div className="font-bold text-gray-200">Digipa S.R.L.</div>
              <div>Piazza Giuseppe Grandi 7, 20129 Milano (MI), Italy</div>
              <div>CF/PIVA 10745180967 | REA MI-2553977</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://docs.dronedb.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c4cc] transition-colors flex items-center gap-1">
                  Documentation <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://github.com/DroneDB/DroneDB" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c4cc] transition-colors flex items-center gap-1">
                  GitHub <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </li>
              <li>
                <a href="https://dronedb.app/plans/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c4cc] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="https://dronedb.app/blog/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c4cc] transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal Center</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://dronedb.app/legal" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c4cc] transition-colors">
                  Legal Center
                </a>
              </li>
              <li>
                <a href="https://www.iubenda.com/privacy-policy/19576939" target="_blank" rel="noopener noreferrer" className="hover:text-[#00c4cc] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-[#00c4cc] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/report-abuse" className="hover:text-[#00c4cc] transition-colors flex items-center gap-1 text-red-400 hover:text-red-300">
                  <ShieldAlert className="w-3 h-3" /> Report Abuse
                </Link>
              </li>
              <li>
                <button onClick={onOpenCookiePrefs} className="hover:text-[#00c4cc] transition-colors text-left">
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Operator */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Community & Operator</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 text-gray-300">
                <a href="https://github.com/DroneDB" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                  GitHub
                </a>
                <a href="https://discord.gg/qDdDNsBYhd" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors">
                  Discord
                </a>
              </div>
              <div className="text-[11px] text-gray-400">
                Operated by <a href="https://digipa.tech" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-semibold">Digipa S.R.L.</a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div>© {new Date().getFullYear()} DroneDB. All rights reserved.</div>
          <div className="flex items-center space-x-4">
            <a href="https://dronedb.app/contact" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact</a>
            <a href="https://digipa.tech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Digipa Tech</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
