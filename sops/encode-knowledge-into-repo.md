# Encode Unseen Knowledge Into The Repo

A one-off discovery, a Slack decision, or a review finding is worthless to the
next session if it only lives in chat. This SOP turns invisible context into a
**durable, discoverable artifact** the agent can act on cold — no human required.

## Goal

Make agent-invisible knowledge discoverable in-repo so a fresh session acts
correctly without relying on prior conversation.

## Trigger signals

- The agent keeps re-asking how the system works.
- Humans say "we decided this in Slack" or "follow what X said last week."
- Reviews cite product/security rules that aren't written anywhere in-repo.
- New sessions repeat discovery work that should already be settled.

## Execution

1. **List the invisible sources** — docs, chat threads, tickets, tacit team
   rules, verbal decisions.
2. **Classify each** — is it architecture, product behavior, security policy,
   reliability expectation, plan state, or reference material?
3. **Encode it into the matching artifact:**

   | Knowledge type                  | Target artifact                          |
   | ------------------------------- | ---------------------------------------- |
   | Architecture                    | `ARCHITECTURE.md`                        |
   | Product behavior                | `docs/product-specs/`                    |
   | Design rationale                | `docs/design-docs/`                      |
   | Execution / plan state          | `docs/exec-plans/`                       |
   | Repeated external references    | `docs/references/`                       |
   | Quality / reliability bar       | `docs/QUALITY_SCORE.md`, `RELIABILITY.md`|
   | Reusable agent behavior / rule  | a skill or `CLAUDE.md`                   |

4. **Rewrite vague into operational** — "be careful with auth" becomes a
   testable rule with the specific constraint.
5. **Deprecate stale copies** so the repo keeps one discoverable truth.

## Good encoding rules

- Write for discoverability, not literary completeness.
- Short docs, clear filenames, linked to related artifacts.
- Store durable rules, not meeting transcripts.
- Encode in the **same session** the decision is made — before the context evaporates.

## Definition of done

- A fresh agent finds the rule without asking a human.
- The same fact isn't scattered across contradictory files.
- The artifact lives next to the code or workflow it governs.

## In my harness

The core move: **a review finding or discovery becomes a durable rule in a
skill or CLAUDE.md — never lost in chat.** My encoded-knowledge layer:

- **CLAUDE.md (global + project)** — the canonical home for durable rules.
  Karpathy principles, mandatory TDD, `uv`-first all live here precisely so
  every session inherits them cold. New tacit rule discovered? It goes here, or
  via the `update-config` skill if it needs a hook to enforce it.
- **Skills as encoded behavior** — `repo-engineering-review` and
  `create-app-implementation-docs` (spec-first pipeline) are reusable knowledge
  frozen into procedure. When a review surfaces a recurring standard, encode it
  into the relevant skill's README/standards rather than re-deriving it.
- **claude-mem** — persistent cross-session memory and observations. Use
  `mem-search` to check "did we already decide this?" before re-discovering, and
  let it capture decisions so they survive compaction.
- **context-mode knowledge base** — `ctx_fetch_and_index` / `ctx_index` to
  persist external references (docs, specs) and `ctx_search` to recall them
  on-demand without re-reading raw bytes. The durable home for "repeated
  external references" in the table above.
- **context-save / context-restore** — checkpoint working state so plan/exec
  context carries across sessions and Conductor handoffs.

Mapping discovery to artifact: architecture/audit findings -> repo docs or
`repo-engineering-review` standards; reusable behavior -> a skill or CLAUDE.md;
external reference material -> context-mode KB; in-flight decisions -> claude-mem.

**Source:** https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/docs/en/resources/openai-advanced/sops/encode-knowledge-into-repo.md
