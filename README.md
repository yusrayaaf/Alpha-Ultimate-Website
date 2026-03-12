# Alpha Ultimate Website

Professional cleaning service website for **alpha-01.com**

## 🚀 One-Command Deploy

```bash
bash deploy.sh
```

That's it. The script will:
1. Check Node.js, npm, git, Vercel CLI (installs CLI if missing)
2. Ask for all environment variables **one by one** (saved forever after first run)
3. Save your GitHub PAT once (never asked again)
4. Commit & push to GitHub
5. Push all env vars to Vercel, then deploy to production
6. Guide you to connect your IONOS domain (`alpha-01.com`)

## ⚡ Quick Commands

| Command | What it does |
|---------|-------------|
| `bash deploy.sh` | Full setup + push + deploy |
| `bash deploy.sh --push` | Skip env prompts, just push & deploy |
| `bash deploy.sh --reset` | Clear saved credentials, start fresh |

## 🔑 Environment Variables

See `.env.example` for all required variables.  
The `deploy.sh` script collects them interactively — no manual editing needed.

## 🛠 Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion animations
- React Router v6
- i18next (English / Arabic / Bengali)
- NeonDB (PostgreSQL) via `@neondatabase/serverless`
- Vercel Serverless Functions (API routes)
- Nodemailer + IONOS SMTP
- ImgBB image uploads
- OpenRouter AI chatbot

## 📁 Structure

```
alpha-ultimate-final/
├── deploy.sh          ← ONE SCRIPT: git + vercel + ionos
├── .env.example       ← All env vars documented
├── src/               ← React app
├── api/               ← Vercel serverless functions
├── public/            ← Static assets (logo, videos, images)
├── vercel.json        ← Vercel config (routing, headers, functions)
└── package.json
```

## 🌍 Pages

`/` Home · `/services` · `/pricing` · `/gallery` · `/booking` · `/contact` · `/about` · `/faq` · `/admin/login`
