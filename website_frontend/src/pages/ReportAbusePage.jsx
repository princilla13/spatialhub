import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldAlert, CheckCircle, ChevronLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReportAbusePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [reason, setReason] = useState('copyright');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 flex flex-col">
      <Header onOpenAuth={() => {}} />
      <main className="flex-1 pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-[#00c4cc] hover:underline mb-8">
          <ChevronLeft className="w-4 h-4" /><span>Back to Home</span>
        </Link>
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold mb-4 border border-red-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /><span>TRUST & SAFETY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Report Abuse</h1>
          <p className="text-sm text-gray-400">Report illegal content, copyright infringement, or terms violations hosted on DroneDB Hub.</p>
        </div>

        {submitted ? (
          <div className="glass-card p-10 rounded-2xl border border-white/15 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center"><CheckCircle className="w-10 h-10" /></div>
            <h3 className="text-2xl font-bold text-white">Report Submitted</h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto">Thank you. Our compliance team will review within 24 hours. Ticket: <span className="font-mono text-[#00c4cc]">#AB-{Math.floor(100000 + Math.random() * 900000)}</span></p>
            <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold">Submit Another Report</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-10 rounded-2xl border border-white/15 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Your Full Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00c4cc]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Your Contact Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@domain.com" className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00c4cc]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Violating Content URL</label>
              <input type="url" required value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://hub.dronedb.app/r/username/dataset" className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00c4cc]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Reason for Report</label>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00c4cc]">
                <option value="copyright">Copyright Infringement (DMCA)</option>
                <option value="privacy">Privacy Violation</option>
                <option value="illegal">Illegal / Harmful Content</option>
                <option value="spam">Spam or Malware</option>
                <option value="other">Other Terms Violation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">Description & Evidence</label>
              <textarea required rows={5} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe why this content violates your rights or our acceptable use policy..." className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00c4cc]"></textarea>
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /><span>Submit Abuse Report</span>
            </button>
          </form>
        )}
      </main>
      <Footer onOpenCookiePrefs={() => {}} />
    </div>
  );
}
