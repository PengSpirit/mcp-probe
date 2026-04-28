# Session closeout: Step 3 URL sweep — Option C only (T-31h to launch)

**Date:** 2026-04-28 (Tue) ~10:00 Taipei
**Notion target:** Decisions Log (database `4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`)
**Status:** Executed (Option C scope)
**Owner:** Peng
**Entities affected:** Incultnito LLC (legal); mcp-probe (package); GitHub org `incultnitollc`
**Related GCal event:** "Probe: Warm supporter DM list" (2-day-late execution; original Sun 10:00 slot lapsed)

## Decision

Execute the Step 3 URL sweep as **Option C: in-repo files + git remote only.** Skip the planned `npm publish` v1.0.2, no version bump, no new GitHub release tag.

## Why

- The Step 3 handoff prompt (`docs/notion/2026-04-26-step3-handoff.md`, frozen Apr 19/23 — committed in this same session as historical artifact) was scoped for **Sun 2026-04-26 10:00 Taipei** with 3+ days of buffer to launch. That slot lapsed unexecuted; Mon 04-27 dress rehearsal also lapsed; this session opened on **Tue 04-28 ~10:00**, T-31h to launch.
- Peng resequenced: dress rehearsal + DROP-READY LOCK compressed into **Wed 04-29 morning**. That removes the original 1-day buffer between rehearsal-found bugs and lock.
- A metadata-only `npm publish` 31h before launch (and ~12h before LOCK) is unnecessary tail risk. Failure modes — wrong scope owner, OTP miss, CDN lag, accidental dist-rebuild bundling — would cost more launch margin than the cleanup is worth.
- Launch-day clickable surfaces (HN/Reddit/LinkedIn/Twitter/Discord submission bodies, README, `.github` issue template, MIGRATION) are the **only** URLs a real reader sees. `npm view repository` is invisible to `npm install` and almost never clicked.
- GitHub permanent redirects from `PengSpirit/mcp-probe` → `incultnitollc/mcp-probe` continue to work. Existing pinned installs and lockfiles remain functional.

## What was executed

| Step | Where | Commit / verification |
|---|---|---|
| Prereq: GH org + repo confirmed | `gh api orgs/incultnitollc` → `Incultnitollc`; `gh api repos/incultnitollc/mcp-probe` → `mcp-probe` | both 200 |
| URL sweep across 13 launch-surface files | `perl -pi -e 's\|PengSpirit/mcp-probe\|incultnitollc/mcp-probe\|g'` on the file list | `994fd23` |
| Targeted edit on `CHANGELOG.md:28` | "Prior versions" cross-link to releases page | `994fd23` |
| Local git remote re-pointed | `git remote set-url origin https://github.com/incultnitollc/mcp-probe.git` | verified via `git remote -v` |
| Single commit + push | `chore(launch): sweep PengSpirit → incultnitollc URLs across launch surfaces` | `994fd23` pushed clean (no "repository moved" warning) |
| Original Step 3 paste-prompt committed as historical artifact | `docs/notion/2026-04-26-step3-handoff.md` | this commit |
| Decisions Log entry | this file | this commit |

### Files swept (every PengSpirit/mcp-probe → incultnitollc/mcp-probe)

`package.json` (3 lines: repository.url, homepage, bugs.url) · `README.md` · `MIGRATION.md` · `CHANGELOG.md:28` (Prior versions cross-link) · `docs/launch/show-hn.md` · `docs/launch/twitter-thread.md` · `docs/launch/linkedin.md` · `docs/launch/reddit-mcp.md` · `docs/launch/reddit-claudeai.md` · `docs/launch/reddit-localllama.md` · `docs/launch/discord.md` · `docs/launch/heads-up/server-filesystem.md` · `docs/launch/heads-up/server-everything.md` · `.github/ISSUE_TEMPLATE/config.yml`

### Files deliberately preserved (historical / dated)

- `CHANGELOG.md:10` — 1.0.1 release note describes what 1.0.1 did at the time. Sweeping would falsify history.
- `docs/notion/2026-04-17-mcp-probe-ship-and-launch-plan.md` — pre-migration plan, accurate at writing.
- `docs/notion/2026-04-23-scope-migration-decision.md` — frozen migration decision log; lines 28/40/53/54 are dated context.
- `docs/notion/2026-04-24-blog-polish-handoff.md` — yesterday's handoff describing the remote-still-stale state at 04-24.
- `docs/notion/2026-04-25-social-assets-handoff.md` — Sat handoff describing remote-still-stale state at 04-25.
- `docs/notion/2026-04-26-step3-handoff.md` — meta-doc describing the sweep itself; URLs inside it are example/instructional.

## What was NOT changed (vs the original Step 3 plan)

- **No version bump.** `package.json` stays at `1.0.1`. `src/client.ts` handshake still reports `1.0.1`.
- **No CHANGELOG 1.0.2 entry.** Reserved for if a real 1.0.2 ever ships.
- **No `npm publish`.** `npm whoami` returned 401 (session expired) — even if Option A had been chosen, this would have required a fresh `npm login` first.
- **No `git tag v1.0.2` / `git push origin v1.0.2`.**
- **No `gh release create v1.0.2`.**
- **`dist/` not regenerated** (would only matter for a publish path).

## Kept as follow-up

- **Wed 04-29 morning Taipei** — Compressed dress rehearsal + DROP-READY LOCK. Run `./scripts/launch.sh` dry-run, confirm all submission tabs open with correct (now-clean) URLs in body copy.
- **Wed 04-29 21:45 Taipei** — LAUNCH. `./scripts/launch.sh` real run, HN/Reddit/Twitter/Discord submissions go live; <30 min reply window for HN comments.
- **Post-launch (only if a real 1.0.x patch is needed):** bundle the `npm publish` v1.0.2 metadata refresh with whatever functional fix triggers it. Historical Step 3 paste-prompt at `docs/notion/2026-04-26-step3-handoff.md` is a useful template if/when that lands.

## Downstream impact

- **Probe launch Wed 2026-04-29 21:45 Taipei:** on track. All clickable launch surfaces now point at `incultnitollc/mcp-probe`. Local push no longer warns about repository move. Wed morning's compressed rehearsal+lock is the last gate.
- **Incultnito Studio (PH 2026-05-16):** unaffected — separate product, separate schedule.
- **MCP Registry:** unaffected — sibling repo owns its own fixture sweep; no cross-repo edits this session.

## Links

- Sweep commit: <https://github.com/incultnitollc/mcp-probe/commit/994fd23>
- npm: <https://www.npmjs.com/package/@incultnitollc/mcp-probe> (still 1.0.1 — intentional)
- Repo: <https://github.com/incultnitollc/mcp-probe>
- Original Step 3 paste-prompt (frozen): `docs/notion/2026-04-26-step3-handoff.md`
