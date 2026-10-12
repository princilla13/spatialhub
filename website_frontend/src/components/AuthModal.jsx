import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, Building, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onAuthenticated }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSubmitted(false);
      setError('');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const endpoint = mode === 'login' ? 'login' : 'register';
      const body = mode === 'login'
        ? { email, password }
        : { name: orgName, email, password };
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to complete your request.');

      localStorage.setItem('spatialhub_token', data.token);
      localStorage.setItem('spatialhub_user', JSON.stringify(data.user));
      setSubmitted(true);
      onAuthenticated?.(data.user);
      setTimeout(onClose, 1400);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#131b2e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#0041e8] p-1.5 flex items-center justify-center shadow-lg shadow-[#0041e8]/30">
            <img src="/assets/logo-dronedb.svg" alt="DroneDB" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">DroneDB Hub</span>
        </div>

        <div className="grid grid-cols-2 p-1 bg-[#0b0f19] rounded-xl border border-white/10 mb-6">
          <button onClick={() => { setMode('login'); setSubmitted(false); setError(''); }} className={`py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-[#0041e8] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
            Log In
          </button>
          <button onClick={() => { setMode('register'); setSubmitted(false); setError(''); }} className={`py-2 text-xs font-semibold rounded-lg transition-all ${mode === 'register' ? 'bg-[#0041e8] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
            Start 30-Day Trial
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">{mode === 'login' ? 'Welcome Back!' : 'Account Created!'}</h3>
            <p className="text-xs text-gray-300">Your SpatialHub account is ready.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Organization Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Geospatial Corp" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00c4cc] transition-colors" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00c4cc] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00c4cc] transition-colors" />
              </div>
            </div>
            {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-[#0041e8] hover:bg-[#0036c2] text-white font-semibold text-sm shadow-xl shadow-[#0041e8]/30 transition-all flex items-center justify-center gap-2 mt-6">
              <span>{isSubmitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Trial Account'}</span>
              <ArrowRight className="w-4 h-4 text-[#00c4cc]" />
            </button>
            <p className="text-[11px] text-gray-500 text-center pt-2">
              By proceeding, you accept DroneDB's{' '}
              <a href="/terms-of-service" className="text-[#00c4cc] underline">Terms of Service</a> and{' '}
              <a href="https://www.iubenda.com/privacy-policy/19576939" target="_blank" rel="noopener noreferrer" className="text-[#00c4cc] underline">Privacy Policy</a>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
