# Lecture 04. Split Instructions Across Files

You started taking harness engineering seriously, so you created an instruction file and packed in every rule, constraint, and hard-won lesson you could think of. One month later it was 300 lines, two months 450, three months 600. Then the agent's performance starts *degrading*: on a trivial bug fix it burns context chewing through irrelevant deployment notes, a critical security constraint buried at line 300 gets ignored outright, and three contradictory style rules mean it picks one at random each run.

This is the "giant instruction file" trap. Everything looks useful, so you cram it all in, and finding one specific rule means rifling through the whole document. You wrote 600 lines, but only a third is relevant to the task in front of the agent.

## The Vicious Cycle at the Root

The loop is familiar: the agent makes a mistake, you say "add a rule to prevent this," you append it to the instruction file, and it works — temporarily. Then a different mistake, another rule. Repeat until the file bloats out of control. "Add a rule" feels reasonable every time, but the cumulative effect is corrosive.

- **Context budget gets eaten alive.** The window is finite. A bloated instruction file can consume 10–20K tokens. That seems survivable until you remember a real task also reads dozens of source files, accumulates tool output, and grows conversation history. By the time the agent needs to actually understand the code, the budget is gone.
- **Lost in the middle.** Liu et al. (2023) showed LLMs use information in the *middle* of long texts far less effectively than at the start or end. Your hard security constraint at line 300 is exactly where it is most likely to be dropped.
- **Priority conflicts.** A non-negotiable ("never use `eval()`"), a soft guideline ("prefer functional style"), and a one-off historical note ("watch for the WebSocket leak we hit last week") all look identical on the page. The agent has no signal for which is a red line.
- **Maintenance decay.** Big files rot. Obsolete rules never get deleted (deletion feels risky), new rules feel free to add. The file only grows; signal-to-noise only falls. Same dynamics as technical debt.
- **Contradiction accumulation.** Rules added at different times start fighting — "use strict mode" vs. "legacy files may use `any`." The agent flips a coin.

## Core Concepts

- **Instruction Bloat** — When the instruction file occupies 10–15% of the window, it crowds out budget for code reading and reasoning.
- **Lost in the Middle** — Middle-of-document information is disproportionately ignored. Put critical rules at the extremes, or better, move them out.
- **Instruction Signal-to-Noise Ratio (SNR)** — The share of loaded instructions actually relevant to the current task. Reading 50 lines of deploy rules during a bug fix is low SNR.
- **Entry File** — A short router whose job is to point the agent at detailed docs, not to contain everything. 50–200 lines.
- **Reveal on Demand** — Overview first, detail when needed. Good harness design is good UI design: don't dump every option at once.
- **Can't Tell What Matters** — When everything shares one format and location, hard constraints and soft suggestions are indistinguishable.

## How to Split

Keep frequently-needed info at hand, tuck away rarely-needed info, and don't carry what you never use.

The entry file stays 50–200 lines: a one-line project overview, first-run commands, the global hard constraints (≤15 non-negotiables), and links to topic docs (one-line description + when it applies).

```markdown
# AGENTS.md

## Project Overview
Python 3.11 FastAPI backend, PostgreSQL 15.

## Quick Start
- Install: `make setup`
- Test: `make test`
- Full verification: `make check`

## Hard Constraints
- All APIs use OAuth 2.0
- All DB queries use SQLAlchemy 2.0 syntax
- All PRs pass pytest + mypy --strict + ruff check

## Topic Docs
- API patterns (`docs/api-patterns.md`) — read when adding endpoints
- Database rules (`docs/database-rules.md`) — read when touching DB
- Testing standards (`docs/testing-standards.md`) — reference when writing tests
```

Each topic doc is 50–150 lines, organized by subject under `docs/` or next to its module, loaded only when needed. Think packing cubes: you find the charger without emptying the whole bag. Some knowledge belongs *in the code itself* — type definitions, interface comments, config explanations — where the agent sees it naturally; don't duplicate it in instructions.

Every instruction should carry a **source** (why added), an **applicability condition** (when it applies), and an **expiry condition** (when it can be removed). Audit regularly; delete stale, redundant, contradictory entries. Manage instructions like dependencies — unused ones only slow the system down. If a rule absolutely must live in the entry file, put it at the top or bottom, never the middle.

Both OpenAI ("entry files should be short and routing-oriented") and Anthropic ("control information for long-running agents should be concise and high-priority") endorse this split.

## Real-World Example

A SaaS team's instruction file grew 50 → 600 lines, mixing stack versions, style rules, bug-fix history, API guides, deploy steps, and personal preferences. Bug fixes wasted context on deploy notes; the "parameterized queries" security rule sat at line 300 and was routinely ignored; three contradictory style rules randomized output.

The refactor:
1. Entry file trimmed to 80 lines — overview, run commands, 15 hard constraints.
2. Topic docs created — `api-patterns.md` (120), `database-rules.md` (60), `testing-standards.md` (80).
3. Links added in the entry file.
4. Historical notes converted to test cases or deleted.

Result: same task set, success 45% → 72%; security-constraint compliance 60% → 95% (the rule moved from the middle to the top, no longer lost).

## Key Takeaways

- "Add a rule" is short-term relief and long-term poison. First ask whether it belongs in a topic doc.
- The entry file is a router, not an encyclopedia: overview, hard constraints, links.
- Exploit lost-in-the-middle — extremes for what stays, topic docs for the rest.
- Manage instruction bloat like tech debt: audit regularly; every rule has source, applicability, expiry.
- After splitting, SNR rises and more budget goes to the actual task.

## How this maps to my harness

- **Progressive disclosure is already my skill convention.** Keep every `SKILL.md` under ~500 lines and push depth into `references/` — `create-app-implementation-docs` and `repo-engineering-review` should route to detail, not inline it. This is the entry-file-as-router idea applied to skills.
- **Keep my global `CLAUDE.md` lean (<300 lines).** The Karpathy principles + mandatory TDD + `uv` rule are hard constraints and belong at the top; anything situational moves to a referenced doc so it is loaded on demand, not every session.
- **Use nested `AGENTS.md` per project/module** instead of one mega-file — the spec pipeline (`constitution → … → validation`) already externalizes concerns into separate docs, which is exactly this split.
- **Encode source / applicability / expiry on rules.** My `repo-engineering-review` evidence-based audit style fits here: every constraint should justify itself or be pruned, the same way it separates "has tests" from "shows TDD."
- **The `bash-guard` PreToolUse hook is the right home for true hard constraints** (rm -rf, DROP/TRUNCATE, force push) — enforced mechanically by the harness, not buried as prose line 300 where lost-in-the-middle would eat it.
- **claude-mem holds the historical "lessons learned"** so they don't bloat the instruction file — one-off bug notes become searchable observations, not permanent context tax.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-04-why-one-giant-instruction-file-fails/
