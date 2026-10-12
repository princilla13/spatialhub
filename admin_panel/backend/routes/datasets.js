/**
 * routes/datasets.js
 * Public + protected dataset routes used by the WEBSITE frontend.
 * GET  /api/datasets          – list public datasets
 * GET  /api/datasets/:id      – get single dataset
 * POST /api/datasets          – create dataset (protected)
 * PUT  /api/datasets/:id/files/upload – upload a file into an owned dataset
 */
import { Router } from 'express';
import { createWriteStream } from 'node:fs';
import { mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { randomUUID } from 'node:crypto';
import Dataset from '../models/Dataset.js';
import { protect } from '../middleware/auth.js';
import { getStoredFilePath, maxUploadFileBytes } from '../config/fileStorage.js';

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
    if (!relativePath) return res.status(400).json({ success: false, message: 'A valid folder path is required' });
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

    const contentType = (req.get('x-file-content-type') || 'application/octet-stream').slice(0, 200);
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

// ── Get Single Dataset ────────────────────────────────────────
// List datasets that belong to the signed-in user.
router.get('/mine', protect, async (req, res) => {
  try {
    const datasets = await Dataset.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, total: datasets.length, datasets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id).populate('owner', 'name email');
    if (!dataset || (!dataset.isPublic)) {
      return res.status(404).json({ success: false, message: 'Dataset not found' });
    }
    res.json({ success: true, dataset: publicDataset(dataset) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Create Dataset ────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, sizeBytes, isPublic, description, tags, thumbnailUrl, downloadUrl, pointCount } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Dataset name is required' });

    const dataset = await Dataset.create({
      name, type, sizeBytes, isPublic, description, tags, thumbnailUrl, downloadUrl, pointCount,
      owner: req.user._id,
    });

    res.status(201).json({ success: true, dataset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
