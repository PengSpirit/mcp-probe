# mcp-probe Step 3 handoff — Sun 2026-04-26 ~10:00 Taipei

Paste the fenced block below into a fresh Claude Code session opened on
this repo (`/Users/pengspirit/incultnito/Dev/Backend/repos/Month 1 and 2 - MCP Inspect/`).
The block is self-contained — it does not require Claude to read MCPR
memory or any other session's context.

Prereq before pasting: confirm Step 1 (org creation) and Step 2 (repo
transfer) landed. Do **not** paste this prompt until:

```
gh api orgs/incultnitollc --jq '.login'            # returns: incultnitollc
gh api repos/incultnitollc/mcp-probe --jq '.name'  # returns: mcp-probe
```

Both must succeed. If either 404s, stop — the transfer hasn't flushed
GitHub's side yet, wait 30s and retry.

---

## Paste-ready prompt

```
MCP-PROBE-STEP-3-URL-SWEEP-AND-1.0.2 2026-04-26 Taipei

Working dir: this repo (mcp-probe, the one published as
@incultnitollc/mcp-probe). HEAD is the last 1.0.1 commit.

Context set by sibling MCPR session (2026-04-23 EOD):
- npm scope migration done 2026-04-23. Package ships as
  @incultnitollc/mcp-probe; old @incultnitostudiosllc/mcp-probe
  scope is deprecated with a redirect notice.
- GitHub org incultnitollc was created this morning and THIS repo
  just transferred from PengSpirit/mcp-probe to
  incultnitollc/mcp-probe. GitHub auto-redirects work, but the
  published 1.0.1 tarball still carries PengSpirit/mcp-probe in
  package.json (repository.url, homepage, bugs.url). That's the
  stale metadata this task fixes.
- Sibling MCPR session is idle and does not touch mcp-probe.
- Peng is present for OTP on npm publish; everything else runs here.

Goal — ONE commit, then one manual publish:

1. URL SWEEP.
   Grep every PengSpirit/mcp-probe across the repo:

       grep -rn "PengSpirit/mcp-probe" . --exclude-dir=node_modules \
         --exclude-dir=.git --exclude-dir=dist

   Replace each with incultnitollc/mcp-probe. Expected surfaces:
   package.json (repository.url, homepage, bugs.url) · README.md ·
   MIGRATION.md · CHANGELOG.md · docs/launch/*.md · docs/notion/*.md ·
   docs/blog/*.md · docs/ci-example.md · docs/scorecards/SUMMARY.md ·
   src/*.ts embedded links (rare — confirm via grep) ·
   .github/ISSUE_TEMPLATE/*.md if present.

   Keep LICENSE, attribution, and copyright as-is. They say
   "Incultnito LLC", not a GH user.

   Historical docs (CHANGELOG pre-1.0 entries, Notion
   2026-04-23-scope-migration-decision.md) may keep the old URL
   inside a dated historical block — leave those alone IF the
   surrounding text clearly marks them historical. Otherwise update.

2. VERSION BUMP 1.0.1 -> 1.0.2.
   Grep for the literal "1.0.1":

       grep -rn '"1.0.1"' src/ package.json \
         && grep -rn "version.*1\.0\.1" src/

   Known hits (confirm, don't assume):
   - package.json "version": "1.0.1"
   - src/client.ts line ~53 new Client({ ..., version: "1.0.1" })
   Any other src/*.ts with embedded version = bump.

   Do NOT rebuild dist/ in this commit. dist/ is rebuilt by
   `prepublishOnly` (or `npm run build`) at publish time — skipping
   the rebuild in the commit keeps the diff tight and human-reviewable.

3. CHANGELOG ENTRY.
   Add to CHANGELOG.md directly under the "Unreleased" header (or
   create 1.0.2 section above 1.0.0):

       ## 1.0.2 — 2026-04-26

       ### Changed
       - **Metadata only.** Repository moved from
         github.com/PengSpirit/mcp-probe to
         github.com/incultnitollc/mcp-probe (entity-name hygiene;
         matches the @incultnitollc npm scope). Updated package.json
         (repository, homepage, bugs), README, MIGRATION, and
         docs/* links. GitHub permanently redirects old URLs, so
         existing installs and lockfiles continue to work.
       - Client handshake string reports 1.0.2.

       No functional changes. No API changes. No breaking changes.

4. TYPECHECK + LINT. Must pass before commit:

       npm run build && npm test || npx tsc --noEmit

   (The real one-liner depends on this repo's scripts — use whatever
   gate the CHANGELOG 1.0.0 + 1.0.1 entries implied existed then.)

5. COMMIT. Conventional Commits:

       git add -u CHANGELOG.md package.json README.md MIGRATION.md \
                  src/ docs/
       git commit -m "chore(release): 1.0.2 — GitHub org migration metadata"

   Commit body:
       Repository moved PengSpirit/mcp-probe -> incultnitollc/mcp-probe
       as part of the 2026-04-23/26 entity-name cleanup. No code
       changes; metadata + URLs + version bump only. Old URLs still
       resolve via GitHub redirects.

6. PUBLISH — Peng runs this step interactively for OTP:

       npm whoami                           # expect: incultnitostudiosllc
       npm publish --access public          # OTP prompt

   Verify:

       npm view @incultnitollc/mcp-probe version    # expect: 1.0.2
       npm view @incultnitollc/mcp-probe repository # expect incultnitollc URL

7. TAG + PUSH:

       git tag v1.0.2
       git push origin main
       git push origin v1.0.2

   (Assuming the remote was re-pointed post-transfer:
    git remote set-url origin https://github.com/incultnitollc/mcp-probe.git
    — run that FIRST if `git remote -v` still shows PengSpirit.)

8. GITHUB RELEASE — drop a 1.0.2 release mirroring the CHANGELOG entry.
   One-liner via gh:

       gh release create v1.0.2 --repo incultnitollc/mcp-probe \
         --title "1.0.2 — GitHub org migration metadata" \
         --notes-file <(sed -n '/^## 1.0.2/,/^## /p' CHANGELOG.md | sed '$d')

Rules:
- ONE commit for the metadata change. Do NOT bundle any feature work,
  refactor, or dist-output regen into this commit. If something else
  tempts you, open a separate branch after this ships.
- Do NOT deprecate 1.0.1. It stays the last pre-migration version for
  anyone who pins; 1.0.2 is strictly additive.
- Do NOT touch the sibling MCPR repo at
  /Users/pengspirit/incultnito/Dev/Backend/repos/Month 2 - MCP Registry
  from this session. MCPR owns its own fixture sweep.

When done, paste this exact line back to Peng:
  MCP-PROBE-1.0.2-PUBLISHED: github.com/incultnitollc/mcp-probe at v1.0.2, npm view returns 1.0.2, redirect verified.
```

---

## Expected wall-clock

Sweep + bump + CHANGELOG: ~15 min.
Commit + publish + OTP + tag + release: ~10 min.
Verification: ~3 min.

Total ~30 min inside the Sun 4/26 10:00 block.

## If anything goes sideways

- Publish fails with 403: `npm whoami` doesn't match scope owner. Log
  out / log back in with the account that owns `@incultnitollc`.
- Publish fails with 402: wrong access flag. The `--access public`
  flag is mandatory for scoped packages; don't omit it.
- Post-publish `npm view` returns 1.0.1: CDN lag. Wait 60s, retry.
- `gh release create` fails with 404: the --repo flag's org name
  doesn't match transferred name. Verify `gh api
  repos/incultnitollc/mcp-probe` returns 200 first.
