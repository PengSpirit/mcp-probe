#!/usr/bin/env bash
#
# scripts/launch.sh — open prefilled submission URLs in the order Peng
# should hit them on launch day. The actual Submit click stays manual.
#
# Channels (in order):
#   1. Show HN          — https://news.ycombinator.com/submit  (paste manually)
#   2. r/mcp            — prefilled title + body from docs/launch/reddit-mcp.md
#   3. r/ClaudeAI       — prefilled title + body from docs/launch/reddit-claudeai.md
#   4. Twitter intent   — first tweet of docs/launch/twitter-thread.md
#   5. Discord          — printed reminder; copy docs/launch/discord.md by hand
#
# Cross-platform-ish: prefers macOS `open`, falls back to `xdg-open` on Linux.

set -euo pipefail

# ── Resolve repo root from this script's location ───────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DOCS_DIR="${REPO_ROOT}/docs/launch"

REPO_URL="https://github.com/PengSpirit/mcp-doctor"

# ── Pick a browser-opener for this OS ───────────────────────────────────────
if command -v open >/dev/null 2>&1; then
  OPENER="open"
elif command -v xdg-open >/dev/null 2>&1; then
  OPENER="xdg-open"
else
  echo "ERROR: no 'open' (macOS) or 'xdg-open' (Linux) found in PATH." >&2
  echo "       Install one or open the URLs printed below manually." >&2
  exit 1
fi

# ── URL-encode a string. Prefers python3 (always present on macOS),
#    falls back to jq if available. Stdin in, encoded string out. ────────────
url_encode() {
  if command -v python3 >/dev/null 2>&1; then
    python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.stdin.read()))"
  elif command -v jq >/dev/null 2>&1; then
    jq -sRr @uri
  else
    echo "ERROR: need python3 or jq for URL encoding." >&2
    exit 1
  fi
}

require_file() {
  local f="$1"
  if [ ! -f "$f" ]; then
    echo "ERROR: missing required file: $f" >&2
    exit 1
  fi
}

require_file "${DOCS_DIR}/reddit-mcp.md"
require_file "${DOCS_DIR}/reddit-claudeai.md"
require_file "${DOCS_DIR}/twitter-thread.md"
require_file "${DOCS_DIR}/discord.md"

open_url() {
  local label="$1"
  local url="$2"
  echo "  → ${label}"
  "${OPENER}" "${url}"
  sleep 2
}

# ── 1. Show HN ──────────────────────────────────────────────────────────────
echo ""
echo "Opening Show HN submit page..."
echo "  Paste title:  Show HN: Mcp-probe – one command to health-check any MCP server"
echo "  Paste URL:    ${REPO_URL}"
open_url "Show HN" "https://news.ycombinator.com/submit"

# ── 2. r/mcp ────────────────────────────────────────────────────────────────
echo ""
echo "Opening r/mcp submit page (title + body prefilled)..."
REDDIT_MCP_TITLE="mcp-probe — one command to test any MCP server"
REDDIT_MCP_BODY_RAW="$(cat "${DOCS_DIR}/reddit-mcp.md")"
REDDIT_MCP_TITLE_ENC="$(printf '%s' "${REDDIT_MCP_TITLE}" | url_encode)"
REDDIT_MCP_BODY_ENC="$(printf '%s' "${REDDIT_MCP_BODY_RAW}" | url_encode)"
open_url "r/mcp" \
  "https://old.reddit.com/r/mcp/submit?title=${REDDIT_MCP_TITLE_ENC}&text=${REDDIT_MCP_BODY_ENC}"

# ── 3. r/ClaudeAI ───────────────────────────────────────────────────────────
echo ""
echo "Opening r/ClaudeAI submit page (title + body prefilled)..."
REDDIT_CLAUDE_TITLE="I made a tool to vet MCP servers before you add them to Claude Desktop"
REDDIT_CLAUDE_BODY_RAW="$(cat "${DOCS_DIR}/reddit-claudeai.md")"
REDDIT_CLAUDE_TITLE_ENC="$(printf '%s' "${REDDIT_CLAUDE_TITLE}" | url_encode)"
REDDIT_CLAUDE_BODY_ENC="$(printf '%s' "${REDDIT_CLAUDE_BODY_RAW}" | url_encode)"
open_url "r/ClaudeAI" \
  "https://old.reddit.com/r/ClaudeAI/submit?title=${REDDIT_CLAUDE_TITLE_ENC}&text=${REDDIT_CLAUDE_BODY_ENC}"

# ── 4. Twitter/X intent ─────────────────────────────────────────────────────
# First tweet of the thread. We grep the first fenced code block in
# twitter-thread.md (that's tweet 1/), strip the fence, then append the repo URL.
echo ""
echo "Opening Twitter compose (tweet 1 of thread prefilled)..."
TWEET_1="$(awk '
  /^```/ { in_block = !in_block; if (!in_block && captured) exit; next }
  in_block { print; captured = 1 }
' "${DOCS_DIR}/twitter-thread.md")"
# Trim leading/trailing blank lines
TWEET_1="$(printf '%s' "${TWEET_1}" | sed -e '/./,$!d' -e :a -e '/^$/{$d;N;ba' -e '}')"
TWEET_TEXT="${TWEET_1}

${REPO_URL}"
TWEET_ENC="$(printf '%s' "${TWEET_TEXT}" | url_encode)"
open_url "Twitter intent" "https://twitter.com/intent/tweet?text=${TWEET_ENC}"

# ── 5. Discord — manual reminder ────────────────────────────────────────────
echo ""
echo "Discord: copy docs/launch/discord.md manually into the MCP Discord #show-and-tell channel."
echo "         (Discord has no submission URL — paste the message body yourself.)"
echo ""

# ── Launch checklist printout ───────────────────────────────────────────────
cat <<'CHECKLIST'

────────────────────────────────────────────────────────────
  LAUNCH-DAY REPLY WINDOWS — keep these tabs open
────────────────────────────────────────────────────────────
  Show HN     reply window  : 30 minutes per comment, 4 hrs straight
  r/mcp       reply window  : 1 hour per comment, 4 hrs of attention
  r/ClaudeAI  reply window  : 1 hour per comment (mods strict on self-promo)
  Twitter     reply window  : 48 hours, every reply, no exceptions
  Discord     reply window  : 48 hours, no DMing maintainers for boosts

  Order checked off today:
    [ ]  1. Discord (do this FIRST, AM PT, MCP community channel)
    [ ]  2. Show HN  (8–10am ET Tue/Wed)
    [ ]  3. r/mcp    (immediately after HN)
    [ ]  4. r/ClaudeAI (parallel with r/mcp)
    [ ]  5. Twitter thread + pin tweet 1

  Hard rules:
    - No emoji on HN. No exclamation marks. No "excited to announce".
    - Do NOT @ Anthropic staff asking for boosts.
    - Do NOT cross-post to multiple Discord channels.
    - If a maintainer asks you to test their server — do it on the spot.
────────────────────────────────────────────────────────────

CHECKLIST
