export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    // No custom icon uploaded — frontend will use default
    return res.status(404).json({ message: 'No custom Yusra icon. Using default.' });
  }

  if (req.method === 'POST') {
    // For persistent file uploads on Vercel, integrate Vercel Blob:
    // https://vercel.com/docs/storage/vercel-blob
    // npm install @vercel/blob
    // const { put } = require('@vercel/blob');
    // const blob = await put('yusra-icon.png', req.body, { access: 'public' });
    return res.status(200).json({
      success: true,
      message: 'For persistent file uploads, configure Vercel Blob Storage.',
      filePath: '/assets/yusra-icon.png',
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
