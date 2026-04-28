# Show HN — paste-ready

**Submit at:** https://news.ycombinator.com/submit
**Best time:** Tuesday or Wednesday, 8–10am ET
**Budget:** Sit at the keyboard for 4 hours after posting. Reply to every comment within 30 minutes.

## Title

```
Show HN: mcp-probe – one command to test any MCP server
```

## URL

```
https://github.com/incultnitollc/mcp-probe
```

## Text (body)

```
mcp-probe is a CLI that connects to any MCP server (stdio command, SSE
URL, or Streamable HTTP URL) and:

- Lists every tool, resource, and prompt
- Calls each tool with arguments generated from its input schema
- Reads each resource and fetches each prompt
- Validates responses against the declared schemas
- Prints a pass/fail scorecard and exits 0/1 for CI

  npm install -g @incultnitollc/mcp-probe
  mcp-probe test "npx -y @modelcontextprotocol/server-everything"

Other flags: --html for a shareable report, --bench for p50/p95/p99
latency per tool, --watch for dev loops, --json for automation.

I ran it against the four official Node MCP servers in the
modelcontextprotocol org, as a sanity check on my own tool:

  server-memory               9/9   tools  PASS
  server-sequential-thinking  1/1   tools  PASS
  server-everything           12/13 tools, 7/7 resources, 3/4 prompts
  server-filesystem           8/14  tools

30/37 tools callable across the four (81%). The interesting part isn't
the pass rate, it's the failure mode: 6 of 7 remaining tool failures
trace to input-schema properties shipped without `description` fields.
(The seventh, `simulate-research-query` in server-everything, needs a
streaming API my client doesn't wire up yet — on the roadmap.) When
the schema doesn't describe a parameter, every automated caller — my
probe, an IDE's autocomplete, an LLM trying to invoke the tool — has
to guess the argument shape. On server-filesystem that meant the probe
defaulted `path` to the allowed root directory and the server correctly
returned EISDIR. Not a server bug, a documentation gap that breaks
every downstream caller the same way.

For full transparency: server-filesystem only got to 8/14 after I fixed
my own client to call `list_allowed_directories` first and normalize
macOS `/tmp` -> `/private/tmp` symlinks. Before that fix it scored 2/14.
Writing a probe taught me how lazy my own client was about sandbox
boundaries.

Background: I'm a solo builder, non-coder by training. I wrote this
across a two-month MCP learning project because I kept adding servers
to Claude Desktop and Cursor and discovering broken tools only after
wiring them up. MIT licensed.

Repo: https://github.com/incultnitollc/mcp-probe
npm:  https://www.npmjs.com/package/@incultnitollc/mcp-probe
Full scorecard write-up: https://github.com/incultnitollc/mcp-probe/discussions/10

Feedback I'm specifically looking for: which failure modes should it
catch that it currently misses, and whether the "missing description"
diagnostic is useful to people who maintain servers.
```

## HN rules (hard)

- No emoji.
- No exclamation marks.
- No "excited to announce."
- No CAPS.
- Reply to every top-level comment within 30 minutes for 4 hours.
- If criticism lands, thank + acknowledge, don't defend.
- If it gets flagged off front page, do NOT reupload same day.
