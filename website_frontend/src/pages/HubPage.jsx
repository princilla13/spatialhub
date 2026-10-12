import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Database,
  FolderOpen,
  LogOut,
  Plus,
  RefreshCw,
  Share2,
  Upload,
  FileText,
  FolderUp,
  Download,
  Trash2,
  Check,
  Copy,
  Users,
  Info,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatSize(bytes = 0) {
  if (!bytes) return '0 B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

export default function HubPage() {
  const token = localStorage.getItem('spatialhub_token');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('mine'); // 'mine' | 'shared'
  const [datasets, setDatasets] = useState([]);
  const [sharedDatasets, setSharedDatasets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploadingDatasetId, setUploadingDatasetId] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  // Create Dataset Modal
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'GeoTIFF', description: '', isPublic: false });

  // Share Modal
  const [sharingDataset, setSharingDataset] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareNote, setShareNote] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Expanded file lists
  const [expandedDatasets, setExpandedDatasets] = useState({});
  const [downloadingFile, setDownloadingFile] = useState('');

  async function api(path, options = {}) {
    const response = await fetch(API_URL + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }

  async function loadHub() {
    setLoading(true);
    setError('');
    try {
      const [meRes, mineRes, sharedRes] = await Promise.all([
        api('/auth/me'),
        api('/datasets/mine'),
        api('/datasets/shared-with-me').catch(() => ({ datasets: [] })),
      ]);
      setUser(meRes.user);
      setDatasets(mineRes.datasets || []);
      setSharedDatasets(sharedRes.datasets || []);
      localStorage.setItem('spatialhub_user', JSON.stringify(meRes.user));
    } catch (loadError) {
      setError(loadError.message);
      if (loadError.message?.toLowerCase().includes('token') || loadError.message?.toLowerCase().includes('auth')) {
        localStorage.removeItem('spatialhub_token');
        localStorage.removeItem('spatialhub_user');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadHub();
  }, []);

  function toggleExpand(datasetId) {
    setExpandedDatasets((prev) => ({ ...prev, [datasetId]: !prev[datasetId] }));
  }

  async function createDataset(event) {
    event.preventDefault();
    try {
      const result = await api('/datasets', { method: 'POST', body: JSON.stringify(form) });
      setDatasets((items) => [result.dataset, ...items]);
      setForm({ name: '', type: 'GeoTIFF', description: '', isPublic: false });
      setShowCreate(false);
    } catch (createError) {
      setError(createError.message);
    }
  }

  async function deleteDataset(datasetId) {
    if (!window.confirm('Are you sure you want to delete this folder and all its uploaded TIFF files?')) {
      return;
    }
    try {
      await api(`/datasets/${datasetId}`, { method: 'DELETE' });
      setDatasets((items) => items.filter((d) => d._id !== datasetId));
    } catch (err) {
      setError(err.message || 'Failed to delete dataset');
    }
  }

  async function uploadTiffFiles(dataset, files) {
    if (!files.length) return;
    const tiffFiles = files.filter((file) => /\.tiff?$/i.test(file.name));
    const skippedFiles = files.length - tiffFiles.length;
    if (!tiffFiles.length) {
      setError('Only TIFF files (.tif or .tiff) are accepted.');
      return;
    }
    setError('');
    setUploadingDatasetId(dataset._id);
    try {
      for (let index = 0; index < tiffFiles.length; index += 1) {
        const file = tiffFiles[index];
        const relativePath = file.webkitRelativePath || file.name;
        setUploadProgress(`Uploading ${index + 1} of ${tiffFiles.length}: ${file.name}`);

        const uploadResponse = await fetch(`${API_URL}/datasets/${dataset._id}/files/upload`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/octet-stream',
            'X-File-Content-Type': file.type || 'image/tiff',
            'X-Relative-Path': encodeURIComponent(relativePath),
          },
          body: file,
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.message || `Upload failed for ${relativePath}`);
      }

      await loadHub();
      setExpandedDatasets((prev) => ({ ...prev, [dataset._id]: true }));
      setUploadProgress(
        skippedFiles
          ? `Uploaded ${tiffFiles.length} TIFF file(s); skipped ${skippedFiles} non-TIFF file(s).`
          : `Successfully uploaded ${tiffFiles.length} TIFF file(s)!`
      );
      setTimeout(() => setUploadProgress(''), 4000);
    } catch (uploadError) {
      setError(uploadError.message || 'Upload failed. Check backend connection and storage permissions.');
      setUploadProgress('');
    } finally {
      setUploadingDatasetId('');
    }
  }

  async function downloadFile(datasetId, relativePath, fileName) {
    setDownloadingFile(`${datasetId}-${relativePath}`);
    try {
      const res = await fetch(`${API_URL}/datasets/${datasetId}/files/download?path=${encodeURIComponent(relativePath)}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || relativePath.split('/').pop() || 'dataset-file.tif';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Failed to download file');
    } finally {
      setDownloadingFile('');
    }
  }

  // Sharing Handlers
  function openShareModal(dataset) {
    setSharingDataset(dataset);
    setShareEmail('');
    setShareNote('');
    setShareSuccess('');
  }

  async function handleShare(event) {
    event.preventDefault();
    if (!sharingDataset || !shareEmail.trim()) return;
    setShareLoading(true);
    setError('');
    try {
      const res = await api(`/datasets/${sharingDataset._id}/share`, {
        method: 'POST',
        body: JSON.stringify({ email: shareEmail.trim(), note: shareNote.trim() }),
      });
      setShareSuccess(`Folder shared with ${shareEmail.trim()}`);
      setShareEmail('');
      setShareNote('');
      // Update local state
      setDatasets((items) =>
        items.map((item) =>
          item._id === sharingDataset._id ? { ...item, sharedWith: res.sharedWith } : item
        )
      );
      setSharingDataset((prev) => (prev ? { ...prev, sharedWith: res.sharedWith } : null));
      setTimeout(() => setShareSuccess(''), 4000);
    } catch (shareErr) {
      setError(shareErr.message || 'Failed to share folder');
    } finally {
      setShareLoading(false);
    }
  }

  async function handleRevokeShare(datasetId, emailToRevoke) {
    try {
      const res = await api(`/datasets/${datasetId}/share/${encodeURIComponent(emailToRevoke)}`, {
        method: 'DELETE',
      });
      setDatasets((items) =>
        items.map((item) =>
          item._id === datasetId ? { ...item, sharedWith: res.sharedWith } : item
        )
      );
      setSharingDataset((prev) => (prev ? { ...prev, sharedWith: res.sharedWith } : null));
    } catch (err) {
      setError(err.message || 'Failed to revoke access');
    }
  }

  function copyShareLink(datasetId) {
    const url = `${window.location.origin}/shared/${datasetId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  function signOut() {
    localStorage.removeItem('spatialhub_token');
    localStorage.removeItem('spatialhub_user');
    window.location.assign('/');
  }

  if (!token) return <Navigate to="/" replace />;
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#08111f] text-white">
        <div className="flex flex-col items-center gap-3">
          <Database className="h-8 w-8 animate-pulse text-[#00c4cc]" />
          <p className="text-gray-400">Loading SpatialHub Workspace…</p>
        </div>
      </main>
    );
  }
  if (!user) return <Navigate to="/" replace />;

  const storageUsed = datasets.reduce((total, item) => total + (item.sizeBytes || 0), 0);
  const activeList = activeTab === 'mine' ? datasets : sharedDatasets;

  return (
    <main className="min-h-screen bg-[#08111f] text-gray-100">
      {/* Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0d192b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-lg font-black tracking-tight">
            Spatial<span className="text-[#00c4cc]">Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-300 sm:block">{user.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10 transition"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-white/10 bg-[#0d192b] p-4 flex flex-col justify-between">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#00c4cc]">WORKSPACE</p>
            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveTab('mine')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'mine'
                    ? 'bg-[#0041e8] text-white shadow-lg shadow-[#0041e8]/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen className="h-4 w-4" />
                  My Datasets
                </div>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold">
                  {datasets.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('shared')}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  activeTab === 'shared'
                    ? 'bg-[#0041e8] text-white shadow-lg shadow-[#0041e8]/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4" />
                  Shared with Me
                </div>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold">
                  {sharedDatasets.length}
                </span>
              </button>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-sm text-gray-400">
            <p className="font-semibold text-white">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            <span className="mt-2 inline-block rounded-md bg-[#00c4cc]/10 px-2 py-0.5 text-xs font-medium text-[#00c4cc] capitalize">
              {user.plan || 'Free'} Plan
            </span>
          </div>
        </aside>

        {/* Content Area */}
        <section>
          {/* Top Header */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-[#00c4cc]">
                {activeTab === 'mine' ? 'MY WORKSPACE' : 'SHARED WORKSPACE'}
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold">
                {activeTab === 'mine' ? 'Geospatial TIFF Folders' : 'Folders Shared With You'}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                {activeTab === 'mine'
                  ? 'Upload, manage, and share your TIFF dataset folders.'
                  : 'Folders shared directly with your email by other SpatialHub users.'}
              </p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={loadHub}
                className="rounded-xl border border-white/15 p-2.5 hover:bg-white/10 transition"
                title="Refresh Workspace"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              {activeTab === 'mine' && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#0041e8] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0036c2] shadow-lg shadow-[#0041e8]/25 transition"
                >
                  <Plus className="h-4 w-4" />
                  New Dataset Folder
                </button>
              )}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-5 flex items-start justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-200">
              <p>{error}</p>
              <button onClick={() => setError('')} className="text-red-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {uploadProgress && (
            <div className="mb-5 rounded-xl border border-[#00c4cc]/30 bg-[#00c4cc]/10 p-3.5 text-sm text-[#00c4cc] flex items-center gap-2">
              <Upload className="h-4 w-4 animate-bounce" />
              <span>{uploadProgress}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-[#0d192b] p-5">
              <FolderOpen className="h-5 w-5 text-[#00c4cc]" />
              <p className="mt-3 text-2xl font-bold">{datasets.length}</p>
              <p className="text-xs text-gray-400">My Dataset Folders</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#0d192b] p-5">
              <Users className="h-5 w-5 text-purple-400" />
              <p className="mt-3 text-2xl font-bold">{sharedDatasets.length}</p>
              <p className="text-xs text-gray-400">Folders Shared With Me</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#0d192b] p-5">
              <Database className="h-5 w-5 text-[#638cff]" />
              <p className="mt-3 text-2xl font-bold">{formatSize(storageUsed)}</p>
              <p className="text-xs text-gray-400">Total Storage Used</p>
            </article>
          </div>

          {/* Datasets List Section */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d192b]">
            <div className="border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base">
                  {activeTab === 'mine' ? 'My Datasets' : 'Shared with Me'}
                </h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  {activeTab === 'mine'
                    ? 'Upload individual .tif/.tiff files or complete folders, then share them securely.'
                    : 'Folders you have been granted access to view and download.'}
                </p>
              </div>
              <span className="text-xs text-gray-400">{activeList.length} total</span>
            </div>

            {activeList.length > 0 ? (
              <div className="divide-y divide-white/5">
                {activeList.map((dataset) => {
                  const tiffFiles = (dataset.files || []).filter((f) => /\.tiff?$/i.test(f.relativePath));
                  const isExpanded = Boolean(expandedDatasets[dataset._id]);
                  const sharedCount = dataset.sharedWith?.length || 0;

                  return (
                    <article key={dataset._id} className="p-5 transition hover:bg-white/[0.01]">
                      {/* Folder Item Header */}
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base text-white">{dataset.name}</h3>
                            <span className="rounded-md bg-[#00c4cc]/15 px-2 py-0.5 text-xs font-semibold text-[#00c4cc]">
                              {dataset.type || 'GeoTIFF'}
                            </span>
                            {activeTab === 'mine' ? (
                              sharedCount > 0 ? (
                                <span className="flex items-center gap-1 rounded-md bg-purple-500/15 px-2 py-0.5 text-xs font-medium text-purple-300">
                                  <Users className="h-3 w-3" /> Shared with {sharedCount} user(s)
                                </span>
                              ) : (
                                <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                                  Private
                                </span>
                              )
                            ) : (
                              <span className="rounded-md bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-300">
                                Shared by {dataset.owner?.name || dataset.owner?.email || 'User'}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-gray-400">
                            {formatSize(dataset.sizeBytes)} · {tiffFiles.length} TIFF file(s) · Created{' '}
                            {new Date(dataset.createdAt).toLocaleDateString()}
                          </p>

                          {dataset.description && (
                            <p className="mt-2 text-sm text-gray-300 line-clamp-2">{dataset.description}</p>
                          )}

                          {/* Note from sender (if in Shared With Me view) */}
                          {activeTab === 'shared' && dataset.shareNote && (
                            <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-200">
                              <span className="font-semibold text-blue-300 flex items-center gap-1 mb-0.5">
                                <Info className="h-3.5 w-3.5" /> Note from {dataset.owner?.name || 'sender'}:
                              </span>
                              {dataset.shareNote}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {activeTab === 'mine' && (
                            <>
                              {/* Upload TIFF Files Button */}
                              <input
                                id={`files-${dataset._id}`}
                                className="hidden"
                                type="file"
                                accept=".tif,.tiff"
                                multiple
                                onChange={(e) => {
                                  uploadTiffFiles(dataset, Array.from(e.target.files || []));
                                  e.target.value = '';
                                }}
                              />
                              <label
                                htmlFor={`files-${dataset._id}`}
                                title="Upload one or more TIFF files"
                                className={`flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#00c4cc]/30 bg-[#00c4cc]/10 px-3 py-2 text-xs font-semibold text-[#00c4cc] hover:bg-[#00c4cc]/20 transition ${
                                  uploadingDatasetId === dataset._id ? 'pointer-events-none opacity-50' : ''
                                }`}
                              >
                                <FileText className="h-3.5 w-3.5" />
                                {uploadingDatasetId === dataset._id ? 'Uploading…' : 'Upload TIFF Files'}
                              </label>

                              {/* Upload Folder Button */}
                              <input
                                id={`folder-${dataset._id}`}
                                className="hidden"
                                type="file"
                                accept=".tif,.tiff"
                                multiple
                                webkitdirectory=""
                                directory=""
                                onChange={(e) => {
                                  uploadTiffFiles(dataset, Array.from(e.target.files || []));
                                  e.target.value = '';
                                }}
                              />
                              <label
                                htmlFor={`folder-${dataset._id}`}
                                title="Upload an entire folder containing TIFF files"
                                className={`flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium hover:bg-white/10 transition ${
                                  uploadingDatasetId === dataset._id ? 'pointer-events-none opacity-50' : ''
                                }`}
                              >
                                <FolderUp className="h-3.5 w-3.5" />
                                Upload Folder
                              </label>

                              {/* Share Button */}
                              <button
                                onClick={() => openShareModal(dataset)}
                                title="Share folder with a user by email"
                                className="flex items-center gap-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 px-3 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 transition"
                              >
                                <Share2 className="h-3.5 w-3.5" />
                                Share
                              </button>

                              {/* Delete Dataset Button */}
                              <button
                                onClick={() => deleteDataset(dataset._id)}
                                title="Delete dataset"
                                className="rounded-xl border border-white/15 p-2 text-gray-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}

                          {/* Toggle Files List */}
                          <button
                            onClick={() => toggleExpand(dataset._id)}
                            className="flex items-center gap-1 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 transition"
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {tiffFiles.length} File(s)
                          </button>
                        </div>
                      </div>

                      {/* Expandable File Tree & Downloads */}
                      {isExpanded && (
                        <div className="mt-4 rounded-xl border border-white/10 bg-[#08111f]/60 p-4">
                          <div className="mb-2.5 flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                              Files in Folder ({tiffFiles.length})
                            </p>
                            <span className="text-xs text-gray-500">Click download to save locally</span>
                          </div>

                          {tiffFiles.length > 0 ? (
                            <div className="divide-y divide-white/5 max-h-64 overflow-y-auto pr-1">
                              {tiffFiles.map((file, idx) => (
                                <div
                                  key={`${file.relativePath}-${idx}`}
                                  className="flex items-center justify-between py-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0 pr-3">
                                    <FileText className="h-3.5 w-3.5 text-[#00c4cc] shrink-0" />
                                    <span className="truncate text-gray-200">{file.relativePath}</span>
                                    <span className="shrink-0 text-gray-500">({formatSize(file.sizeBytes)})</span>
                                  </div>

                                  <button
                                    onClick={() => downloadFile(dataset._id, file.relativePath)}
                                    disabled={downloadingFile === `${dataset._id}-${file.relativePath}`}
                                    className="flex items-center gap-1.5 rounded-lg bg-[#0041e8]/20 border border-[#0041e8]/40 px-2.5 py-1 text-xs font-medium text-blue-300 hover:bg-[#0041e8] hover:text-white transition disabled:opacity-50 shrink-0"
                                  >
                                    <Download className="h-3 w-3" />
                                    {downloadingFile === `${dataset._id}-${file.relativePath}` ? 'Saving…' : 'Download'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="py-4 text-center text-xs text-gray-500">
                              No TIFF files in this folder yet. Use "Upload TIFF Files" or "Upload Folder" above.
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                {activeTab === 'mine' ? (
                  <>
                    <FolderOpen className="mx-auto h-10 w-10 text-gray-500" />
                    <h3 className="mt-3 font-bold text-lg">No datasets yet</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Create your first dataset folder to begin uploading and sharing TIFF files.
                    </p>
                    <button
                      onClick={() => setShowCreate(true)}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0041e8] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0036c2]"
                    >
                      <Plus className="h-4 w-4" />
                      Create Dataset Folder
                    </button>
                  </>
                ) : (
                  <>
                    <Users className="mx-auto h-10 w-10 text-gray-500" />
                    <h3 className="mt-3 font-bold text-lg">No shared folders</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      When other users share folders with your email ({user.email}), they will appear here.
                    </p>
                  </>
                )}
              </div>
            )}
          </section>
        </section>
      </div>

      {/* ── CREATE DATASET MODAL ─────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={createDataset}
            className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#131b2e] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Create Dataset Folder</h2>
                <p className="text-xs text-gray-400 mt-0.5">Organize your TIFF and geospatial datasets.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">Folder / Dataset Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Survey Zone A Orthophotos"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-2.5 text-sm outline-none focus:border-[#00c4cc]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">Dataset Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-2.5 text-sm"
              >
                <option value="GeoTIFF">GeoTIFF (Raster / Orthomosaic)</option>
                <option value="Orthophoto">Orthophoto</option>
                <option value="Potree 3D">Potree 3D</option>
                <option value="LAZ">LAZ / LAS Point Cloud</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">Description (Optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Project notes or coordinate system details..."
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-2.5 text-sm outline-none focus:border-[#00c4cc]"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-white/10 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#0041e8] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0036c2]"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── SHARE FOLDER MODAL ───────────────────────────────── */}
      {sharingDataset && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-4 rounded-2xl border border-white/10 bg-[#131b2e] p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Share2 className="h-5 w-5 text-purple-400" />
                  Share "{sharingDataset.name}"
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Share this folder with another user by email.
                </p>
              </div>
              <button
                onClick={() => setSharingDataset(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mandatory Security Information Note */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3.5 text-xs text-cyan-200">
              <p className="font-bold flex items-center gap-1.5 text-cyan-300 mb-1">
                <Info className="h-4 w-4" /> Important Security Note:
              </p>
              The recipient must be logged into SpatialHub with this exact email address to open, view, and download files from this folder.
            </div>

            {/* Form */}
            <form onSubmit={handleShare} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-gray-300">Recipient Email Address</label>
                <input
                  type="email"
                  required
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="colleague@domain.com"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-2.5 text-sm outline-none focus:border-[#00c4cc]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300">Note for Recipient (Optional)</label>
                <textarea
                  value={shareNote}
                  onChange={(e) => setShareNote(e.target.value)}
                  placeholder="e.g. Here are the survey orthophotos for inspection..."
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-2.5 text-sm outline-none focus:border-[#00c4cc]"
                  rows="2"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => copyShareLink(sharingDataset._id)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs text-gray-300 hover:bg-white/10 transition"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedLink ? 'Copied Folder Link!' : 'Copy Direct Link'}
                </button>

                <button
                  type="submit"
                  disabled={shareLoading || !shareEmail.trim()}
                  className="flex items-center gap-2 rounded-xl bg-[#0041e8] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0036c2] disabled:opacity-50 transition"
                >
                  <Share2 className="h-4 w-4" />
                  {shareLoading ? 'Sharing…' : 'Share Folder'}
                </button>
              </div>
            </form>

            {shareSuccess && (
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-center text-xs text-emerald-300">
                {shareSuccess}
              </p>
            )}

            {/* Currently Shared Collaborators List */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                People with access ({sharingDataset.sharedWith?.length || 0})
              </p>

              {sharingDataset.sharedWith?.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {sharingDataset.sharedWith.map((entry) => (
                    <div
                      key={entry.email}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-[#08111f] px-3 py-2 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-white truncate">{entry.email}</p>
                        {entry.note && (
                          <p className="text-gray-400 truncate text-[11px] mt-0.5">Note: {entry.note}</p>
                        )}
                        <p className="text-gray-500 text-[10px]">
                          Shared on {new Date(entry.sharedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRevokeShare(sharingDataset._id, entry.email)}
                        title="Revoke access"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-500/15 hover:text-red-300 transition shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 py-1">This folder has not been shared with anyone yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
