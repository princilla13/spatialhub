import mongoose from 'mongoose';

const datasetFileSchema = new mongoose.Schema(
  {
    relativePath: { type: String, required: true },
    storageKey: { type: String, required: true },
    sizeBytes: { type: Number, required: true, min: 0 },
    contentType: { type: String, default: 'application/octet-stream' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const sharedUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: { type: String, default: '', trim: true },
    sharedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const datasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['LAZ', 'LAS', 'Potree 3D', 'glTF 3D', 'GeoTIFF', 'Orthophoto', 'Other'], default: 'Other' },
    sizeBytes: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    description: { type: String, default: '' },
    tags: [{ type: String }],
    thumbnailUrl: { type: String, default: null },
    downloadUrl: { type: String, default: null },
    pointCount: { type: Number, default: 0 },
    files: { type: [datasetFileSchema], default: [] },
    sharedWith: { type: [sharedUserSchema], default: [] },
  },
  { timestamps: true }
);

const Dataset = mongoose.model('Dataset', datasetSchema);
export default Dataset;
