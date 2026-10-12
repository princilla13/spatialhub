/**
 * SpatialHub – Unified Backend Server
 * ─────────────────────────────────────
 * Single backend serving:
 *   • Website frontend   (http://localhost:5173)
 *   • Admin panel frontend (http://localhost:5174)
 *
 * API structure:
 *   POST /api/auth/register     – register new user
 *   POST /api/auth/login        – login
 *   GET  /api/auth/me           – current user (JWT required)
 *   GET  /api/datasets          – list public datasets
 *   POST /api/datasets          – create dataset (JWT required)
 *   GET  /api/datasets/:id      – single dataset
 *   POST /api/contact           – contact form (public)
 *   POST /api/abuse-report      – submit abuse report (public)
 *   GET  /api/health            – health check
 *   GET  /install.sh            – CLI install script
 *   GET  /api/admin/metrics     – admin stats (admin JWT required)
 *   GET  /api/admin/users       – all users (admin JWT required)
 *   PATCH /api/admin/users/:id  – update user (admin JWT required)
 *   DELETE /api/admin/users/:id – delete user (admin JWT required)
 *   GET  /api/admin/abuse-reports – list reports (admin JWT required)
 *   PATCH /api/admin/abuse-reports/:id – update report (admin JWT required)
 *   GET  /api/admin/datasets    – all datasets (admin JWT required)
 *   DELETE /api/admin/datasets/:id – delete dataset (admin JWT required)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';
import { ensureAdminUser } from './config/seedAdmin.js';
import authRoutes from './routes/auth.js';
import datasetRoutes from './routes/datasets.js';
import adminRoutes from './routes/admin.js';
import publicRoutes from './routes/public.js';

// ── Connect to MongoDB ────────────────────────────────────────
await connectDB();
await ensureAdminUser();

// ── Express App ────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ───────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin "${origin}" is not allowed`));
    },
    credentials: true,
  })
);

// ── Body Parser ────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);            // Website auth
app.use('/api/datasets', datasetRoutes);     // Website datasets
app.use('/api/admin', adminRoutes);          // Admin panel (protected)
app.use('/api', publicRoutes);               // Public: /api/health, /api/contact, /api/abuse-report
app.use('/', publicRoutes);                  // /install.sh

// ── 404 Handler ────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('🔥 Unhandled error:', err.message);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 SpatialHub Backend running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
});
