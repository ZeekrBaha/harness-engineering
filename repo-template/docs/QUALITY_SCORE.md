# QUALITY_SCORE.md

Tracks whether the repository is getting stronger or weaker over time. Grades are
backed by evidence, aligned with the `repo-engineering-review` standard — a grade
without a linked verification is a `C` at best.

## Grading Scale

- `A`: verified, legible, stable, boundaries enforced, tests green
- `B`: working with minor gaps
- `C`: partially working, notable confusion or instability, or unverified
- `D`: broken, unsafe, or structurally unclear

## Product Domains

| Domain | Grade | Verification | Agent Legibility | Test Stability | Key Gaps | Last Updated |
|--------|-------|-------------|-----------------|---------------|----------|-------------|
| `[domain-a]` | - | - | - | - | - | - |
| `[domain-b]` | - | - | - | - | - | - |
| `[domain-c]` | - | - | - | - | - | - |

## Architectural Layers

| Layer | Grade | Boundary Enforcement | Agent Legibility | Key Gaps | Last Updated |
|-------|-------|---------------------|-----------------|----------|-------------|
| Types | - | - | - | - | - |
| Services | - | - | - | - | - |
| Server (actions/routes) | - | - | - | - | - |
| UI | - | - | - | - | - |

## Evidence Standard

Every grade cites how it was verified (validation-gates): a passing test run, a
captured journey, a lint/type-check result, or a `repo-engineering-review`
finding. "Looks done" is not evidence.

## Benchmark Snapshots

| Date | Harness Variant | Completion Rate | Retries | Defects Before Review | Notes |
|------|-----------------|----------------|--------|-----------------------|------|
| YYYY-MM-DD | `[baseline / improved / simplified]` | - | - | - | - |

## Simplification Log

| Date | Component Removed | Outcome | Decision |
|------|-------------------|---------|----------|
| YYYY-MM-DD | `[component]` | `[degraded / unchanged]` | `[restore / keep removed]` |

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
