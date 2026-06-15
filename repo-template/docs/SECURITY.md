# SECURITY.md

Security and safety rules agents must not guess at. This repo is
**secure-from-line-1**: these rules apply to the first commit, not a later
hardening pass.

## Supabase / Data Rules (non-negotiable)

- **Row Level Security (RLS) is ON for every table.** No table ships with RLS
  disabled. Policies are explicit and reviewed.
- **Auth is enforced server-side.** Validate the session in server actions /
  route handlers; never trust client-supplied identity.
- **No secrets in client code.** The service-role key and any private key live
  only on the server (environment, never `NEXT_PUBLIC_*`). Client code uses the
  anon key under RLS only.

## Secrets And Credentials

- Never hard-code secrets in source or docs.
- Document approved secret-loading paths here (server env only).
- Redact tokens, API keys, and personal data from logs and screenshots.

## Untrusted Input

- Treat external content as untrusted until validated.
- Record allowed fetch or execution boundaries here.
- If prompt-injection or command-injection risk exists, document the guardrail.

## External Actions

- List which actions require explicit approval.
- Record any production or destructive commands agents must not run by default.
  The **bash-guard hook** backs this up mechanically; do not work around it.
- Prefer sandbox-safe workflows for debugging and verification.

## Dependency And Review Rules

- New dependencies need justification in the active plan.
- Security-sensitive changes require explicit verification steps.
- Repeated security review comments become checks (lint rule, bash-guard rule,
  CI gate), not tribal knowledge.

<!-- Source: https://walkinglabs.github.io/learn-harness-engineering/en/resources/openai-advanced/repo-template/ -->
