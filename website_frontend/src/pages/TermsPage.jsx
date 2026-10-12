import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 flex flex-col">
      <Header onOpenAuth={() => {}} />
      <main className="flex-1 pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-[#00c4cc] hover:underline mb-8">
          <ChevronLeft className="w-4 h-4" /><span>Back to Home</span>
        </Link>
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0041e8]/15 text-[#00c4cc] text-xs font-semibold mb-4 border border-[#00c4cc]/20">
            <FileText className="w-3.5 h-3.5" /><span>LEGAL AGREEMENT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last Updated: June 30, 2022 • Operated by Digipa S.R.L.</p>
        </div>
        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          {[
            { title: "1. Acceptance of Terms", body: "By accessing and using DroneDB (including dronedb.app, hub.dronedb.app, and associated command-line interfaces and APIs), you agree to comply with and be bound by these Terms of Service. If you do not agree to these Terms, you must not use our services." },
            { title: "2. Description of Services", body: "DroneDB provides modern cloud-based and self-hosted software solutions for geospatial data management, orthophoto processing, LiDAR point cloud visualization, 3D model streaming, and dataset sharing." },
            { title: "3. User Accounts and Content Responsibilities", body: "Users are solely responsible for maintaining the confidentiality of their account credentials and for all data, orthophotos, point clouds, and files uploaded to DroneDB Hub. You warrant that you hold all necessary rights and licenses for any content uploaded to the platform." },
            { title: "4. Acceptable Use Policy", body: "You agree not to upload, store, or distribute any content that violates applicable local, national, or international laws, infringes on third-party intellectual property rights, contains malicious software, or violates privacy regulations." },
            { title: "5. Governing Law and Operator Details", body: "These terms are governed by the laws of Italy. DroneDB is operated by Digipa S.R.L., Piazza Giuseppe Grandi 7, 20129 Milano (MI), Italy (CF/PIVA 10745180967, REA MI-2553977)." }
          ].map((section, idx) => (
            <div key={idx} className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <p className="text-gray-300">{section.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer onOpenCookiePrefs={() => {}} />
    </div>
  );
}
