# AGENTS.md

This repository is designed for long-running coding-agent work. The goal is not
to maximize raw code output. The goal is to leave the repo in a state where the
next session can continue without guessing. Any agent (Claude Code, Codex,
Cursor, or other) follows this file.

> Fill in every `<...>` placeholder. Delete sections that do not apply.

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd` (expected: `<repo-root>`).
2. Read `claude-progress.md` for the latest verified state and next step.
3. Read `feature_list.json` and choose the highest-priority unfinished feature.
4. Review recent commits with `git log --oneline -5`.
5. Restore context (`/context-restore`; search `claude-mem` for prior decisions
   and blockers before asking the user).
6. Run `./init.sh` (or `<startup-command>`).
7. Run the required smoke / end-to-end verification before starting new work.

If baseline verification is already failing, fix that first. Do not stack new
feature work on top of a broken starting state.

## Working Rules

- **TDD first — no production code without a failing test.** RED → GREEN →
  REFACTOR. Code written before its test gets deleted and rewritten test-first.
- One feature at a time. State assumptions; name trade-offs.
- Do not mark a feature complete just because code was added.
- Keep changes within the selected feature scope unless a blocker forces a
  narrow supporting fix.
- Simplicity first; lean files (**< ~300 lines**); minimal diffs; existing
  conventions.
- Do not silently change verification rules during implementation.
- Prefer durable repo artifacts over chat summaries.
- The `bash-guard` PreToolUse hook gates destructive commands — state a reason.

## Stack, Security & Visual Standards

- **Stack:** Next.js App Router + TS `strict` + Tailwind + shadcn/ui + Lucide;
  Postgres/Supabase; `uv` for Python (fallback needs a stated reason).
- **Security from line 1:** Supabase RLS on (deny by default), server-side auth,
  no client/repo secrets (env vars only), validate at every boundary.
- **Anti-slop UI:** pin design tokens, real data, WCAG AA. Banned: Inter/Roboto
  default, purple→blue gradients, emoji-icons, hero→3-cards→testimonials.

## Required Artifacts

- `feature_list.json`: source of truth for feature state
- `claude-progress.md`: session log and current verified status
- `init.sh`: standard startup and verification path
- `session-handoff.md`: optional compact handoff for larger sessions

## Definition Of Done

A feature is done only when all of the following are true:

- the target behavior is implemented test-first
- the required verification actually ran (suite + type/lint green, with counts)
- evidence is recorded in `feature_list.json` or `claude-progress.md`, tagged
  confirmed / likely / needs-runtime-verification
- the repository remains restartable from the standard startup path

## End Of Session

Before ending a session:

1. Update `claude-progress.md`.
2. Update `feature_list.json`.
3. Record any unresolved risk or blocker.
4. Run `/context-save` for cross-session/workspace continuity.
5. Commit with a descriptive message once the work is in a safe state.
6. Leave the repo clean enough for the next session to run `./init.sh`
   immediately.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/templates/ -->
