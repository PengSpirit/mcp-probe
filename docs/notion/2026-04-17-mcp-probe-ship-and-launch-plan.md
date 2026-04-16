# mcp-probe v0.2.1 — Ship Decision + Launch Plan

**Date:** 2026-04-17
**Destinations:** Paste into Notion Decisions Log (`4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`). Secondary copy to Inbox (`0bc19e52-647f-45b6-8387-e0f1f0f2d1f9`) if you want the launch metrics tracked separately.

---

## Decision: Ship mcp-probe as first public OSS release

**Entity:** Incultnito Studios LLC (owner) — published under npm org scope `@incultnitostudiosllc`

**What shipped:**
- Package: `@incultnitostudiosllc/mcp-probe@0.2.1`
- npm: https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe
- GitHub repo: https://github.com/PengSpirit/mcp-doctor (repo name unchanged)
- GitHub release: https://github.com/PengSpirit/mcp-doctor/releases/tag/v0.2.1
- Binary: `mcp-probe`
- License: MIT

**Why this name:**
Unscoped `mcp-doctor` was already taken on npm by an unrelated MCP-config-fixer tool (crooj026). Also taken: `mcp-inspect`, `mcp-tester`. Scoped under `@incultnitostudiosllc` because: (a) guarantees name availability, (b) preserves the Incultnito Studios brand, (c) avoids binary collision.

**Why this version:**
v0.2.0 shipped 2026-04-13 (SSE + HTTP transports). v0.2.1 is the rename-only patch. No functional changes.

---

## Launch plan (2-week window starting when Peng is ready)

### Day 1 (AM PT Tue/Wed)
1. MCP community Discord `#showcase` (first — community-first posting)
2. Show HN (8–10am ET) — `docs/launch/show-hn.md`
3. r/mcp + r/ClaudeAI (parallel) — `docs/launch/reddit-*.md`
4. Twitter/X thread (pin tweet 1 for 2 weeks) — `docs/launch/twitter-thread.md`

### Day 2
5. r/LocalLLaMA — `docs/launch/reddit-localllama.md`
6. LinkedIn — `docs/launch/linkedin.md`

### Week 2
7. Blog post: "I tested 5 official MCP servers with one command. Two of them don't exist on npm." — `docs/blog/week-2-testing-mcp-servers.md` (draft committed)
8. YouTube / Loom walkthrough (8–12 min)
9. dev.to tutorial: "Add MCP server health checks to your GitHub Actions in 5 minutes"

### Success metrics (48h / 2 weeks)
| Metric | 48h target | 2w target |
|---|---|---|
| npm weekly downloads | 200+ | 1,000+ |
| GitHub stars | 50+ | 200+ |
| GitHub issues opened | 3–8 | — |
| Unique contributors | — | 5+ |
| CI repos using mcp-probe | — | 10+ |
| HN points | 40+ | — |

---

## Launch infrastructure (already committed to repo)

- `.github/ISSUE_TEMPLATE/` — bug, feature, test-my-server templates
- `docs/ci-example.md` — GitHub Actions / GitLab / CircleCI / pre-commit snippets
- `docs/launch/*.md` — paste-ready copy for every channel
- `docs/scorecards/` — first 5-server run, summary + raw outputs
- `docs/blog/week-2-testing-mcp-servers.md` — week-2 blog draft
- GitHub Discussions enabled + seed thread: https://github.com/PengSpirit/mcp-doctor/discussions/10

---

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| HN flops (<10 points in 1hr) | Don't reupload same day. Let it breathe. Week-2 blog is your second shot. |
| Server maintainers take the "broken scorecard" findings personally | Give 72h heads-up via GitHub issue before publishing negative findings. |
| A viral moment generates issues Peng can't handle (solo non-coder) | test-my-server template absorbs traffic. Reply within 48h, not 30min, except for HN / Reddit launch day. |
| npm name squatting or trademark confusion | MIT license + clear "a tool by Incultnito Studios LLC" attribution in README protects positioning. |

---

## Next actions (top 3)

1. **Pin the Share Your Scorecard discussion** (1 click in UI): https://github.com/PengSpirit/mcp-doctor/discussions/10
2. **Pick a launch date** — ideally a Tuesday or Wednesday in the next 7 days so HN timing works
3. **Record demo GIF re-capture** — current demo.gif references `mcp-doctor`; re-record with `mcp-probe` binary name before launch

---

*Source: mcp-probe repo, commit e2fbb4e (launch infrastructure) + 29a55ed (rename to 0.2.1). Scorecards captured 2026-04-17. Full launch materials at `docs/launch/README.md`.*
