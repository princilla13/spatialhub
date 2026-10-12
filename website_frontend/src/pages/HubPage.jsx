import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Database, FolderOpen, LogOut, Plus, RefreshCw, Share2, Upload } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatSize(bytes = 0) {
  return bytes ? (bytes / 1000000).toFixed(1) + ' MB' : '0 MB';
}

export default function HubPage() {
  const token = localStorage.getItem('spatialhub_token');
  const [user, setUser] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingDatasetId, setUploadingDatasetId] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Other', description: '', isPublic: false });

  async function api(path, options = {}) {
    const response = await fetch(API_URL + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token, ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async function loadHub() {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all([api('/auth/me'), api('/datasets/mine')]);
      setUser(results[0].user);
      setDatasets(results[1].datasets);
      localStorage.setItem('spatialhub_user', JSON.stringify(results[0].user));
    } catch (loadError) {
      setError(loadError.message);
      localStorage.removeItem('spatialhub_token');
      localStorage.removeItem('spatialhub_user');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (token) loadHub(); }, []);

  async function createDataset(event) {
    event.preventDefault();
    try {
      const result = await api('/datasets', { method: 'POST', body: JSON.stringify(form) });
      setDatasets((items) => [result.dataset, ...items]);
      setForm({ name: '', type: 'Other', description: '', isPublic: false });
      setShowCreate(false);
    } catch (createError) {
      setError(createError.message);
    }
  }

  async function uploadFolder(dataset, files) {
    if (!files.length) return;
    const tiffFiles = files.filter((file) => /\.tiff?$/i.test(file.name));
    const skippedFiles = files.length - tiffFiles.length;
    if (!tiffFiles.length) {
      setError('This dataset accepts TIFF files only (.tif or .tiff).');
      return;
    }
    setError('');
    setUploadingDatasetId(dataset._id);
    try {
      for (let index = 0; index < tiffFiles.length; index += 1) {
        const file = tiffFiles[index];
        const relativePath = file.webkitRelativePath || file.name;
        setUploadProgress(`Uploading ${index + 1} of ${tiffFiles.length}: ${relativePath}`);

        const uploadResponse = await fetch(`${API_URL}/datasets/${dataset._id}/files/upload`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/octet-stream',
            'X-File-Content-Type': file.type || 'application/octet-stream',
            'X-Relative-Path': encodeURIComponent(relativePath),
          },
          body: file,
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.message || `Upload failed for ${relativePath}`);
      }
      const result = await api('/datasets/mine');
      setDatasets(result.datasets);
      setUploadProgress(skippedFiles ? `Uploaded ${tiffFiles.length} TIFF file(s); skipped ${skippedFiles} non-TIFF file(s).` : '');
    } catch (uploadError) {
      setError(uploadError.message || 'Upload failed. Check the backend connection and storage permissions.');
      setUploadProgress('');
    } finally {
      setUploadingDatasetId('');
    }
  }

  function signOut() {
    localStorage.removeItem('spatialhub_token');
    localStorage.removeItem('spatialhub_user');
    window.location.assign('/');
  }

  if (!token) return <Navigate to="/" replace />;
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#08111f] text-white">Loading SpatialHub Hub…</main>;
  if (!user) return <Navigate to="/" replace />;

  const storage = datasets.reduce((total, item) => total + (item.sizeBytes || 0), 0);
  const publicCount = datasets.filter((item) => item.isPublic).length;

  return <main className="min-h-screen bg-[#08111f] text-gray-100">
    <header className="border-b border-white/10 bg-[#0d192b]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="text-lg font-black tracking-tight">Spatial<span className="text-[#00c4cc]">Hub</span></Link>
        <div className="flex items-center gap-4"><span className="hidden text-sm text-gray-300 sm:block">{user.email}</span><button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"><LogOut className="h-4 w-4" />Sign out</button></div>
      </div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-2xl border border-white/10 bg-[#0d192b] p-4"><p className="mb-5 text-xs font-bold tracking-[0.2em] text-[#00c4cc]">WORKSPACE</p><div className="rounded-xl bg-[#0041e8] px-3 py-2.5 text-sm font-semibold">My datasets</div><div className="mt-5 border-t border-white/10 pt-5 text-sm text-gray-400"><p className="font-medium text-white">{user.name}</p><p className="mt-1 capitalize">{user.plan} plan</p></div></aside>
      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-[#00c4cc]">SPATIALHUB HUB</p><h1 className="mt-1 text-3xl font-bold">Your geospatial workspace</h1><p className="mt-2 text-sm text-gray-400">Manage datasets that belong to your account.</p></div><div className="flex gap-3"><button onClick={loadHub} className="rounded-xl border border-white/15 p-3 hover:bg-white/10" title="Refresh"><RefreshCw className="h-4 w-4" /></button><button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-xl bg-[#0041e8] px-4 py-3 text-sm font-bold hover:bg-[#0036c2]"><Plus className="h-4 w-4" />New dataset</button></div></div>
        {error && <p className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-3"><article className="rounded-2xl border border-white/10 bg-[#0d192b] p-5"><FolderOpen className="h-5 w-5 text-[#00c4cc]" /><p className="mt-4 text-2xl font-bold">{datasets.length}</p><p className="text-sm text-gray-400">Datasets</p></article><article className="rounded-2xl border border-white/10 bg-[#0d192b] p-5"><Database className="h-5 w-5 text-[#638cff]" /><p className="mt-4 text-2xl font-bold">{formatSize(storage)}</p><p className="text-sm text-gray-400">Storage used</p></article><article className="rounded-2xl border border-white/10 bg-[#0d192b] p-5"><Share2 className="h-5 w-5 text-purple-300" /><p className="mt-4 text-2xl font-bold">{publicCount}</p><p className="text-sm text-gray-400">Shared publicly</p></article></div>
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d192b]"><div className="border-b border-white/10 p-5"><h2 className="font-bold">My datasets</h2><p className="mt-1 text-xs text-gray-400">Folder uploads accept TIFF files only (.tif and .tiff).</p></div>{datasets.length ? <div className="divide-y divide-white/5">{datasets.map((dataset) => <article key={dataset._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold">{dataset.name}</h3><p className="mt-1 text-xs text-gray-400">{dataset.type} · {dataset.isPublic ? 'Public' : 'Private'} · {formatSize(dataset.sizeBytes)} · {dataset.files?.length || 0} files</p>{dataset.description && <p className="mt-2 text-sm text-gray-300">{dataset.description}</p>}{dataset.files?.length > 0 && <details className="mt-2 text-xs text-gray-400"><summary className="cursor-pointer">Show uploaded folder paths</summary><ul className="mt-2 max-h-32 space-y-1 overflow-auto pl-4">{dataset.files.map((file, index) => <li key={`${file.relativePath}-${index}`} className="break-all">{file.relativePath}</li>)}</ul></details>}</div><div className="flex shrink-0 items-center gap-3"><input id={`folder-${dataset._id}`} className="hidden" type="file" accept=".tif,.tiff" multiple webkitdirectory="" directory="" onChange={(event) => { uploadFolder(dataset, Array.from(event.target.files || [])); event.target.value = ''; }} /><label htmlFor={`folder-${dataset._id}`} className={`flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10 ${uploadingDatasetId === dataset._id ? 'pointer-events-none opacity-50' : ''}`}><Upload className="h-4 w-4" />{uploadingDatasetId === dataset._id ? 'Uploading…' : 'Upload folder'}</label><span className="rounded-full bg-white/10 px-2 py-1 text-xs">{dataset.isPublic ? 'Shared' : 'Private'}</span></div></article>)}</div> : <div className="p-10 text-center"><Database className="mx-auto h-8 w-8 text-[#00c4cc]" /><h3 className="mt-3 font-bold">No datasets yet</h3><p className="mt-1 text-sm text-gray-400">Create your first dataset to begin using SpatialHub.</p></div>}</section>
        {uploadProgress && <p className="mt-3 text-sm text-[#00c4cc]">{uploadProgress}</p>}
      </section>
    </div>
    {showCreate && <div className="fixed inset-0 grid place-items-center bg-black/70 p-4"><form onSubmit={createDataset} className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#131b2e] p-6 shadow-2xl"><div><h2 className="text-xl font-bold">Create dataset</h2><p className="text-sm text-gray-400">Save dataset information to your SpatialHub account.</p></div><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Dataset name" className="w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-3 outline-none focus:border-[#00c4cc]" /><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-3"><option>Other</option><option>LAZ</option><option>LAS</option><option>Potree 3D</option><option>glTF 3D</option><option>GeoTIFF</option><option>Orthophoto</option></select><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description (optional)" className="w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-3 outline-none focus:border-[#00c4cc]" rows="3" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublic} onChange={(event) => setForm({ ...form, isPublic: event.target.checked })} />Make this dataset public</label><div className="flex justify-end gap-3"><button type="button" onClick={() => setShowCreate(false)} className="rounded-xl px-4 py-3 text-sm">Cancel</button><button className="rounded-xl bg-[#0041e8] px-4 py-3 text-sm font-bold">Create dataset</button></div></form></div>}
  </main>;
}
