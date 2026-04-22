# Discord (MCP community / Anthropic) — paste-ready

**Where:** MCP community Discord `#showcase` or `#community-projects` (whichever the server designates). Check pinned rules before posting.
**When:** Launch day, AM PT — FIRST channel to post in, before HN/Twitter.
**DO NOT** cross-post to multiple channels. Post once. Reply for 48 hours.

## Message

```
Hey all — sharing a tool I built: mcp-probe.

CLI that runs a full health check on any MCP server (stdio / SSE /
Streamable HTTP) with one command. Lists tools/resources/prompts, calls
each, validates schemas, prints a pass/fail scorecard. Exit 0/1 for CI.

   npm install -g @incultnitollc/mcp-probe
   mcp-probe test "<server>"

I ran it against the four official Node MCP servers as a sanity check:

   server-memory               9 / 9   tools  PASS
   server-sequential-thinking  1 / 1   tools  PASS
   server-everything           12 / 13 tools, 7 / 7 resources, 3 / 4 prompts
   server-filesystem           8 / 14  tools

30 / 37 tools callable across the four. Nearly every remaining failure
traces to the same thing: schema properties shipped without `description`
fields, so any automated caller — mcp-probe, your IDE's autocomplete,
an LLM — has to guess the argument shape. (One exception: one tool in
server-everything needs a streaming API — `callToolStream` — that
mcp-probe doesn't wire up yet. Client-side gap, roadmap item.)
mcp-probe surfaces exactly which params need better docs.

Built as a non-coder founder during a two-month MCP project. Open to
"you're validating this wrong" feedback. If you maintain a server and
want me to run it and share the scorecard, link it.

Discussion thread (numbers + raw outputs):
https://github.com/PengSpirit/mcp-probe/discussions/10

Repo: https://github.com/PengSpirit/mcp-probe
```

## Rules

- Do NOT @ anyone.
- Do NOT DM Anthropic staff / mods / maintainers asking for boosts.
- Do NOT post in multiple Discord channels — mods notice and mute.
- Reply to every response for 48 hours.
- If a server maintainer asks you to test their server, do it on the spot and post the scorecard as a reply in the thread.
