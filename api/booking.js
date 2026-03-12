/**
 * /api/booking — Save booking to NeonDB + notify via email + Telegram
 */
import nodemailer from 'nodemailer';
import { getDb, ensureTables } from './admin/db.js';

function genId() {
  return 'ALF-' + Date.now().toString(36).toUpperCase().slice(-6);
}

async function sendTelegram(botToken, chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  return res.ok;
}

function getMailer() {
  const pass = process.env.SMTP_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ionos.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465,
    auth: { user: process.env.SMTP_USER || 'reply@alpha-01.com', pass },
    tls: { rejectUnauthorized: true },
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone, email, service, date, time, address, rooms, notes, language } = req.body || {};
  if (!name || !phone || !service || !date)
    return res.status(400).json({ error: 'Name, phone, service, and date are required.' });

  const bookingId = genId();
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Riyadh' });

  // ── Save to NeonDB ────────────────────────────────────────────────
  const sql = getDb();
  if (sql) {
    try {
      await ensureTables();
      await sql`
        INSERT INTO bookings (id, name, phone, email, service, date, time, address, rooms, notes, language, status)
        VALUES (${bookingId}, ${name}, ${phone}, ${email||''}, ${service}, ${date}, ${time||''}, ${address||''}, ${rooms||''}, ${notes||''}, ${language||'en'}, 'pending')
      `;
    } catch (e) { console.error('Booking DB save error:', e.message); }
  }

  // ── Telegram ──────────────────────────────────────────────────────
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
  let notified = false;
  if (BOT_TOKEN && CHAT_ID) {
    const msg = `🧹 <b>NEW BOOKING — Alpha Ultimate</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>ID:</b> ${bookingId}
👤 <b>Name:</b> ${name}
📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
${email ? `📧 <b>Email:</b> ${email}\n` : ''}🧽 <b>Service:</b> ${service}
📅 <b>Date:</b> ${date}${time ? ` at ${time}` : ''}
${address ? `📍 <b>Address:</b> ${address}\n` : ''}${rooms ? `🏠 <b>Rooms:</b> ${rooms}\n` : ''}${notes ? `📝 <b>Notes:</b> ${notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
⏰ ${timestamp}`;
    notified = await sendTelegram(BOT_TOKEN, CHAT_ID, msg).catch(() => false);
  }

  // ── Email ─────────────────────────────────────────────────────────
  const FROM   = process.env.EMAIL_FROM || 'reply@alpha-01.com';
  const INFO   = process.env.EMAIL_INFO || 'info@alpha-01.com';
  const mailer = getMailer();
  if (mailer) {
    const wrap = (b) => `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#04050f;color:#e2e8f0;padding:32px;border-radius:12px;border:1px solid #14f19530">${b}<p style="margin-top:24px;font-size:12px;color:#475569">Alpha Ultimate · <a href="https://alpha-01.com" style="color:#14f195">alpha-01.com</a></p></div>`;
    const row = (l, v) => v ? `<tr><td style="padding:6px 0;color:#94a3b8;width:130px">${l}</td><td style="color:#fff">${v}</td></tr>` : '';

    await mailer.sendMail({
      from: `"Alpha Ultimate Booking" <${FROM}>`,
      to: INFO,
      subject: `📋 New Booking ${bookingId} — ${name} | ${service}`,
      html: wrap(`<h2 style="color:#14f195;margin-top:0">🧹 New Booking</h2>
        <table style="width:100%;border-collapse:collapse">
          ${row('Booking ID', `<strong style="color:#14f195">${bookingId}</strong>`)}
          ${row('Name', name)}${row('Phone', phone)}${row('Email', email)}
          ${row('Service', service)}${row('Date', date + (time ? ` at ${time}` : ''))}
          ${row('Address', address)}${row('Rooms', rooms)}${row('Notes', notes)}
          ${row('Received', timestamp)}
        </table>`),
    }).catch(e => console.error('Admin email:', e.message));

    if (email) {
      await mailer.sendMail({
        from: `"Alpha Ultimate" <${FROM}>`,
        replyTo: INFO,
        to: email,
        subject: `✅ Booking Confirmed ${bookingId} — Alpha Ultimate`,
        html: wrap(`<h2 style="color:#14f195;margin-top:0">Booking Confirmed ✅</h2>
          <p>Dear <strong>${name}</strong>, thank you for booking with Alpha Ultimate.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            ${row('Booking ID', `<strong style="color:#14f195">${bookingId}</strong>`)}
            ${row('Service', service)}
            ${row('Date', date + (time ? ` at ${time}` : ''))}
            ${row('Address', address)}
          </table>
          <p>We will contact you within <strong>30 minutes</strong> to confirm.</p>
          <p>Questions? Email <a href="mailto:${INFO}" style="color:#14f195">${INFO}</a></p>`),
      }).catch(e => console.error('Customer email:', e.message));
    }
  }

  return res.status(200).json({
    success: true, bookingId,
    message: 'Booking received! We will confirm within 30 minutes.',
    notified,
  });
}
