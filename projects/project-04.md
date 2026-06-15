# Project 04. Use Runtime Feedback to Correct Agent Behavior

> Related lectures: Lecture 07 (Draw clear task boundaries for agents) · Lecture 08 (Use feature lists to constrain what the agent does)

## What You Do

Add runtime observability (startup logs, import/indexing logs, error states) and architecture constraints that prevent cross-layer violations. Then plant a runtime bug and have the agent fix it — using the logs and boundary checks, not blind code reading.

You compare a checked-in starter and solution: the starter has weak diagnostics and no architecture-guard script, while the solution adds structured logs, boundary checks, and the bug fix.

### Steps

1. Add a structured logger covering startup, document import, and incremental indexing — including explicit error states.
2. Write an `ARCHITECTURE.md` that names the layer boundaries, plus a `check-architecture.sh` that fails when a layer reaches across a boundary it shouldn't.
3. Seed a runtime defect (e.g. large-file chunking fails) and let the agent locate the root cause from the logs.
4. Fix `indexing-service.ts` minimally; confirm the architecture check stays green and the fix is non-invasive.

### Deliverables

- `src/services/logger.ts` — structured, level-tagged runtime logging
- `scripts/check-architecture.sh` — automated boundary guard
- `docs/ARCHITECTURE.md` — the boundary contract the script enforces
- A minimal, evidence-backed fix to `src/services/indexing-service.ts`
- `clean-state-checklist.md` passing after the fix

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron

## Harness Mechanism

Runtime feedback + scope control + incremental indexing

## Use the Checked-In Project

Repository path: `projects/project-04/`

| Directory | What it contains | What to compare |
|------|------|------|
| `starter/` | Project 03 code with weak diagnostics. A seeded indexing defect can make large-file chunking fail, and there is no architecture-check script. | How long the agent takes to find the root cause without runtime signals. |
| `solution/` | Structured logger, architecture boundary docs and script, fixed chunking logic, and `clean-state-checklist.md`. | Whether logs and boundary checks make the fix faster and less invasive. |

Concrete files to inspect: `solution/src/services/logger.ts`, `solution/scripts/check-architecture.sh`, `solution/docs/ARCHITECTURE.md`, `solution/src/services/indexing-service.ts`.

## Success Criteria

- Root cause is found from runtime signals (logs/error states), not by reading the whole tree.
- The architecture-check script fails on a boundary violation and passes once the code respects layers.
- The bug fix is minimal and scoped to the indexing service — no drive-by changes.
- The fix is faster and less invasive with the harness than without it (compare starter vs solution).

## How I'd do this in my harness

This project is "incremental indexing + make the runtime observable so debugging is fast." My harness has a literal implementation of both halves:

- **Incremental indexing IS context-mode.** The `ctx_fetch_and_index` / `ctx_batch_execute` / `ctx_execute` / `ctx_search` tools are an incremental indexing pipeline: each command output is chunked, indexed into FTS5, and queried on demand. Instead of building a bespoke indexer for the assignment, I'd point context-mode at the document corpus and the logs, then derive answers with `ctx_execute` (Think-in-Code) so raw bytes never burn my context window.
- **Runtime observability** → for any LLM/agent runtime I route traces to **Langfuse** (langfuse MCP: `listObservations`, `queryMetrics`, `getObservation`), which gives me startup/import/indexing spans and error states without hand-rolling a logger. For the app layer, `claude-mem` auto-captures runtime errors, decisions, and tool failures as searchable observations — that's my structured-log substitute across sessions.
- **Finding root cause from signals, not code-reading** → `superpowers:systematic-debugging` (and the `investigate` skill) enforces the Iron Law: no fix without a reproduced root cause. I'd reproduce the chunking failure, read the failing span/log, form a hypothesis, and only then edit. The `bash-guard` hook keeps the reproduction commands safe.
- **Architecture boundary guard** → `check-architecture.sh` maps onto a CI-style guard I'd add to the `health` skill / `repo-engineering-review`: a script that greps for illegal cross-layer imports and fails the build. The `freeze`/`guard` skills additionally scope edits to one module so the fix can't sprawl across layers.
- **Minimal, TDD'd fix** → global `CLAUDE.md` TDD: write the failing test that reproduces the large-file chunking bug (RED), make it pass with the smallest change (GREEN), keep the architecture check green. `uv` for any Python tooling.
- **Clean state** → `verification-before-completion` + `finishing-a-development-branch` close it out with tests, types, and the boundary check all green.

Net: the assignment's logger + architecture script map onto context-mode incremental indexing, Langfuse/claude-mem observability, the systematic-debugging skill, and a health-style boundary guard — with TDD keeping the fix minimal.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/projects/project-04-incremental-indexing/
