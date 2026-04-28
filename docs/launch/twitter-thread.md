# Twitter/X launch thread — paste-ready

**Post at:** https://x.com/compose/post
**Time:** Launch day, parallel with HN submission
**Pin tweet 1 for 2 weeks.**
**Attach demo.gif (repo root) to tweet 1.**

## Thread (7 tweets)

### 1/  (attach demo.gif)

```
I shipped mcp-probe — one command to test any MCP server.

   npm i -g @incultnitollc/mcp-probe
   mcp-probe test "<server>"

Enumerates every tool, resource, prompt. Calls them. Validates schemas.
Prints a pass/fail scorecard. Exits 0/1 for CI.
```

### 2/

```
Pointed it at the 4 official Node MCP servers as a sanity check:

server-memory               9/9   PASS
server-sequential-thinking  1/1   PASS
server-everything           12/13 tools, 3/4 prompts
server-filesystem           8/14  tools

30/37 tools pass across all four.
```

### 3/

```
The interesting part isn't the pass rate. It's that nearly every
remaining failure traces to the same thing: input-schema properties
shipped without `description` fields.

If the schema doesn't describe the arg, my probe — and any LLM, and
your IDE's autocomplete — has to guess.
```

### 4/

```
Works across all three transports:
— stdio (local commands)
— SSE
— Streamable HTTP

Same command, same scorecard.
```

### 5/

```
Flags that mattered to me:
--html   shareable report
--bench  p50 / p95 / p99 per tool
--watch  re-run on file change
--json   pipe into anything
```

### 6/

```
Solo indie, non-coder background, built across a two-month MCP
learning project. MIT licensed.

If you maintain an MCP server and want a scorecard run against it,
reply with a link.
```

### 7/

```
Full scorecard write-up + raw outputs:
https://github.com/incultnitollc/mcp-probe/discussions/10

Repo + demo gif:
https://github.com/incultnitollc/mcp-probe

npm:
https://www.npmjs.com/package/@incultnitollc/mcp-probe
```

## Rules

- Do NOT tag @AnthropicAI in tweet 1. Only tag them if directly relevant later in thread, and only once.
- Do NOT buy engagement.
- Pin tweet 1 for 2 weeks.
- Reply to every reply for 48 hours.
- If it flops (<500 impressions in 2 hrs), do NOT delete and retry — let it breathe; post the 20-server blog in week 2 with a fresh thread.
