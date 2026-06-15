# Project 02. Make the Project Readable and Pick Up Where You Left Off

> Related lectures: *Make the repository your single source of truth* · *Split instructions across files*

## Assignment goal

Add "readability" to the repo so a *new* agent session can quickly understand the
project structure, know the current progress, and pick up work. Concretely:
implement **document import**, **document detail view**, and **local
persistence**, completed across **two sessions**.

You run it twice from the checked-in directories:

1. **First** — against the thinner `starter/` workspace with no
   `session-handoff.md`.
2. **Second** — against the `solution/` shape with expanded `ARCHITECTURE.md`,
   `PRODUCT.md`, and a `session-handoff.md`.

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron

## Harness mechanism

Agent-readable workspace + persistent state files

## Steps / deliverables

- Implement the three product features across two sessions: document import,
  full document detail/content loading, persistence across restart.
- In the weak run, observe how much a second agent session has to **rediscover**
  because the docs are thin and there is no handoff file.
- In the strong run, confirm a fresh session can **resume from repo state alone**
  — no oral/out-of-band context — using `ARCHITECTURE.md`, `PRODUCT.md`,
  `feature_list.json`, and `session-handoff.md`.

## Success criteria

- All three product features work: import, detail/content view, and persistence
  across an app restart.
- The **harness feature** is the handoff-readable workspace: a fresh session can
  pick up the remaining work without external context.

| Directory | What it contains | What to compare |
|-----------|------------------|-----------------|
| `starter/` | Project 01 code plus *incomplete* import, detail view, persistence. Docs are intentionally thin; no `session-handoff.md`. | How much rediscovery a second agent session does. |
| `solution/` | Same slice completed, with expanded docs plus `feature_list.json` and `session-handoff.md`. | Whether a fresh session resumes from repo state without oral context. |

## How I'd do this in my harness

This is the `repo-engineering-review` standard applied as a forcing function.

- **README / `docs/` layout standard.** My `repo-engineering-review` skill
  defines a portfolio-grade README + `docs/` structure. `ARCHITECTURE.md` and
  `PRODUCT.md` here are that standard — I'd generate them with that skill so the
  repo is the single source of truth, not my chat history.
- **Spec-first docs.** `create-app-implementation-docs` produces exactly the
  readable artifacts this project asks for (requirements, architecture, design)
  *before* coding, so a second session reads the spec, not the diff.
- **`session-handoff.md` → `/context-save`.** I'd write the handoff with
  `/context-save`, which captures git state, decisions, and remaining work; the
  fresh session restores with `/context-restore`. The markdown handoff is the
  human-readable mirror of that machine state.
- **The honest test.** To prove resumability I'd start the second session in a
  clean shell with *no* memory primed and only the repo — exactly the project's
  "resume without oral context" bar.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/projects/project-02-agent-readable-workspace/
