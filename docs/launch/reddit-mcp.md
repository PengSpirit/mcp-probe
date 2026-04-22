# Reddit r/mcp — paste-ready

**Submit at:** https://www.reddit.com/r/mcp/submit
**Flair:** Tools / Showcase (check sub rules)
**Day:** Launch day, right after Show HN posts

## Title

```
mcp-probe: ran it against the 4 official Node MCP servers — 30/37 tools pass, most remaining failures trace to missing schema descriptions
```

## Body

```
Built mcp-probe because I kept adding MCP servers and finding tools
that looked fine in the manifest but threw on invocation, or resources
that 404'd.

    npm install -g @incultnitollc/mcp-probe
    mcp-probe test "<command-or-url>"

Connects via stdio, SSE, or Streamable HTTP. Enumerates tools/resources/
prompts, calls each with generated args, validates schemas, prints a
scorecard. Exits 0/1 — drops into CI.

Also: --html report, --bench (p50/p95/p99), --watch, --json.

To prove the tool on something I didn't write, I pointed it at the four
official Node servers (`@modelcontextprotocol/server-*`):

    server-memory               9 / 9   PASS
    server-sequential-thinking  1 / 1   PASS
    server-everything           12 / 13 tools, 7 / 7 resources, 3 / 4 prompts
    server-filesystem           8 / 14  tools

Aggregate: 30 / 37 tools callable (81%), 2 / 4 servers fully clean.

6 of the 7 remaining tool failures trace to the same root cause:
input-schema properties shipped without `description` fields. (The
seventh, `simulate-research-query`, needs a streaming API — `callToolStream`
— that mcp-probe doesn't wire up yet. Client-side gap, on the roadmap.)
When the schema doesn't say what a param is for, every automated caller
— my probe, an IDE's autocomplete, an LLM — has to guess. On server-filesystem that meant
mcp-probe defaulted `path` to the allowed root directory and the server
correctly returned EISDIR. Not a server bug, a documentation gap that
breaks every downstream caller the same way.

(Quick disclosure on my own client: server-filesystem went from 2/14
to 8/14 after I fixed mcp-probe to call `list_allowed_directories`
first and normalize macOS `/tmp` → `/private/tmp`. Sandboxed servers
expose how lazy your client is.)

Full scorecard + raw outputs:
https://github.com/PengSpirit/mcp-doctor/discussions/10

Repo: https://github.com/PengSpirit/mcp-doctor

If you maintain a server and want me to run it against your implementation
and share results, drop a link.
```

## After posting

- Reply to every comment within 1 hour for the first 4 hours
- If someone links their server, run mcp-probe against it and post the scorecard as a reply (huge engagement moment)
- Link back to the r/mcp post from your Twitter thread once it has 20+ upvotes
