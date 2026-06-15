# PLANS.md

How execution plans are created, updated, completed, and archived.

## When A Plan Is Required

Create an execution plan when work:

- spans more than one session
- changes more than one subsystem
- has non-trivial verification or rollout risk
- depends on open decisions that should be logged

## Plan Locations

- `docs/exec-plans/active/`: plans currently driving work
- `docs/exec-plans/completed/`: finished plans kept for future agent context
- `docs/exec-plans/tech-debt-tracker.md`: deferred work and follow-ups

## Minimum Plan Sections

- objective
- scope and out-of-scope
- verification path (including the tests that must go red then green)
- risks and blockers
- progress log
- open decisions

## Operating Rules

- One active plan has one clearly owned current step.
- Work incrementally: break the plan into small TDD-sized steps, each with its
  own failing test, rather than one sweeping change.
- Update the plan as work progresses; do not treat it as static prose.
- If a decision changes implementation direction, record it in the plan.
- Move finished plans to `completed/` so agents can still discover prior context.

## Relationship To The Doc Skill

For new apps, features, or rewrites, generate the plan with
`create-app-implementation-docs` (research → design → task → validation). Its
task and validation docs become the active plan's backbone; keep them in
`docs/exec-plans/active/` and update them as the source of truth.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
