# Browser Validation Loop

Use this SOP when UI work needs real runtime evidence — screenshots, DOM state,
console output — not just code inspection. The point is to turn UI validation
into a repeatable interaction loop you re-run until the user journey is clean.

## Core loop

1. Pick the target page or running app instance.
2. Clear stale console noise.
3. Capture the BEFORE state (screenshot + DOM + console).
4. Trigger one UI path.
5. Watch runtime events during the interaction.
6. Capture the AFTER state.
7. Apply a fix and restart the app if needed.
8. Re-run until the journey is clean.

```
 select page  ->  clear console  ->  snapshot BEFORE
       ^                                    |
       |                              trigger ONE path
   restart/fix                              |
       |                              observe events
       |                                    |
   clean?  <-  compare BEFORE/AFTER  <-  snapshot AFTER
```

## Required inputs

- A stable startup command.
- A reproducible UI journey (the exact steps a user takes).
- A way to snapshot DOM, console, and screenshots.
- An explicit rule for what counts as "clean".

## Execution steps

1. Write the target journey into the active plan.
2. Define success in observable terms: text present, button enabled, error
   gone, console clean, request succeeded.
3. Snapshot the initial state before interacting.
4. Trigger exactly one path at a time — never batch interactions.
5. Record runtime events, DOM changes, and visible output.
6. On failure, fix the smallest responsible layer and restart.
7. Re-run the same path and diff BEFORE vs AFTER evidence.

## Clean criteria checklist

- [ ] Intended visible state is present.
- [ ] No unexpected errors.
- [ ] Console noise is understood or cleared.
- [ ] Re-running the same path gives the same result (deterministic).

## Artifacts to update

- The active execution plan.
- `docs/RELIABILITY.md` if the journey becomes a golden path.
- The product spec if the visible behavior changed.

## In my harness

I have no Chrome DevTools MCP. My real-browser tools are the gstack browse
daemon (~100ms per command) and playwright-cli — together they cover the whole
loop above.

- Drive the browser: `/browse` skill (or `playwright` skill) — navigate,
  interact, snapshot DOM/console, take annotated screenshots, diff before/after,
  test responsive layouts and forms. This is the literal core loop.
- Run the full test-fix-verify gate: `/qa` (fixes bugs and re-verifies) or
  `/qa-only` (report only). Maps to "re-run until clean".
- Designer's-eye runtime audit with before/after screenshots: `/design-review`.
- Confirm a specific change actually works in the running app: `/verify`.
- Performance regressions (load time, web vitals, bundle size) in the same
  daemon: `/benchmark`.
- Post-deploy watch against pre-deploy baselines: `/canary`.
- Authenticated journeys: `/setup-browser-cookies` before the loop; watch it
  live with `/connect-chrome`.

Workflow fit: plan the journey first (superpowers brainstorming / writing-plans),
follow MANDATORY TDD for any code fix, and close with
`verification-before-completion`. Persist a golden path in `docs/RELIABILITY.md`.

**Source:** https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/docs/en/resources/openai-advanced/sops/chrome-devtools-validation-loop.md
