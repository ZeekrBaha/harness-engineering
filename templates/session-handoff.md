# Session Handoff

> Compact handoff for the next session. Pair with `/context-save` (capture) and
> `/context-restore` (resume); the durable log lives in `claude-progress.md` and
> `claude-mem`. Fill in every field.

## Verified Now

- What is currently working:
- What verification actually ran (suite + type/lint, counts):
- Confidence (confirmed / likely / needs-runtime-verification):

## Changed This Session

- Code or behavior added (test-first):
- Infrastructure or harness changes:
- Security-relevant changes (RLS, auth, secrets, env):

## Broken Or Unverified

- Known defect:
- Unverified path:
- Risk for the next session:

## Next Best Step

- Highest-priority unfinished feature:
- Why it is next:
- What counts as passing (failing test to write first):
- What must not change during that step:

## Commands

- Startup: `./init.sh` (or `<startup-command>`)
- Verification: `<test + type/lint command>`
- Focused debug command:
- Resume: `/context-restore`

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/templates/ -->
