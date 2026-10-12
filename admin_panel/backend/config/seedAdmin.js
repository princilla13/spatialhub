import User from '../models/User.js';

/**
 * Creates the first admin account from the local environment file.
 * It never overwrites an existing account.
 */
export async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('Admin account was not seeded: ADMIN_EMAIL or ADMIN_PASSWORD is missing.');
    return;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return;

  await User.create({
    name: 'SpatialHub Administrator',
    email,
    password,
    role: 'admin',
    plan: 'enterprise',
    trialExpires: null,
  });
  console.log(`Admin account created for ${email}`);
}
