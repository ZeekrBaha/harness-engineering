# AGENTS.md

This repository is optimized for long-running coding-agent work. Keep this file
short. It is a router into the system-of-record docs, not an instruction dump.

## Startup Workflow

Before changing code:

1. Confirm the repo root with `pwd`.
2. Let the SessionStart hook + claude-mem prime context; if it did not run,
   recover state via memory search and the timeline.
3. Read `ARCHITECTURE.md` for the system map and hard dependency rules.
4. Read `docs/QUALITY_SCORE.md` to see which domains/layers are weakest.
5. Read `docs/PLANS.md`, then open the active plan you are working from.
6. Read the relevant product spec in `docs/product-specs/`.
7. Run the standard bootstrap and verification path (`uv run ...` for Python).
8. If baseline verification is failing, repair the baseline before adding scope.

## Routing Map

- `ARCHITECTURE.md`: domain map, layer model, dependency rules
- `docs/design-docs/core-beliefs.md`: project-wide agent-first beliefs
- `docs/product-specs/index.md`: current behaviors and acceptance targets
- `docs/PLANS.md`: plan lifecycle and execution-plan policy
- `docs/QUALITY_SCORE.md`: product-domain and layer health
- `docs/RELIABILITY.md`: runtime signals, benchmarks, restart expectations
- `docs/SECURITY.md`: secrets, RLS, auth, sandbox, external-action rules
- `docs/FRONTEND.md`: UI constraints, design system, anti-slop, accessibility

## Harness Hooks And Tools

- **bash-guard hook** gates destructive shell commands; do not work around it.
- **claude-mem** is persistent cross-session memory; query it before asking.
- **context-mode** (`ctx_*`) is for gathering and processing — keep raw bytes
  out of context, surface only derived answers.
- Two project skills: **`create-app-implementation-docs`** (spec-first docs
  before building) and **`repo-engineering-review`** (evidence-based review).

## Working Contract

- Work from one bounded plan or feature slice at a time.
- **TDD is mandatory**: write the failing test first, watch it fail, then write
  the minimal code to pass. No production code without a failing test.
- **Security from line 1**: Supabase RLS on, auth enforced server-side, no
  secrets in client code. See `docs/SECURITY.md`.
- Do not mark work done from code inspection alone; runnable evidence is
  required.
- If you change behavior, update the matching product, plan, or reliability docs
  in the same session.
- Promote repeated review feedback into a mechanical rule, check, or linter
  instead of re-explaining it in chat.

## Definition Of Done

A change is done only when all of the following are true:

- the failing test that drove it now passes; the full suite + type/lint is green
- target behavior is implemented
- required verification actually ran and is linked from the plan / quality doc
- affected docs remain current
- security rules hold (no client secrets, RLS intact, server-side auth)
- the repository can restart cleanly from the standard startup path

## End Of Session

1. Update the active execution plan.
2. Update `docs/QUALITY_SCORE.md` if any domain/layer meaningfully changed.
3. Record new debt in `docs/exec-plans/tech-debt-tracker.md` if you deferred it.
4. Move finished plans to `docs/exec-plans/completed/` when appropriate.
5. Leave the repo restartable, with a clear next action and memory captured.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
