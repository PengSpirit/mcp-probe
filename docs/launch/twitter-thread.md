# Twitter/X launch thread — paste-ready

**Post at:** https://x.com/compose/post
**Time:** Launch day, parallel with HN submission
**Pin tweet 1 for 2 weeks.**

## Thread (7 tweets)

### 1/

```
I shipped mcp-probe — one command to health-check any MCP server.

   npx @incultnitostudiosllc/mcp-probe test "<server>"

Enumerates every tool, resource, prompt. Calls them. Validates schemas.
Prints a pass/fail scorecard. Exits 0/1 for CI.
```

### 2/

```
Works across all three transports:
— stdio (local commands)
— SSE
— Streamable HTTP

Same command, same scorecard.
```

### 3/

```
Flags that mattered to me:
--html   → shareable report
--bench  → p50 / p95 / p99 latency per tool
--watch  → re-run on file change while you build
--json   → pipe into anything
```

### 4/

```
Why I built it: every time I added a server to Claude Desktop or Cursor
I'd discover broken tools only *after* wiring them up. I wanted one
command that fails loudly before integration.
```

### 5/

```
I'm not a DevTools company. Solo indie, non-coder background, built
this during a two-month MCP learning project. MIT licensed.
```

### 6/

```
If you maintain an MCP server — I'd love to run mcp-probe against it
and share the scorecard. Reply with a link.
```

### 7/

```
Repo + demo gif:
https://github.com/PengSpirit/mcp-doctor

npm:
https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe
```

## Rules

- Do NOT tag @AnthropicAI in tweet 1. Only tag them if directly relevant later in thread, and only once.
- Do NOT buy engagement.
- Pin tweet 1 for 2 weeks.
- Reply to every reply for 48 hours.
- If it flops (<500 impressions in 2 hrs), do NOT delete and retry — let it breathe; post the 20-server blog in week 2 with a fresh thread.
