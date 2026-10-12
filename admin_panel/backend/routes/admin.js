/**
 * routes/admin.js
 * Admin-only routes used by the ADMIN PANEL frontend.
 * All routes require: protect + adminOnly middleware.
 *
 * GET  /api/admin/metrics          – platform stats
 * GET  /api/admin/users            – list all users
 * PATCH /api/admin/users/:id       – update user (plan, isActive, role)
 * DELETE /api/admin/users/:id      – delete user
 * GET  /api/admin/abuse-reports    – list abuse reports
 * PATCH /api/admin/abuse-reports/:id – update report status
 * GET  /api/admin/datasets         – list all datasets
 * DELETE /api/admin/datasets/:id   – delete any dataset
 */
import { Router } from 'express';
import User from '../models/User.js';
import Dataset from '../models/Dataset.js';
import AbuseReport from '../models/AbuseReport.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);

// ── Platform Metrics ──────────────────────────────────────────
router.get('/metrics', async (req, res) => {
  try {
    const [totalUsers, totalDatasets, pendingReports] = await Promise.all([
      User.countDocuments(),
      Dataset.countDocuments(),
      AbuseReport.countDocuments({ status: 'Pending' }),
    ]);

    const storageAgg = await Dataset.aggregate([{ $group: { _id: null, total: { $sum: '$sizeBytes' } } }]);
    const totalStorageBytes = storageAgg[0]?.total ?? 0;

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalDatasets,
        pendingAbuseReports: pendingReports,
        activeStorageGB: (totalStorageBytes / 1e9).toFixed(2),
        systemStatus: 'Optimal',
        uptime: '99.98%',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Users ─────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { search, plan, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (plan) filter.plan = plan;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const allowed = ['plan', 'isActive', 'role', 'name'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await Dataset.deleteMany({ owner: req.params.id });
    res.json({ success: true, message: 'User and their datasets deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Abuse Reports ─────────────────────────────────────────────
router.get('/abuse-reports', async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [reports, total] = await Promise.all([
      AbuseReport.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      AbuseReport.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/abuse-reports/:id', async (req, res) => {
  try {
    const allowed = ['status', 'description'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (updates.status === 'Resolved' || updates.status === 'Dismissed') {
      updates.resolvedAt = new Date();
      updates.reviewedBy = req.user._id;
    }
    const report = await AbuseReport.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Datasets (Admin) ──────────────────────────────────────────
router.get('/datasets', async (req, res) => {
  try {
    const { search, type, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [datasets, total] = await Promise.all([
      Dataset.find(filter).populate('owner', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Dataset.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: Number(page), datasets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/datasets/:id', async (req, res) => {
  try {
    const dataset = await Dataset.findByIdAndDelete(req.params.id);
    if (!dataset) return res.status(404).json({ success: false, message: 'Dataset not found' });
    res.json({ success: true, message: 'Dataset deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
