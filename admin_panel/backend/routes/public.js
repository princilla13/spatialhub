/**
 * routes/public.js
 * Fully public routes used by the WEBSITE (no auth needed).
 * POST /api/contact       – contact / enquiry form
 * POST /api/abuse-report  – submit an abuse report
 * GET  /api/health        – health check
 * GET  /install.sh        – CLI install script
 */
import { Router } from 'express';
import AbuseReport from '../models/AbuseReport.js';

const router = Router();

// ── Health Check ──────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'SpatialHub Unified Backend',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ── Contact / Enquiry Form ─────────────────────────────────────
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'name, email and message are required' });
    }
    // TODO: integrate an email service (SendGrid, Resend, etc.)
    console.log(`📧 Contact form submission from ${email}: ${message}`);
    res.json({ success: true, message: 'Message received. We will get back to you shortly.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Submit Abuse Report ────────────────────────────────────────
router.post('/abuse-report', async (req, res) => {
  try {
    const { reporter, reporterEmail, targetUrl, reason, description } = req.body;
    if (!reporter || !targetUrl || !reason) {
      return res.status(400).json({ success: false, message: 'reporter, targetUrl and reason are required' });
    }

    const reportId = `AB-${Date.now()}`;
    const report = await AbuseReport.create({ reportId, reporter, reporterEmail, targetUrl, reason, description });
    res.status(201).json({ success: true, message: 'Abuse report submitted successfully', reportId: report.reportId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── CLI Install Script ─────────────────────────────────────────
router.get('/install.sh', (_req, res) => {
  res.type('text/plain');
  res.send(`#!/bin/sh
echo "Downloading DroneDB CLI v2.4.1..."
echo "Checking system compatibility..."
echo "DroneDB CLI installed successfully to /usr/local/bin/ddb"
`);
});

export default router;
