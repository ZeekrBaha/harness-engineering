# Coding Agent Startup Flow

Run this at the start of every coding session, once initialization is complete.
It exists so a fresh session orients itself from the repository and from
persistent memory instead of from chat history that no longer exists.

## Fixed Startup Template

1. Run `pwd` and confirm the repository root.
2. Let the **SessionStart hook** prime context (claude-mem injects prior
   decisions, blockers, and the last handoff). If priming did not run, query it
   yourself: `ctx_search(sort: "timeline")` and claude-mem memory search for
   "what was I doing, what is blocked".
3. Read the constitution / research / progress docs produced by
   **`create-app-implementation-docs`** (research, requirements, design,
   architecture, task, validation). These are the durable spec; recover them
   before editing.
4. Read `feature_list.json` (or the task doc) for the machine-readable feature
   surface and statuses.
5. Review recent commits with `git log --oneline -5`.
6. Run the standard bootstrap (`./init.sh`, or `uv run ...` for Python).
7. Run a baseline smoke / end-to-end path before adding scope.
8. If the baseline is broken, fix that first.
9. Select the single highest-priority unfinished feature.
10. Work only on that feature until it is verified or explicitly blocked,
    writing the failing test first (TDD is mandatory).

## Why This Order Matters

- `pwd` prevents accidental work in the wrong directory.
- Session priming (hook + claude-mem) recovers durable state cheaply before any
  new bytes enter context.
- The implementation docs explain intended behavior and acceptance criteria, so
  the agent does not re-derive the spec.
- The feature surface and recent commits explain what changed most recently.
- `init.sh` / `uv` standardize startup instead of relying on memory.
- Baseline verification catches broken starting states before new work hides
  them.
- One bounded feature at a time prevents scope sprawl.

## End-Of-Session Mirror

The same session should end by:

1. recording progress in the implementation/progress docs
2. updating feature state in `feature_list.json`
3. writing a handoff if work is unfinished
4. committing only verified, safe work (TDD green + lint/type checks)
5. letting claude-mem capture the session so the next start primes cleanly
6. leaving a clean restart path

## In my harness

- **SessionStart hook + claude-mem** replace "read claude-progress.md from
  memory." Priming is automatic; treat the injected timeline and memory search
  as step 2, and only fall back to manual `ctx_search(sort: "timeline")` if the
  hook did not fire.
- **`create-app-implementation-docs`** is the system of record for intent. Its
  research/constitution and validation docs are the startup read, gating work
  through research → design → implementation → validation phases.
- **TDD is non-negotiable** (global CLAUDE.md): step 10 starts with a failing
  test, not production code. **`uv`** is the default runner/bootstrap for Python
  projects.
- Baseline verification aligns with the **validation-gates** standard from
  `repo-engineering-review`: runnable evidence, not code inspection, ends a step.

**Source:** https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/docs/en/resources/reference/coding-agent-startup-flow.md
