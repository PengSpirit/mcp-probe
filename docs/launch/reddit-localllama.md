# Reddit r/LocalLLaMA — paste-ready

**Submit at:** https://www.reddit.com/r/LocalLLaMA/submit
**Day:** Launch day + 1 (Day 2 — post AFTER you have HN/r/mcp traction to reference)

## Title

```
mcp-probe — CLI health checker for MCP servers (exit codes + HTML report + bench mode)
```

## Body

```
For anyone running MCP servers locally: mcp-probe connects over
stdio/SSE/HTTP, exercises every tool/resource/prompt, validates schemas,
and prints a scorecard. CI-friendly exit codes.

    npx @incultnitostudiosllc/mcp-probe test "<server>"
    npx @incultnitostudiosllc/mcp-probe test "<server>" --bench  # p50/p95/p99
    npx @incultnitostudiosllc/mcp-probe test "<server>" --html out.html

MIT, Node 20+. Solo OSS side project — feedback on missing checks welcome.

https://github.com/PengSpirit/mcp-doctor
```

## Note

- r/LocalLLaMA skews toward self-hosters and tinkerers. Lead with the concrete (commands, exit codes, benchmarks) not the why
- If HN / r/mcp performed well, it's OK to add a single line: "Got decent feedback on HN yesterday, cross-posting here." — signals validation without bragging
