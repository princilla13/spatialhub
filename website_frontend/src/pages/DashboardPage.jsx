import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Database, LogOut, UserRound } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spatialhub_user')); } catch { return null; }
  });
  const [message, setMessage] = useState('Loading your account…');

  useEffect(() => {
    const token = localStorage.getItem('spatialhub_token');
    if (!token) return;
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        localStorage.setItem('spatialhub_user', JSON.stringify(data.user));
        setUser(data.user);
        setMessage('');
      })
      .catch(() => {
        localStorage.removeItem('spatialhub_token');
        localStorage.removeItem('spatialhub_user');
        setUser(null);
      });
  }, []);

  if (!localStorage.getItem('spatialhub_token')) return <Navigate to="/" replace />;
  if (!user) return <main className="min-h-screen grid place-items-center bg-[#0b0f19] text-white">{message}</main>;

  function signOut() {
    localStorage.removeItem('spatialhub_token');
    localStorage.removeItem('spatialhub_user');
    window.location.assign('/');
  }

  return <main className="min-h-screen bg-[#0b0f19] px-4 py-12 text-gray-100"><section className="mx-auto max-w-3xl"><div className="mb-8 flex items-center justify-between"><Link to="/" className="text-sm font-semibold text-[#00c4cc] hover:underline">← Back to SpatialHub</Link><button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button></div><article className="rounded-3xl border border-white/10 bg-[#131b2e] p-8 shadow-2xl"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#0041e8]"><UserRound className="h-7 w-7" /></div><div><p className="text-sm text-[#00c4cc]">SPATIALHUB HUB</p><h1 className="text-2xl font-bold">Welcome, {user.name}</h1></div></div><dl className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-black/20 p-4"><dt className="text-xs uppercase tracking-wide text-gray-400">Email</dt><dd className="mt-1 font-medium">{user.email}</dd></div><div className="rounded-xl bg-black/20 p-4"><dt className="text-xs uppercase tracking-wide text-gray-400">Plan</dt><dd className="mt-1 font-medium capitalize">{user.plan}</dd></div></dl><div className="mt-7 rounded-xl border border-[#00c4cc]/20 bg-[#00c4cc]/5 p-5"><Database className="mb-2 h-5 w-5 text-[#00c4cc]" /><h2 className="font-bold">Your SpatialHub workspace is ready</h2><p className="mt-1 text-sm text-gray-300">Your account is securely stored in SpatialHub’s database. Dataset upload and workspace tools are the next feature to connect.</p></div></article></section></main>;
}
