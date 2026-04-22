# Heads-up issue: server-filesystem (modelcontextprotocol/servers)

**Repo:** https://github.com/modelcontextprotocol/servers
**Filed by:** PengSpirit
**Filed before:** Apr 25, 2026 (72h before Apr 29 launch of mcp-probe)

---

## Title

Schema gap: 18 properties on filesystem-server tools have no `description` field

## Body

Hi — running diagnostic tools (in this case [mcp-probe](https://github.com/PengSpirit/mcp-doctor)) against `@modelcontextprotocol/server-filesystem@2026.1.14` surfaces 18 schema warnings, all of the form *"Property X on tool Y is missing a description."* Filing a friendly heads-up because we're about to publish a public scorecard that includes this server.

This is a **constructive observation, not a server bug** — the tools work correctly. The issue is that without per-property descriptions, automated callers (LLMs, IDE autocomplete, health checkers) can't distinguish "this `path` arg expects a file path" from "this `path` arg expects a directory path." mcp-probe's pass rate against this server jumped from 2/14 → 8/14 once we wrote a workaround that probes `list_allowed_directories` first, but the residual 6 failures are still client guessing because the schema doesn't tell us file-vs-directory.

The complete warning list:

```
read_file — Property "path" missing description
read_text_file — Property "path" missing description
read_media_file — Property "path" missing description
write_file — Property "path" missing description
write_file — Property "content" missing description
edit_file — Property "path" missing description
edit_file — Property "edits" missing description
create_directory — Property "path" missing description
list_directory — Property "path" missing description
list_directory_with_sizes — Property "path" missing description
directory_tree — Property "path" missing description
directory_tree — Property "excludePatterns" missing description
move_file — Property "source" missing description
move_file — Property "destination" missing description
search_files — Property "path" missing description
search_files — Property "pattern" missing description
search_files — Property "excludePatterns" missing description
get_file_info — Property "path" missing description
```

**Suggested fix:** add a one-line `description` to each property in the JSON schema. For path args, even just `"description": "Absolute path to a file"` vs `"description": "Absolute path to a directory"` would let any automated caller pick the right argument shape.

I'm happy to send a PR if helpful — let me know either way. We'll mention this finding (without naming the server as "broken") in the launch post so other maintainers can run the same check on their servers.

Repro:
```bash
npx -y @incultnitollc/mcp-probe test "npx -y @modelcontextprotocol/server-filesystem /tmp"
```

Thanks for shipping the reference servers — they're the why-MCP-works-at-all argument.
