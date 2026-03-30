#!/data/data/com.termux/files/usr/bin/bash

echo "🔧 Fixing Git Repository..."

# Step 1: Ensure git is installed
pkg install git -y

# Step 2: Check repo
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository. Initializing..."
  git init
fi

# Step 3: Reset broken states
echo "🧹 Cleaning state..."
git merge --abort 2>/dev/null
git rebase --abort 2>/dev/null

# Step 4: Fix remote (replace with your repo)
REPO_URL="https://github.com/yusrayaaf/Alpha-Ultimate-Website.git"

echo "🔗 Setting correct remote..."
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL

# Step 5: Fetch safely
echo "⬇️ Fetching origin..."
git fetch origin

# Step 6: Force sync (safe overwrite with your local)
echo "⚠️ Force syncing..."
git add .
git commit -m "Final sync" 2>/dev/null

git branch -M main

git push origin main --force

echo "✅ DONE: Repo fully fixed and synced."
