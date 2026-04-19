---
title: "Schema descriptions are load-bearing: what I learned building a health check tool for MCP servers"
description: "I built mcp-probe to test MCP servers. Stress-testing it against the four official Node servers forced me to fix three real bugs in my own client before I could trust any failure I reported. Here's the loop."
tags: [mcp, modelcontextprotocol, claude, cli, devtools, testing]
cover_image: ""
canonical_url: ""
published: false
---

<!--
Cross-post targets: dev.to, Hashnode, personal blog.
Before publishing:
  1. Set canonical_url to whichever blog you publish on first.
  2. Swap the cover image with a screenshot of the scorecard output (or the demo GIF first frame).
  3. Re-confirm the scorecard table against docs/scorecards/SUMMARY.md the morning of publish.
-->

I shipped a small CLI called [`mcp-probe`](https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe) — point it at any MCP server and it runs a health check: enumerates every tool, resource, and prompt, calls each one with auto-generated sample arguments, validates against declared schemas, prints a pass/fail scorecard, and exits 0 or 1 for CI.

The plan for launch week was to run it against the official Node MCP servers and post the results. The first run made me look like I'd broken half the ecosystem. The second run, after I'd actually read my own output, told a different story: most of the failures were bugs in my client, not bugs in the servers. The remaining failures all collapse into a single substantive finding about schema design.

This post is the corrected version. Three sections: what mcp-probe does, what the scorecards actually say, and the three bugs I had to fix in my own client before I could trust any failure I was reporting.

## 1. What mcp-probe does

One command. stdio, SSE, or Streamable HTTP transport. No config file required.

```bash
npx @incultnitostudiosllc/mcp-probe test "npx -y @modelcontextprotocol/server-memory"
```

Output is a scorecard:

```
Tools callable:      9/9
Resources readable:  n/a
Prompts callable:    n/a
Schema warnings:     4
ALL CHECKS PASSED
```

Exit code 0 if everything passes, 1 if anything fails. Drop it in CI:

```yaml
- run: npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js"
```

Install globally if you'd rather not `npx` every time:

```bash
npm install -g @incultnitostudiosllc/mcp-probe
```

The mental model is `curl` for MCP servers. You don't open Claude Desktop, hand-write a config, restart the app, and stare at the tool list to see whether anything broke. You run one command and get a scorecard.

![mcp-probe demo](https://raw.githubusercontent.com/PengSpirit/mcp-doctor/main/demo.gif)

## 2. What I found across the four official Node servers

Here is the actual scorecard from `docs/scorecards/SUMMARY.md`, re-run on `@incultnitostudiosllc/mcp-probe@0.2.1`:

| Server | Tools | Resources | Prompts | Schema warns | Status |
|---|---|---|---|---|---|
| `@modelcontextprotocol/server-memory` | 9 / 9 | n/a | n/a | 4 | PASS |
| `@modelcontextprotocol/server-sequential-thinking` | 1 / 1 | n/a | n/a | 0 | PASS |
| `@modelcontextprotocol/server-everything` | 12 / 13 | 7 / 7 | 3 / 4 | 1 | partial |
| `@modelcontextprotocol/server-filesystem` | 8 / 14 | n/a | n/a | 18 | partial |

Aggregate: 30 of 37 tools callable across four servers, 81%. Two servers fully pass. The other two have a single failure pattern between them.

A scope note before the finding, because I got this wrong the first time: Anthropic's `fetch` MCP server is Python-only, installed via `uvx mcp-server-fetch`. It has never been published to npm. mcp-probe runs against any stdio MCP server regardless of language — only this scorecard is scoped to the official Node servers. Earlier launch copy of mine that called `server-fetch` "broken on npm" was wrong, and I want to flag it explicitly here because I almost shipped that draft.

Now the real finding. Every remaining failure on the partial-pass servers traces to the same root cause: **missing `description` fields on schema properties**.

On `server-filesystem`, six of the fourteen tools fail because mcp-probe doesn't know which arguments are supposed to be file paths versus directory paths versus arbitrary strings. The `path` parameter on `read_file`, `read_text_file`, `read_media_file`, `edit_file`, and `write_file` has no description in the schema, so my client defaults to the allowed sandbox directory itself. The server correctly returns `EISDIR` (you tried to read a directory as a file) or `EACCES` (you tried to write to one). `move_file` fails the same way — both `source` and `destination` resolve to the same directory, and the server correctly refuses the no-op rename. The server is doing its job. The schema is the gap.

On `server-everything`, one prompt fails because the `resourceType` argument has no description. It's an enum — `"Text"` or `"Blob"` — but with no description and no examples, my client passes the literal string `"test"` and the server correctly returns `Invalid resourceType: test`. The schema validator inside mcp-probe even raises a warning on this property before the call fires:

```
WARN  get-resource-reference — Property "resourceType" missing description
```

That warning is the diagnostic working as intended — mcp-probe still attempts the call, then surfaces both the warning and the resulting failure side-by-side so you can see the connection.

The substantive insight, and the line I'll repeat at every MCP-related event for the next year: **when an MCP server ships parameter properties without descriptions, no automated tool can guess valid arguments.** Not mcp-probe. Not your IDE's autocomplete. Not an LLM trying to call the tool from Claude Desktop. Schema descriptions aren't documentation polish. They're the instruction manual the model is reading every time it picks an argument. They're load-bearing.

If you maintain an MCP server and you want a quick win, add `"description"` to every property in every input schema. The 18 schema warnings on `server-filesystem` are not 18 separate problems — they're 18 instances of the same one-line fix.

## 3. The three bugs I fixed in my own client first

Here's the part I want to be honest about. The first time I ran mcp-probe against `server-filesystem`, I got 2 of 14 tools passing and a scorecard that screamed FAIL. My instinct was to write a launch post saying "the official filesystem server is broken." I almost did.

Then I actually read my own output. Most of those failures were because my client was sending arguments the server had no way to accept. A diagnostic tool is only credible if it can distinguish "your server is broken" from "I sent garbage." Stress-testing forced that distinction, and three commits came out of it before I trusted the scorecard.

**Commit `3825170` — show the args we sent on every failure.** When a tool or prompt call fails, mcp-probe now prints the exact JSON it sent alongside the server's error response. Before this, a failure looked like `MCP error -32603: Invalid resourceType: test` with no indication that `"test"` was something my client had auto-generated. After this, you can read the failure and immediately tell whether the server rejected something reasonable or something nonsense. This is the smallest of the three changes and the most important one for the trust story.

**Commit `ce4f55e` — sandbox-aware paths.** `server-filesystem` enforces an allowed-directory sandbox. mcp-probe now calls `list_allowed_directories` before generating sample arguments and uses one of those directories as the default for any `path`-shaped parameter. On macOS, where `/tmp` is a symlink to `/private/tmp`, it normalizes via `realpath` so the path the server receives matches what the sandbox check expects. This single commit moved `server-filesystem` from 2 of 14 passing to 8 of 14. The remaining 6 are the missing-description cases I already covered — the bugs that aren't mine.

**Prompt-argument enum extractor.** When a prompt argument is described in prose like `"one of: Text, Blob"` instead of as a JSON Schema enum, mcp-probe now tries to parse the allowed values out of the description string and pick one. Partial — it works on the prompts that have prose-level documentation, and it does nothing for arguments like `resourceType` on `server-everything` that have neither schema enum nor prose description. This is why the schema-description finding above isn't theoretical: I built the workaround, and the workaround can't help when there's no text to read.

The loop, in one sentence: I had to make my client honest about what it was sending before I could call any server's failure a server bug.

## Try it

```bash
npm install -g @incultnitostudiosllc/mcp-probe
mcp-probe test "npx -y @modelcontextprotocol/server-memory"
```

- Repo: [github.com/PengSpirit/mcp-doctor](https://github.com/PengSpirit/mcp-doctor)
- npm: [@incultnitostudiosllc/mcp-probe](https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe)
- Raw scorecards from this post: [`docs/scorecards/`](https://github.com/PengSpirit/mcp-doctor/tree/main/docs/scorecards)

If you maintain an MCP server and you want a scorecard run against it, open an issue with the [test-my-server template](https://github.com/PengSpirit/mcp-doctor/issues/new?template=test_my_server.yml) and I'll post the results as a comment. If mcp-probe reports something that looks like a server bug and isn't, open an issue against mcp-probe instead — that's the loop that produced commits `3825170` and `ce4f55e`, and it's the only way the diagnostic gets more trustworthy.
