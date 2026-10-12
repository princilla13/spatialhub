import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Database, 
  Download, 
  FileText, 
  FolderOpen, 
  Lock, 
  ArrowLeft, 
  User, 
  Calendar, 
  HardDrive, 
  Share2, 
  Check, 
  Copy,
  Info,
  ShieldAlert
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatSize(bytes = 0) {
  if (!bytes) return '0 B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

export default function SharedDatasetPage() {
  const { id } = useParams();
  const token = localStorage.getItem('spatialhub_token');
  const storedUser = JSON.parse(localStorage.getItem('spatialhub_user') || 'null');

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState('');

  useEffect(() => {
    async function fetchSharedFolder() {
      setLoading(true);
      setError('');
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/datasets/${id}`, { headers });
        const data = await res.json();

        if (res.status === 401 || data.requiresLogin) {
          setRequiresLogin(true);
          setError(data.message || 'You must be logged in with the shared email address to view this folder.');
          return;
        }

        if (!res.ok) {
          throw new Error(data.message || 'Unable to access this shared folder.');
        }

        setDataset(data.dataset);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchSharedFolder();
  }, [id, token]);

  async function handleDownload(relativePath) {
    setDownloadingFile(relativePath);
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/datasets/${id}/files/download?path=${encodeURIComponent(relativePath)}`, {
        headers,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Download failed');
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = relativePath.split('/').pop() || 'dataset-file.tif';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert(err.message || 'Failed to download file');
    } finally {
      setDownloadingFile('');
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#08111f] text-white">
        <div className="flex flex-col items-center gap-3">
          <Database className="h-8 w-8 animate-pulse text-[#00c4cc]" />
          <p className="text-gray-400">Loading shared folder…</p>
        </div>
      </main>
    );
  }

  if (requiresLogin) {
    return (
      <main className="min-h-screen bg-[#08111f] text-gray-100 flex flex-col justify-center items-center px-5 py-12">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0d192b] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Login Required</h1>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            {error || 'This folder is shared securely with a specific user email.'}
          </p>

          <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left text-xs text-cyan-200">
            <p className="font-semibold flex items-center gap-1.5 mb-1">
              <Info className="h-4 w-4" /> Security Note:
            </p>
            You must be logged into SpatialHub with the email address this folder was shared with to open and download its TIFF files.
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/"
              className="w-full rounded-xl bg-[#0041e8] px-4 py-3 text-sm font-bold text-white hover:bg-[#0036c2] transition"
            >
              Sign In to Your Account
            </Link>
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-white transition flex items-center justify-center gap-1 mt-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back to SpatialHub Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error || !dataset) {
    return (
      <main className="min-h-screen bg-[#08111f] text-gray-100 flex flex-col justify-center items-center px-5 py-12">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0d192b] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            {error || 'Folder not found or you do not have permission to view it.'}
          </p>
          {storedUser && (
            <p className="mt-2 text-xs text-gray-400">
              Logged in as: <span className="text-white font-medium">{storedUser.email}</span>
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/hub"
              className="w-full rounded-xl bg-[#0041e8] px-4 py-3 text-sm font-bold text-white hover:bg-[#0036c2] transition"
            >
              Go to My Hub
            </Link>
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-white transition flex items-center justify-center gap-1 mt-2"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tiffFiles = (dataset.files || []).filter((f) => /\.tiff?$/i.test(f.relativePath));

  return (
    <main className="min-h-screen bg-[#08111f] text-gray-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0d192b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-lg font-black tracking-tight">
            Spatial<span className="text-[#00c4cc]">Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-xs hover:bg-white/10 transition"
              title="Copy share link"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied Link!' : 'Share Link'}
            </button>
            <Link
              to="/hub"
              className="flex items-center gap-2 rounded-xl bg-[#0041e8] px-3.5 py-2 text-xs font-bold hover:bg-[#0036c2] transition"
            >
              Go to Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Link
          to="/hub"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Hub
        </Link>

        {/* Dataset Hero Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0d192b] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-[#00c4cc]/15 px-3 py-1 text-xs font-bold text-[#00c4cc]">
                  {dataset.type || 'GeoTIFF'} Folder
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-300">
                  Shared Folder
                </span>
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">{dataset.name}</h1>
              {dataset.description && (
                <p className="mt-2 max-w-2xl text-sm text-gray-300 leading-relaxed">{dataset.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyLink}
                className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm hover:bg-white/10 transition"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>
          </div>

          {/* Sender Note Callout */}
          {dataset.shareNote && (
            <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-200">
              <p className="font-semibold text-xs tracking-wider uppercase text-blue-300 mb-1 flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Note from Sender:
              </p>
              <p className="text-gray-200">{dataset.shareNote}</p>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/10 pt-6">
            <div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><User className="h-3 w-3" /> Shared By</p>
              <p className="mt-1 text-sm font-medium text-white">{dataset.owner?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{dataset.owner?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><HardDrive className="h-3 w-3" /> Total Size</p>
              <p className="mt-1 text-sm font-semibold text-white">{formatSize(dataset.sizeBytes)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><FileText className="h-3 w-3" /> TIFF Files</p>
              <p className="mt-1 text-sm font-semibold text-white">{tiffFiles.length} file(s)</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> Updated</p>
              <p className="mt-1 text-sm font-medium text-white">
                {new Date(dataset.updatedAt || dataset.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* File Explorer Table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d192b]">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-[#00c4cc]" />
                TIFF Files in this Folder
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Download or inspect geospatial TIFF assets
              </p>
            </div>
            <span className="text-xs text-gray-400">{tiffFiles.length} file(s) available</span>
          </div>

          {tiffFiles.length > 0 ? (
            <div className="divide-y divide-white/5">
              {tiffFiles.map((file, idx) => (
                <div
                  key={`${file.relativePath}-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-white/[0.02] transition"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00c4cc]/10 text-[#00c4cc]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-200 truncate">{file.relativePath}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        TIFF · {formatSize(file.sizeBytes)} · Uploaded {new Date(file.uploadedAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDownload(file.relativePath)}
                      disabled={downloadingFile === file.relativePath}
                      className="flex items-center gap-2 rounded-xl bg-[#0041e8]/20 border border-[#0041e8]/40 px-3.5 py-2 text-xs font-semibold text-blue-300 hover:bg-[#0041e8] hover:text-white transition disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {downloadingFile === file.relativePath ? 'Downloading…' : 'Download TIFF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <FolderOpen className="mx-auto h-8 w-8 text-gray-500 mb-2" />
              <p className="text-sm font-semibold">No TIFF files uploaded yet</p>
              <p className="text-xs text-gray-500 mt-1">The folder owner has not uploaded any TIFF files yet.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
