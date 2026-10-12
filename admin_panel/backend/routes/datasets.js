/**
 * routes/datasets.js
 * Public + protected dataset routes used by the WEBSITE frontend.
 * - GET  /api/datasets               – list public datasets
 * - GET  /api/datasets/mine          – list datasets owned by current user
 * - GET  /api/datasets/shared-with-me – list datasets shared with current user's email
 * - GET  /api/datasets/:id           – get single dataset (checks owner / shared email / public)
 * - POST /api/datasets               – create dataset (protected)
 * - PATCH /api/datasets/:id          – update dataset (owner only)
 * - DELETE /api/datasets/:id         – delete dataset and files (owner only)
 * - PUT  /api/datasets/:id/files/upload – upload TIFF file/folder (owner only)
 * - GET  /api/datasets/:id/files/download – download TIFF file (owner / shared recipient / public)
 * - POST /api/datasets/:id/share     – share folder with email and note (owner only)
 * - DELETE /api/datasets/:id/share/:email – revoke share access (owner only)
 */
import { Router } from 'express';
import { createWriteStream } from 'node:fs';
import { mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { randomUUID } from 'node:crypto';
import Dataset from '../models/Dataset.js';
import User from '../models/User.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { getStoredFilePath, maxUploadFileBytes, uploadRoot } from '../config/fileStorage.js';

const router = Router();

function validateRelativePath(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 1024) return null;
  const normalized = value.trim().replace(/\\/g, '/');
  if (normalized.startsWith('/') || normalized.includes('\0')) return null;
  const segments = normalized.split('/').filter((segment) => segment && segment !== '.');
  if (!segments.length || segments.some((segment) => segment === '..')) return null;
  return segments.join('/');
}

async function findOwnedDataset(datasetId, ownerId) {
  return Dataset.findOne({ _id: datasetId, owner: ownerId });
}

function publicDataset(dataset) {
  const result = dataset.toObject();
  result.files = (result.files || []).map(({ relativePath, sizeBytes, contentType, uploadedAt }) => ({
    relativePath, sizeBytes, contentType, uploadedAt,
  }));
  return result;
}

// ── Upload TIFF File / Folder ─────────────────────────────────
// Stream one file to the backend while preserving its relative folder path.
router.put('/:id/files/upload', protect, async (req, res) => {
  let destination;
  let temporaryFile;
  let bytesWritten = 0;
  try {
    const dataset = await findOwnedDataset(req.params.id, req.user._id);
    if (!dataset) return res.status(404).json({ success: false, message: 'Dataset not found' });

    let relativePath;
    try {
      relativePath = validateRelativePath(decodeURIComponent(req.get('x-relative-path') || ''));
    } catch {
      relativePath = null;
    }
    if (!relativePath) return res.status(400).json({ success: false, message: 'A valid file/folder path is required' });
    if (!['.tif', '.tiff'].includes(path.posix.extname(relativePath).toLowerCase())) {
      return res.status(415).json({ success: false, message: 'Only TIFF files (.tif or .tiff) can be uploaded' });
    }
    const declaredSize = Number(req.get('content-length'));
    if (Number.isFinite(declaredSize) && declaredSize > maxUploadFileBytes()) {
      return res.status(413).json({ success: false, message: 'File is too large for the configured upload limit' });
    }

    destination = getStoredFilePath(req.user._id, dataset._id, relativePath);
    await mkdir(path.dirname(destination), { recursive: true });
    temporaryFile = `${destination}.upload-${randomUUID()}`;
    const limiter = new Transform({
      transform(chunk, _encoding, callback) {
        bytesWritten += chunk.length;
        if (bytesWritten > maxUploadFileBytes()) {
          const error = new Error('File is too large for the configured upload limit');
          error.code = 'FILE_TOO_LARGE';
          callback(error);
          return;
        }
        callback(null, chunk);
      },
    });
    await pipeline(req, limiter, createWriteStream(temporaryFile, { flags: 'wx' }));
    await rename(temporaryFile, destination);
    temporaryFile = null;

    const contentType = (req.get('x-file-content-type') || 'image/tiff').slice(0, 200);
    const existingIndex = dataset.files.findIndex((file) => file.relativePath === relativePath);
    const oldSize = existingIndex >= 0 ? dataset.files[existingIndex].sizeBytes : 0;
    const fileRecord = { relativePath, storageKey: relativePath, sizeBytes: bytesWritten, contentType, uploadedAt: new Date() };
    if (existingIndex >= 0) dataset.files.set(existingIndex, fileRecord);
    else dataset.files.push(fileRecord);
    dataset.sizeBytes = Math.max(0, dataset.sizeBytes - oldSize + bytesWritten);
    await dataset.save();

    res.status(201).json({ success: true, file: { relativePath, sizeBytes: bytesWritten, contentType } });
  } catch (err) {
    if (temporaryFile) await rm(temporaryFile, { force: true }).catch(() => {});
    const status = err.code === 'FILE_TOO_LARGE' ? 413 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
});

// ── Download TIFF File ────────────────────────────────────────
// Streams/downloads a file. Allowed if dataset is public, requester is owner, or shared with user.
router.get('/:id/files/download', optionalAuth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset) return res.status(404).json({ success: false, message: 'Dataset not found' });

    const isOwner = req.user && String(dataset.owner) === String(req.user._id);
    const isShared = req.user && dataset.sharedWith?.some((s) => s.email.toLowerCase() === req.user.email.toLowerCase());
    const isPublic = dataset.isPublic;

    if (!isPublic && !isOwner && !isShared) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          requiresLogin: true,
          message: 'You must be logged in to access and download files from this shared folder.',
        });
      }
      return res.status(403).json({
        success: false,
        message: 'Access denied. This folder is not shared with your logged-in email.',
      });
    }

    const rawPath = req.query.path;
    const relativePath = validateRelativePath(decodeURIComponent(rawPath || ''));
    if (!relativePath) {
      return res.status(400).json({ success: false, message: 'A valid file path is required' });
    }

    const fileRecord = dataset.files.find((f) => f.relativePath === relativePath);
    if (!fileRecord) {
      return res.status(404).json({ success: false, message: 'File not found in this dataset' });
    }

    const filePath = getStoredFilePath(dataset.owner, dataset._id, relativePath);
    const fileName = path.basename(relativePath);

    res.download(filePath, fileName, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ success: false, message: 'File could not be found in storage' });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── List Public Datasets ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { type, search, limit = 20, page = 1 } = req.query;
    const filter = { isPublic: true };
    if (type) filter.type = type;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const [datasets, total] = await Promise.all([
      Dataset.find(filter).populate('owner', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Dataset.countDocuments(filter),
    ]);

    res.json({ success: true, total, page: Number(page), datasets: datasets.map(publicDataset) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── List Datasets Owned by Signed-In User ─────────────────────
router.get('/mine', protect, async (req, res) => {
  try {
    const datasets = await Dataset.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, total: datasets.length, datasets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── List Datasets Shared With Signed-In User ──────────────────
router.get('/shared-with-me', protect, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();
    const datasets = await Dataset.find({ 'sharedWith.email': userEmail })
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 });

    // Format results with the user's specific note
    const formatted = datasets.map((d) => {
      const obj = d.toObject();
      const shareEntry = (d.sharedWith || []).find((s) => s.email.toLowerCase() === userEmail);
      obj.shareNote = shareEntry?.note || '';
      obj.sharedAt = shareEntry?.sharedAt;
      return obj;
    });

    res.json({ success: true, total: formatted.length, datasets: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Get Single Dataset (Owner, Shared Recipient, or Public) ───
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id).populate('owner', 'name email');
    if (!dataset) {
      return res.status(404).json({ success: false, message: 'Dataset not found' });
    }

    const isOwner = req.user && String(dataset.owner._id) === String(req.user._id);
    const isShared = req.user && dataset.sharedWith?.some((s) => s.email.toLowerCase() === req.user.email.toLowerCase());
    const isPublic = dataset.isPublic;

    if (!isPublic && !isOwner && !isShared) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          requiresLogin: true,
          message: 'This folder is private. You must be logged in with the email address this folder was shared with to open it.',
        });
      }
      return res.status(403).json({
        success: false,
        message: `Access denied. You are logged in as ${req.user.email}, but this folder has not been shared with this email.`,
      });
    }

    const data = dataset.toObject();
    if (isShared && !isOwner) {
      const shareInfo = dataset.sharedWith.find((s) => s.email.toLowerCase() === req.user.email.toLowerCase());
      data.shareNote = shareInfo?.note || '';
      data.sharedAt = shareInfo?.sharedAt;
    }

    res.json({ success: true, dataset: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Create Dataset ────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { name, type = 'GeoTIFF', sizeBytes = 0, isPublic = false, description = '' } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, message: 'Dataset name is required' });

    const dataset = await Dataset.create({
      name: name.trim(),
      type,
      sizeBytes,
      isPublic: Boolean(isPublic),
      description: description.trim(),
      owner: req.user._id,
      files: [],
      sharedWith: [],
    });

    res.status(201).json({ success: true, dataset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Update Dataset (Owner Only) ───────────────────────────────
router.patch('/:id', protect, async (req, res) => {
  try {
    const dataset = await findOwnedDataset(req.params.id, req.user._id);
    if (!dataset) return res.status(404).json({ success: false, message: 'Dataset not found' });

    const { name, description, type, isPublic } = req.body;
    if (name !== undefined) dataset.name = name.trim();
    if (description !== undefined) dataset.description = description.trim();
    if (type !== undefined) dataset.type = type;
    if (isPublic !== undefined) dataset.isPublic = Boolean(isPublic);

    await dataset.save();
    res.json({ success: true, dataset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Delete Dataset & Stored Files (Owner Only) ─────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const dataset = await findOwnedDataset(req.params.id, req.user._id);
    if (!dataset) return res.status(404).json({ success: false, message: 'Dataset not found' });

    // Clean up files on disk
    try {
      const datasetFolder = path.resolve(uploadRoot, String(req.user._id), String(dataset._id));
      await rm(datasetFolder, { recursive: true, force: true });
    } catch {
      // Ignore disk cleanup error if directory does not exist
    }

    await Dataset.findByIdAndDelete(dataset._id);
    res.json({ success: true, message: 'Dataset and all uploaded files deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Share Dataset / Folder With Email (Owner Only) ────────────
router.post('/:id/share', protect, async (req, res) => {
  try {
    const dataset = await findOwnedDataset(req.params.id, req.user._id);
    if (!dataset) return res.status(404).json({ success: false, message: 'Dataset not found' });

    const { email, note = '' } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email address is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === req.user.email.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'You cannot share a folder with yourself' });
    }

    const recipientUser = await User.findOne({ email: normalizedEmail }).select('_id email name');

    const existingIndex = dataset.sharedWith.findIndex((s) => s.email.toLowerCase() === normalizedEmail);
    const shareEntry = {
      email: normalizedEmail,
      user: recipientUser ? recipientUser._id : null,
      note: String(note).trim(),
      sharedAt: new Date(),
    };

    if (existingIndex >= 0) {
      dataset.sharedWith[existingIndex] = shareEntry;
    } else {
      dataset.sharedWith.push(shareEntry);
    }

    await dataset.save();

    res.json({
      success: true,
      message: `Folder successfully shared with ${normalizedEmail}`,
      sharedWith: dataset.sharedWith,
      noteReminder: 'The recipient must be logged into their SpatialHub account with this email to access this folder.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Revoke Share Access (Owner Only) ──────────────────────────
router.delete('/:id/share/:email', protect, async (req, res) => {
  try {
    const dataset = await findOwnedDataset(req.params.id, req.user._id);
    if (!dataset) return res.status(404).json({ success: false, message: 'Dataset not found' });

    const targetEmail = decodeURIComponent(req.params.email).trim().toLowerCase();
    dataset.sharedWith = dataset.sharedWith.filter((s) => s.email.toLowerCase() !== targetEmail);

    await dataset.save();
    res.json({ success: true, message: `Access revoked for ${targetEmail}`, sharedWith: dataset.sharedWith });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
