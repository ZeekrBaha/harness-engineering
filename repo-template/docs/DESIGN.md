# DESIGN.md

Design entrypoint. Keep it brief and route into the detailed files under
`docs/design-docs/`.

## Purpose

Record durable product and system design decisions that should survive beyond a
single chat, sprint, or reviewer memory.

## Read This When

- you need the current design philosophy
- you are about to introduce a new pattern
- you need to know which design decisions are settled versus still open

## Canonical Design Docs

- `docs/design-docs/index.md`: index of accepted, proposed, and deprecated docs
- `docs/design-docs/core-beliefs.md`: project-wide agent-first beliefs and the
  Karpathy coding principles

## Design Rules

- Keep design docs small and current.
- Prefer one doc per decision area.
- Link design docs from plans and specs when a change depends on them.
- Simplicity first: prefer the simplest design that works; do not add layers,
  patterns, or abstractions that no current requirement needs.
- If a design rule becomes operationally critical, promote it into an automated
  check or update `ARCHITECTURE.md`.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
