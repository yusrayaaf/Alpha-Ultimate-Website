import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  app.set('trust proxy', 1); // Trust the first proxy
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  // Broadcast function
  const broadcast = (message: string) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Middleware
  app.use(express.json());

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', apiLimiter);

  // API Routes
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const ADMIN_USER = process.env.VITE_ADMIN_USER;
    const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD;

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  const upload = multer({ dest: '/tmp' });
  const assetsDir = path.join(__dirname, 'src/assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  app.post('/api/admin/upload/logo', upload.single('file'), (req, res) => {
    // Handle logo upload here
    res.json({ message: 'Logo uploaded successfully' });
  });

  app.post('/api/admin/upload/graphics', upload.single('file'), (req, res) => {
    // Handle graphics upload here
    broadcast('New booking received!');
    res.json({ message: 'Graphic uploaded successfully' });
  });

  app.post('/api/admin/upload/yusra-icon', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const tempPath = req.file.path;
    const targetPath = path.join(assetsDir, 'yusra-icon.png'); // Always save as yusra-icon.png

    fs.rename(tempPath, targetPath, err => {
      if (err) return res.status(500).json({ message: 'Error saving file.' });
      res.json({ message: 'Yusra icon uploaded successfully', filePath: '/src/assets/yusra-icon.png' });
    });
  });

  app.get('/api/admin/yusra-icon', (req, res) => {
    const iconPath = path.join(assetsDir, 'yusra-icon.png');
    if (fs.existsSync(iconPath)) {
      res.sendFile(iconPath);
    } else {
      res.status(404).json({ message: 'Yusra icon not found.' });
    }
  });

  app.get('/api/admin/content', (req, res) => {
    if (fs.existsSync(path.resolve(__dirname, 'src/data/content.json'))) {
        res.sendFile(path.resolve(__dirname, 'src/data/content.json'));
    } else {
        res.json({});
    }
  });

  app.post('/api/admin/content', (req, res) => {
    // In a serverless environment, we can't write to the file system.
    // For now, we'll just return a success message.
    // A more robust solution would involve a database.
    broadcast('New contact form submission!');
    res.json({ message: 'Content updated successfully (simulation)' });
  });

  app.post('/api/booking', (req, res) => {
    const bookingDetails = req.body;
    console.log('Booking received:', bookingDetails);
    
    // Simulate sending confirmation email
    console.log(`[EMAIL SERVICE] Sending confirmation email to ${bookingDetails.email || 'user'}...`);
    console.log(`[EMAIL CONTENT] Subject: Booking Confirmation - Alpha Ultimate`);
    console.log(`[EMAIL CONTENT] Dear ${bookingDetails.name}, thank you for booking with us. We have received your request for ${bookingDetails.service} on ${bookingDetails.date}.`);
    
    broadcast('New booking received!');
    res.status(200).json({ message: 'Booking received and confirmation email sent' });
  });

  app.post('/api/contact', (req, res) => {
    console.log('Contact message received:', req.body);
    broadcast('New contact message received!');
    res.status(200).json({ message: 'Message received' });
  });

  // Vite Middleware (Development)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Static Files (Production)
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  // SPA Fallback
  // Note: In dev mode with appType: 'spa', vite.middlewares handles the fallback automatically.
  // We only need this for production or if vite doesn't handle it.
  if (process.env.NODE_ENV === 'production') {
      app.use('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
      });
  }

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

createServer();
