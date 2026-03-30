/**
 * /api/admin/content
 * GET  — public, returns site content (NeonDB → JSONBin → static file)
 * POST — admin auth required, saves content to NeonDB
 */
import { readFileSync } from 'fs';
import { join } from 'path';
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

function staticContent() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'public', 'content.json'), 'utf-8'));
  } catch {
    try {
      return JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', 'content.json'), 'utf-8'));
    } catch { return {}; }
  }
}

async function dbGet() {
  const sql = getDb();
  if (!sql) return null;
  try {
    await ensureTables();
    const rows = await sql`SELECT key, value FROM site_content`;
    if (!rows.length) return null;
    const out = {};
    for (const r of rows) out[r.key] = r.value;
    return out;
  } catch { return null; }
}

async function dbSet(data) {
  const sql = getDb();
  if (!sql) return false;
  try {
    await ensureTables();
    for (const [key, value] of Object.entries(data)) {
      await sql`
        INSERT INTO site_content (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}, NOW())
        ON CONFLICT (key) DO UPDATE
          SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }
    return true;
  } catch (e) {
    console.error('dbSet error:', e.message);
    return false;
  }
}

// JSONBin fallback
async function jsonbinGet() {
  const { JSONBIN_BIN_ID: id, JSONBIN_API_KEY: key } = process.env;
  if (!id || !key) return null;
  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`, {
      headers: { 'X-Master-Key': key },
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.record || null;
  } catch { return null; }
}

async function jsonbinSet(data) {
  const { JSONBIN_BIN_ID: id, JSONBIN_API_KEY: key } = process.env;
  if (!id || !key) return false;
  try {
    const r = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': key },
      body: JSON.stringify(data),
    });
    return r.ok;
  } catch { return false; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const live = await dbGet() || await jsonbinGet();
    return res.status(200).json(live || staticContent());
  }

  if (req.method === 'POST') {
    if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized.' });
    const body = req.body || {};

    // Try NeonDB first, then JSONBin
    const savedDb  = await dbSet(body);
    const savedBin = !savedDb ? await jsonbinSet(body) : false;

    if (savedDb || savedBin) {
      return res.status(200).json({
        success: true,
        message: `Content saved to ${savedDb ? 'NeonDB ✅' : 'JSONBin ✅'}`,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'No storage configured. Add DATABASE_URL (NeonDB) to your Vercel environment variables.',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
