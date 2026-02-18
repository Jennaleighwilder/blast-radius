# blast-radius Deployment Instructions

## Status

- ✅ Package built and verified (`npm pack` succeeds)
- ✅ CLI works on express (`node src/cli.js lib/application.js` produces report)
- ✅ Release notes ready (`launch/release.md`)
- ⏳ **GitHub repo** — needs to be created
- ⏳ **npm publish** — needs `npm login` first
- ⏳ **GitHub Release** — create after push

---

## Step 1: Create GitHub Repo

1. Go to: **https://github.com/new?name=blast-radius&description=See+the+blast+radius+of+a+code+change+before+you+touch+it.**
2. Ensure it's **public**
3. Do **not** initialize with README (we're pushing existing code)
4. Click **Create repository**

---

## Step 2: Fix npm Cache (if you see EPERM errors)

```bash
sudo chown -R $(whoami) ~/.npm
```

---

## Step 3: Push to GitHub

```bash
cd /Users/jenniferwest/blast-radius
git push -u origin main
git push origin v0.1.0
```

If your GitHub username is different from `jenniferwest`, update the remote first:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/blast-radius.git
```

---

## Step 4: npm Login & Publish

```bash
cd /Users/jenniferwest/blast-radius
npm login
# Complete browser login when prompted

npm publish --access public
```

If `blast-radius` is already taken on npm, rename to `blast-radius-cli`:

```bash
# Edit package.json: "name": "blast-radius-cli"
git add package.json && git commit -m "chore: rename to blast-radius-cli" && git push
npm publish --access public
```

---

## Step 5: Verify npx Works

```bash
mkdir -p /tmp/verify && cd /tmp/verify
git clone https://github.com/expressjs/express
cd express
npx blast-radius lib/application.js
```

You should see a formatted BLAST-RADIUS report.

---

## Step 6: Create GitHub Release

1. Go to: **https://github.com/jenniferwest/blast-radius/releases/new**
2. Tag: `v0.1.0`
3. Title: `blast-radius v0.1.0`
4. Description: Copy from `launch/release.md`
5. Publish release

---

## Step 7: Verify GitHub Action

After pushing, wait ~90 seconds. Check:

- https://github.com/jenniferwest/blast-radius/actions
- DEMO.md should be auto-updated by the workflow
