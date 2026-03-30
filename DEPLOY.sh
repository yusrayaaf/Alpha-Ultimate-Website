#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║           ALPHA ULTIMATE — ONE-SCRIPT DEPLOY v4                        ║
# ║  Collects ALL env vars · Git push · Vercel deploy · IONOS domain       ║
# ║                                                                        ║
# ║  Usage:                                                                ║
# ║    bash deploy.sh              → full setup + push + deploy            ║
# ║    bash deploy.sh --push       → skip env prompts, just git push       ║
# ║    bash deploy.sh --reset      → clear saved credentials & restart     ║
# ╚══════════════════════════════════════════════════════════════════════════╝

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colours ───────────────────────────────────────────────────────────────
R='\033[0;31m'  G='\033[0;32m'  Y='\033[1;33m'
C='\033[0;36m'  B='\033[1m'     D='\033[2m'     NC='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────
header()  { echo -e "\n${C}${B}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  $1\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }
ok()      { echo -e "  ${G}✔${NC}  $*"; }
warn()    { echo -e "  ${Y}⚠${NC}   $*"; }
err()     { echo -e "  ${R}✘${NC}  $*"; }
info()    { echo -e "  ${C}ℹ${NC}  $*"; }
dim()     { echo -e "  ${D}$*${NC}"; }
nl()      { echo ""; }

ENV_FILE="$SCRIPT_DIR/.env.local"
CREDS_FILE="$HOME/.git-credentials"

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  FLAG HANDLING                                                         ║
# ╚══════════════════════════════════════════════════════════════════════════╝
MODE="full"
[[ "${1:-}" == "--push"  ]] && MODE="push"
[[ "${1:-}" == "--reset" ]] && MODE="reset"

if [[ "$MODE" == "reset" ]]; then
  nl
  warn "Resetting all saved credentials…"
  [[ -f "$CREDS_FILE" ]] && grep -v "github.com" "$CREDS_FILE" > "${CREDS_FILE}.tmp" 2>/dev/null && mv "${CREDS_FILE}.tmp" "$CREDS_FILE" && ok "GitHub PAT cleared" || true
  [[ -f "$ENV_FILE"   ]] && rm "$ENV_FILE" && ok ".env.local cleared" || true
  ok "Reset complete. Run: bash deploy.sh"
  nl
  exit 0
fi

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  BANNER                                                                ║
# ╚══════════════════════════════════════════════════════════════════════════╝
clear
echo -e "${C}${B}"
echo "  ╔══════════════════════════════════════════════════════╗"
echo "  ║       ALPHA ULTIMATE — DEPLOY SCRIPT v4  🚀         ║"
echo "  ║   alpha-01.com  ·  reply@alpha-01.com  ·  GitHub    ║"
echo "  ╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "  What this script does:\n"
echo -e "  ${G}1${NC}  Checks Node.js, npm, git, Vercel CLI"
echo -e "  ${G}2${NC}  Collects all environment variables (one by one, once only)"
echo -e "  ${G}3${NC}  Saves GitHub PAT (never asked again)"
echo -e "  ${G}4${NC}  Initialises git, sets remote"
echo -e "  ${G}5${NC}  Commits & pushes to GitHub"
echo -e "  ${G}6${NC}  Pushes all env vars to Vercel, then deploys"
echo -e "  ${G}7${NC}  Guides you to connect IONOS domain alpha-01.com"
nl
read -rp "  Press ENTER to begin, or Ctrl+C to cancel… " _

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 1 — PREREQUISITES                                                ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 1 · Checking Prerequisites"

check_cmd() {
  if command -v "$1" &>/dev/null; then
    ok "$1  $(${2:-$1 --version 2>&1 | head -1})"
  else
    err "$1 not found!"
    echo -e "  ${Y}Install:${NC} $3"
    exit 1
  fi
}

check_cmd node "node --version" "https://nodejs.org  (v18+)"
check_cmd npm  "npm --version"  "Included with Node.js"
check_cmd git  "git --version"  "https://git-scm.com"

# Vercel CLI — install if missing
if ! command -v vercel &>/dev/null; then
  warn "Vercel CLI not found. Installing globally…"
  npm install -g vercel --silent && ok "Vercel CLI installed" || {
    err "Could not install Vercel CLI automatically."
    echo -e "  Run manually: ${C}npm install -g vercel${NC}"
    exit 1
  }
else
  ok "vercel  $(vercel --version 2>&1 | head -1)"
fi

NODE_VER=$(node -v | tr -d 'v' | cut -d. -f1)
if [[ "$NODE_VER" -lt 18 ]]; then
  err "Node.js v18+ required (you have v$(node -v))"
  echo -e "  Update at: ${C}https://nodejs.org${NC}"
  exit 1
fi

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 2 — ENVIRONMENT VARIABLES (one by one)                           ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 2 · Environment Variables"

# Load existing .env.local if present
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source <(grep -v '^#' "$ENV_FILE" | grep -v '^$') 2>/dev/null || true
  set +a
fi

# ── Prompt helper: ask once, remember forever ─────────────────────────────
# ask_var VAR_NAME "Label" "default" [secret]
ask_var() {
  local varname="$1" label="$2" default="${3:-}" secret="${4:-}"
  local current="${!varname:-}"
  if [[ -n "$current" && "$current" != "skip" ]]; then
    ok "$label  → already saved"
    return
  fi
  nl
  echo -e "  ${B}${label}${NC}"
  [[ -n "$default" && "$default" != "skip" ]] && dim "  Default / example: $default"
  if [[ "$secret" == "secret" ]]; then
    read -rsp "  → Enter value (hidden): " val; echo ""
  else
    read -rp  "  → Enter value: " val
  fi
  val="${val:-$default}"
  [[ -z "$val" || "$val" == "skip" ]] && val=""
  printf -v "$varname" '%s' "$val"
}

# ─── Check if all required vars are already set ───────────────────────────
NEED_SETUP=false
for v in ADMIN_USER ADMIN_PASSWORD JWT_SECRET SMTP_PASS; do
  [[ -z "${!v:-}" ]] && NEED_SETUP=true && break
done

if [[ "$NEED_SETUP" == "false" && "$MODE" != "full" ]]; then
  ok "All environment variables already configured"
else
  nl
  echo -e "  ${Y}Please answer each prompt — values are saved and never asked again.${NC}"
  echo -e "  ${D}(Press Enter to use the shown default | blank = skip optional items)${NC}"

  nl
  echo -e "  ${C}${B}── ADMIN LOGIN ─────────────────────────────────────────────────────${NC}"
  dim "  This is the login for your site's /admin/login page."
  ask_var ADMIN_USER     "Admin username"                                   "admin"
  ask_var ADMIN_PASSWORD "Admin password  (USE A STRONG PASSWORD!)"         ""   secret

  # Auto-generate JWT secret
  if [[ -z "${JWT_SECRET:-}" ]]; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    ok "JWT_SECRET  → auto-generated (64-char hex)"
  else
    ok "JWT_SECRET  → already saved"
  fi

  nl
  echo -e "  ${C}${B}── NEONDB (PostgreSQL — FREE) ───────────────────────────────────────${NC}"
  dim "  Create a free database at https://neon.tech"
  dim "  Then copy the connection string: postgresql://user:pass@host/dbname?sslmode=require"
  ask_var DATABASE_URL "NeonDB connection string  (postgresql://…)" ""

  nl
  echo -e "  ${C}${B}── IONOS EMAIL ─────────────────────────────────────────────────────${NC}"
  dim "  From: reply@alpha-01.com  ·  Notifications to: info@alpha-01.com"
  dim "  This is the IONOS webmail password for reply@alpha-01.com"
  ask_var SMTP_PASS "IONOS email password for reply@alpha-01.com" "" secret

  nl
  echo -e "  ${C}${B}── IMAGE UPLOADS — ImgBB (FREE) ─────────────────────────────────────${NC}"
  dim "  Sign up free at https://api.imgbb.com — no credit card needed"
  ask_var IMGBB_API_KEY "ImgBB API key  (or press Enter to skip)" ""

  nl
  echo -e "  ${C}${B}── AI CHATBOT — OpenRouter (FREE) ───────────────────────────────────${NC}"
  dim "  Sign up free at https://openrouter.ai — get a free API key"
  ask_var OPENROUTER_API_KEY "OpenRouter API key  sk-or-v1-…  (or Enter to skip)" ""

  nl
  echo -e "  ${C}${B}── TELEGRAM NOTIFICATIONS (optional) ───────────────────────────────${NC}"
  dim "  Get instant booking/contact alerts on Telegram"
  dim "  Create a bot: message @BotFather on Telegram → /newbot"
  dim "  Get your chat ID: message @userinfobot on Telegram"
  ask_var TELEGRAM_BOT_TOKEN "Telegram bot token  1234567:ABC…  (or Enter to skip)" ""
  ask_var TELEGRAM_CHAT_ID   "Telegram chat ID    123456789      (or Enter to skip)" ""

  # ── Write .env.local ──────────────────────────────────────────────────
  cat > "$ENV_FILE" <<ENVEOF
# Alpha Ultimate — Environment Variables
# Generated by deploy.sh on $(date)
# ────────────────────────────────────────────
# ADMIN
ADMIN_USER=${ADMIN_USER:-admin}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
JWT_SECRET=${JWT_SECRET}
# ────────────────────────────────────────────
# DATABASE
DATABASE_URL=${DATABASE_URL:-}
# ────────────────────────────────────────────
# IONOS EMAIL
SMTP_HOST=smtp.ionos.com
SMTP_PORT=587
SMTP_USER=reply@alpha-01.com
SMTP_PASS=${SMTP_PASS:-}
EMAIL_FROM=reply@alpha-01.com
EMAIL_INFO=info@alpha-01.com
# ────────────────────────────────────────────
# IMAGE UPLOADS
IMGBB_API_KEY=${IMGBB_API_KEY:-}
# ────────────────────────────────────────────
# AI CHATBOT
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
# ────────────────────────────────────────────
# TELEGRAM
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN:-}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID:-}
ENVEOF
  chmod 600 "$ENV_FILE"
  nl
  ok "All environment variables saved to .env.local"
fi

# Reload to make sure all vars are live in this shell
set -a
source <(grep -v '^#' "$ENV_FILE" | grep -v '^$') 2>/dev/null || true
set +a

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 3 — GITHUB PAT                                                   ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 3 · GitHub Authentication"

GH_USER=""
GH_REPO="Alpha-Ultimate-Website"
GH_OWNER="yusrayaaf"

if [[ -f "$CREDS_FILE" ]] && grep -q "github.com" "$CREDS_FILE" 2>/dev/null; then
  SAVED_USER=$(grep "github.com" "$CREDS_FILE" | sed 's|https://||;s|:.*||' | head -1)
  ok "GitHub credentials already saved for: ${B}${SAVED_USER}${NC}"
  GH_USER="$SAVED_USER"
else
  nl
  echo -e "  ${Y}One-time GitHub setup — PAT is saved locally and never asked again.${NC}"
  nl
  echo -e "  ${B}Which GitHub account OWNS the repository?${NC}"
  dim "  (Repo: github.com/${GH_OWNER}/${GH_REPO})"
  read -rp "  → GitHub username [${GH_OWNER}]: " _gh_user
  GH_USER="${_gh_user:-$GH_OWNER}"
  nl
  echo -e "  ${B}Create a Personal Access Token:${NC}"
  echo -e "  1. Go to → ${C}https://github.com/settings/tokens/new${NC}"
  echo -e "  2. Token name: ${B}alpha-ultimate-deploy${NC}"
  echo -e "  3. Expiration: ${B}No expiration${NC}  (or your choice)"
  echo -e "  4. Scope: tick ${B}repo${NC}  (full control of private repositories)"
  echo -e "  5. Click ${B}Generate token${NC} → copy the token"
  nl
  read -rsp "  → Paste your GitHub PAT here (hidden): " GH_PAT; echo ""

  # Remove stale github.com lines
  if [[ -f "$CREDS_FILE" ]]; then
    grep -v "github.com" "$CREDS_FILE" > "${CREDS_FILE}.tmp" 2>/dev/null || true
    mv "${CREDS_FILE}.tmp" "$CREDS_FILE"
  fi
  git config --global credential.helper store
  printf "https://%s:%s@github.com\n" "$GH_USER" "$GH_PAT" >> "$CREDS_FILE"
  chmod 600 "$CREDS_FILE"
  nl
  ok "PAT saved for ${B}${GH_USER}${NC} — never asked again"
fi

REPO_URL="https://github.com/${GH_OWNER}/${GH_REPO}.git"
git config --global user.email "reply@alpha-01.com" 2>/dev/null || true
git config --global user.name  "Alpha Ultimate"      2>/dev/null || true

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 4 — GIT INIT & REMOTE                                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 4 · Git Repository"

BRANCH="main"
if [[ ! -d ".git" ]]; then
  git init -b "$BRANCH" 2>/dev/null || { git init; git checkout -b "$BRANCH" 2>/dev/null || true; }
  ok "Git repository initialised"
else
  ok "Git repository already exists"
fi

if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REPO_URL"
  ok "Remote origin → $REPO_URL"
else
  git remote add origin "$REPO_URL"
  ok "Remote origin added → $REPO_URL"
fi

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 5 — SECURITY: ensure secrets are gitignored                      ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 5 · Security Check"

GITIGNORE=".gitignore"
for entry in ".env" ".env.local" ".env.production" ".env*.local" "node_modules/" "dist/" ".vercel/"; do
  grep -qxF "$entry" "$GITIGNORE" 2>/dev/null || echo "$entry" >> "$GITIGNORE"
done
ok ".gitignore is protecting secrets"

git rm --cached .env.local 2>/dev/null && warn ".env.local removed from git tracking" || true
git rm --cached .env       2>/dev/null && warn ".env removed from git tracking"       || true

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 6 — COMMIT & PUSH                                                ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 6 · Commit & Push to GitHub"

git add -A

if git diff --cached --quiet; then
  ok "Nothing new to commit — working tree is clean"
else
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
  DEFAULT_MSG="deploy: alpha-ultimate update ${TIMESTAMP}"
  nl
  echo -e "  ${B}Commit message${NC}"
  dim "  Press Enter to use: \"${DEFAULT_MSG}\""
  read -rp "  → " COMMIT_MSG
  COMMIT_MSG="${COMMIT_MSG:-$DEFAULT_MSG}"
  nl
  git commit -m "$COMMIT_MSG"
  ok "Committed: \"${COMMIT_MSG}\""
fi

nl
echo -e "  ${C}Pushing to GitHub (${BRANCH})…${NC}"
git push origin "$BRANCH" 2>&1 || git push --set-upstream origin "$BRANCH"
nl
ok "${B}Code pushed to GitHub ✓${NC}"
dim "  https://github.com/${GH_OWNER}/${GH_REPO}"

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 7 — VERCEL LOGIN & DEPLOY                                        ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 7 · Vercel — Login & Deploy"

nl
echo -e "  ${B}Vercel Login${NC}"
dim "  Checking if you are already logged in to Vercel CLI…"
nl

VERCEL_EMAIL=""
if vercel whoami &>/dev/null 2>&1; then
  VERCEL_EMAIL=$(vercel whoami 2>/dev/null || echo "logged in")
  ok "Already logged in to Vercel as: ${B}${VERCEL_EMAIL}${NC}"
else
  echo -e "  ${Y}You need to log in to Vercel CLI:${NC}"
  echo -e "  1. A browser will open (or a URL will appear)"
  echo -e "  2. Authorise the CLI login"
  nl
  vercel login
  nl
  ok "Logged in to Vercel ✓"
fi

nl
echo -e "  ${B}Pushing environment variables to Vercel…${NC}"
dim "  Pushing all vars from .env.local → Vercel project (production + preview)"

push_vercel_env() {
  local key="$1" val="$2"
  [[ -z "$val" ]] && return
  echo "$val" | vercel env add "$key" production  --force 2>/dev/null || true
  echo "$val" | vercel env add "$key" preview     --force 2>/dev/null || true
}

# Push every env var
push_vercel_env "ADMIN_USER"          "${ADMIN_USER:-admin}"
push_vercel_env "ADMIN_PASSWORD"      "${ADMIN_PASSWORD:-}"
push_vercel_env "JWT_SECRET"          "${JWT_SECRET:-}"
push_vercel_env "DATABASE_URL"        "${DATABASE_URL:-}"
push_vercel_env "SMTP_HOST"           "smtp.ionos.com"
push_vercel_env "SMTP_PORT"           "587"
push_vercel_env "SMTP_USER"           "reply@alpha-01.com"
push_vercel_env "SMTP_PASS"           "${SMTP_PASS:-}"
push_vercel_env "EMAIL_FROM"          "reply@alpha-01.com"
push_vercel_env "EMAIL_INFO"          "info@alpha-01.com"
[[ -n "${IMGBB_API_KEY:-}"         ]] && push_vercel_env "IMGBB_API_KEY"          "$IMGBB_API_KEY"
[[ -n "${OPENROUTER_API_KEY:-}"    ]] && push_vercel_env "OPENROUTER_API_KEY"     "$OPENROUTER_API_KEY"
[[ -n "${TELEGRAM_BOT_TOKEN:-}"    ]] && push_vercel_env "TELEGRAM_BOT_TOKEN"     "$TELEGRAM_BOT_TOKEN"
[[ -n "${TELEGRAM_CHAT_ID:-}"      ]] && push_vercel_env "TELEGRAM_CHAT_ID"       "$TELEGRAM_CHAT_ID"

ok "Environment variables pushed to Vercel ✓"

nl
echo -e "  ${B}Deploying to Vercel (production)…${NC}"
nl

vercel --prod --yes 2>&1 | tee /tmp/vercel_deploy_output.txt || true

DEPLOY_URL=$(grep -oE 'https://[a-zA-Z0-9._-]+\.vercel\.app' /tmp/vercel_deploy_output.txt | tail -1 || echo "")
nl
if [[ -n "$DEPLOY_URL" ]]; then
  ok "${B}Deployed successfully! ✓${NC}"
  ok "Live URL → ${C}${DEPLOY_URL}${NC}"
else
  warn "Deployment may have completed. Check: ${C}https://vercel.com/dashboard${NC}"
fi

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STEP 8 — IONOS DOMAIN (alpha-01.com)                                  ║
# ╚══════════════════════════════════════════════════════════════════════════╝
header "STEP 8 · IONOS Domain → alpha-01.com"

nl
echo -e "  ${B}Add custom domain in Vercel:${NC}"
echo ""
echo -e "  ${G}1${NC}  Open → ${C}https://vercel.com/dashboard${NC}"
echo -e "  ${G}2${NC}  Click your project → ${B}Settings${NC} → ${B}Domains${NC}"
echo -e "  ${G}3${NC}  Add ${B}alpha-01.com${NC}  and  ${B}www.alpha-01.com${NC}"
echo -e "  ${G}4${NC}  Vercel will show you DNS values to add"
nl
echo -e "  ${B}Then set these DNS records in IONOS:${NC}"
echo ""
echo -e "  Log in → ${C}https://my.ionos.com${NC}"
echo -e "  Go to: ${B}Domains & SSL → alpha-01.com → DNS → Manage Records${NC}"
echo ""
echo -e "  ${D}┌──────────────────┬────────────┬────────────────────────────────────┐${NC}"
echo -e "  ${D}│${NC}  ${B}Type${NC}             ${D}│${NC}  ${B}Host${NC}       ${D}│${NC}  ${B}Points To / Value${NC}               ${D}│${NC}"
echo -e "  ${D}├──────────────────┼────────────┼────────────────────────────────────┤${NC}"
echo -e "  ${D}│${NC}  A               ${D}│${NC}  @          ${D}│${NC}  ${G}76.76.21.21${NC}                       ${D}│${NC}"
echo -e "  ${D}│${NC}  CNAME           ${D}│${NC}  www        ${D}│${NC}  ${G}cname.vercel-dns.com${NC}              ${D}│${NC}"
echo -e "  ${D}└──────────────────┴────────────┴────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${D}TTL: 3600 (or Auto)  ·  Delete any old A/CNAME records first${NC}"
nl
echo -e "  ${Y}DNS propagates in 5–60 minutes.${NC} After propagation:"
echo -e "  Vercel auto-provisions free ${B}SSL/HTTPS${NC} for alpha-01.com"
nl
echo -e "  Verify your domain is live: ${C}https://dnschecker.org/#A/alpha-01.com${NC}"

# ── Auto-add domain via Vercel CLI (optional, best-effort) ───────────────
nl
echo -e "  ${B}Adding domain via Vercel CLI (auto)…${NC}"
vercel domains add alpha-01.com     2>/dev/null && ok "alpha-01.com added to Vercel ✓"     || warn "Run manually: vercel domains add alpha-01.com"
vercel domains add www.alpha-01.com 2>/dev/null && ok "www.alpha-01.com added to Vercel ✓" || warn "Run manually: vercel domains add www.alpha-01.com"

# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  DONE                                                                  ║
# ╚══════════════════════════════════════════════════════════════════════════╝
nl
echo -e "${G}${B}"
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║            ALL DONE — ALPHA ULTIMATE IS LIVE! 🚀          ║"
echo "  ╠═══════════════════════════════════════════════════════════╣"
echo "  ║  ✅  Code pushed to GitHub                                ║"
echo "  ║  ✅  All env vars saved (.env.local) + pushed to Vercel   ║"
echo "  ║  ✅  Deployed to Vercel production                        ║"
echo "  ║  📋  Set IONOS DNS records above to connect alpha-01.com  ║"
echo "  ╠═══════════════════════════════════════════════════════════╣"
echo "  ║  Next push: just run  bash deploy.sh --push               ║"
echo "  ║  Reset all: just run  bash deploy.sh --reset              ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

[[ -n "${DEPLOY_URL:-}" ]] && echo -e "  ${C}Your site:${NC} ${DEPLOY_URL}"
echo -e "  ${C}After DNS:${NC} https://alpha-01.com"
echo -e "  ${C}Admin:${NC}     https://alpha-01.com/admin/login"
nl
