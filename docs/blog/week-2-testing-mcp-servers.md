---
title: "I tested 5 official MCP servers with one command. Two of them don't exist on npm."
description: "What a 30-second health check reveals about the current state of the MCP ecosystem — silent broken packages, missing schema descriptions, and servers that look fine until you actually call them."
tags: [mcp, modelcontextprotocol, claude, cli, devtools, testing]
cover_image: ""
canonical_url: ""
published: false
---

<!--
Cross-post targets: dev.to, Hashnode, personal blog.
Before publishing:
  1. Give 72-hour heads-up to maintainers of server-filesystem and server-everything (they have failing results).
  2. Re-verify server-fetch / server-sequentialthinking 404s (MCP package names shift quickly).
  3. Set canonical_url to whichever blog you publish on first.
  4. Swap the cover image with a screenshot of the scorecard output.
-->

Last week I shipped [`mcp-probe`](https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe) — a CLI that connects to any MCP server and runs a full health check in one command. On launch day I pointed it at five official MCP servers from the `@modelcontextprotocol` org. The results surprised me.

Two of them don't exist on npm.

## The command

```bash
npx @incultnitostudiosllc/mcp-probe test "npx -y @modelcontextprotocol/server-everything"
```

That's it. The tool connects over stdio (or SSE / Streamable HTTP), enumerates every tool, resource, and prompt, calls each one with auto-generated sample arguments, validates the responses against declared schemas, and prints a pass/fail scorecard. Exit code 0 for CI-pass, 1 for CI-fail.

## The five servers I tested

| Server | Tools | Resources | Prompts | Schema warns | Status |
|---|---|---|---|---|---|
| `server-memory` | 9 / 9 | n/a | n/a | 4 | **PASS** |
| `server-everything` | 12 / 13 | 7 / 7 | 3 / 4 | 1 | FAIL (1 prompt) |
| `server-filesystem` | 2 / 14 | n/a | n/a | 18 | FAIL (12 tools) |
| `server-fetch` | — | — | — | — | **npm 404** |
| `server-sequentialthinking` | — | — | — | — | **npm 404** |

## Finding 1: Two advertised servers are missing from npm

```
npm error 404 Not Found - GET https://registry.npmjs.org/@modelcontextprotocol%2fserver-fetch - Not found
```

`server-fetch` and `server-sequentialthinking` are referenced in MCP documentation and widely copy-pasted into Claude Desktop configs. The names I tried return 404. These packages were renamed, split across orgs, or unpublished — and users who follow tutorials copying those exact names hit a silent install failure before Claude Desktop ever sees them.

This is the strongest argument for running a pre-integration health check. If a server can't even install, you want to know in 30 seconds at the terminal — not after five minutes of debugging "why isn't my tool showing up in Claude?"

## Finding 2: `server-filesystem` — 12 of 14 tools fail under automated testing

Scorecard:

```
Tools callable:      2/14
Schema warnings:     18
SOME CHECKS FAILED
```

mcp-probe auto-generated the string `"test"` for required `path` arguments. The filesystem server wanted real paths under the `/tmp` root I passed. This is a documented limitation of mcp-probe — it infers sample arguments from the schema, and the schema doesn't tell it "this field must be a real filesystem path."

But it's also a real signal *about the server*: none of those `path` properties have a `description` in their JSON Schema. All 18 schema warnings are variants of:

```
WARN  list_directory_with_sizes — Property "path" missing description
WARN  directory_tree — Property "path" missing description
WARN  move_file — Property "source" missing description
```

Without descriptions, neither an automated test generator nor an LLM can produce a useful argument. The server "works" when a human passes the right path, and silently collapses when anything else does.

If you're writing an MCP server, **your schema descriptions are load-bearing**. They're not documentation — they're the instruction manual your LLM is reading every time it decides how to call your tool.

## Finding 3: `server-everything` — 1 prompt fails, 1 schema warning

```
FAIL resource-prompt — A prompt that includes an embedded resource reference (1ms)
     MCP error -32603: Invalid resourceType: test. Must be Text or Blob.
```

Same argument-generation issue. The prompt declares `resourceType` as an enum (`"Text" | "Blob"`), and mcp-probe passed the generic `"test"` string because it didn't read the enum.

That's a mcp-probe roadmap item (respect `enum` constraints when generating sample arguments — tracking as an issue). But it's also a useful finding for server authors: **add meaningful `examples`** in your schema. A single `examples: ["Text"]` in the `resourceType` property would have made this call succeed.

## Finding 4: `server-memory` — the gold standard

```
Tools callable:      9/9
Schema errors:       0
Schema warnings:     4
ALL CHECKS PASSED
```

Every tool callable with zero special setup. Four schema warnings are still "missing description" style — easy to fix — but from a functional perspective, this is what an MCP server should look like under automated testing: you point a stranger's tool at it, and it just works.

## What this means for MCP server authors

If you're shipping an MCP server, here's what a 30-second health check from a stranger will expose:

1. **Your package name must resolve on npm.** If you've renamed, unpublished, or reorganized — leave a deprecated stub that points users to the new name.
2. **Every input schema property needs a `description`.** Missing descriptions are silent quality-of-life killers for LLMs and for automated testing.
3. **Use `enum` and `examples` where the tool expects specific values.** An automated test generator can't guess `"Text"` or `"Blob"`.
4. **Run it in CI.** `npx -y @incultnitostudiosllc/mcp-probe test "node dist/index.js"` fails the build when anything regresses.

## What's next for mcp-probe

Scorecard data from this run created three roadmap items:

- Auto-read `enum` constraints when generating sample arguments
- Infer filesystem-shaped argument types from property name + server context
- Show a concise "process exited before handshake" error instead of the full npm 404 dump

Plus an explicit escape hatch for server authors who want to provide canonical test inputs: `--sample-args my-canonical-inputs.json`.

## Try it

```bash
npx @incultnitostudiosllc/mcp-probe test "your-mcp-server-command-or-url"
```

- Repo: [github.com/PengSpirit/mcp-doctor](https://github.com/PengSpirit/mcp-doctor)
- npm: [@incultnitostudiosllc/mcp-probe](https://www.npmjs.com/package/@incultnitostudiosllc/mcp-probe)
- Drop in CI: [docs/ci-example.md](https://github.com/PengSpirit/mcp-doctor/blob/main/docs/ci-example.md)

If you maintain an MCP server, open an issue with the [test-my-server template](https://github.com/PengSpirit/mcp-doctor/issues/new?template=test_my_server.yml) and I'll run mcp-probe against it and post the scorecard as a comment.

---

*Raw scorecards from this post are committed to the repo at [`docs/scorecards/`](https://github.com/PengSpirit/mcp-doctor/tree/main/docs/scorecards) — re-runnable with the same commands, timestamped 2026-04-17.*
