/**
 * routes/auth.js
 * Public auth routes used by the WEBSITE frontend.
 * POST /api/auth/register   – create account & start trial
 * POST /api/auth/login      – login, returns JWT
 * GET  /api/auth/me         – get current user (protected)
 */
import { Router } from 'express';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = Router();

// ── Register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, plan = 'community' } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const trialExpires = new Date(Date.now() + 14 * 86400000); // 14-day trial
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password, plan, trialExpires });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Get Current User ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
