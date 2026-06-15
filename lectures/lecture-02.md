# Lecture 02. What a Harness Actually Is

"Harness" gets thrown around loosely in agent circles, and most of the time it just means a prompt file. A prompt file is not a harness.

A harness is five subsystems — **instructions, tools, environment, state, feedback** — each with clear responsibilities and a way to evaluate it. This lecture gives that definition something you can act on today.

## Start with an analogy

You're a new hire dropped into a project with zero documentation. No README, no comments, nobody tells you how to run the tests, the CI config is buried somewhere. Can you write good code? Maybe — if you're smart and patient. But you'll spend enormous effort *figuring out what the project is* rather than *solving the problem*.

An agent faces the same predicament, only worse: you can at least corner a colleague. The agent sees only the files you put in front of it and the commands it can run.

OpenAI frames the core principle as **"the repo IS the spec"** — all necessary context lives in the repository, delivered through structured instruction files, explicit verification commands, and clear directory organization. Anthropic's long-running-agents work emphasizes state persistence, explicit recovery paths, and structured progress tracking. Different emphases, same claim: **everything in the engineering infrastructure outside the model determines how much of the model's capability is actually realized.**

A few familiar tools, read through this lens:

| Tool | Instructions | Tools | State | Verdict |
|------|-------------|-------|-------|---------|
| **Claude Code** | reads `CLAUDE.md` | shell + files | session history | Embodies harness thinking — but it can't verify if you never tell it how to run tests |
| **Cursor** | `.cursorrules` | terminal | weak — closes with the IDE | Same logic, fragile state |
| **Codex** | `AGENTS.md` | git worktrees + local observability (logs/metrics/traces) | per-task isolation | Far better in harnessed repos than bare ones |
| **AutoGPT** | ad hoc | broad | none structured | The cautionary tale: context piles up, the agent loops. Not the model that fails — the harness |

## Core concepts

- **What a harness is** — everything outside the model weights. OpenAI distills the engineer's job to three things: designing environments, expressing intent, building feedback loops. Anthropic calls their Agent SDK a "general-purpose agent harness."
- **The repo is the single source of truth** — anything the agent can't see effectively does not exist. The repo is the *system of record*.
- **Give a map, not a manual** — `AGENTS.md` should be a directory page, not an encyclopedia. ~100 lines. If it won't fit, split into `docs/` and let the agent read on demand.
- **Constrain, don't micromanage** — enforce invariants with executable rules rather than enumerating instructions. And separate "the worker" from "the checker," because agents confidently praise their own output.
- **Remove one at a time and observe** — to measure each component's marginal value, ablate it and see which removal hurts most. Anthropic found that as models strengthen some components stop being critical — but new critical ones always emerge.

## The five-subsystem model

```
Project rules (AGENTS.md/CLAUDE.md) ┐
Progress + git (PROGRESS.md/commits)├─> Agent ─> Tools (shell/files/tests)
                                     ┘            └─> Runtime (deps/services/versions)
                                                       └─> Checks (test/lint/build) ─> back to Agent
```

- **Instructions** — `AGENTS.md`/`CLAUDE.md`: project overview and purpose, stack + versions, first-run commands, non-negotiable hard constraints, links to deeper docs.
- **Tools** — give enough access. Don't disable shell "for security" (an agent that can't `pip install` can't work), but don't open everything either — least privilege.
- **Environment** — make state self-describing: lock deps (`pyproject.toml` / `package.json`), pin runtimes (`.python-version` / `.nvmrc`), reproduce with Docker or devcontainers.
- **State** — long tasks need progress tracking. A simple `PROGRESS.md`: done / in progress / blocked. Write it before a session ends; read it when the next begins.
- **Feedback** — the highest-ROI subsystem. List verification commands explicitly:

```
Verification commands:
- Tests:     pytest tests/ -x
- Type check: mypy src/ --strict
- Lint:      ruff check src/
- Full:      make check
```

Miss any one of the five and the harness is incomplete — the agent will always feel awkward to use.

A fuller component inventory for a local coding agent — **Model:** the LLM. **Harness:** system prompt, `AGENTS.md`, bash tool, file read/write, git access, local filesystem, startup scripts, test commands, stop hooks, lint checks, evaluator loop. Change any harness piece and you change the effective agent.

### Quantifying component value

Use a **controlled-variable exclusion test**: fix the model, remove subsystems one at a time, and rank by the size of the performance drop. That tells you which component is *most valuable right now*. But it does **not** by itself locate the bottleneck — a near-zero-impact component may be redundant, badly designed, or just not exercised by this task. To find the real bottleneck you must read the failure records and attribute root cause: unclear task? thin context? unreproducible environment? missing verification? broken state? Ablation is supporting evidence, not a verdict.

## A team's real story

A team used GPT-4o on a TypeScript + React app (~20k LOC), adding harness components one stage at a time:

| Stage | Added | Success rate |
|-------|-------|--------------|
| 1 | README only | 20% (1/5) — wrong package manager, broke naming conventions, couldn't run tests |
| 2 | `AGENTS.md` (versions, conventions, key decisions) | 60% |
| 3 | Verification commands (`yarn test && yarn lint && yarn build`) | 80% |
| 4 | Progress-file template | 80-100% |

Four iterations, the model never changed, success went from 20% to near 100%.

## Key takeaways

- Harness = Instructions + Tools + Environment + State + Feedback. All five matter.
- If it isn't model weights, it's harness — and the harness determines how much capability is realized.
- Feedback is usually lowest cost, highest return. Get verification commands right first.
- Use ablation to rank marginal value; use failure attribution to find the bottleneck.
- Harness rots like code. Audit it; pay down harness debt like technical debt.

## How this maps to my harness

- **My whole stack already *is* a five-subsystem harness — I should name the layers:**
  - *Instructions* = my global `~/.claude/CLAUDE.md` (Karpathy principles + TDD law) plus per-project `CLAUDE.md`/`AGENTS.md`, and my **skills** (`create-app-implementation-docs`, `repo-engineering-review`, superpowers) as loadable, scoped instruction modules.
  - *Tools* = Claude Code's shell + file tools under `bypassPermissions` — maximum affordance, which is exactly why the next layer matters.
  - *Environment* = `uv`-managed Python envs and pinned runtimes; reproducibility is a stated rule, not a hope.
  - *State* = **claude-mem** (cross-session memory) + **context-mode** (`ctx_*`) + my `context-save`/`context-restore` skills — the persistent progress layer this lecture says long tasks require.
  - *Feedback* = the mandatory TDD loop (RED→GREEN→REFACTOR) plus "end with full suite + type/lint green and report counts" — my always-on verification subsystem.
- **My `bash-guard.sh` hook is a deterministic gate, not an instruction.** It enforces invariants ("don't micromanage") at the tool boundary — the constrain-don't-micromanage principle implemented as a hook rather than a prompt rule the model might skip.
- **The "separate worker from checker" idea is already in my toolkit:** superpowers `requesting-code-review` / `subagent-driven-development` and my `repo-engineering-review` skill act as the independent checker, since agents over-praise their own work.
- **`repo-engineering-review` is my standing harness audit** — it's how I "audit regularly and pay down harness debt" against a live repo instead of trusting memory.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-02-what-a-harness-actually-is/
