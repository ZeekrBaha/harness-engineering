# Prompt Calibration

Root instructions and role prompts should define the operating frame, not every
possible move. Calibration is the discipline of keeping prompts oriented toward
what to do, not buried in every past failure.

## Keep In The Root File

- repository purpose and scope
- startup path
- verification path
- non-negotiable constraints (TDD, security-from-line-1)
- required state artifacts
- end-of-session rules

## Move Out Of The Root File

- long historical edge cases
- topic-specific implementation details
- local architecture notes that belong near the code
- examples that only apply to one subsystem

## Positive-Directive Rule

Write prompts as positive directives — state the desired behavior, not a wall of
prohibitions. "Use a pinned type scale and real data" beats "don't use random
fonts and don't fake data." Negatives are unavoidable for hard safety rails, but
the default voice is what the agent should do, expressed concretely enough that
a fresh session can act on it without guessing.

## Anti-Slop Prompt Rules

- Specify concrete tokens and constraints, not adjectives ("pin the type scale,"
  not "make it look clean").
- Ban known slop tells explicitly where they keep recurring: generic fonts
  (Inter/Roboto), purple→blue gradients, emoji-as-icons, the hero→3-cards
  template.
- Require real data and real states (empty / loading / error), not lorem and
  happy-path mockups.
- Make acceptance objective: WCAG AA, a passing test, a screenshot of the real
  flow — not "looks good."

## Working Rule

The root file should help a fresh session orient itself quickly. If it is
becoming a dumping ground for every past failure, split the detail into smaller
docs (or a check) and link to them instead. If a calibration note keeps getting
ignored, promote it from prose into a mechanical rule.

## In my harness

- **Role prompts live in `docs/prompts/`.** Each role (initializer, implementer,
  reviewer, frontend) gets a calibrated prompt scoped to its job; the root
  `AGENTS.md`/`CLAUDE.md` stays a router and points at them.
- The **positive-directive rule** is the default voice for those prompts —
  describe the target behavior; reserve hard "never" rules for security and the
  anti-slop bans.
- **Anti-slop rules** are shared with `docs/FRONTEND.md` (pin tokens; ban
  Inter/Roboto, purple→blue gradients, emoji-icons, hero→3-cards; real data;
  WCAG AA) so the same calibration applies whether the agent is prompted or
  reviewed.
- Recurring feedback is mechanized, not re-explained: a repeated slop tell
  becomes a lint/check or a bash-guard rule, consistent with the
  `repo-engineering-review` standard.

**Source:** https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/docs/en/resources/reference/prompt-calibration.md
