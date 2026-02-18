# blast-radius v0.1.0

See the blast radius of a code change before you touch it.

## Install

```bash
npx blast-radius path/to/file
```

## What's in this release

- **CLI** — Analyze any file or directory for change impact
- **Dependency graph** — Scans JS/TS (and basic Python) imports, builds reverse dependency map
- **Risk scoring** — LOW / MEDIUM / HIGH based on inbound references and file patterns
- **Output** — Human-readable report or `--json` for tooling

## Flags

| Flag | Description |
|------|-------------|
| `--depth <n>` | Import layers outward (default: 3) |
| `--json` | Machine-readable output |
| `--output <file>` | Write report to file |
| `--include-tests` | Include test files in scan |
| `--verbose` | Print scan stats |

## Demo

See [DEMO.md](https://github.com/Jennaleighwilder/blast-radius/blob/main/DEMO.md) for live outputs from real open-source repos.

## Links

- [GitHub](https://github.com/Jennaleighwilder/blast-radius)
- [npm](https://www.npmjs.com/package/blast-radius)
