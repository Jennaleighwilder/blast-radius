#!/bin/bash
# Usage: NPM_TOKEN=your_token_here ./launch/publish-with-token.sh
# Get token at: https://www.npmjs.com/settings/~/tokens (Create "Automation" token)
set -e
cd "$(dirname "$0")/.."

if [ -z "$NPM_TOKEN" ]; then
  echo "Set NPM_TOKEN. Get one at: https://www.npmjs.com/settings/~/tokens"
  exit 1
fi

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> .npmrc
npm publish --access public
sed -i '' '/_authToken/d' .npmrc 2>/dev/null || true
echo "Published!"
