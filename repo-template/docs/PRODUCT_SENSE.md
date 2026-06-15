# PRODUCT_SENSE.md

Durable product judgment that agents cannot infer reliably from code alone.

## Product Core

- Primary user: `[replace]`
- Job to be done: `[replace]`
- Main frustration to remove: `[replace]`
- Quality bar for acceptance: `[replace]`

## Product Rules

- Favor user-visible reliability over feature count.
- Treat ambiguous behavior as a spec gap, not as permission to guess. Ask, or
  log it as an open decision in the active plan.
- If implementation changes what users see or trust, update the matching spec.
- Use product specs for concrete flows; use this file for cross-cutting product
  priorities.

## No-Go Patterns

- Hidden destructive actions
- Silent failure without user feedback
- Unclear source of truth for visible state
- Features that cannot be explained in one sentence

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
