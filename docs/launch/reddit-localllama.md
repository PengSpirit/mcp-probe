# Reddit r/LocalLLaMA — paste-ready

**Submit at:** https://www.reddit.com/r/LocalLLaMA/submit
**Day:** Launch day + 1 (Day 2 — post AFTER you have HN/r/mcp traction to reference)

## Title

```
mcp-probe — CLI health checker for MCP servers (exit codes, HTML report, bench mode)
```

## Body

```
For anyone running MCP servers locally: mcp-probe connects over
stdio/SSE/HTTP, exercises every tool/resource/prompt, validates schemas,
and prints a scorecard. CI-friendly exit codes.

    npm install -g @incultnitostudiosllc/mcp-probe
    mcp-probe test "<server>"
    mcp-probe test "<server>" --bench       # p50/p95/p99
    mcp-probe test "<server>" --html out.html

Sanity-check run against the four official Node MCP servers:

    server-memory               9 / 9   PASS
    server-sequential-thinking  1 / 1   PASS
    server-everything           12 / 13 tools, 3 / 4 prompts
    server-filesystem           8 / 14  tools

30 / 37 tools callable. Every failure I haven't fixed in my own client
traces to the same thing: schema properties without `description` fields.
When the schema doesn't describe an argument, anything calling the tool
— my probe, your local model, your IDE — has to guess. The probe flags
those properties so server authors can fix them upstream.

(One example I had to fix on my side: server-filesystem went from 2/14
to 8/14 once the client called `list_allowed_directories` first and
normalized macOS `/tmp` → `/private/tmp` symlinks. Sandboxed local servers
will eat anything that doesn't respect their root.)

MIT, Node 20+. Solo OSS side project — feedback on missing checks welcome.

https://github.com/PengSpirit/mcp-doctor
https://github.com/PengSpirit/mcp-doctor/discussions/10
```

## Note

- r/LocalLLaMA skews toward self-hosters and tinkerers. Lead with the concrete (commands, exit codes, benchmarks) not the why.
- If HN / r/mcp performed well, it's OK to add a single line: "Got decent feedback on HN yesterday, cross-posting here." — signals validation without bragging.
