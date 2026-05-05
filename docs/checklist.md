# MCP Server Pre-Publish Checklist

A community-maintained checklist for shipping a Model Context Protocol (MCP) server to npm, PyPI, or any other registry. Written for maintainers who want their server to work the first time a user installs it from Claude Desktop, Cursor, or any MCP-compatible client.

This is not an Anthropic spec. It's a working list compiled from running automated checks against the four official Anthropic Node MCP servers and from reading every issue thread on `modelcontextprotocol/servers` between 2025-11 and 2026-04. If you maintain an MCP server and disagree with anything here, open a PR — the canonical source is [`docs/checklist.md` in the mcp-probe repo](https://github.com/incultnitollc/mcp-probe/blob/main/docs/checklist.md).

The seven sections below correspond to the seven categories where MCP servers most commonly break in the wild. Each item ends with a one-line check you can run before publishing.

---

## 1. Schema hygiene

The schema is the contract between your server and every LLM that calls it. The model never sees your README — it sees `inputSchema.properties` and the `description` field on each property. A missing description is a missing instruction, and the model will fill the gap by guessing.

- [ ] **Every input property has a `description`.** Not "todo", not blank, not omitted. Treat the description as the parameter's docstring. The model will paraphrase it back to the user when explaining what your tool does.
- [ ] **Enums are enums in the schema, not in prose.** If a parameter accepts `"Text"` or `"Blob"`, declare `"enum": ["Text", "Blob"]`. Do not bury the allowed values in a description string — many automated callers will not parse them out.
- [ ] **Required fields are listed in `required: []`.** Optional parameters need a default — either via `default:` in the schema or a clear "Optional. Defaults to X." in the description.
- [ ] **Path-shaped parameters say so.** A parameter named `path` with description `"file path"` is ambiguous: file path, directory path, absolute, relative? Spell it out: `"absolute path to a file inside the allowed directory; never a directory"`.
- [ ] **`additionalProperties: false`** on every input schema unless you genuinely accept arbitrary keys. Without this, clients that send extra fields will succeed when you intended a 400.
- [ ] **Examples in the schema, not just the README.** `examples: ["/Users/me/notes.md"]` on a path-shaped property cuts the model's failure rate on the first call.
- [ ] **Tool names are stable.** Renaming a tool in a minor version is a breaking change for every saved Claude Desktop workflow that references the old name. Treat tool names like CLI flags.

**Self-check:**
```bash
# Reject if any property is missing a description
jq '.. | objects | select(has("properties")) | .properties | to_entries[] | select(.value.description == null or .value.description == "") | .key' src/schemas/*.json
```

---

## 2. Transport hygiene

MCP supports stdio, Server-Sent Events (SSE), and Streamable HTTP. The protocol is the same; the framing is not. A server that works in stdio against Claude Desktop will fail in SSE against a remote agent if framing leaks.

- [ ] **`server.connect()` is awaited before any work happens.** Premature writes to stdout corrupt the JSON-RPC stream and leave the client waiting on initialize forever.
- [ ] **No raw `console.log` in production code paths.** Every log goes through `server.sendLoggingMessage()` or to stderr. stdout is reserved for protocol frames.
- [ ] **The initialize handshake declares accurate capabilities.** Don't claim `tools` if you list none. Don't claim `resources` if `resources/list` will return empty. Clients use this to decide what UI to render.
- [ ] **`logging` capability is declared if you ever call `sendLoggingMessage`.** Some clients silently drop logs from servers that didn't advertise the capability.
- [ ] **The server exits cleanly on stdin EOF.** When the client process dies, your server should die with it — not orphan and retain a port or file lock.
- [ ] **Streamable HTTP servers expose `/sse` (legacy) AND `/mcp` (current).** Both are documented in the spec and both will see real-world traffic for at least the next year.
- [ ] **CORS is set if the server speaks HTTP.** Browser-based clients need it. Server-side clients don't care, but the cost of setting it is zero.

**Self-check:**
```bash
# In a sandbox, send an initialize, expect capabilities, then close stdin.
# The process should exit within 1 second.
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"test","version":"0"}}}' | timeout 5 node dist/index.js
```

---

## 3. Resource & Prompt sanity

Tools get most of the attention. Resources and prompts are quieter and break in quieter ways.

- [ ] **`resources/list` returns valid URIs.** Every URI is parseable, every scheme is one your server actually serves. Don't return a `https://` URI for a resource only readable via your `file://` handler.
- [ ] **`resources/read` returns `contents` with declared `mimeType`.** Default `text/plain` is fine if the content is plaintext. Lying about MIME type breaks any client that does content-type-based routing.
- [ ] **`resources/templates/list` is implemented when you support template URIs.** Otherwise clients can't tell which templates you accept.
- [ ] **Prompt arguments are described.** A prompt with `arguments: [{name: "topic"}]` and no description gives the model nothing to work with. Prompts are tools that return messages — the same schema-hygiene rules apply.
- [ ] **Prompts return well-formed `messages: [{role, content}]`.** `role` is `"user"` or `"assistant"`, never anything else. `content` is a string or a structured `[{type: "text", text: "..."}]` array — never both, never null.

**Self-check:**
```bash
# List + read the first resource, expect a non-empty contents array.
mcp-probe test "node dist/index.js" --filter resources
```

---

## 4. Error handling

Failures are the part of the protocol most servers get most wrong. Clients route on error shape; a malformed error tells the model "the tool is broken," not "the tool was called wrong."

- [ ] **Every tool wraps its handler in try/catch and returns `isError: true`.** Throwing inside a handler crashes the process and breaks the connection. Return `{ content: [...], isError: true }` instead.
- [ ] **Error `content` is human-readable.** The text inside an error response is what the model sees and what the model relays to the user. "EISDIR" is meaningless to a non-Unix user; "the path you provided is a directory, but this tool only reads files" is actionable.
- [ ] **JSON-RPC errors use the right code.** `-32600` invalid request, `-32601` method not found, `-32602` invalid params, `-32603` internal error. Don't use `-32603` for everything — clients with retry logic differentiate by code.
- [ ] **Validation failures fire BEFORE work starts.** A tool that reads 5 GB then errors on a missing field is wasting bandwidth. Validate input shape first.
- [ ] **Concurrent calls are safe.** MCP clients pipeline. If your tool mutates global state, two concurrent calls must not corrupt it. The tests for this are unglamorous and almost no server has them.

**Self-check:**
```bash
# Send a deliberately wrong call. Expect isError: true, not a process crash.
mcp-probe test "node dist/index.js" --negative
```

---

## 5. Distribution metadata

The npm or PyPI page is the second thing a user sees, after the README. Most users skim. The metadata is the skim layer.

- [ ] **`description` field is keyword-loaded, not brand-voiced.** "MCP server for X — Y, Z, and W" beats "An elegant approach to integration." Models indexing the registry will quote your description verbatim when answering "is there an MCP server for X?".
- [ ] **`keywords` includes `mcp` AND `model-context-protocol`.** Both. Different users search both. Add the noun for what your server actually does (`postgres`, `slack`, `filesystem`, etc.).
- [ ] **`bin` entry matches the install instructions.** If your README says `npx my-mcp-server` and your `bin` is `mcp-server`, the install will fail and the user will assume your package is broken.
- [ ] **`engines.node` is set to a version that exists.** `"node": ">=18"` is fine. `"node": "^99"` is a typo that will block every install.
- [ ] **License is set.** MIT or Apache-2.0 are the community defaults. No license = legally unusable in any company codebase.
- [ ] **Repository URL resolves.** `package.json` `repository.url` should 200 when curled. Broken or moved repos lose discovery to forks.
- [ ] **Versioned releases are tagged.** `npm publish` without a matching `git tag v1.2.3` makes diffing painful for the first user who hits a bug.

**Self-check:**
```bash
npm view <your-package> | grep -E "description|keywords|bin|repository"
```

---

## 6. Security

Half of MCP servers expose the filesystem, a database, or a remote API. Default-deny is the only safe default.

- [ ] **No environment variables logged.** Not at debug level, not "just for development." A misconfigured logger has shipped database passwords to npm registries before.
- [ ] **API keys validated at startup, not on first call.** A server that starts successfully then errors on every tool call because the API key is missing is a worse user experience than one that refuses to start.
- [ ] **Path-accepting tools enforce an allowed-directory sandbox.** `realpath` the input, compare to an allowlist, refuse symlink escapes. The official `server-filesystem` is the reference implementation.
- [ ] **SQL-accepting tools refuse multi-statement input by default.** A "run this query" tool that allows `; DROP TABLE` is a CTF challenge, not a product.
- [ ] **Outbound HTTP has a timeout.** `fetch()` with no timeout will hang on a slow remote forever and your tool will look broken.
- [ ] **Secrets in transport URIs are stripped from logs.** A connection string like `postgres://user:pass@host/db` should never appear in error output.
- [ ] **No `eval` and no shell-string interpolation.** If you must invoke a subprocess, use `execFile` with an array, never `exec` with a string.

**Self-check:**
```bash
# Grep for the obvious footguns
grep -nE "console\.log\([^)]*process\.env|exec\(|eval\(" src/
```

---

## 7. Pre-publish verification

Run the protocol-level smoke test against your packaged tarball, not against your dev environment. Local `tsx src/index.js` lies to you about a dozen things — `node_modules` resolution, file inclusion, `bin` shebangs, missing `dependencies` declared as `devDependencies`.

- [ ] **`npm pack` then `npm install -g <tarball>` then run the binary.** This is the only way to catch missing files in `files: []` before users do.
- [ ] **Initialize handshake completes against the packaged binary.** If `npx <your-package>` doesn't start within 5 seconds, neither will Claude Desktop's launcher.
- [ ] **Every advertised tool, resource, and prompt is callable.** Not just "the server starts" — every capability you list in `tools/list` should pass at least a smoke call.
- [ ] **Schema warnings are zero, or every warning has a comment explaining why it's intentional.** Warnings are the diagnostic asking you to do the work the model would otherwise have to guess at.
- [ ] **CI runs the same check.** Whatever local check you run before `npm publish`, run it in GitHub Actions on every PR. The check is only valuable if it can't be skipped.

**Self-check (one of several options):**
```bash
# Option A: mcp-probe (CLI, this checklist's reference implementation)
npx @incultnitollc/mcp-probe test "npx -y <your-package>"

# Option B: MCP Inspector (Anthropic's GUI; manual click-through)
npx @modelcontextprotocol/inspector <your-package>

# Option C: mcp-validation (Red Hat; security-focused, JSON-reporting)
# https://github.com/RHEcosystemAppEng/mcp-validation

# Option D: hand-rolled — write a 30-line Node script that starts your server
# in a child process, sends an initialize frame, lists tools, calls each one.
```

The checks above don't substitute for each other — each one finds a different failure class. mcp-probe is fast and CI-friendly; Inspector lets you click through edge cases interactively; mcp-validation pushes harder on security boundaries; a hand-rolled script forces you to confront the protocol directly. If you ship a server that ten thousand people will install, run all four at least once.

---

## What this checklist does NOT cover

- **Performance.** Latency, memory, throughput. These matter, but the failure mode for an unbenchmarked MCP server is "slow," not "broken." Cover it after the seven sections above are clean.
- **Auth.** OAuth, Bearer tokens, mTLS — the spec is still moving. Worth its own checklist, not bolted onto this one.
- **Multi-tenancy.** Most community MCP servers run single-tenant inside a single user's Claude Desktop. If you're shipping a multi-tenant SaaS surface, you have a different problem and a longer checklist.
- **Distribution beyond npm/PyPI.** Docker images, Homebrew formulas, GitHub Releases — same principles, different metadata fields. Adapt as needed.

---

## Versioning

This checklist is versioned with the `mcp-probe` repo. Filing an issue or PR against [`mcp-probe/docs/checklist.md`](https://github.com/incultnitollc/mcp-probe/blob/main/docs/checklist.md) is the canonical way to propose changes. If items get added or removed, the change is logged in `CHANGELOG.md` under the date.

**Last revised:** 2026-05-05.

**Changes welcome from:** maintainers of MCP servers, MCP client implementers, anyone who has hit a real-world bug that traces to a gap in this list.
