/**
 * /api/admin/assets
 * Stores URLs for special site assets: logo, hero-video, yusra-icon, favicon
 * GET  — public, returns asset URLs
 * POST — admin auth, saves asset URLs (uploaded via /api/admin/upload first)
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

const ASSET_KEYS = ['logo', 'hero_video', 'yusra_icon', 'favicon'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = getDb();

  if (req.method === 'GET') {
    const defaults = {
      logo:       '/assets/alpha-logo.png',
      hero_video: '/assets/hero-video.mp4',
      yusra_icon: null,
      favicon:    '/favicon.ico',
    };
    if (!sql) return res.status(200).json(defaults);
    try {
      await ensureTables();
      const rows = await sql`SELECT key, value FROM site_settings WHERE key = ANY(${ASSET_KEYS})`;
      const assets = { ...defaults };
      for (const r of rows) assets[r.key] = r.value;
      return res.status(200).json(assets);
    } catch {
      return res.status(200).json(defaults);
    }
  }

  if (req.method === 'POST') {
    if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized.' });
    if (!sql) return res.status(503).json({ error: 'DATABASE_URL not configured.' });
    try {
      await ensureTables();
      const body = req.body || {};
      for (const key of ASSET_KEYS) {
        if (body[key] !== undefined) {
          await sql`
            INSERT INTO site_settings (key, value, updated_at)
            VALUES (${key}, ${body[key]}, NOW())
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
          `;
        }
      }
      return res.status(200).json({ success: true, message: 'Assets saved ✅' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
