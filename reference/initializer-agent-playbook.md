# Initializer Agent Playbook

Use this for the first serious session in a repository, before incremental
feature work begins. The job of the initializer is to build a stable operating
surface so later sessions implement behavior without re-deriving startup
commands, current status, or task boundaries.

## Goal

Leave the repository in a state where a fresh, context-free session can orient
itself entirely from in-repo artifacts and primed memory.

## Required Outputs

The initializer should leave behind at least:

- a root router file (`AGENTS.md` or `CLAUDE.md`) — short, points into docs
- the **implementation-doc set** from `create-app-implementation-docs`:
  research/constitution, requirements, design, design-system, architecture,
  task, agent-role, prompt, and validation docs
- a machine-readable feature surface (`feature_list.json`)
- a standard startup helper (`init.sh`, or documented `uv` commands)
- a security baseline (`docs/SECURITY.md`) with RLS-on, server-side auth, and
  no-client-secrets stated from line 1
- an initial safe commit capturing the baseline scaffold

## Checklist

1. Run the **research phase** of `create-app-implementation-docs` to produce the
   constitution and research docs (problem, users, constraints, stack choice).
2. Define the standard startup path (bootstrap + run).
3. Define the standard verification path (tests, smoke, golden journeys).
4. Decompose the work into explicit features with statuses in
   `feature_list.json`.
5. Write the first failing acceptance test (TDD) for the thinnest end-to-end
   slice.
6. Create the progress artifact and record the starting state.
7. Create the first clean baseline commit.

## Success Test

A fresh session with no prior chat context should be able to answer, from the
repo alone:

- what this repository does
- how to start it
- how to verify it
- what is unfinished
- what the next best step is
- what the security and quality bars are

## In my harness

- The initializer is effectively a **`create-app-implementation-docs` run**: its
  constitution/research/design/architecture/task/validation docs are the durable
  operating surface this playbook asks for. Do not hand-roll ad hoc instruction
  files when that skill produces the canonical set.
- **claude-mem session priming** plus the **SessionStart hook** mean the
  initializer should write its decisions where memory can capture them, so the
  next session's startup is primed automatically.
- **TDD + uv** apply to the baseline: the first commit includes a failing
  acceptance test, and Python bootstrap is `uv`-based.
- **Security from line 1**: the baseline commit ships `SECURITY.md` with
  Supabase RLS on, server-side auth, and no client-side secrets — not as a later
  hardening pass.
- The success test mirrors the **`repo-engineering-review`** evidence standard:
  if a fact is not discoverable in-repo, treat it as operationally unavailable.

**Source:** https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/docs/en/resources/reference/initializer-agent-playbook.md
