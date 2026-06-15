# Core Beliefs

Project-wide, agent-first beliefs. These shape every plan, review, and doc.

## Agent-First Beliefs

- The repository is the system of record for agents; what is not discoverable
  in-repo (or in primed memory) is operationally unavailable.
- `AGENTS.md` is a router, not an encyclopedia.
- Verification evidence matters more than confidence.
- One bounded task is better than many half-finished tasks.
- Repeated human feedback should become reusable harness rules (checks, hooks,
  linters), not repeated chat.
- Cleanup and simplification are part of shipping, not afterthoughts.

## Karpathy Coding Principles

These are canonical for this repo:

1. **Think before you code.** Restate the problem, surface ambiguities, ask
   before guessing.
2. **Simplicity first.** The simplest thing that works; no speculative layers.
3. **Minimal changes.** Modify only what was asked; small, reviewable diffs.
4. **Be explicit about assumptions.** Name trade-offs; do not silently pick.
5. **Verify your work.** Mentally simulate; cover edge cases; include a test.
6. **Readability over cleverness.** Clear names; no condensed one-liners.
7. **Handle errors and edge cases.** Null/empty inputs; validate at boundaries.
8. **Be incremental.** Break work into steps; show reasoning when useful.
9. **Respect the existing codebase.** Follow existing style and conventions.
10. **Communicate clearly.** Explain what and why, concisely.

## Non-Negotiables

- **TDD is mandatory.** No production code without a failing test first
  (RED → GREEN → REFACTOR). A test that passes the moment it is written proves
  nothing.
- **`uv` for Python.** It is the default for packages, envs, and running scripts
  unless a concrete constraint prevents it (state the reason if so).
- **Security from line 1.** Supabase RLS on, server-side auth, no client
  secrets — from the first commit.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
