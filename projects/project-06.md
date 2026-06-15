# Project 06. Build a Complete Agent Harness (Capstone)

> Related lectures: Lecture 11 (Make the agent's runtime observable) · Lecture 12 (Clean handoff at the end of every session)

## What You Do

This is the capstone. Assemble everything from the first five projects, run a full benchmark, then do a cleanup pass to verify the result is maintainable.

Use a fixed multi-feature task set covering the complete product slice: document import, indexing, citation-based Q&A, runtime observability, and a readable, restartable repo state. Then:

1. **Baseline run** with a deliberately weak harness.
2. **Strong run** with your strongest full harness.
3. **Cleanup + re-run** to confirm quality holds.
4. **Ablation experiment** — remove one harness component at a time and see which ones actually move the result.

Unlike earlier projects, the capstone starter is *not* mostly missing product features. The main gap is the operating harness around the app.

### Deliverables

- Weak-harness baseline observations (run by hand — the starter intentionally ships no benchmark scripts)
- Full harness surface: `AGENTS.md`, `CLAUDE.md`, `feature_list.json`, `init.sh`, `session-handoff.md`, `clean-state-checklist.md`, quality/evaluator docs
- `scripts/benchmark.sh` results (weak vs strong vs post-cleanup)
- `scripts/cleanup-scanner.sh` output and the cleanup diff
- An ablation table: component removed → measured impact

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron
- Quality document template
- Evaluator rubric
- All harness components accumulated from the first five projects

## Harness Mechanism

Complete harness: all mechanisms + observability + ablation study

## Use the Checked-In Project

Repository path: `projects/project-06/`

| Directory | What it contains | What to compare |
|------|------|------|
| `starter/` | Mostly complete product code with an intentionally weak harness surface: basic `AGENTS.md`, no `feature_list.json`, no `session-handoff.md`, no clean-state checklist. | Manual weak-harness baseline observations. The starter intentionally has no benchmark scripts. |
| `solution/` | Full harness surface: `AGENTS.md`, `CLAUDE.md`, `feature_list.json`, `init.sh`, `session-handoff.md`, `clean-state-checklist.md`, quality/evaluator docs, benchmark and cleanup scripts. | Run `solution/scripts/benchmark.sh` and `solution/scripts/cleanup-scanner.sh`, then compare quality-document evidence. |

## Success Criteria

- The strong-harness run measurably beats the weak baseline on the same fixed task set.
- The cleanup pass holds or improves quality (no regression after re-run).
- The ablation table identifies which components actually matter (and which are ceremony).
- The repo ends in a clean, restartable state with a passing clean-state checklist and full harness surface present.

## How I'd do this in my harness

The capstone is "assemble the whole harness, benchmark it, then ablate to find what matters." My Claude Code setup *is* an assembled harness, so this is mostly mapping each lesson artifact to a live component and then running the experiment:

- **The full harness surface** maps directly:
  - `AGENTS.md` / `CLAUDE.md` → my global `CLAUDE.md` (Karpathy principles + MANDATORY TDD + `uv`) plus project-level config, enforced at runtime by the `bash-guard` hook and `update-config`/settings hooks.
  - `feature_list.json` + `init.sh` + `session-handoff.md` → `superpowers:writing-plans`/`executing-plans` for the feature set, and `context-save` / `context-restore` + `claude-mem` for init and handoff.
  - `clean-state-checklist.md` → `superpowers:verification-before-completion` + `finishing-a-development-branch` on a `using-git-worktrees` workspace.
  - quality/evaluator docs → `create-app-implementation-docs` (research → requirements → design → architecture → tasks → validation gates) + `repo-engineering-review`.
- **Observability across the run** → Langfuse (traces/metrics/scores) for the agent runtime, `claude-mem` observations for cross-session decisions/errors, and `context-mode` (`ctx_*`) as the incremental index over logs and corpus so I benchmark from derived data, not raw bytes in context.
- **`benchmark.sh`** → I'd drive the fixed task set through the `health` skill (composite quality score + trend tracking) and `benchmark-models` for the model dimension, with `qa`/`browse`+`playwright` producing before/after health scores on the UI slice. Langfuse datasets give me the run-over-run numeric comparison for weak vs strong vs post-cleanup.
- **`cleanup-scanner.sh`** → `simplify` + `code-review` + `repo-engineering-review` are my cleanup pass: they hunt dead code, over-abstraction, and quality regressions, applying atomic fixes. `cso` adds the security sweep so "maintainable" also means "not vulnerable."
- **The ablation experiment** → this is the interesting part. I'd hold the fixed task set constant (one worktree per condition via `using-git-worktrees`) and remove one component per run — TDD off, `context-save`/`restore` off, evaluator/code-review off, Langfuse observability off, `feature_list` plan off — scoring each with `health` + Langfuse so I can rank which components actually move the result. My prior is that the TDD gate and the plan→verify loop dominate; observability and memory pay off most on long, multi-session tasks. The ablation makes that measurable instead of asserted.

Net: every capstone artifact has a live counterpart in my harness (global `CLAUDE.md`, superpowers plan/execute/verify, context-save/restore + claude-mem, context-mode indexing, Langfuse, health/qa/codex/cso), and the ablation becomes a worktree-isolated, Langfuse-scored experiment over a frozen task set.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/projects/project-06-runtime-observability-and-debugging/
