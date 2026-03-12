/**
 * /api/admin/login — FREE auth using Node built-in crypto (no paid packages)
 * Creates a signed session token using HMAC-SHA256
 * No jsonwebtoken, no external services
 */
import { createHmac, timingSafeEqual } from 'crypto';

function createToken(username, secret) {
  const payload = Buffer.from(JSON.stringify({
    u: username, r: 'admin',
    exp: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
    iat: Date.now(),
  })).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(tokenStr, secret) {
  try {
    const [payload, sig] = tokenStr.split('.');
    if (!payload || !sig) return null;
    const expected = createHmac('sha256', secret).update(payload).digest('base64url');
    // Timing-safe comparison
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() > data.exp) return null;
    return data;
  } catch { return null; }
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { username, password } = req.body || {};
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const SECRET = process.env.JWT_SECRET || 'alpha_ultimate_default_secret_change_in_production';

  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    return res.status(500).json({ message: 'Admin credentials not set. Add ADMIN_USER and ADMIN_PASSWORD in Vercel environment variables.' });
  }
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const userMatch = timingSafeEqual(Buffer.from(username), Buffer.from(ADMIN_USER));
  const passMatch = timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASSWORD));

  if (userMatch && passMatch) {
    const token = createToken(username, SECRET);
    return res.status(200).json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials.' });
}
