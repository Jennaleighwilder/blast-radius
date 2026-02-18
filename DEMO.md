# blast-radius Demo

Live outputs from running blast-radius against real open-source repos.

---

## blast-radius — `src/analyze.js`

- **Repo:** [blast-radius](https://github.com/jenniferwest/blast-radius)

- **Target:** `src/analyze.js`

**Report (first 50 lines):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLAST-RADIUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TARGET:           /Users/jenniferwest/blast-radius/src/analyze.js
RISK:             LOW (score 4)

DIRECT IMPORTERS: 1
TRANSITIVE (≤1):  1

WHY THIS IS RISKY:
- Imported by 1 file(s) directly
- Central transit node (1 transitive within depth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP DIRECT IMPORTERS:
  /Users/jenniferwest/blast-radius/src/cli.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACT PATHS (depth 1–3):
  depth 1:
    /Users/jenniferwest/blast-radius/src/cli.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAFER EDIT ZONES (if you just need UI/behavior tweaks):
  components/
  styles/
  public/
  assets/
  docs/
  examples/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


```

**What this shows:**

- Blast radius analysis on a real production codebase

- Risk scoring based on import graph and file patterns

- Direct importers and transitive impact within depth 3


---

## blast-radius — `src/scanner.js`

- **Repo:** [blast-radius](https://github.com/jenniferwest/blast-radius)

- **Target:** `src/scanner.js`

**Report (first 50 lines):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLAST-RADIUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TARGET:           /Users/jenniferwest/blast-radius/src/scanner.js
RISK:             LOW (score 5)

DIRECT IMPORTERS: 1
TRANSITIVE (≤2):  2

WHY THIS IS RISKY:
- Imported by 1 file(s) directly
- Central transit node (2 transitive within depth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP DIRECT IMPORTERS:
  /Users/jenniferwest/blast-radius/src/analyze.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACT PATHS (depth 1–3):
  depth 1:
    /Users/jenniferwest/blast-radius/src/analyze.js
  depth 2:
    /Users/jenniferwest/blast-radius/src/cli.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAFER EDIT ZONES (if you just need UI/behavior tweaks):
  components/
  styles/
  public/
  assets/
  docs/
  examples/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


```

**What this shows:**

- Blast radius analysis on a real production codebase

- Risk scoring based on import graph and file patterns

- Direct importers and transitive impact within depth 3

