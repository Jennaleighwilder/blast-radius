#!/bin/bash
# Run this after creating the GitHub repo and fixing npm cache (if needed).
set -e

cd "$(dirname "$0")/.."

echo "=== 1. Fix npm cache (if EPERM) ==="
echo "If you see npm cache errors, run: sudo chown -R \$(whoami) ~/.npm"
echo ""

echo "=== 2. Push to GitHub ==="
echo "Create repo at: https://github.com/new?name=blast-radius (if not exists)"
echo "Then run:"
echo "  git push -u origin main"
echo "  git push origin v0.1.0"
echo ""

echo "=== 3. npm login (if not logged in) ==="
npm login

echo "=== 4. Publish to npm ==="
npm publish --access public

echo "=== 5. Verify npx works ==="
echo "From a fresh directory:"
echo "  mkdir -p /tmp/verify && cd /tmp/verify"
echo "  git clone https://github.com/expressjs/express"
echo "  cd express && npx blast-radius lib/application.js"
echo ""

echo "=== 6. Create GitHub Release ==="
echo "Go to: https://github.com/jenniferwest/blast-radius/releases/new"
echo "Tag: v0.1.0"
echo "Title: blast-radius v0.1.0"
echo "Copy description from launch/release.md"
