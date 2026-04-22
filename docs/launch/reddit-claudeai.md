# Reddit r/ClaudeAI — paste-ready

**Submit at:** https://www.reddit.com/r/ClaudeAI/submit
**Flair:** Tools / Resources (check sub rules — r/ClaudeAI is strict on self-promo; frame as "helpful tool I made" not "my product")
**Day:** Launch day

## Title

```
I made a tool to vet MCP servers before you add them to Claude Desktop
```

## Body

```
If you've ever added an MCP server to Claude Desktop and had a tool
silently not work, this is for you.

    npm install -g @incultnitollc/mcp-probe
    mcp-probe test "<command-or-url>"

It runs every tool, reads every resource, fetches every prompt, validates
schemas, and prints a pass/fail scorecard. One command. Works with any
transport (stdio / SSE / Streamable HTTP).

I ran it against the four official Node MCP servers to sanity-check
my own tool:

    server-memory               9 / 9   PASS
    server-sequential-thinking  1 / 1   PASS
    server-everything           12 / 13 tools, 3 / 4 prompts
    server-filesystem           8 / 14  tools

Two pass clean. The other two surface mostly the same root cause:
input-schema properties without `description` fields. (One tool in
server-everything also needs a streaming API mcp-probe doesn't wire
up yet — noted on the roadmap.) When the schema doesn't say what an
arg is for, every caller has to guess — Claude included. That
matches the failure mode I was seeing in Claude Desktop: a tool listed,
the model calls it, the call comes back with `Invalid X` or `EISDIR`
because the model guessed wrong.

I built this as a non-coder founder during a two-month MCP learning
project, so the output is designed to be readable, not clever.

Repo + demo gif: https://github.com/PengSpirit/mcp-doctor
Full scorecard write-up: https://github.com/PengSpirit/mcp-doctor/discussions/10

Happy to answer questions, and if there's a server you've had trouble
with in Claude Desktop, drop it and I'll run a scorecard.
```

## Note

- r/ClaudeAI mods downvote anything that reads like marketing. Keep it first-person, problem-first, no bold claims.
- If a mod removes the post, accept it and don't repost — DM them first with a polite "what could I change?"
