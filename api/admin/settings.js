/**
 * /api/admin/settings
 * GET  — load site settings from NeonDB
 * POST — save site settings to NeonDB
 */
import { createHmac } from 'crypto';
import { getDb, ensureTables } from './db.js';

const SECRET = process.env.JWT_SECRET || 'alpha_ultimate_default_secret_change_in_production';

function verifyToken(req) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    const token = auth.split(' ')[1];
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const expected = createHmac('sha256', SECRET).update(payload).digest('base64url');
    if (sig !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() > data.exp) return null;
    return data;
  } catch { return null; }
}

const DEFAULTS = {
  businessName: 'Alpha Ultimate Premium Cleaning Services',
  phone1: '+966 57 8695494',
  phone2: '+966 56 3906822',
  email: 'info@alpha-01.com',
  whatsapp: '+966 56 3906822',
  address: 'Riyadh, Saudi Arabia',
  metaTitle: 'Alpha Ultimate — Premium Cleaning Riyadh',
  metaDesc: "Riyadh's #1 premium cleaning service. Deep clean, move-in/out, post-construction. Book online 24/7.",
  currency: 'SAR',
  language: 'en',
  timezone: 'Asia/Riyadh',
  bookingNotif: 'true',
  reviewReminder: 'true',
  whatsappNotif: 'true',
  emailNotif: 'false',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized.' });

  const sql = getDb();

  if (req.method === 'GET') {
    if (!sql) return res.status(200).json(DEFAULTS);
    try {
      await ensureTables();
      const rows = await sql`SELECT key, value FROM site_settings`;
      const settings = { ...DEFAULTS };
      for (const r of rows) settings[r.key] = r.value;
      return res.status(200).json(settings);
    } catch {
      return res.status(200).json(DEFAULTS);
    }
  }

  if (req.method === 'POST') {
    if (!sql) return res.status(503).json({ error: 'DATABASE_URL not configured. Add NeonDB connection string to Vercel env vars.' });
    try {
      await ensureTables();
      const entries = Object.entries(req.body || {});
      for (const [key, val] of entries) {
        const value = String(val);
        await sql`
          INSERT INTO site_settings (key, value, updated_at)
          VALUES (${key}, ${value}, NOW())
          ON CONFLICT (key) DO UPDATE
            SET value = EXCLUDED.value, updated_at = NOW()
        `;
      }
      return res.status(200).json({ success: true, message: 'Settings saved to NeonDB ✅' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
