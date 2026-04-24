# Session closeout: Blog draft final polish (T-5 to launch)

**Date:** 2026-04-24 (Fri) 22:00–23:30 Taipei
**Notion target:** Decisions Log (database `4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`)
**Status:** Executed
**Owner:** Peng
**Entities affected:** Incultnito LLC (legal); mcp-probe (package)
**Related GCal event:** "Probe: Blog draft final polish"

## Decision

Defer `demo.gif` regeneration and `scripts/fake-demo.sh` stale-string fix to the Saturday 2026-04-25 10:00–13:00 Taipei GCal slot ("Probe: Social assets — demo GIF + OG card"). Ship the blog polish tonight as a text-only, single-file, zero-risk commit.

## Why

- Existing `demo.gif` (2.1 MB, committed in `050d175` on 2026-04-19) is live at `raw.githubusercontent.com/incultnitollc/mcp-probe/main/demo.gif` and renders correctly in both README and the published blog.
- `fake-demo.sh` carries two stale failure messages (`simulate-research-query` shows "Requires task-based execution" instead of the real client-side `callToolStream` gap; `resource-prompt` shows "must be Text or Blob" instead of "Invalid resourceType: test") — only visible if a viewer pauses the GIF.
- Tomorrow's event is literally scoped for this work. Batching the stale-string fix with the re-record and the new OG card (1200×630) keeps tonight's blog-polish blast radius to 5 line edits across one markdown file, and puts all visual-asset churn into one Saturday window.
- DROP-READY LOCK is Tue 2026-04-28 22:00 Taipei. Every unplanned scope addition inside polish events eats margin from that lock.

## What was executed

| Step | Where | Commit / verification |
|---|---|---|
| Intro tightened 157 → 122 words (<150 target); reversal beat + schema-design finding preserved | `docs/blog/week-2-testing-mcp-servers.md` (mcp-probe repo) | `dea7fa5` |
| 4× stale `PengSpirit/mcp-probe` URLs swept → `incultnitollc/mcp-probe` (demo.gif raw, repo link, scorecards tree, test-my-server issue template) | same file | `dea7fa5` — verified via `grep -n "PengSpirit" docs/blog/*.md` returns empty |
| Scorecard version stamp `1.0.0` → `1.0.1` (matches published tarball) | same file, line 60 | `dea7fa5` |
| `published: false` frontmatter preserved | same file, line 7 | visual diff inspection |
| `demo.gif` reference at top already present (line 56, from `050d175`) | same file | no action needed |
| Push to `origin/main` | GitHub (redirect from old remote URL warned, push landed) | `8634c5b..dea7fa5  main -> main` |
| Next-event handoff written to memory `project_launch.md` | `~/.claude/projects/.../memory/` | marks Sat 04-25 as next scheduled event |

## What was NOT changed

- `scripts/fake-demo.sh` stale failure strings — deferred to Saturday per the decision above.
- `demo.gif` binary — not regenerated tonight.
- Blog body content below the intro (sections 1–3, scorecard table, closing CTA) — untouched beyond URL sweep.
- `package.json` `repository.url` / `homepage` / `bugs` — the Sun 04-26 `step3-handoff.md` covers that separately.
- Git remote `origin` URL still points to `PengSpirit/mcp-probe.git`; GitHub redirect handles the push. Not touching remote config tonight.

## Kept as follow-up

- **Sat 04-25 10:00 Taipei** — `fake-demo.sh` stale-string fix + `vhs demo.tape` re-record + OG card design (1200×630) + commit.
- **Sun 04-26 10:00 Taipei** — execute `docs/notion/2026-04-26-step3-handoff.md` (sweeps `package.json` redirect URLs, bumps `1.0.1` → `1.0.2`, Warm Supporter DM list).
- **Mon 04-27 22:00 Taipei** — Dress rehearsal, dry-run `./scripts/launch.sh`.
- **Tue 04-28 22:00 Taipei** — DROP-READY LOCK (no more content changes).

## Downstream impact

- **Probe launch Wed 2026-04-29 21:45 Taipei:** on track. Blog draft is now polish-complete pending the Tue lock; text quality is launch-ready.
- **Incultnito Studio (PH 2026-05-16):** unaffected — separate product, separate schedule.
- **MCPR:** unaffected — no adapter or library surface touched tonight.

## Links

- Commit: <https://github.com/incultnitollc/mcp-probe/commit/dea7fa5>
- Blog file on GitHub: <https://github.com/incultnitollc/mcp-probe/blob/main/docs/blog/week-2-testing-mcp-servers.md>
- npm: <https://www.npmjs.com/package/@incultnitollc/mcp-probe>
- Repo: <https://github.com/incultnitollc/mcp-probe>
