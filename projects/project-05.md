# Project 05. Make the Agent Verify Its Own Work

> Related lectures: Lecture 09 (Stop agents from declaring victory early) · Lecture 10 (Only a full-pipeline run counts as real verification)

## What You Do

Implement role separation — a **generator** that implements, an **evaluator** that reviews, and optionally a **planner**. Run the same feature upgrade three times to measure the effect of each added role.

Choose one substantive feature upgrade (multi-turn conversation, citation-panel redesign, or document filtering) and keep it **constant** across all three runs, so the only variable is role separation. The checked-in feature is multi-turn Q&A conversation history.

### Steps

1. Pick the feature and freeze its scope for all three runs.
2. **Run A — single role:** one agent plans, implements, and self-reviews.
3. **Run B — gen + eval:** a generator implements; a separate evaluator scores against a rubric and demands revisions until it passes.
4. **Run C — plan + gen + eval:** add a planner that writes a sprint contract before generation; generator implements; evaluator scores.
5. Score each run with the same `evaluator-rubric.md` and record the defects and revision evidence.

### Deliverables

- The same feature implemented three times (single-role, gen-eval, plan-gen-eval)
- `evaluator-rubric.md` per run with a numeric score and listed defects
- `sprint-contract.md` for the plan-gen-eval run
- Revision evidence (what the evaluator rejected and how the generator fixed it)

## Tools

- Claude Code or Codex
- Git
- Node.js + Electron

## Harness Mechanism

Self-verification + grounded Q&A + evidence-based completion

## Use the Checked-In Project

Repository path: `projects/project-05/`

| Directory | What it contains | What to compare |
|------|------|------|
| `starter/` | Project 04-based app before the conversation-history upgrade. | Starting point if you want to rerun the three variants yourself. |
| `solution/single-role/` | One agent plans, implements, and self-reviews. | `evaluator-rubric.md` score **1.6/5** and listed defects. |
| `solution/gen-eval/` | Generator plus evaluator with revision evidence. | `evaluator-rubric.md` score **3.3/5** and revision notes. |
| `solution/plan-gen-eval/` | Planner plus generator plus evaluator. | `sprint-contract.md`, `evaluator-rubric.md` score **4.9/5**. |

Keep the feature (multi-turn Q&A conversation history) constant across all three variants so the only variable is role separation.

## Success Criteria

- The same feature is implemented in all three variants with identical scope.
- Each variant is scored with the same rubric; scores rise with added roles (single ≪ gen-eval ≪ plan-gen-eval).
- The evaluator produces grounded, evidence-based rejections — not vibes — and the generator's revisions are traceable.
- "Done" is declared only after a full end-to-end run, never on the generator's say-so.

## How I'd do this in my harness

This is grounded Q&A plus the generator/evaluator/planner split — and my harness is built around exactly that separation of concerns:

- **Generator / evaluator / planner roles** → `superpowers:subagent-driven-development` runs the generator as an implementation subagent, then `superpowers:requesting-code-review` / `receiving-code-review` (and the `codex` skill's independent `review`/`challenge` modes) act as the evaluator — a *separate* context that can't rubber-stamp the generator. The planner role is `superpowers:writing-plans` producing the sprint contract before any code. That's the three runs without me hand-wiring three agents.
- **Evidence-based completion (no early victory)** → `superpowers:verification-before-completion` is the anti-"declare victory early" gate, and `validation-gates` from `create-app-implementation-docs` produce the `evaluator-rubric.md` equivalent: a validation doc that gates the run. For UI feature upgrades (citation panel, filtering, multi-turn), the evaluator's evidence is real browser QA via `qa` / `qa-only` / `browse` + `playwright` with before/after screenshots and a numeric health score — that's my rubric score.
- **Grounded Q&A** → answers must cite sources. The `wiki-search` discipline ("every claim cites a file path") and context-mode's `ctx_search` (retrieval with source labels) are how I keep Q&A grounded rather than hallucinated; the citation panel is verified against the indexed chunks the answer claims to use.
- **Scoring the ablation** → I'd record each run's rubric score and defects as `claude-mem` observations and, for LLM-judge scoring, drive it through **Langfuse** datasets/scores (`createScore`, `createDatasetRunItem`) so the single-role→gen-eval→plan-gen-eval lift is real data, not a vibe. `benchmark-models` exists for the same "which configuration actually wins" question.
- **Constant feature, only-variable-is-roles** → `using-git-worktrees` gives each of the three runs an isolated workspace from the same starter commit, so scope truly stays frozen across variants.
- **TDD throughout** → each variant's feature is still test-first; the evaluator checks that the failing-test-first discipline held, which is part of why role separation raises the score.

Net: the lesson's three-role ablation maps onto subagent-driven generation, independent code-review/codex evaluation, writing-plans for the sprint contract, validation-gates + browser QA as the rubric, and Langfuse/claude-mem for scoring the lift — with worktrees keeping the feature constant.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/projects/project-05-grounded-qa-verification/
