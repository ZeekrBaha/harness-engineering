# Lecture 01. A Strong Model Is Not a Reliable One

As of late 2025, the strongest coding agents score roughly 50-60% on SWE-bench Verified. That sounds respectable until you remember what those tasks are: hand-picked issues with clear descriptions and ready-made test cases. Hand the same model your real work instead — vague specs, no tests, business rules scattered implicitly across the codebase — and the pass rate falls further. You delegate a task with confidence, the agent runs for twenty minutes, declares "all done," and the code added a feature while breaking the tests, fixed a bug while introducing two more, and isn't quite what you asked for anyway.

The reflex reaction is "the model isn't good enough — let me reach for a more expensive one." Before you open your wallet: the problem is usually not the model.

## Same horse, different fates

Anthropic ran a clean controlled experiment. Same prompt ("build a 2D retro game editor"), same model (Opus 4.5), two runs.

| Run | Support | Time | Cost | Result |
|-----|---------|------|------|--------|
| 1 | Bare, no harness | 20 min | $9 | Core features didn't work |
| 2 | Full harness (planner / generator / evaluator) | 6 hrs | $200 | Fully playable game |

The model never changed. Opus 4.5 was Opus 4.5 in both runs. What changed was the *tack* — the harness around it.

OpenAI's 2025 harness-engineering write-up is blunter still: Codex in a well-harnessed repository moves from "unreliable" straight to "reliable." Not "a bit better" — a qualitative jump. **Harness** here means all the engineering infrastructure beyond the model weights.

## Where agents actually get stuck

The failure modes reduce to a short list. Each one maps to a *layer* you can fix.

- **Vague requirements — the agent can only guess.** "Add a search feature" means almost nothing. Search what? Full-text or structured? Paginated? Highlighted? You didn't say, so the agent guesses. A right guess is luck; a wrong guess costs several times more than precision would have.
- **Implicit conventions, never written down — the agent can't comply.** Your team uses SQLAlchemy 2.0; the agent defaults to 1.x. Every endpoint must go through OAuth 2.0, but that rule lives only in your head and a three-month-old Slack message. The agent isn't refusing to comply — it has never seen the rule.
- **Incomplete environment — the agent burns energy fixing the setup.** Missing dependencies, wrong tool versions. The agent spends precious context on `pip install` errors and Node version conflicts instead of the actual task.
- **No verification — the agent calls it done when it *feels* done.** No tests, no lint, or verification commands that were never communicated. Anthropic observed a related phenomenon: when an agent senses its context running low it rushes to finish, skips verification, and prefers a simple solution over the correct one. They call it **context anxiety**.
- **Cross-session state loss — every session starts from zero.** Last session's discoveries are gone; the new session re-explores structure from scratch. Without persistent state, failure rates spike on tasks over 30 minutes.

## Key terminology

- **Capability Gap** — the gulf between benchmark performance and real-task performance. A 50-60% SWE-bench score means nearly half of real issues go unsolved.
- **Harness** — everything outside the model: instructions, tools, environment, state management, verification feedback. If it isn't model weights, it's harness.
- **Harness-Induced Failure** — the model is capable enough, but the execution environment has a structural defect. The Anthropic experiment is proof.
- **Verification Gap** — the distance between the agent's confidence and the actual correctness of its output. "I'm done" when it isn't — the single most common failure mode.
- **Diagnostic Loop** — execute, observe failure, attribute it to a specific harness layer, fix that layer, re-execute. The core methodology.
- **Definition of Done** — a set of command-verifiable conditions (tests pass, lint clean, types check). Without one, the agent invents its own.

## When it fails, fix the harness first

One core principle: **when things fail, don't swap the model — check the harness.** If the same model succeeds on similar, well-structured tasks, assume the harness is at fault.

In practice, attribute every failure to one of five defense layers — **task specification, context provision, execution environment, verification feedback, state management** — instead of writing "the model isn't good enough" in your log.

Then write an explicit Definition of Done for every task. Not "add a search feature," but:

```
Completion criteria:
- New endpoint GET /api/search?q=xxx
- Supports pagination, default 20 items
- Results include highlighted snippets
- All new code passes pytest
- Type checking passes (mypy --strict)
```

Place an `AGENTS.md` (or `CLAUDE.md`) at the repo root describing the stack, conventions, and verification commands. This is the highest-ROI first step in harness engineering. One instruction file often beats upgrading to a pricier model — not a joke.

From there, run a diagnostic loop. Treat each failure as a signal that the harness exposed a defect: identify the layer, fix it, never fail that way again. A one-line log per task (succeeded / failed, which layer) is enough; after a few rounds the bottleneck layer becomes obvious and you can focus there.

### Failure-signals checklist

When reviewing a weak run, ask:

- Did the agent ask — or wrongly infer — how to start the app?
- Did it create directories or abstractions that don't match the intended product?
- Did it stop after a visible UI shell with no complete workflow?
- Did it leave notes/artifacts that help a future run continue?
- Could a fresh session understand what happened in under five minutes?

### What an underspecified task looks like

> Build a desktop knowledge-base app with AI question answering.
> Constraints: none. No startup command. No folder structure. No data model. No completion criteria.

Typical outcomes: the agent invents a structure ad hoc; the app may compile but not start consistently; the UI appears before any usable ingest/query path exists; the agent stops after cosmetic success.

## The million-line experiment

In 2025 three OpenAI engineers ran a five-month experiment: they wrote no code themselves — only Codex did. Starting from an empty git repo, they ended with ~1 million lines of agent-generated code (app logic, infra, tooling, docs) across 1,500 PRs — about 3.5 per person per day.

Early progress was slow. Codex wasn't weak; it lacked tools and structures complete enough to drive toward high-level goals. The fix was to break large goals into small blocks (design, code, review, test), let the agent assemble them, then compose blocks into harder tasks. Whenever something broke, the question was never "is the model trying hard enough" but "what is the agent still missing, and can that missing capability be supplied in a form it can understand and execute?"

> Source: OpenAI, "Harness engineering: leveraging Codex in an agent-first world"

## A down-to-earth example

A team used Claude Sonnet to add endpoints to a mid-sized Python app (FastAPI + PostgreSQL + Redis, ~15k LOC). First attempt was one sentence: "add user preferences endpoints under `/api/v2/users`." The agent spent 40% of its context exploring the repo, ignored the project's error-handling patterns, used old SQLAlchemy syntax, and declared done while the endpoint had runtime errors. The next session redid all the discovery.

They then added an `AGENTS.md`, explicit verification commands (`pytest tests/api/v2/ && python -m mypy src/`), and architecture decision records. Same model, three independent runs, all succeeded, ~60% better context efficiency. They changed the harness, not the model.

## Key takeaways

- Model capability and execution reliability are different things. Even a thoroughbred needs good tack.
- On failure, check the harness before the model. Swapping models is the most expensive option and rarely the actual fix.
- Every failure is a signal of a structural harness defect. Find it, fix it.
- Work the five layers systematically: unclear task, thin context, misconfigured environment, missing verification, lost state. Nine times in ten the bug lives in one of them.
- One good `AGENTS.md` can outperform a model upgrade.

## How this maps to my harness

- **My `repo-engineering-review` skill exists to catch exactly these five failure modes.** Its evidence-based audit — and the "has tests" vs. "shows TDD" distinction — is a diagnostic loop applied to a finished repo: attribute each weakness to a layer instead of blaming the model.
- **My evidence-labeling discipline (Evidence / Repository-fact / Assumption) is a verification-gap defense.** It forces me to separate "the agent is confident" from "this is verified in the repo" — the gap this lecture names as the most common failure.
- **My `bash-guard.sh` PreToolUse hook is a deterministic guard against the worst confident-wrong action.** When context anxiety pushes the agent toward a rushed shortcut, the hook still blocks `rm -rf`, `DROP/TRUNCATE TABLE`, `git push --force`, `git reset --hard`, etc. — a harness layer that doesn't depend on the model behaving.
- **My global `CLAUDE.md` already encodes a Definition of Done:** mandatory TDD (no prod code without a failing test) plus "end every task with the full suite + type/lint green and report counts." That is the command-verifiable DoD this lecture demands, applied to every task by default.
- **`bypassPermissions` raises the stakes on the harness, not the model.** With permission prompts off, the failure-mode that bites is *confident wrong action*, so the hook + TDD gates are doing the work the permission prompt used to.
- **claude-mem + context-mode are my state-management layer** — the fix for the cross-session loss this lecture flags as a 30-minute-task killer.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-01-why-capable-agents-still-fail/
