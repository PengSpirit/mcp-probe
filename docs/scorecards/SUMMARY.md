# Scorecard Summary — 2026-04-19

Re-run of `@incultnitollc/mcp-probe@1.0.0` after the 2026-04-17 integrity audit. Every failure here has been classified as **server-side** or **client-side limit** — no fragile claims left in this file.

## Results

| Server | Tools | Resources | Prompts | Schema warns | Status |
|---|---|---|---|---|---|
| `@modelcontextprotocol/server-memory` | 9 / 9 | n/a | n/a | 4 | **PASS** |
| `@modelcontextprotocol/server-sequential-thinking` | 1 / 1 | n/a | n/a | 0 | **PASS** |
| `@modelcontextprotocol/server-everything` | 12 / 13 | 7 / 7 | 3 / 4 | 1 | partial |
| `@modelcontextprotocol/server-filesystem` | 8 / 14 | n/a | n/a | 18 | partial |

**Aggregate:** 30 / 37 tools callable across 4 servers (81%). 2 / 4 servers fully pass.

> **Scope note.** Anthropic's `fetch` MCP server is Python-only (installed via `uvx mcp-server-fetch`); it has never been published to npm. Earlier launch copy that called `server-fetch` "broken on npm" was wrong and has been removed. mcp-probe itself works against any stdio MCP server regardless of language — only this scorecard run is scoped to the official Node servers.

## Findings

Every remaining failure traces to **missing `description` fields on schema properties**. The server is working as designed; mcp-probe needs a hint to generate a valid argument and the schema doesn't give one.

### 1. server-memory — clean pass (9 / 9)

Use as the gold standard. Every required property has a description. mcp-probe needs no special knowledge.

### 2. server-sequential-thinking — clean pass (1 / 1)

Single-tool server, fully described. Passes.

### 3. server-everything — 12 / 13 tools, 3 / 4 prompts

| Failure | Cause | Owner |
|---|---|---|
| Tool `simulate-research-query` | Requires `client.experimental.tasks.callToolStream()` — mcp-probe only uses `callTool()`. | mcp-probe — task-based execution is roadmap |
| Prompt `resource-prompt` | `resourceType` arg has **no `description`**, so the heuristic that extracts `"Must be Text or Blob"` from prose has nothing to read. Server returns `Invalid resourceType: test`. | server-everything — schema warn already raised |

The schema validator caught the missing description on `resourceType` before the call ever fired (`WARN  get-resource-reference — Property "resourceType" missing description`). That's the diagnostic working as intended.

### 4. server-filesystem — 8 / 14 tools

After commit `ce4f55e` (sandbox-aware paths), pass rate jumped from 2 / 14 to 8 / 14. The 6 remaining failures are all client-side limits, NOT server bugs:

| Tool | Cause |
|---|---|
| `read_file`, `read_text_file`, `read_media_file`, `edit_file` | Param `path` has no description, so mcp-probe defaults to the allowed directory itself → server correctly returns `EISDIR`. |
| `write_file` | Same — `path` resolves to a directory, write attempt hits `EACCES` on tmp-file creation. |
| `move_file` | `source` and `destination` both default to the same allowed dir → `EACCES` on a no-op rename. |

**18 schema warnings** on this server, all "missing description on property". Fixing those descriptions would let mcp-probe distinguish file-args from directory-args automatically.

## The launch hook (revised)

> *"Out of the four official Node MCP servers, two pass mcp-probe clean. The other two reveal the same issue: when servers ship without parameter descriptions, every automated tool — mine, your IDE's autocomplete, and any LLM trying to call the tool — has to guess. mcp-probe surfaces exactly which params need better docs."*

This is honest, useful to maintainers, and links naturally to "schema descriptions are load-bearing for AI coding tools."

> **Footnote.** The one tool gap on the mcp-probe side — `simulate-research-query` in server-everything — is a client-side limit, not a missing-description issue. It needs `client.experimental.tasks.callToolStream()`, which mcp-probe doesn't wire up yet. Shipping this is on the v0.3 roadmap; the 12/13 number above reflects that gap transparently.

## Roadmap items this run surfaced

- [ ] Task-based execution support (`callToolStream`) for tools that require it — would make `simulate-research-query` pass
- [ ] Detect missing-description failures and report them as a distinct category, separate from server bugs
- [ ] `--sample-args <file.json>` flag so server authors can supply canonical test inputs and bypass the heuristics entirely
- [ ] Auto-read prompt-argument enums from prose like `"one of: X, Y"` — partially shipped in commit `3825170`, could be tightened

## Raw outputs

- `server-everything.txt`
- `server-filesystem.txt`
- `server-memory.txt`
- `server-sequential-thinking.txt`
