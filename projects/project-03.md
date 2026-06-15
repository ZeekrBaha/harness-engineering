# Project 03. Keep the Agent Working Across Session Restarts

> Related lectures: Lecture 05 (Keep context alive across sessions) · Lecture 06 (Initialize before every agent session)

## What You Do

Add scope control and verification gates to the agent. Implement document chunking, metadata extraction, indexing progress display, and a citation-based Q&A flow. Use `feature_list.json` to track feature status — one feature at a time, with **no marking a feature "pass" without verification evidence**.

You compare a checked-in starter and solution: the starter has only the early tracking surface, while the solution adds the stricter restart and handoff artifacts around the same feature list.

This is not a generic "multi-session" exercise. The work maps to four specific product features: document chunking, metadata extraction, indexing-status UI, and grounded Q&A with citations.

### Steps

1. Stand up a `feature_list.json` with the four features, each `status: pending`.
2. Implement exactly one feature at a time; do not start the next until the current one has evidence.
3. Add the restart/handoff artifacts: `init.sh`, `session-handoff.md`, `claude-progress.md`, `clean-state-checklist.md`.
4. Restart the agent mid-task and confirm it can resume from the artifacts alone — no lost state, no drift.

### Deliverables

- `feature_list.json` (per-feature status with verification evidence attached)
- `init.sh` — one command that re-establishes working context on a fresh session
- `session-handoff.md` — what's done, what's next, what's blocked
- `claude-progress.md` — running progress log
- `clean-state-checklist.md` — the gate that proves the repo is in a resumable state

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron

## Harness Mechanism

Progress log + session handoff + multi-session continuity + one-feature-at-a-time verification

## Use the Checked-In Project

Repository path: `projects/project-03/`

| Directory | What it contains | What to compare |
|------|------|------|
| `starter/` | Project 02 code with indexing and grounded QA still unfinished. Has a starter `feature_list.json` but lacks the final restart/handoff artifacts. | Whether the agent drifts across multiple features or loses state after a restart. |
| `solution/` | Completed chunking, metadata, index status, and citation-based QA, plus `init.sh`, `session-handoff.md`, `claude-progress.md`, and `clean-state-checklist.md`. | Whether each feature has concrete verification evidence before it is marked passing. |

## Success Criteria

- A fresh session can resume the work from the handoff artifacts alone (no prompting the previous session's memory).
- Every feature flips to `pass` only after attached, reproducible verification evidence.
- The agent works one feature at a time and does not drift into adjacent features.
- `clean-state-checklist.md` passes before any handoff.

## How I'd do this in my harness

My Claude Code (Opus 4.8, 1M) setup already implements most of this primitive — I'd wire the assignment to the real tools instead of hand-rolled markdown files:

- **`feature_list.json` + one-feature-at-a-time** → drive it with `superpowers:writing-plans` to author the phased plan, then `superpowers:subagent-driven-development` / `executing-plans` so each feature is its own checkpointed unit. The MANDATORY-TDD rule in my global `CLAUDE.md` is the "no pass without evidence" gate: a feature is only green when its failing test went red first, then passed.
- **Verification-before-pass** → `superpowers:verification-before-completion` plus the `repo-engineering-review` skill enforce that "done" means proven, not claimed. Browser-facing features (the indexing-status UI, citation panel) get dogfooded with `gstack`/`browse` + `playwright` and screenshot evidence stapled to the feature entry.
- **Session handoff / restart** → this is exactly `context-save` → `context-restore`. `context-save` captures git state, decisions, and remaining work; a fresh session resumes with `context-restore`. That replaces the manual `session-handoff.md` + `init.sh`.
- **Cross-session continuity** → `claude-mem` is the persistent memory layer. On resume I query `ctx_search(sort: "timeline")` / claude-mem to recover prior decisions, errors, and the last plan before touching code — so continuity survives compaction, not just restarts.
- **Clean-state gate** → `superpowers:finishing-a-development-branch` + a `using-git-worktrees` isolated workspace is my `clean-state-checklist.md`: tests green, lint/type clean, branch in a mergeable state before handoff.
- **Spec-first scaffolding** → `create-app-implementation-docs` would produce the requirements/architecture/task docs for the four features up front, so the feature list is derived from a real spec rather than invented mid-run.

Net: the lesson's hand-built artifacts (`init.sh`, `session-handoff.md`, `claude-progress.md`, `clean-state-checklist.md`) map 1:1 onto `context-save`/`context-restore`, `claude-mem`, the superpowers plan/execute/verify skills, and worktree finishing — with TDD as the non-negotiable pass gate.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/projects/project-03-multi-session-continuity/
