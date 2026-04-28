# Migrating to `@incultnitollc/mcp-probe@1.0.0`

`mcp-probe` changed npm scopes on **2026-04-23**. If you were installing `@incultnitostudiosllc/mcp-probe`, switch to `@incultnitollc/mcp-probe`. The old scope is deprecated and will not receive further updates.

## Why the rename

The prior scope `@incultnitostudiosllc` referenced a Wyoming LLC name (“Incultnito Studios LLC”) that had not been approved by the Wyoming Secretary of State. The approved legal entity is **Incultnito LLC**, so `mcp-probe` now ships under a scope tied to that entity. Nothing else about the project — author, license, source, or maintenance cadence — has changed.

## CLI users

One-liner change. Wherever you had:

```bash
npx -y @incultnitostudiosllc/mcp-probe test "your-server-command"
# or
npm install -g @incultnitostudiosllc/mcp-probe
```

Use:

```bash
npx -y @incultnitollc/mcp-probe test "your-server-command"
# or
npm install -g @incultnitollc/mcp-probe
```

All CLI flags, subcommands (`test`, `bench`, `watch`), transports (stdio / SSE / Streamable HTTP), output formats (`--json`, `--html`), and exit codes are unchanged.

Pin the version in CI to avoid silent behavior changes:

```bash
npx -y @incultnitollc/mcp-probe@1.0.0 test "node dist/index.js"
```

## Library users

**Library mode is new in `1.0.0`.** If you were shelling out to the CLI and parsing stdout, you can now import `inspectServer` directly.

Install:

```bash
npm install @incultnitollc/mcp-probe
```

Use (ESM / Node 20+):

```ts
import {
  inspectServer,
  parseTarget,
  createTransport,
  type InspectResult,
} from "@incultnitollc/mcp-probe";

const spec = parseTarget("npx -y @modelcontextprotocol/server-everything");
const transport = createTransport(spec);

const result: InspectResult = await inspectServer(transport, {
  json: false,
  timeout: 30_000,
  silent: true,  // suppress spinners + stdout; the return value is authoritative
});

console.log(result.score);
```

Named exports available from the package root and `./lib` subpath:

- `inspectServer`
- `benchServer`
- `parseTarget`
- `createTransport`
- `checkCompliance`
- Types: `InspectResult`, `InspectOptions`, `ToolInfo`, `ToolCallResult`, `ResourceInfo`, `ResourceReadResult`, `PromptInfo`, `PromptGetResult`, `ComplianceIssue`, `SchemaIssue`, `BenchResult`, `BenchToolResult`, `BenchOptions`, `TransportKind`, `StdioTargetSpec`, `HttpTargetSpec`, `TargetSpec`.

## Breaking changes summary

| Area | `0.2.1` (old scope) | `1.0.0` (new scope) |
|---|---|---|
| Package name | `@incultnitostudiosllc/mcp-probe` | `@incultnitollc/mcp-probe` |
| `main` | `./dist/index.js` (CLI + library merged) | `./dist/lib.js` (pure library) |
| `bin.mcp-probe` | `./dist/index.js` | `./dist/cli.js` |
| `silent` option | n/a | `InspectOptions.silent?: boolean` |
| Deep imports like `@incultnitostudiosllc/mcp-probe/dist/...` | worked | now use the package root or `./lib` subpath |

## No-op migrations

- Config files, environment variables, target strings, report schemas, exit codes — **no changes**.
- GitHub issue links, release pages, and old README URLs continue to resolve via GitHub's permanent redirect.

If you hit anything that isn't covered here, open an issue: <https://github.com/incultnitollc/mcp-probe/issues>.
