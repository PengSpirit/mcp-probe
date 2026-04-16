# Scorecard Summary — 2026-04-17

First public run of `@incultnitostudiosllc/mcp-probe@0.2.1` against official MCP servers. Data captured for the week-2 launch blog post.

## Results

| Server | Tools | Resources | Prompts | Schema warns | Status |
|---|---|---|---|---|---|
| `@modelcontextprotocol/server-everything` | 12 / 13 | 7 / 7 | 3 / 4 | 1 | FAIL (1 prompt) |
| `@modelcontextprotocol/server-filesystem` | 2 / 14 | n/a | n/a | 18 | FAIL (12 tools) |
| `@modelcontextprotocol/server-memory` | 9 / 9 | n/a | n/a | 4 | **PASS** |
| `@modelcontextprotocol/server-fetch` | — | — | — | — | npm 404 |
| `@modelcontextprotocol/server-sequentialthinking` | — | — | — | — | npm 404 |

## Findings

### 1. Two of five advertised servers do not exist on npm

`server-fetch` and `server-sequentialthinking` return **404 on npm**. These packages are referenced in MCP documentation and widely copy-pasted into Claude Desktop configs, but the names are wrong or the packages were unpublished / renamed. Users silently fail to install.

**Blog angle:** A concrete example of why you'd want a pre-integration health check — the server never even starts, and you get a clear error instead of a mysterious Claude Desktop crash.

### 2. server-filesystem — 12 / 14 tools fail because of argument semantics

mcp-probe auto-generated `"test"` as the value for required `path` arguments. The filesystem server needs actual filesystem paths under the root `/tmp` we passed. This is a known limitation documented in the README — but also **a real signal**: the server's tool descriptions don't guide the test-argument generator (no `default`, no `examples`, schema property has no `description`).

**Blog angle:** "Your server's schema annotations are load-bearing. Missing `description` fields silently break automated testing."

### 3. server-everything — `resource-prompt` prompt fails

```
FAIL resource-prompt — A prompt that includes an embedded resource reference (1ms)
     MCP error -32603: Invalid resourceType: test. Must be Text or Blob.
```

Same argument-generation issue — our generic `"test"` string hit the prompt's `resourceType` enum constraint. mcp-probe could catch this earlier by reading the enum.

**Blog angle:** "Enums are your first line of defense — mcp-probe should respect them (roadmap).”

### 4. server-memory — perfect pass

9 / 9 tools callable. Clean model for how a well-annotated server looks from a health-check perspective. Use as the "gold standard" example in the blog.

## Roadmap items this run surfaced

- [ ] Auto-read `enum` constraints when generating sample arguments (currently only reads `default` and infers from property name)
- [ ] Auto-infer filesystem-path arguments when property name is `path` + server looks filesystem-shaped
- [ ] Detect "server process exited before handshake" and show a concise error instead of the full npm 404 dump
- [ ] Add `--sample-args <file.json>` flag so server authors can provide canonical test inputs

## Raw outputs

- `server-everything.txt`
- `server-filesystem.txt`
- `server-memory.txt`
- `server-fetch.txt` (npm 404)
- `server-sequentialthinking.txt` (npm 404)
