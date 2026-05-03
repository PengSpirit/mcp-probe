# mcp-probe vs alternatives

> **Status:** DRAFT scaffold — written 2026-05-03 to lock in the three-lane framing after the Week-1 baseline citation sweep.
> **Fill-in:** Week 3 of the 4-week pre-launch playbook (2026-05-18 → 05-24). Don't publish until then.
> **Don't link from README until "Hard rules" gate (Show HN trigger fires).**

## TL;DR — three lanes, not two

The MCP server testing/validation space is not a duel between mcp-probe and the official MCP Inspector. It's three distinct lanes. Pick the tool that matches your actual workflow.

| Lane | Workflow | Best fit |
|---|---|---|
| **GUI / exploration** | "Click around, see what my server exposes, send a request, watch the response." | **MCP Inspector** (Anthropic), `alpic-ai/grizzly` |
| **Deep-CLI / enterprise validation** | "Validate every transport, OAuth flow, security posture; integrate with Red Hat / regulated environments." | `RHEcosystemAppEng/mcp-validation` |
| **Fast pre-publish CLI / CI** | "I'm about to ship a server. Tell me in 30 seconds if it's broken, and run on every PR." | **`mcp-probe`** |

## mcp-probe vs `RHEcosystemAppEng/mcp-validation`

This is the closer competitor on feature surface — Python-based, pip-installable as `mcp-validation`, similar lane.

| Dimension | `mcp-probe` | `mcp-validation` (Red Hat) |
|---|---|---|
| Language / runtime | Node / npm (`@incultnitollc/mcp-probe`) | Python / PyPI (`mcp-validation`) |
| Setup time | ~30 seconds | OAuth flow setup adds minutes |
| Transports | stdio, HTTP, SSE | stdio, HTTP, SSE |
| OAuth 2.0 (Dynamic Client Reg) | _no — out of scope_ | yes (RFC 7591), full browser flow |
| Container runtime support (`docker`/`podman`) | _no_ | yes |
| Security scanning | _no — out of scope_ | yes (via `mcp-scan` integration) |
| CI/CD exit codes | yes | yes |
| Multi-server scorecards (% conformance across N servers) | **yes — unique** | _no — single-server only_ |
| Pre-publish checklist workflow | yes | _not the primary use case_ |
| License | MIT | MIT |

**Use `mcp-probe` when:** you're a server author about to ship, you need a fast feedback loop, you want to know where you sit against a fleet of reference servers (the scorecard methodology), and your CI pipeline runs in Node.

**Use `mcp-validation` when:** your environment requires OAuth 2.0 Dynamic Client Registration, you need integrated security scanning, you're deploying inside a Red Hat / OpenShift / regulated stack, or you need container-runtime-launched validation.

> **Gap noted, not hidden.** mcp-probe does not currently implement OAuth Dynamic Client Registration or `mcp-scan` integration. If you need those, `mcp-validation` is the right tool — full stop. mcp-probe's bet is that the 80% of authors who don't need OAuth-wrapped enterprise validation are best served by a faster, simpler CLI.

[TODO Week 3: PyPI download volume comparison once metric is captured. If `mcp-validation` >10× `@incultnitollc/mcp-probe` weekly DL, consider whether positioning needs sharpening or scope expansion.]

## mcp-probe vs MCP Inspector

The official MCP Inspector (Anthropic) is the GUI tool for exploring and debugging MCP servers interactively. It is **not** a competitor on the CI/automation lane — it's a peer for a different workflow.

| Dimension | `mcp-probe` | MCP Inspector |
|---|---|---|
| Interface | CLI | Browser-based GUI |
| Workflow | Run once per CI build, exit code drives gate | Sit alongside dev, click through tools |
| Audience | Server authors, CI pipelines, release reviewers | Developers exploring MCP, debugging interactively |
| Output | Health report + scorecard (text, JSON, exit code) | Interactive panes |
| State | Stateless (each invocation is fresh) | Stateful UI session |

**Use `mcp-probe` when:** you want pre-publish/CI gating, automation, repeatable scorecards, or text-output for a release pipeline.

**Use Inspector when:** you're exploring an unfamiliar MCP server, debugging a tool call interactively, or want to see request/response wiring.

> **Built on the same spec.** mcp-probe is built on the Anthropic Model Context Protocol (MCP) spec. Inspector is the official reference implementation for exploration; mcp-probe is the CLI peer for automation. Both belong in a healthy MCP stack.

## When to use which — decision tree

```
Are you running this in CI / before publishing a release?
├── YES → mcp-probe
└── NO
    ├── Do you need OAuth / container runtime / security scanning?
    │   ├── YES → mcp-validation (Red Hat)
    │   └── NO  → continue
    └── Do you want a GUI to click through tools and resources?
        ├── YES → MCP Inspector
        └── NO  → mcp-probe (CLI fallback)
```

## Honest scope-out — what `mcp-probe` deliberately does NOT do

[TODO Week 3: confirm this list against current scope before publish.]

- **Not** an OAuth 2.0 client (use `mcp-validation` if you need RFC 7591 flows).
- **Not** a vulnerability scanner (use `mcp-scan` directly, or `mcp-validation` for integrated scanning).
- **Not** a GUI (use MCP Inspector or `alpic-ai/grizzly`).
- **Not** a registry/marketplace (use the MCP server registry).
- **Not** a runtime/proxy (use the actual MCP transport library).

## Footnotes

- All comparisons are based on README/feature documentation as of 2026-05-03. Tools evolve; verify before relying.
- `alpic-ai/grizzly` is included in the lane table as a GUI alternative but is currently dormant (no commits since 2025-06-05). Status to be re-checked at Week 3 publish time.
- Competitive audit details live in `docs/competitive-notes-2026-05-03.md`.
