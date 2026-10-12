import path from 'node:path';
import { fileURLToPath } from 'node:url';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const backendDirectory = path.resolve(configDirectory, '..');
const configuredDirectory = process.env.UPLOAD_STORAGE_DIR?.trim();
export const uploadRoot = configuredDirectory
  ? path.resolve(path.isAbsolute(configuredDirectory) ? configuredDirectory : path.join(backendDirectory, configuredDirectory))
  : path.join(backendDirectory, 'uploads');

export function maxUploadFileBytes() {
  const configured = Number(process.env.MAX_UPLOAD_FILE_BYTES);
  return Number.isFinite(configured) && configured > 0 ? configured : 5 * 1024 * 1024 * 1024;
}

export function getStoredFilePath(ownerId, datasetId, relativePath) {
  const resolved = path.resolve(uploadRoot, String(ownerId), String(datasetId), ...relativePath.split('/'));
  const insideRoot = path.relative(uploadRoot, resolved);
  if (!insideRoot || insideRoot.startsWith('..') || path.isAbsolute(insideRoot)) {
    throw new Error('Invalid file path');
  }
  return resolved;
}
