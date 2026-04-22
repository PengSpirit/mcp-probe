# Heads-up issue: server-everything (modelcontextprotocol/servers)

**Repo:** https://github.com/modelcontextprotocol/servers
**Filed by:** PengSpirit
**Filed before:** Apr 25, 2026 (72h before Apr 29 launch of mcp-probe)

---

## Title

`get-resource-reference` prompt: `resourceType` arg is missing a description, blocks automated invocation

## Body

Hi — running [mcp-probe](https://github.com/PengSpirit/mcp-probe) against `@modelcontextprotocol/server-everything@2026.1.26` surfaces one schema warning that becomes a hard failure when the prompt is invoked:

```
WARN  get-resource-reference — Property "resourceType" missing description
FAIL  resource-prompt — MCP error -32603: Invalid resourceType: test. Must be Text or Blob.
```

The server correctly enforces the enum, but because MCP prompt arguments don't carry a JSON schema (only `name` / `description` / `required`), there's no machine-readable way for a caller to know that `resourceType` accepts only `Text` or `Blob`. The convention is to encode allowed values in the `description` (e.g. *"Type of resource. Must be `Text` or `Blob`."*). Without that, every automated caller has to guess.

**Suggested fix:** populate the `description` field on the `resourceType` argument of the `get-resource-reference` prompt with prose that names the allowed values, e.g. `"Type of resource — must be 'Text' or 'Blob'."`

mcp-probe already has a fallback heuristic that extracts allowed values from descriptions matching `"must be X or Y"` / `"one of: X"` (commit `3825170` in the mcp-probe repo). Once the description is filled in, this prompt would pass cleanly.

This is a **schema-completeness issue, not a server bug** — the server itself works correctly. Filing a friendly heads-up because we're about to publish a scorecard that includes this finding, and want maintainers to have time to respond.

Repro:
```bash
npx -y @incultnitollc/mcp-probe test "npx -y @modelcontextprotocol/server-everything"
```

Thanks for `server-everything` — it's the most useful integration test target in the ecosystem precisely because it exercises every protocol corner.
