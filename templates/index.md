# Template Guide

Drop-in harness artifacts. Copy what you need into a project root, then fill the
blanks. These encode Baha's rules — Karpathy principles, MANDATORY TDD, lean
code (<300 lines/file), security-from-line-1, anti-slop visuals — so an agent
(or a future you) can run a long project without re-explaining the standards.

Default stack assumed: Next.js App Router + TypeScript (strict) + Tailwind +
shadcn/ui + Lucide, Postgres/Supabase. Swap commands/paths for other stacks.

## How to Get Started

Copy these first:

1. `CLAUDE.md` (Claude Code) or `AGENTS.md` (Codex / other agents) — same rules
2. `claude-progress.md` — the session log
3. `feature_list.json` — the feature tracker (companion file; see CLAUDE.md)

Add the rest as the project grows. Pair the progress + handoff files with
`/context-save`, `/context-restore`, and claude-mem so durable repo artifacts
and searchable session memory stay in sync.

---

## CLAUDE.md / AGENTS.md

The root instruction file — the first thing the agent reads each session. Same
content, two formats: `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex/others.
Keep them identical; edit one, mirror the change.

**Use it to:** pin the operating loop (read progress, pick one feature, verify
baseline), the TDD law (no prod code without a failing test), the lean/security/
anti-slop gates, and the definition of done. Keep the Definition of Done and the
TDD section — they are the load-bearing parts.

## claude-progress.md

The progress log. Every session reads it first and writes to it last. Holds the
single source of truth: repo root, startup command, verification command, the
highest-priority unfinished feature, and the current blocker — plus one record
per session. Mirror the wrap-up into claude-mem / `/context-save` so the next
session can resume from either repo state or session memory.

## session-handoff.md

A compact handoff between sessions. Optional for small sessions; important for
long ones or multi-area projects. Covers what's verified now, what changed,
what's broken/unverified, the next best step, and the quick-reference commands.
Generate it at session end alongside `/context-save`.

## clean-state-checklist.md

Run before ending any session. Confirms the repo is restartable, verification
still green, progress recorded, no false `passing` entries, and the bash-guard
hook / git tree are clean. Hands off to the `finishing-a-development-branch`
skill for the merge/PR decision.

## evaluator-rubric.md

A scorecard for reviewing a session's output. Score six dimensions 0-2, each
claim tagged by the repo-engineering-review evidence standard (confirmed /
likely / needs-runtime-verification). Verdict: Accept / Revise / Block.
**The evaluator needs tuning** — agents are poor self-judges out of the box.
Plan 3-5 rounds comparing its verdict to your own and tightening pass/fail
criteria until they align.

## quality-document.md

A health snapshot of the *codebase over time*, not a single session. Grades each
product domain and architectural layer (A-D) on verification, agent legibility,
test stability, and security boundaries. Different question than the rubric:
- Evaluator rubric: "Did the agent do good work this session?"
- Quality document: "Is the project getting stronger or weaker over time?"

Also drives harness simplification: snapshot, remove one harness component, run
the benchmark suite, re-snapshot. If grades hold, the component was overhead.

## Companion files (not in this folder, referenced by the templates)

- `init.sh` — one-shot startup: prints `pwd`, installs deps (`npm install` /
  `uv sync`), runs verification (`npm test` / `uv run pytest`), prints the start
  command. Stop and fix the baseline if verification fails.
- `feature_list.json` — machine-readable feature tracker. Each feature: `id`,
  `priority`, `area`, `title`, `user_visible_behavior`, `status`
  (`not_started` | `in_progress` | `blocked` | `passing`), `verification`,
  `evidence`, `notes`. Exactly one feature `in_progress` at a time.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/templates/ -->
