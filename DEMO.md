# blast-radius Demo

Live outputs from running blast-radius against real open-source repos.

---

## chalk — `source/index.js`

- **Repo:** [chalk](https://github.com/chalk/chalk)

- **Target:** `source/index.js`

**Report (first 50 lines):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLAST-RADIUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TARGET:           /home/runner/work/blast-radius/blast-radius/demo/tmp/chalk-main/source/index.js
RISK:             MEDIUM (score 16)

DIRECT IMPORTERS: 2
TRANSITIVE (≤1):  2

WHY THIS IS RISKY:
- Imported by 2 file(s) directly
- Central transit node (2 transitive within depth)
- Touches index (pattern match)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP DIRECT IMPORTERS:
  /home/runner/work/blast-radius/blast-radius/demo/tmp/chalk-main/examples/rainbow.js
  /home/runner/work/blast-radius/blast-radius/demo/tmp/chalk-main/examples/screenshot.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACT PATHS (depth 1–3):
  depth 1:
    /home/runner/work/blast-radius/blast-radius/demo/tmp/chalk-main/examples/rainbow.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/chalk-main/examples/screenshot.js

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

## express — `lib/express.js`

- **Repo:** [express](https://github.com/expressjs/express)

- **Target:** `lib/express.js`

**Report (first 50 lines):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLAST-RADIUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TARGET:           /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/lib/express.js
RISK:             HIGH (score 19)

DIRECT IMPORTERS: 3
TRANSITIVE (≤2):  30

WHY THIS IS RISKY:
- Imported by 3 file(s) directly
- Central transit node (30 transitive within depth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP DIRECT IMPORTERS:
  /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/route-map/index.js
  /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/route-middleware/index.js
  /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/index.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACT PATHS (depth 1–3):
  depth 1:
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/route-map/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/route-middleware/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/index.js
  depth 2:
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/auth/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/content-negotiation/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/cookie-sessions/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/cookies/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/downloads/index.js
    ... and 22 more

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

## express — `lib/response.js`

- **Repo:** [express](https://github.com/expressjs/express)

- **Target:** `lib/response.js`

**Report (first 50 lines):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLAST-RADIUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TARGET:           /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/lib/response.js
RISK:             MEDIUM (score 13)

DIRECT IMPORTERS: 1
TRANSITIVE (≤3):  31

WHY THIS IS RISKY:
- Imported by 1 file(s) directly
- Central transit node (31 transitive within depth)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP DIRECT IMPORTERS:
  /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/lib/express.js

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACT PATHS (depth 1–3):
  depth 1:
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/lib/express.js
  depth 2:
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/route-map/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/route-middleware/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/index.js
  depth 3:
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/auth/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/content-negotiation/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/cookie-sessions/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/cookies/index.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/express-master/examples/downloads/index.js
    ... and 22 more

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

## query-string — `index.js`

- **Repo:** [query-string](https://github.com/sindresorhus/query-string)

- **Target:** `index.js`

**Report (first 50 lines):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLAST-RADIUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TARGET:           /home/runner/work/blast-radius/blast-radius/demo/tmp/query-string-main/index.js
RISK:             MEDIUM (score 16)

DIRECT IMPORTERS: 2
TRANSITIVE (≤1):  2

WHY THIS IS RISKY:
- Imported by 2 file(s) directly
- Central transit node (2 transitive within depth)
- Touches index (pattern match)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP DIRECT IMPORTERS:
  /home/runner/work/blast-radius/blast-radius/demo/tmp/query-string-main/benchmark.js
  /home/runner/work/blast-radius/blast-radius/demo/tmp/query-string-main/index.test-d.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPACT PATHS (depth 1–3):
  depth 1:
    /home/runner/work/blast-radius/blast-radius/demo/tmp/query-string-main/benchmark.js
    /home/runner/work/blast-radius/blast-radius/demo/tmp/query-string-main/index.test-d.ts

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

