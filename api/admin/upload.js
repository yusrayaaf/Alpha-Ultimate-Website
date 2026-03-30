/**
 * /api/admin/upload
 * POST — upload image to ImgBB, store record in NeonDB
 * GET  — list all uploads (public, with optional ?category= filter)
 * DELETE — remove record from DB
 * Supports: images (ImgBB) + video URL logging
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

export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — list all uploads from DB (optionally filtered by category)
  if (req.method === 'GET') {
    const sql = getDb();
    if (!sql) return res.status(200).json({ uploads: [] });
    try {
      await ensureTables();
      const { category } = req.query || {};
      let rows;
      if (category && category !== 'all') {
        rows = await sql`SELECT * FROM media_uploads WHERE category = ${category} ORDER BY uploaded_at DESC LIMIT 200`;
      } else {
        rows = await sql`SELECT * FROM media_uploads ORDER BY uploaded_at DESC LIMIT 200`;
      }
      return res.status(200).json({ uploads: rows });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // POST — upload image or log video URL
  if (req.method === 'POST') {
    if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized.' });

    const { image, name = 'upload', type = 'image', category = 'general', videoUrl } = req.body || {};

    // Special case: log a video URL without uploading
    if (type === 'video' && videoUrl) {
      const sql = getDb();
      if (sql) {
        try {
          await ensureTables();
          await sql`
            INSERT INTO media_uploads (name, url, display_url, thumb, type, category)
            VALUES (${name}, ${videoUrl}, ${videoUrl}, ${videoUrl}, 'video', ${category})
          `;
        } catch (e) { console.error('Video log error:', e.message); }
      }
      return res.status(200).json({ success: true, url: videoUrl, displayUrl: videoUrl, thumb: videoUrl, name });
    }

    const IMGBB_KEY = process.env.IMGBB_API_KEY;
    if (!IMGBB_KEY) {
      return res.status(400).json({
        success: false,
        error: 'IMGBB_API_KEY not set. Add it in Vercel → Settings → Environment Variables. Get a free key at api.imgbb.com',
      });
    }

    if (!image) return res.status(400).json({ error: 'No image data provided.' });

    try {
      const base64 = image.replace(/^data:[^;]+;base64,/, '');
      const form = new URLSearchParams();
      form.append('key', IMGBB_KEY);
      form.append('image', base64);
      form.append('name', name);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error?.message || `ImgBB error: ${response.status}`);
      }

      const url        = data.data.url;
      const displayUrl = data.data.display_url;
      const thumb      = data.data.thumb?.url || displayUrl;

      // Save to NeonDB with category
      const sql = getDb();
      if (sql) {
        try {
          await ensureTables();
          await sql`
            INSERT INTO media_uploads (name, url, display_url, thumb, type, category)
            VALUES (${name}, ${url}, ${displayUrl}, ${thumb}, ${type}, ${category})
          `;
        } catch (e) { console.error('DB save error:', e.message); }
      }

      return res.status(200).json({ success: true, url, displayUrl, thumb, name });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Upload failed.' });
    }
  }

  // DELETE — remove from DB
  if (req.method === 'DELETE') {
    if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized.' });
    const { id } = req.body || {};
    const sql = getDb();
    if (sql && id) {
      try {
        await sql`DELETE FROM media_uploads WHERE id = ${id}`;
      } catch (e) { console.error(e.message); }
    }
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
