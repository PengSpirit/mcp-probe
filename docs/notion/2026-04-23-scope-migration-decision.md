# Decision: npm scope migrated to `@incultnitollc`

**Date:** 2026-04-23
**Notion target:** Decisions Log (database `4acefbb1-e3b1-4c1b-9b80-24e2e3bf3d62`)
**Status:** Executed
**Owner:** Peng
**Entities affected:** Incultnito LLC (legal); mcp-probe (package); MCP Registry (downstream consumer)

## Decision

Retire the npm scope `@incultnitostudiosllc` and republish `mcp-probe` under `@incultnitollc/mcp-probe@1.0.0`.

## Why

`@incultnitostudiosllc` referenced a Wyoming LLC filing ("Incultnito Studios LLC") that was applied-for but **not approved** by the WY Secretary of State as of 2026-04-23. Shipping public launches (Probe 2026-04-29, Studio 2026-05-16) under an unapproved entity name is a compliance smell that would be flagged on Show HN, Product Hunt, or by enterprise buyers. The approved legal entity is **Incultnito LLC**; the new scope is tied to it.

## What was executed

| Step | Where | Commit / verification |
|---|---|---|
| Split `src/index.ts` → `src/cli.ts` + `src/lib.ts`; add `InspectOptions.silent`; update `main`/`types`/`exports`/`bin` | mcp-probe repo | `4149f8c` |
| Rename package `@incultnitostudiosllc/mcp-probe` → `@incultnitollc/mcp-probe`; bump to `1.0.0`; sweep docs + issue templates | mcp-probe repo | `51944b7` |
| `npm publish --access public` | npm | `npm view @incultnitollc/mcp-probe version` → `1.0.0` |
| `npm deprecate "@incultnitostudiosllc/mcp-probe@<=0.2.1" "Moved to @incultnitollc/mcp-probe. Install that instead."` | npm | `npm view ... deprecated` returns the message |
| MCPR `adapter-probe` dep swap to `@incultnitollc/mcp-probe@^1.0.0` + lockfile regen | MCPR repo | `398f729` (+ ADR addendum `d627cbd`) |
| Add `CHANGELOG.md` + `MIGRATION.md`; update README hedge note; sweep `@0.2.1` pins | mcp-probe repo | `08e43af` |
| Rename GitHub repo `mcp-doctor` → `mcp-probe`; update `repo.url` / `homepage` / `bugs` in package.json + docs | GitHub + mcp-probe repo | `gh repo rename` + local commits |
| Cut GitHub release `v1.0.0` with migration notes | GitHub | <https://github.com/PengSpirit/mcp-probe/releases/tag/v1.0.0> |

## What was NOT changed

- CLI behavior: subcommands (`test`, `bench`, `watch`), transports (stdio / SSE / Streamable HTTP), flags, output formats, exit codes — identical to `0.2.1`.
- License (MIT), copyright holder (Incultnito LLC), author attribution.
- Old-scope package: **not** unpublished — deprecated-only. Old tarballs still resolve; lockfiles don't break; tombstone carries the redirect message.
- `@incultnitostudiosllc` npm org kept as a tombstone. If WY SOS later approves "Incultnito Studios LLC" as a formal entity name, the scope becomes available for reuse on that entity.

## Kept as follow-up (not part of this decision)

- **Library-mode migration for MCPR `adapter-probe`** (ADR 0002 §4). Adapter currently still shells out to the CLI in subprocess mode; switching to direct `inspectServer` import deletes ~100 lines, eliminates a known CLI-argv drift bug, and unlocks typed `InspectResult` end-to-end. Blocker for MCPR P1-0.
- **`npm view` metadata refresh.** The published 1.0.0 tarball's `repository.url` / `homepage` / `bugs` fields still reference `PengSpirit/mcp-doctor`. GitHub redirect is durable, so this is cosmetic. If a 1.0.1 patch ships later, include the fresh URLs then.
- **External announce.** Whether to tweet / LinkedIn post about the scope move is Peng's call; the deprecation message covers mechanical discovery.

## Downstream impact

- **Probe launch Wed 2026-04-29 21:45 Taipei:** unblocked. Launch copy now consistently references `@incultnitollc/mcp-probe`.
- **MCPR P0 chain fully closed.** Critical path starts at P1-0 (library-mode migration) on first available weekend block.
- **Incultnito Studio (PH 2026-05-16):** unaffected — separate product, separate schedule.

## Links

- npm (new): <https://www.npmjs.com/package/@incultnitollc/mcp-probe>
- npm (tombstone): <https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe>
- Repo: <https://github.com/PengSpirit/mcp-probe>
- Release: <https://github.com/PengSpirit/mcp-probe/releases/tag/v1.0.0>
- Migration guide: `MIGRATION.md` at repo root
- Changelog: `CHANGELOG.md` at repo root
