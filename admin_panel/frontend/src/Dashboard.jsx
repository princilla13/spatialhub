import React, { useCallback, useEffect, useState } from 'react';
import { Activity, Database, LogOut, RefreshCw, Search, ShieldAlert, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '—';
}

export default function Dashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('spatialhub_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed.');
    return data;
  }, [token]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const searchQuery = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
      const [metricsResult, usersResult] = await Promise.all([
        request('/admin/metrics'),
        request(`/admin/users${searchQuery}`),
      ]);
      setMetrics(metricsResult.metrics);
      setUsers(usersResult.users);
    } catch (loadError) {
      setError(loadError.message);
      if (/token|authorised|admin/i.test(loadError.message)) {
        localStorage.removeItem('spatialhub_admin_token');
        setToken('');
      }
    } finally {
      setLoading(false);
    }
  }, [request, search, token]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to sign in.');
      if (data.user.role !== 'admin') throw new Error('This account does not have admin access.');
      localStorage.setItem('spatialhub_admin_token', data.token);
      setToken(data.token);
      setPassword('');
    } catch (loginError) {
      setError(loginError.message);
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('spatialhub_admin_token');
    setToken('');
    setMetrics(null);
    setUsers([]);
  }

  if (!token) {
    return <main className="min-h-screen grid place-items-center bg-[#0b0f19] p-4 text-gray-100"><form onSubmit={handleLogin} className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-[#131b2e] p-8 shadow-2xl"><div><p className="text-xs font-bold tracking-[0.2em] text-[#00c4cc]">SPATIALHUB</p><h1 className="mt-2 text-2xl font-bold">Admin sign in</h1><p className="mt-1 text-sm text-gray-400">Use the admin account configured in the backend environment file.</p></div><input className="w-full rounded-xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-sm outline-none focus:border-[#00c4cc]" type="email" placeholder="Admin email" value={email} onChange={(event) => setEmail(event.target.value)} required /><input className="w-full rounded-xl border border-white/10 bg-[#0b0f19] px-4 py-3 text-sm outline-none focus:border-[#00c4cc]" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />{error && <p className="text-sm text-red-300">{error}</p>}<button className="w-full rounded-xl bg-[#0041e8] py-3 text-sm font-bold" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form></main>;
  }

  const cards = [
    { label: 'Registered users', value: metrics?.totalUsers ?? '—', icon: Users, color: 'text-[#00c4cc]' },
    { label: 'Datasets', value: metrics?.totalDatasets ?? '—', icon: Database, color: 'text-[#638cff]' },
    { label: 'Storage used', value: metrics ? `${metrics.activeStorageGB} GB` : '—', icon: Activity, color: 'text-purple-400' },
    { label: 'Pending reports', value: metrics?.pendingAbuseReports ?? '—', icon: ShieldAlert, color: 'text-red-400' },
  ];

  return <div className="min-h-screen bg-[#0b0f19] text-gray-100"><header className="flex items-center justify-between border-b border-white/10 bg-[#131b2e] px-6 py-4"><div><p className="text-xs font-bold tracking-[0.2em] text-[#00c4cc]">SPATIALHUB</p><h1 className="text-lg font-bold">Admin dashboard</h1></div><button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button></header><main className="mx-auto max-w-7xl p-6"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-bold">Live platform data</h2><p className="text-sm text-gray-400">Accounts and metrics are loaded from MongoDB.</p></div><button onClick={loadData} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/10" disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button></div>{error && <p className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({ label, value, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-white/10 bg-[#131b2e] p-5"><div className="flex justify-between text-sm text-gray-400"><span>{label}</span><Icon className={`h-5 w-5 ${color}`} /></div><p className="mt-3 text-3xl font-bold">{value}</p></article>)}</section><section className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-[#131b2e]"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5"><div><h3 className="font-bold">Registered users</h3><p className="text-xs text-gray-400">New registrations appear here automatically.</p></div><form onSubmit={(event) => { event.preventDefault(); loadData(); }} className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" /><input className="rounded-lg border border-white/10 bg-[#0b0f19] py-2 pl-9 pr-3 text-sm outline-none focus:border-[#00c4cc]" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} /></form></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-white/5 text-xs uppercase tracking-wide text-gray-400"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Plan</th><th className="p-4">Role</th><th className="p-4">Joined</th><th className="p-4">Status</th></tr></thead><tbody>{users.length ? users.map((user) => <tr key={user._id} className="border-t border-white/5"><td className="p-4 font-medium">{user.name}</td><td className="p-4 text-gray-300">{user.email}</td><td className="p-4 capitalize">{user.plan}</td><td className="p-4 capitalize">{user.role}</td><td className="p-4 text-gray-400">{formatDate(user.createdAt)}</td><td className="p-4"><span className={`rounded-full px-2 py-1 text-xs ${user.isActive ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'}`}>{user.isActive ? 'Active' : 'Suspended'}</span></td></tr>) : <tr><td colSpan="6" className="p-8 text-center text-gray-400">No registered users found.</td></tr>}</tbody></table></div></section></main></div>;
}
