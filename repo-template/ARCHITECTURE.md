# ARCHITECTURE.md

Top-level map of the system. Keep it concise and point to deeper documents when
needed. Default stack: Next.js App Router + TypeScript (strict) + Tailwind +
shadcn/ui + Lucide, with Postgres/Supabase for data and auth.

## System Shape

- Product: `[replace with product name]`
- Primary user workflow: `[replace with main workflow]`
- Runtime surfaces: `[web (Next.js App Router) / services / workers]`
- Data + auth: Supabase (Postgres, RLS on, server-side auth)
- Source of truth for product behavior: `docs/product-specs/`

## Domain Map

| Domain | Purpose | Primary Entry Points | Related Spec |
|--------|---------|----------------------|--------------|
| `[domain-a]` | `[what it owns]` | `[route handlers / server actions / components]` | `[spec path]` |
| `[domain-b]` | `[what it owns]` | `[route handlers / server actions / components]` | `[spec path]` |

## Layer Model

Use a fixed directional model so agents do not invent ad hoc architecture:

`Types -> Config -> Repo (DB/Supabase) -> Service -> Server (actions/route handlers) -> UI (RSC/Client)`

Cross-cutting concerns enter through explicit provider or adapter boundaries
instead of reaching across layers directly.

## Hard Dependency Rules

- Lower layers must not depend on higher layers.
- UI must not bypass server actions / service contracts to hit the database.
- Data access enters through repositories or Supabase server clients only.
- **Secrets and service-role keys never reach client components.** Auth checks
  happen server-side; RLS is the second line of defense.
- Shared utilities stay generic and must not accumulate domain logic.
- New dependencies are justified in the matching plan or design doc.

## Cross-Cutting Interfaces

| Concern | Approved Boundary | Notes |
|--------|-------------------|-------|
| Logging and tracing | `[provider / utility path]` | structured only, no ad hoc console use |
| Auth | Supabase server client | session validated server-side; never trust client |
| Data access | repository / Supabase server client | RLS on for every table |
| External APIs | `[client or provider path]` | rate limit / retry guidance |
| Feature flags | `[flag boundary]` | ownership |

## Current Hot Spots

- `[area that is hardest for agents to change safely]`
- `[area with weak boundaries or fragile tests]`

## Change Checklist

When you touch architecture-relevant code:

1. Update this file if the domain map or allowed boundaries changed.
2. Update the related design doc in `docs/design-docs/` if the reasoning changed.
3. Add or update an executable check if the rule should be enforced mechanically.
4. Confirm no secret or service-role key crossed into client code.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
