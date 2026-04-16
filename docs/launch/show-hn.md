# Show HN — paste-ready

**Submit at:** https://news.ycombinator.com/submit
**Best time:** Tuesday or Wednesday, 8–10am ET
**Budget:** Sit at the keyboard for 4 hours after posting. Reply to every comment within 30 minutes.

## Title

```
Show HN: Mcp-probe – one command to health-check any MCP server
```

## URL

```
https://github.com/PengSpirit/mcp-doctor
```

## Text (body)

```
Hi HN — I built mcp-probe because every time I added an MCP server to Claude
Desktop or Cursor I'd hit the same thing: silent failures, half-implemented
tools, schemas that don't match reality.

It's a CLI. You point it at a server (stdio command, SSE URL, or Streamable
HTTP URL), and it:

- Lists every tool, resource, and prompt
- Calls each tool with auto-generated arguments from its input schema
- Reads each resource and fetches each prompt
- Validates responses against the declared schemas
- Prints a pass/fail scorecard and exits 0/1 for CI

  npx @incultnitostudiosllc/mcp-probe test "npx -y @modelcontextprotocol/server-everything"

Other flags: --html for a shareable report, --bench for p50/p95/p99 latency,
--watch for dev loops, --json for automation.

I'm not a DevTools company — I'm a solo builder (non-coder by background)
who got tired of not knowing whether a server was actually working. Wrote it
across a "Month 1–2 MCP Inspect" learning project. MIT licensed.

Repo: https://github.com/PengSpirit/mcp-doctor
npm: https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe

Would love feedback, especially: which failure modes should it catch that it
currently misses?
```

## HN rules (hard)

- No emoji.
- No exclamation marks.
- No "excited to announce."
- No CAPS.
- Reply to every top-level comment within 30 minutes for 4 hours.
- If criticism lands, thank + acknowledge, don't defend.
- If it gets flagged off front page, do NOT reupload same day.
