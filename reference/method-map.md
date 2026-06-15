# Method Map

One-page index mapping common long-running coding-agent failure modes to the
artifact or operating rule that fixes them first, and to where each lives in my
harness. Use it to pick the smallest intervention for an observed problem.

| Failure mode | What it looks like | Primary fix | Supporting artifact | Where in my harness |
| --- | --- | --- | --- | --- |
| Cold-start confusion | A new session spends most of its time rediscovering setup and status | Make the repo + memory the system of record | progress / implementation docs | SessionStart hook + claude-mem priming; `create-app-implementation-docs` |
| Scope sprawl | The agent starts several features and finishes none cleanly | Restrict active scope to one slice | `feature_list.json` | `lectures/` plan lifecycle; one active plan rule |
| Premature completion | Claims "done" after edits but before runnable proof | Bind completion to evidence | clean-state / validation checklist | validation-gates; `repo-engineering-review` evidence standard |
| Fragile startup | Every session re-learns how to boot | Standardize setup and verification | `init.sh` / `uv` commands | `init.sh`; `uv run` for Python |
| Weak handoff | Next session cannot tell what is verified, broken, or next | End with an explicit handoff | session handoff note | claude-mem capture + end-of-session mirror |
| Subjective review | Review quality depends on taste or memory | Score output with fixed categories | evaluator rubric | `repo-engineering-review` skill; `QUALITY_SCORE.md` |
| Prompt drift / slop | Vague prompts yield generic or off-spec output | Calibrate role + positive-directive prompts | role prompts | `docs/prompts/`; `prompt-calibration.md`; anti-slop rules |
| Untested code | Production code lands without a failing test first | Enforce test-first | failing test | TDD mandate (global CLAUDE.md) |
| Unsafe defaults | Secrets leak; destructive commands run unguarded | Bake security in from line 1 | `SECURITY.md` | bash-guard hook; Supabase RLS + server-side auth |

## Cross-links

- **Reference docs:** `coding-agent-startup-flow.md`,
  `initializer-agent-playbook.md`, `prompt-calibration.md` (this folder).
- **Lectures:** see `lectures/` for the longer-form rationale behind each fix
  (startup discipline, scope control, evidence-based completion, review rubrics).
- **Skills:** `create-app-implementation-docs` (spec-first docs that prevent
  cold-start and slop) and `repo-engineering-review` (evidence-based review that
  prevents premature completion and subjective review).

## Operating Principle

Add the smallest artifact that directly addresses the observed failure mode.
Do not solve every reliability problem by dumping more text into one global
instruction file — split detail into a small doc, a check, or a hook, and link
to it.

## In my harness

- This file is the **index** that cross-links the `lectures/` (rationale) with my
  two skills (mechanism). When a failure mode recurs, route to the lecture for
  the "why" and to the skill for the "how."
- Fixes prefer **mechanical enforcement** over prose: a recurring review comment
  becomes a bash-guard rule, a linter, or a validation gate — not another
  paragraph in `AGENTS.md`.
- The completion / review rows are anchored to the **`repo-engineering-review`
  evidence standard**: runnable proof and fixed rubric categories, not vibes.

**Source:** https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/docs/en/resources/reference/method-map.md
