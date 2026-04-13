# mcp-doctor

**One command to diagnose your MCP server.**

Tests every tool, resource, and prompt your server exposes — then gives you a health report with a pass/fail scorecard.

<p align="center">
  <img src="demo.gif" alt="mcp-doctor demo" width="800" />
</p>

```
npx mcp-doctor test "npx -y @modelcontextprotocol/server-everything"
```

## What it does

| Check | Description |
|-------|-------------|
| **Tool calling** | Calls every tool with auto-generated sample arguments based on the input schema |
| **Resource reading** | Reads every resource and verifies content is returned |
| **Prompt rendering** | Gets every prompt with sample arguments and verifies messages are returned |
| **Schema validation** | Checks tool schemas for missing descriptions, broken required fields, malformed types |
| **Health scoring** | Summarizes everything into a pass/fail scorecard |

## Install

```bash
npm install -g mcp-doctor
```

Or run directly:

```bash
npx mcp-doctor test "your-server-command"
```

## Usage

### Local stdio server

```bash
npx mcp-doctor test "npx -y @modelcontextprotocol/server-everything"
```

### Remote server (Streamable HTTP)

```bash
npx mcp-doctor test https://your-server.example.com/mcp
```

### Remote server (SSE)

```bash
npx mcp-doctor test https://your-server.example.com/mcp --transport sse
```

### Authenticated remote server

```bash
npx mcp-doctor test https://your-server.example.com/mcp \
  --header "Authorization: Bearer $TOKEN"
```

### Options

| Flag | Description |
|---|---|
| `--json` | Output results as JSON |
| `--timeout <ms>` | Per-operation timeout (default 30000) |
| `--transport <kind>` | Force `stdio`, `sse`, or `http` (auto-detected from target) |
| `--header <Name: value>` | Add header to remote transport. Repeatable. |

### Exit codes

- `0` — All checks passed
- `1` — One or more checks failed (useful for CI gates)

### JSON output

Use `--json` to get structured output for automation:

```bash
mcp-doctor test --json "your-server" | jq '.score'
```

```json
{
  "toolsCallable": 12,
  "toolsTotal": 13,
  "resourcesReadable": 7,
  "resourcesTotal": 7,
  "promptsGettable": 3,
  "promptsTotal": 4,
  "schemaErrors": 0,
  "schemaWarnings": 1
}
```

## How tool calling works

mcp-doctor auto-generates arguments for each tool based on its `inputSchema`:

- Only **required** fields get values (safest approach)
- Uses `default` values and `enum` first choices when available
- Infers smart defaults from field names (`url` → `https://example.com`, `email` → `test@example.com`)
- Falls back to type-appropriate defaults (`string` → `"test"`, `number` → `1`, `boolean` → `false`)

This means tools with complex required inputs may fail — and that's useful information. It tells you your tool isn't self-contained enough for automated testing.

## Use cases

- **MCP server development** — Run mcp-doctor in your test suite to catch regressions
- **CI/CD gates** — Block deploys if your MCP server doesn't pass health checks
- **Server evaluation** — Quickly assess third-party MCP servers before integrating them
- **Schema quality** — Find missing descriptions and malformed schemas before users hit them

## Development

```bash
git clone https://github.com/PengSpirit/mcp-doctor.git
cd mcp-doctor
npm install
npm run dev -- test "npx -y @modelcontextprotocol/server-everything"
npm test
```

## License

MIT - [Incultnito Studios LLC](https://github.com/PengSpirit)
