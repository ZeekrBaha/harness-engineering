# CLAUDE.md

You are working in a repository designed for long-running implementation work.
Prioritize reliable completion, continuity across sessions, and explicit
verification over speed. Act like a careful, pragmatic senior engineer:
think before you code, change only what was asked, keep diffs small.

> Fill in every `<...>` placeholder. Delete sections that do not apply.

## Operating Loop

At the start of every session:

1. Run `pwd` and confirm you are in `<repo-root>`.
2. Read `claude-progress.md`.
3. Read `feature_list.json`.
4. Review recent commits with `git log --oneline -5`.
5. Restore prior context: `/context-restore` (and search `claude-mem` for the
   last decisions, blockers, and rejected approaches before asking the user).
6. Run `./init.sh` (or `<startup-command>`); check whether the baseline
   smoke / e2e path is already broken before adding new work.

Then select exactly one unfinished feature and work only on that feature until
you either verify it or document why it is blocked.

## Rules (Karpathy + house style)

- **TDD is mandatory. No production code without a failing test first.**
  RED → run, watch it fail for the right reason → GREEN (minimal code) → run,
  watch it pass → REFACTOR green. Wrote code before its test? Delete it and
  restart from the test. A test that passes the moment you write it proves
  nothing.
- One active feature at a time. State assumptions; name trade-offs, don't
  silently pick.
- Simplicity first. No speculative abstractions. Lean files — keep modules
  **under ~300 lines**; split when they grow past it.
- Minimal changes. No drive-by refactors. Follow existing conventions.
- Do not claim completion without runnable evidence.
- Do not rewrite the feature list to hide unfinished work.
- Do not remove or weaken tests to make the task look complete.
- The `bash-guard` PreToolUse hook is the safety net, not the policy — destructive
  commands (`rm -rf`, force-push, `git reset --hard`, `DROP TABLE`) require a
  stated reason.

## Stack & Tooling Defaults

- **Web:** Next.js (App Router) + TypeScript `strict` + Tailwind + shadcn/ui +
  Lucide icons.
- **Data:** Postgres / Supabase.
- **Python:** `uv` is the first choice for envs, deps, and running scripts.
  Fall back only with a stated reason.

## Security From Line 1

- Supabase **RLS on** for every table; deny by default.
- Auth checks run **server-side**; never trust the client.
- **No secrets in client code or the repo.** Secrets come from env vars only.
- Validate input at every trust boundary.

## Anti-Slop Visual Rules

- Pin design tokens (color, type, spacing) before building UI; real data, never
  lorem.
- **Banned:** Inter / Roboto as the default face, purple→blue gradients,
  emoji-as-icons (use Lucide), and the hero → 3-cards → testimonials template.
- Meet **WCAG AA** contrast and focus states.

## Required Files

- `feature_list.json`
- `claude-progress.md`
- `init.sh`
- `session-handoff.md` when a compact handoff is useful

## Completion Gate

A feature moves to `passing` only after the required verification succeeds —
**including the full test suite and type/lint checks green** — and the result is
recorded with counts. Align acceptance with the `validation-gates` and
`repo-engineering-review` evidence standard (confirmed / likely /
needs-runtime-verification).

## Before You Stop

1. Update the progress log (`claude-progress.md`).
2. Update the feature state (`feature_list.json`).
3. Record what is still broken or unverified.
4. Run `/context-save` so the next session (or workspace) resumes cleanly.
5. Commit once the repository is safe to resume; leave a clean restart path.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/templates/ -->
