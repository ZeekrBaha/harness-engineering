# Advanced Repo Template

Copy this starter into a real repository when you want an agent-first
documentation surface instead of only a minimal harness. It is opinionated: TDD
is mandatory, security is on from line 1, and the default stack is Next.js App
Router + TypeScript (strict) + Tailwind + shadcn/ui + Lucide + Postgres/Supabase.

## Copy Order

1. Copy `AGENTS.md` and `ARCHITECTURE.md` to the repo root.
2. Copy the whole `docs/` tree.
3. Fill in `docs/PRODUCT_SENSE.md`, `docs/QUALITY_SCORE.md`, and
   `docs/RELIABILITY.md` first.
4. Read `docs/SECURITY.md` and confirm Supabase RLS is on and no secrets reach
   the client before writing any feature.
5. Add your first active plan under `docs/exec-plans/active/`.
6. Keep the entrypoint files short and route detail into the linked docs.

## What This Template Optimizes For

- durable repo-local context (system of record for agents)
- progressive disclosure instead of one giant instruction file
- explicit plan lifecycle
- quality tracking over time against an evidence standard
- security and TDD baked in, not bolted on
- readable boundaries for agents and humans

Treat every file here as a starter. Replace placeholders, examples, and sample
commands with your real project specifics before relying on it.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
