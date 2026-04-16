# Using mcp-probe in CI

Drop mcp-probe into your MCP server's CI pipeline to catch broken tools, missing descriptions, and schema regressions before they reach users.

## GitHub Actions — minimum working example

Save as `.github/workflows/mcp-probe.yml` in your MCP server's repository:

```yaml
name: mcp-probe health check

on:
  push:
    branches: [main]
  pull_request:

jobs:
  probe:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install your server's deps
        run: npm ci

      - name: Build your server (if needed)
        run: npm run build

      - name: Health check with mcp-probe
        run: npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js"
```

**What happens on failure:** `mcp-probe` exits with code `1` and fails the job. You see the scorecard in the Actions log.

## GitHub Actions — with HTML report artifact

Upload a shareable report on every run:

```yaml
- name: Health check with mcp-probe
  run: |
    npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js" \
      --html mcp-report.html
  continue-on-error: false

- name: Upload report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: mcp-report
    path: mcp-report.html
```

## GitHub Actions — with benchmarks

Track latency regressions over time:

```yaml
- name: Latency benchmark
  run: |
    npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js" \
      --bench --json > bench.json

- name: Upload bench data
  uses: actions/upload-artifact@v4
  with:
    name: bench-${{ github.sha }}
    path: bench.json
```

## GitHub Actions — testing a remote HTTP server

If your server is deployed:

```yaml
- name: Health check against staging
  run: |
    npx -y @incultnitostudiosllc/mcp-probe test \
      "${{ secrets.MCP_STAGING_URL }}" \
      --header "Authorization: Bearer ${{ secrets.MCP_TOKEN }}"
```

## GitLab CI

```yaml
mcp_probe:
  image: node:20
  script:
    - npm ci
    - npm run build
    - npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js"
```

## CircleCI

```yaml
version: 2.1
jobs:
  mcp_probe:
    docker:
      - image: cimg/node:20.11
    steps:
      - checkout
      - run: npm ci
      - run: npm run build
      - run: npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js"
workflows:
  test:
    jobs: [mcp_probe]
```

## pre-commit hook

Run a fast probe before every commit. Save as `.git/hooks/pre-commit`:

```bash
#!/usr/bin/env bash
set -e
npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js" --timeout 10000
```

Make it executable: `chmod +x .git/hooks/pre-commit`.

## Exit codes

| Code | Meaning |
|------|---------|
| `0`  | All tools / resources / prompts passed |
| `1`  | One or more checks failed — fail the CI job |

## Tips

- **Pin the version** in CI to avoid silent behavior changes: `npx -y @incultnitostudiosllc/mcp-probe@0.2.1 test ...`
- **Use `--timeout`** on slow servers — default is 30s per operation
- **Set `--transport`** if auto-detection guesses wrong (`stdio` / `sse` / `http`)
- **Store `--json` output as an artifact** — makes regression diffs easy across commits
