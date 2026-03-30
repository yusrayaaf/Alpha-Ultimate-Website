/**
 * db.js — Shared NeonDB helper for all admin APIs
 * Uses: DATABASE_URL (NeonDB connection string)
 * Falls back to JSONBin or in-memory if not configured.
 */
import { neon } from '@neondatabase/serverless';

let _sql = null;

export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

/** Run once at startup — creates tables if missing */
export async function ensureTables() {
  const sql = getDb();
  if (!sql) return false;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        key   TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id          TEXT PRIMARY KEY,
        name        TEXT,
        phone       TEXT,
        email       TEXT,
        service     TEXT,
        date        TEXT,
        time        TEXT,
        address     TEXT,
        rooms       TEXT,
        notes       TEXT,
        language    TEXT DEFAULT 'en',
        status      TEXT DEFAULT 'pending',
        amount      TEXT DEFAULT '',
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS media_uploads (
        id          SERIAL PRIMARY KEY,
        name        TEXT,
        url         TEXT,
        display_url TEXT,
        thumb       TEXT,
        type        TEXT DEFAULT 'image',
        category    TEXT DEFAULT 'general',
        uploaded_at TIMESTAMPTZ DEFAULT NOW()
      )`;
    // Migrate: add category column if upgrading from old schema
    await sql`ALTER TABLE media_uploads ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general'`;
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )`;
    return true;
  } catch (e) {
    console.error('ensureTables error:', e.message);
    return false;
  }
}
