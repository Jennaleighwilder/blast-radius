# blast-radius

See the blast radius of a code change before you touch it.

## Install / Run

```bash
npx blast-radius path/to/file
```

No install required. Or install globally:

```bash
npm install -g blast-radius
blast-radius src/auth.js
```

## Flags

| Flag | Description |
|------|-------------|
| `--depth <n>` | How many import layers outward (default: 3) |
| `--json` | Output machine-readable JSON |
| `--output <file>` | Write report to file |
| `--include-tests` | Include test files in scan (default: ignore) |
| `--verbose` | Print scan stats |

## Demo

See [DEMO.md](./DEMO.md) for live outputs from real open-source repos.

Run the demo locally:

```bash
npm run demo
```

## How it works

1. **Dependency graph** — Scans JS/TS (and basic Python) files, extracts `import`/`require` statements, builds a directed graph of who imports whom.

2. **Reverse traversal** — From your target file, walks backward: who imports this file? Who imports those? Up to `--depth` layers.

3. **Risk heuristics** — Scores based on:
   - Inbound reference count (direct + transitive)
   - File/path patterns (auth, config, middleware, etc.)
   - Safe zones (components/, styles/, etc.)

4. **Output** — Human report with risk level, top importers, impact paths, and suggested safer edit zones.

## Contributing

- **Add language support** — Extend `scanner.js` for more import syntax (Go, Rust, etc.)
- **Improve import resolution** — Handle path aliases, barrel exports, TypeScript paths
- **Expand heuristics** — More patterns, configurable weights

MIT License
