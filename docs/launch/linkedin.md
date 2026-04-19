# LinkedIn — paste-ready

**Post at:** https://www.linkedin.com/feed/?shareActive=true
**Day:** Launch day + 1

## Post

```
Shipped a small OSS tool this week: mcp-probe.

It's a CLI that connects to any MCP (Model Context Protocol) server and
runs a full health check — every tool, every resource, every prompt,
schema-validated, with CI-friendly exit codes.

    npm install -g @incultnitostudiosllc/mcp-probe
    mcp-probe test "<server>"

To prove it on something real, I pointed it at the four official Node
MCP servers Anthropic publishes:

    server-memory               9 / 9   PASS
    server-sequential-thinking  1 / 1   PASS
    server-everything           12 / 13 tools, 3 / 4 prompts
    server-filesystem           8 / 14  tools

Two pass clean. The other two reveal the same issue: when servers ship
without `description` fields on their input-schema properties, every
automated caller — my probe, your IDE's autocomplete, any LLM trying
to invoke the tool — has to guess. mcp-probe surfaces exactly which
params need better docs, so maintainers can fix them.

Context on me: I'm not a DevTools founder. I run Incultnito Studios LLC
and I'm a non-coder by background. I built this during a two-month
learning project because I kept adding MCP servers to my stack and
discovering broken tools only after integration.

Three things I learned building it:
— The MCP spec moves fast; writing a client forces you to read every line
— "Works on my machine" is especially dangerous for stdio servers
— A 20-line scorecard is worth more than a 500-line log

MIT. Links in the comments.
```

## First comment (separate, because LinkedIn throttles posts with external links in the body)

```
npm: https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe
Repo: https://github.com/PengSpirit/mcp-doctor
Scorecard write-up: https://github.com/PengSpirit/mcp-doctor/discussions/10
```

## Notes

- LinkedIn algorithm rewards posts where you reply to every comment — block 30 min after posting
- Tag 0–2 relevant people MAX (e.g. someone at Anthropic you already know). Zero is safer.
- Post between 8am–10am Taipei time (your audience is mixed US/APAC — morning catches US evening + APAC workday start)
