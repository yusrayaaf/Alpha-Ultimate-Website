/**
 * /api/admin/bookings
 * GET    — list all bookings from NeonDB (admin auth)
 * PATCH  — update booking status (admin auth)
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized.' });

  const sql = getDb();

  if (req.method === 'GET') {
    if (!sql) {
      return res.status(200).json({ bookings: [], note: 'DATABASE_URL not configured — add NeonDB connection string to Vercel env vars.' });
    }
    try {
      await ensureTables();
      const bookings = await sql`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 200`;
      return res.status(200).json({ bookings });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'PATCH') {
    if (!sql) return res.status(503).json({ error: 'Database not configured.' });
    const { id, status } = req.body || {};
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!id || !allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid id or status.' });
    }
    try {
      await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
      return res.status(200).json({ success: true, id, status });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
