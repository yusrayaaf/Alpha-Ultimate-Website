/**
 * /api/contact — Contact handler with IONOS email + Telegram
 *
 * IONOS EMAIL ENV VARS:
 *   SMTP_HOST  = smtp.ionos.com
 *   SMTP_PORT  = 587
 *   SMTP_USER  = reply@alpha-01.com
 *   SMTP_PASS  = your IONOS email password
 *   EMAIL_FROM = reply@alpha-01.com
 *   EMAIL_INFO = info@alpha-01.com
 */

import nodemailer from 'nodemailer';

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

async function sendTelegram(botToken, chatId, text) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  return res.ok;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message, phone } = req.body || {};
  if (!name || !message) return res.status(400).json({ error: 'Name and message are required.' });

  const refId = 'MSG-' + Date.now().toString(36).toUpperCase().slice(-6);
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Riyadh' });

  // ── TELEGRAM ─────────────────────────────────────────────────────
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
  let notified = false;
  if (BOT_TOKEN && CHAT_ID) {
    const msg = `💬 <b>NEW CONTACT MESSAGE — Alpha Ultimate</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Ref:</b> ${refId}
👤 <b>Name:</b> ${name}
${email ? `📧 <b>Email:</b> ${email}\n` : ''}${phone ? `📞 <b>Phone:</b> ${phone}\n` : ''}${subject ? `📌 <b>Subject:</b> ${subject}\n` : ''}━━━━━━━━━━━━━━━━━━━━
💬 <b>Message:</b>\n${message}
━━━━━━━━━━━━━━━━━━━━
⏰ Received: ${timestamp}`;
    notified = await sendTelegram(BOT_TOKEN, CHAT_ID, msg);
  }

  // ── EMAIL ─────────────────────────────────────────────────────────
  const FROM   = process.env.EMAIL_FROM || 'reply@alpha-01.com';
  const INFO   = process.env.EMAIL_INFO || 'info@alpha-01.com';
  const mailer = getMailer();

  if (mailer) {
    const wrap = (body) => `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#04050f;color:#e2e8f0;padding:32px;border-radius:12px;border:1px solid #14f19530">${body}<p style="margin-top:24px;font-size:12px;color:#475569">Alpha Ultimate · <a href="https://alpha-01.com" style="color:#14f195">alpha-01.com</a></p></div>`;

    // Admin: forwarded inquiry → info@alpha-01.com
    await mailer.sendMail({
      from: `"Alpha Ultimate Contact" <${FROM}>`,
      to: INFO,
      replyTo: email || FROM,
      subject: `📩 New Enquiry [${refId}]${subject ? ' — ' + subject : ''} from ${name}`,
      html: wrap(`
        <h2 style="color:#14f195;margin-top:0">📩 New Contact Message</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#94a3b8;width:100px">Ref</td><td style="color:#14f195;font-weight:bold">${refId}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8">Name</td><td style="color:#fff">${name}</td></tr>
          ${email ? `<tr><td style="padding:6px 0;color:#94a3b8">Email</td><td style="color:#fff">${email}</td></tr>` : ''}
          ${phone ? `<tr><td style="padding:6px 0;color:#94a3b8">Phone</td><td style="color:#fff">${phone}</td></tr>` : ''}
          ${subject ? `<tr><td style="padding:6px 0;color:#94a3b8">Subject</td><td style="color:#fff">${subject}</td></tr>` : ''}
        </table>
        <div style="margin-top:16px;padding:16px;background:#0f172a;border-radius:8px;border-left:3px solid #14f195">
          <p style="margin:0;white-space:pre-wrap">${message}</p>
        </div>
        <p style="color:#64748b;font-size:12px">Received: ${timestamp}</p>
      `),
    }).catch(e => console.error('Admin contact email:', e.message));

    // Auto-reply to sender
    if (email) {
      await mailer.sendMail({
        from: `"Alpha Ultimate" <${FROM}>`,
        replyTo: INFO,
        to: email,
        subject: `We received your message [${refId}] — Alpha Ultimate`,
        html: wrap(`
          <h2 style="color:#14f195;margin-top:0">Thank you, ${name}! 👋</h2>
          <p>We've received your message and will get back to you within a few hours.</p>
          <div style="padding:12px 16px;background:#0f172a;border-radius:8px;border-left:3px solid #14f195;margin:16px 0">
            <p style="margin:0;color:#94a3b8;font-size:12px">Reference: <strong style="color:#14f195">${refId}</strong></p>
            ${subject ? `<p style="margin:4px 0 0;color:#94a3b8;font-size:12px">Subject: ${subject}</p>` : ''}
          </div>
          <p>For urgent matters, contact us at <a href="mailto:info@alpha-01.com" style="color:#14f195">info@alpha-01.com</a></p>
        `),
      }).catch(e => console.error('Auto-reply email:', e.message));
    }
  }

  return res.status(200).json({
    success: true, refId,
    message: "Message received! We'll get back to you within a few hours.",
    notified,
  });
}
