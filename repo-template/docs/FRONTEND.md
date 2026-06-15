# FRONTEND.md

Stable frontend expectations so agents do not invent UI patterns unpredictably.
Default UI stack: Next.js App Router + Tailwind + shadcn/ui + Lucide icons.

## UI Principles

- Optimize for clarity before novelty.
- Keep interaction flows discoverable and restartable.
- Prefer a small number of reusable components over one-off variants.
- Accessibility is part of normal verification, not polish work.

## Anti-Slop Rules (non-negotiable)

These exist because generic AI UI has recognizable tells. Avoid them:

- **Pin design tokens.** Define and reuse a fixed type scale, spacing scale, and
  color tokens. No ad hoc font sizes or one-off hex values.
- **Banned fonts:** do not default to Inter or Roboto. Choose and pin a
  deliberate typeface in the design system.
- **Banned gradient:** no purple→blue gradients (the canonical slop gradient).
- **No emoji as icons.** Use Lucide icons; emoji are not UI iconography.
- **No hero→3-cards template.** Do not reach for the generic landing layout
  (big hero followed by a three-card row) as a default; design for the actual
  content.
- **Real data only.** Render real or realistic data and copy — no lorem ipsum,
  no placeholder names shipped to review.
- **WCAG AA.** Meet AA contrast and keyboard/focus requirements; this is a gate,
  not a nice-to-have.

## Guardrails

- Document the design system (tokens, components) in `docs/references/` and
  `docs/DESIGN.md`.
- Record key user-facing states for every flow: empty, loading, success, error,
  retry.
- Keep copy, keyboard behavior, and visual hierarchy consistent across flows.
- When a UI bug is fixed, add or update the matching validation step.

## Verification Expectations

- Capture evidence (screenshots / DOM checks) for critical user journeys.
- Record browser or runtime validation steps in the relevant plan.
- If visual regressions are common, standardize screenshot or DOM checks.
- Run an accessibility check as part of the journey, not after.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
