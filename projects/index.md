# Harness Engineering — Projects (Overview)

This is the hands-on track of *Learn Harness Engineering*, adapted for my own
Claude Code harness. Reading the lectures is not enough — the point is to build
the environments and watch how an agent (Claude Code / Codex) actually behaves
when the rules around it change.

All six projects build the *same product*: a small Electron knowledge-base app
(document list, import, chunking + indexing, citation-based Q&A). The product is
deliberately simple. The thing being engineered is the **harness** around the
agent — the rules, state files, scope controls, verification gates, and
observability that make a capable model execute *reliably*.

## The six projects

| # | Title | Harness mechanism introduced |
|---|-------|------------------------------|
| 01 | Prompt-Only vs. Rules-First | `AGENTS.md` + `init.sh` + `feature_list.json` (minimal harness) |
| 02 | Make the Project Readable | Agent-readable workspace + persistent state / handoff files |
| 03 | Work Across Session Restarts | Progress log + session handoff + one-feature-at-a-time verification |
| 04 | Use Runtime Feedback to Correct Behavior | Runtime logs + architecture boundary checks + scope control |
| 05 | Make the Agent Verify Its Own Work | Role separation (planner / generator / evaluator) + grounded completion |
| 06 | Build a Complete Harness (Capstone) | Everything assembled + observability + ablation study |

## Suggested order

Do them **in sequence, 01 → 06**. Each project's `starter/` is the previous
project's code with the next gap left open, so the codebase and the harness grow
together. Skipping ahead means inheriting an app you never watched fail under a
weak harness — which defeats the purpose.

## How each project works

Every project folder in the source repo ships two shapes:

- **`starter/`** — the weak-harness run. Minimal or missing rule files; you give
  the agent the task and measure what it completes (and how much it rediscovers).
- **`solution/`** — the same product slice with explicit harness artifacts
  (`AGENTS.md`, `feature_list.json`, `session-handoff.md`, etc.) so you can
  compare against an evidence-backed completion.

The exercise is always the same loop: **run weak → run with harness → compare**.
Projects 05 and 06 add more runs (role-separation variants; baseline vs.
strong-harness vs. cleanup, plus an ablation pass).

## How this maps onto my harness

These projects map almost one-to-one onto tooling I already run:

- **P01 minimal harness** → my global `CLAUDE.md` (Karpathy principles + TDD) and
  per-project `AGENTS.md` / `feature_list` conventions.
- **P02 readable workspace** → the `repo-engineering-review` README/`docs/`
  standard.
- **P03 multi-session continuity** → `claude-mem` + `/context-save` /
  `/context-restore` + `session-handoff.md`.
- **P04 incremental indexing / runtime feedback** → `context-mode`
  (`ctx_fetch_and_index` / `ctx_execute` / `ctx_search`) is *literally* this
  pattern; plus structured logging.
- **P05 grounded QA / role separation** → `create-app-implementation-docs` role
  prompts, `superpowers` TDD + verification-before-completion, and real-browser
  QA (`gstack`/`browse` + Playwright) for evidence.
- **P06 capstone observability** → `context-mode` + `langfuse` MCP +
  `claude-mem` observations, plus an ablation experiment over my own harness
  components.

Each project file below keeps the source's structure (goal, tools, mechanism,
starter/solution table, rubrics) and adds a **"How I'd do this in my harness"**
section translating the exercise into my actual tools and skills.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/projects/
