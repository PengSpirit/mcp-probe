# Session closeout: Social assets — demo GIF + OG card (T-4 to launch)

**Date:** 2026-04-25 (Sat) 10:00–13:00 Taipei
**Notion target:** Decisions Log (database `4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`)
**Status:** Executed
**Owner:** Peng
**Entities affected:** Incultnito LLC (legal); mcp-probe (package)
**Related GCal event:** "Probe: Social assets — demo GIF + OG card"

## Decision

Ship `demo.gif` re-record, OG card (1200×630), and blog `cover_image` wire as a single commit on `main`. Keep all Sunday-scoped work (sibling-MCPR `package.json` URL sweep + 1.0.2 bump) out of this commit; that lives in the untracked `docs/notion/2026-04-26-step3-handoff.md` paste prompt for tomorrow.

## Why

- The Saturday slot was scoped specifically for visual-asset churn so tonight's Tue DROP-READY LOCK has zero asset risk.
- Blog `published: false` is still set, so wiring `cover_image: "docs/assets/og-card.png"` is a safe pre-flip — no visible surface change, one less frontmatter edit on launch night.
- Bundling the `fake-demo.sh` string fix + `vhs demo.tape` re-record into one pass (vs. splitting across two sessions) avoids a second round of GIF-regeneration overhead and keeps the demo.gif history single-hop.
- OG card was authored as SVG → PNG (via `rsvg-convert`) so the source is editable without binary-only diffs, and the PNG can be regenerated deterministically from the SVG any time the tagline changes.

## What was executed

| Step | Where | Commit / verification |
|---|---|---|
| `scripts/fake-demo.sh` stale failure strings fixed | `scripts/fake-demo.sh` (gitignored — lives on disk) | `simulate-research-query` → real `callToolStream` gap; `resource-prompt` → `Invalid resourceType: test`; timings aligned to scorecard (`1ms`) |
| `demo.gif` re-recorded via `vhs demo.tape` | repo root | `bbe7d96` — binary modified, 2.17 MB → 1.92 MB, 1000×680, Catppuccin Mocha, 15s |
| OG card source authored | `docs/assets/og-card.svg` | `bbe7d96` — 1200×630, editorial layout, brand-aligned (plum `#820855` headline, off-white `#FAFAF7` bg, Georgia serif 62pt, Helvetica 22pt sub, Menlo monospace npm hint) |
| OG card rendered to PNG | `docs/assets/og-card.png` | `bbe7d96` — 65 KB, deterministic render via `rsvg-convert -w 1200 -h 630` |
| Blog `cover_image` wired | `docs/blog/week-2-testing-mcp-servers.md:5` | `bbe7d96` — `""` → `"docs/assets/og-card.png"` |
| Push to `origin/main` | GitHub (redirect warning again; push landed) | `0d22c6a..bbe7d96 main -> main` |
| Next-event handoff | `~/.claude/projects/.../memory/project_launch.md` | updated to point at Sun 04-26 10:00 Warm Supporter DM event |

## What was NOT changed

- `docs/notion/2026-04-26-step3-handoff.md` — untracked file from yesterday's session carry-over, scoped for tomorrow's 10:00 slot. **Not staged, not committed, not read beyond carry-over watch.**
- `package.json` `repository.url` / `homepage` / `bugs` — owned by Sun 04-26 handoff; still stale, still causing push redirect warnings.
- Git remote `origin` URL still points to `PengSpirit/mcp-probe.git`; GitHub redirect handles the push. Not touching remote config.
- Blog body content — untouched beyond the single frontmatter line.
- README `demo.gif` reference — still the same relative path; new gif auto-loads.
- v1.0.1 tarball on npm — stale URLs inside; sweep + republish to 1.0.2 is Sunday's scope.

## Kept as follow-up

- **Sun 04-26 10:00 Taipei** — execute `docs/notion/2026-04-26-step3-handoff.md`: sweep `package.json` redirect URLs, bump `1.0.1` → `1.0.2`, publish to npm, build Warm Supporter DM list.
- **Mon 04-27 22:00 Taipei** — Dress rehearsal, dry-run `./scripts/launch.sh`.
- **Tue 04-28 22:00 Taipei** — DROP-READY LOCK (no more content changes).
- **Wed 04-29 21:30 Taipei** — Pre-flight check; 21:45 LAUNCH.

## Downstream impact

- **Probe launch Wed 2026-04-29 21:45 Taipei:** on track. All visual assets now fresh and brand-compliant; blog frontmatter one flip away from publish (just `published: false` → `true` + `canonical_url` on the night).
- **Incultnito Studio (PH 2026-05-16):** unaffected — separate product, separate schedule.
- **MCPR:** unaffected — no adapter or library surface touched today.

## Links

- Commit: <https://github.com/incultnitollc/mcp-probe/commit/bbe7d96>
- demo.gif on GitHub: <https://github.com/incultnitollc/mcp-probe/blob/main/demo.gif>
- OG card on GitHub: <https://github.com/incultnitollc/mcp-probe/blob/main/docs/assets/og-card.png>
- Blog file on GitHub: <https://github.com/incultnitollc/mcp-probe/blob/main/docs/blog/week-2-testing-mcp-servers.md>
- npm: <https://www.npmjs.com/package/@incultnitollc/mcp-probe>
- Repo: <https://github.com/incultnitollc/mcp-probe>
