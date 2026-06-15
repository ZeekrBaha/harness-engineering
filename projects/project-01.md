# Project 01. Prompt-Only vs. Rules-First: How Much Difference Does It Make

> Related lectures: *Strong models don't mean reliable execution* · *What a harness actually is*

## Assignment goal

Build a minimal Electron knowledge-base app shell — a window with a document
list on the left, a Q&A panel on the right, and a local data directory. The task
itself is not complex. What's complex is how you get the agent to complete it.

You run it **twice**:

1. **First run — prompt only.** No preparation. Hand the agent the task and watch.
2. **Second run — rules first.** `AGENTS.md`, `init.sh`, and `feature_list.json`
   are pre-placed in the repo before the agent starts.

Then compare. (The course treats the rediscovery/preparation interval as an
illustrative example, not a fixed measured result.)

## Tools

- Claude Code or Codex (pick one, use it for **both** runs)
- Git (branch and compare)
- Node.js + Electron (project stack)
- A timer (record each run's duration)

## Harness mechanism

Minimal harness: `AGENTS.md` + `init.sh` + `feature_list.json`

## Steps / deliverables

- Run the agent against `starter/` (which contains only `task-prompt.md`, no
  `AGENTS.md` or `feature_list.json`). Measure what it completes with no extra
  structure.
- Run the agent against the `solution/` shape, where the same task is made
  concrete through explicit harness artifacts: `AGENTS.md`, `CLAUDE.md`,
  `init.sh`, `feature_list.json`, and a `claude-progress.md` evidence log.
- Compare the two: time, completeness, and how much the agent had to rediscover.

## Success criteria

The four concrete features must exist and be demonstrable:

1. Window launch
2. Document list
3. Question panel
4. Local data directory creation

Inspect `solution/feature_list.json` for the **expected evidence** of each
feature — the rules-first run is judged against that evidence, not against the
agent's own claim that it is "done".

| Directory | What it contains | How to use it |
|-----------|------------------|---------------|
| `starter/` | Only `task-prompt.md`; no `AGENTS.md` / `feature_list.json`. | Give the prompt to the agent; measure what it completes without structure. |
| `solution/` | Same slice with `AGENTS.md`, `CLAUDE.md`, `init.sh`, `feature_list.json`, `claude-progress.md`. | Compare how rules + verification evidence make the task concrete. |

## How I'd do this in my harness

This is exactly the contrast my setup is built around.

- **The "rules" already exist globally.** My global `CLAUDE.md` (Karpathy
  principles + mandatory TDD + `uv` for Python) is a permanent rules-first layer.
  For a clean A/B I'd run the weak case in a worktree where that influence is
  minimized, then the strong case with a per-project `AGENTS.md` /`CLAUDE.md`.
- **`feature_list.json` → my evidence-first habit.** I'd encode the four features
  as a checklist and refuse to mark any feature "pass" without evidence, mirroring
  `claude-progress.md`. The `superpowers:verification-before-completion` skill is
  the enforcement arm.
- **`init.sh` → repeatable bootstrap.** A small `init.sh` (install, build, launch
  Electron) so every session starts identically — and my `bash-guard` PreToolUse
  hook keeps it from doing anything destructive.
- **Default stack note.** The source uses Electron; my reflex stack is Next.js +
  TS strict. For faithfulness I'd keep Electron here, but the harness artifacts
  (`AGENTS.md`, feature list, init script) are stack-agnostic.
- **Measuring the gap.** Rather than a wall-clock timer alone, I'd capture both
  runs as `claude-mem` observations so the prompt-only vs. rules-first delta is
  searchable later — turning a one-off comparison into reusable memory.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/projects/project-01-baseline-vs-minimal-harness/
