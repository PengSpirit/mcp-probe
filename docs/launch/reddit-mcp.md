# Reddit r/mcp — paste-ready

**Submit at:** https://www.reddit.com/r/mcp/submit
**Flair:** Tools / Showcase (check sub rules)
**Day:** Launch day, right after Show HN posts

## Title

```
mcp-probe: CLI that health-checks any MCP server (stdio/SSE/HTTP) in one command
```

## Body

```
Built this because I kept adding MCP servers and finding tools that looked
fine in the manifest but threw on invocation, or resources that 404'd.

    npx @incultnitostudiosllc/mcp-probe test "<command-or-url>"

Connects via stdio, SSE, or Streamable HTTP. Enumerates tools/resources/prompts,
calls each with generated args, validates schemas, prints a scorecard.
Exits 0/1 — drops into CI.

Also: --html report, --bench (p50/p95/p99), --watch, --json.

Repo: https://github.com/PengSpirit/mcp-doctor

If you maintain a server and want me to run it against your implementation
and share results, drop a link.
```

## After posting

- Reply to every comment within 1 hour for the first 4 hours
- If someone links their server, run mcp-probe against it and post the scorecard as a reply (huge engagement moment)
- Link back to the r/mcp post from your Twitter thread once it has 20+ upvotes
