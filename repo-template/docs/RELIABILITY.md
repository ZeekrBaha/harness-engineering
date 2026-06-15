# RELIABILITY.md

How the system proves it is healthy and restartable.

## Standard Paths

- Bootstrap: `[command]` (use `uv sync` / `uv run` for Python)
- Verification: `[command]` (full test suite + type/lint, must be green)
- Start app or service: `[command]`
- Debug or inspect runtime: `[command]`

## Required Runtime Signals

- structured logs for startup and critical flows
- health checks for key services
- trace or timing data for slow paths when available
- user-visible error states for recoverable failures

## Golden Journeys

- `[journey 1]`
- `[journey 2]`
- `[journey 3]`

Each golden journey has a repeatable verification path and clear failure
signals. These are the journeys `QUALITY_SCORE.md` grades and that
`repo-engineering-review` checks for evidence.

## Reliability Rules

- No feature is complete if the system cannot restart cleanly afterward.
- Runtime failures should be diagnosable from repo-local signals (and surfaced
  to claude-mem so the next session is primed on them).
- If a repeated failure mode appears, add a benchmark, a test, or a guardrail
  (e.g. a bash-guard rule) for it instead of re-explaining it.
- Cleanup is part of reliability, not a separate concern.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
