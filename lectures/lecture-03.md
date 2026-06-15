# Lecture 03. The Repository Must Become the System of Record

Your team's architecture decisions are scattered across Confluence, Slack, Jira, and a few senior engineers' heads. For humans that barely works — you can ask a colleague, search chat, dig through docs, or corner someone in the break room. For an AI agent, information that isn't in the repository simply does not exist.

That's not hyperbole. An agent has exactly three input sources: system prompts and task descriptions, file contents from the repo, and tool execution output. Your Slack history, Jira tickets, Confluence pages, and the architecture call you had Friday afternoon — the agent sees none of it. It can't "go ask someone." Its entire working world is the repository.

So the real question is whether you'll give it a map that's good enough.

## What belongs on the map

OpenAI states it plainly: **information that doesn't exist in the repo doesn't exist for the agent.** They call this *repo as spec* — the repository is the highest-authority specification.

Anthropic echoes it from the state angle: persistent state is a necessary condition for long-task continuity, and cross-session knowledge recoverability directly determines success rates. That state must live in the repository — the only stable, reliably accessible storage the agent has.

"Our team is small, knowledge lives in people's heads, and it works fine" is true — for humans. To use an agent you must accept one fact: the agent can't ask people. Everything it needs must be written down where it can find it.

This is not a "write more docs" problem; it's a "put decision information in the right place" problem. A 50-line `ARCHITECTURE.md` sitting in `src/api/` beats a 500-page Confluence design doc nobody maintains. Proximity beats length — information is only useful when it's at hand the moment you need it.

## The fresh-session test

How do you know your map is good enough? Open a brand-new agent session, give it only the repository, and see if it can answer five questions:

| Question | Answered by |
|----------|-------------|
| What is this system? | `AGENTS.md` / README |
| How is it organized? | `ARCHITECTURE.md` / module docs |
| How do I run it? | Makefile / `init.sh` / package scripts |
| How do I verify it? | test / lint / check commands |
| Where are we now? | `PROGRESS.md` / feature list / git history |

If it can answer all five, a new session can start work without asking a human. Where it can't, the map has blank spots — and where the map is blank the agent guesses. Wrong guesses become bugs; excessive guessing wastes context; and every new session guesses again. The cost of guessing always exceeds the cost of drawing the map properly the first time.

A slightly fuller version of the same checklist — can a fresh agent discover, from the repo alone: what product is being built; what the app should do for users; how the codebase is organized; how the app starts; how health is checked; what work is in progress; what quality standards matter?

## Core concepts

- **Knowledge Visibility Gap** — the share of total project knowledge *not* in the repo. The bigger the gap, the higher the failure rate. Estimate it: list the implicit knowledge living in heads, then see how much made it into the repo.
- **System of Record** — the repo as authoritative source for decisions, architecture constraints, execution state, and verification standards. If "this road is closed" lives only in Old Zhang's head, you ask Old Zhang every time. Write it in the repo and nobody has to ask.
- **Fresh Session Test** — the five questions above; how many the agent answers is how complete your map is.
- **Discovery Cost** — context budget burned to find one key fact. The more hidden the fact, the higher the cost, the less budget left for the task. Put critical info where the agent sees it first.
- **Knowledge Decay Rate** — share of repo knowledge that goes stale per unit time. Docs drifting out of sync with code are worse than no docs at all.
- **ACID Analogy** — database transaction principles applied to agent state (below).

## How to draw a good map

- **Principle 1 — knowledge lives next to code.** A rule about endpoint auth belongs beside the API code, not in a giant global doc. The module directory is a natural index: reach the code and you reach its constraints, no searching.
- **Principle 2 — a standardized entry file.** `AGENTS.md`/`CLAUDE.md` is the agent's landing page. It needn't hold everything, but it must let the agent quickly answer "what is this," "how do I run it," "how do I verify it." 50-100 lines.
- **Principle 3 — minimal but complete.** Every entry needs a use case; if removing a rule doesn't change decision quality, it shouldn't exist. But every fresh-session question must have an answer.
- **Principle 4 — update with code.** Bind doc updates to code changes — put architecture docs in the module directory so you notice them when you edit, and let CI nudge you to check docs after changes.

Concrete structure:

```
project/
├── AGENTS.md              # Entry: overview, run commands, hard constraints
├── src/
│   ├── api/
│   │   └── ARCHITECTURE.md  # API-layer decisions
│   └── db/
│       └── CONSTRAINTS.md   # DB hard constraints
├── PROGRESS.md             # done / in-progress / blocked
└── Makefile                # setup, test, lint, check
```

## Managing agent state with ACID

Borrowed from database transactions — it feels like overkill but it's a practical frame:

- **Atomicity** — one logical operation ("add endpoint + update tests") = one git commit. Fails midway? `git stash` to roll back. All or nothing; no "half done."
- **Consistency** — define verification predicates for a consistent state (all tests pass, zero lint errors). Verify after each operation; never commit an inconsistent intermediate state.
- **Isolation** — for concurrent agents, design state files to avoid races. Simplest: each agent gets its own progress file, or isolate with git branches. Concurrent writes to one file are a classic trap.
- **Durability** — critical knowledge lives in git-tracked files. Temporary state can stay in session memory; anything that must survive across sessions gets written down. What's in your head doesn't count.

## A real transformation story

A team ran an e-commerce platform of ~30 microservices. Architecture decisions — comms protocols, consistency strategies, API versioning — were scattered across Confluence (partly outdated), Slack (unsearchable), senior engineers' heads (not scalable), and sporadic comments (unsystematic).

After introducing agents, 70% of tasks needed human intervention — nearly every failure was the agent violating an implicit constraint "everyone knows but nobody wrote down." The agent couldn't know what it didn't know.

The fix:
1. `AGENTS.md` at the root: overview, stack versions, global hard constraints.
2. `ARCHITECTURE.md` in each service dir: responsibilities, interfaces, dependencies.
3. A central `CONSTRAINTS.md` in explicit MUST / MUST NOT language.
4. `PROGRESS.md` in each service dir tracking status.

After: the same agent could answer every key question on a fresh session, and completion quality rose sharply.

## Key takeaways

- Knowledge not in the repo doesn't exist for the agent. Putting decisions into the repo is the most fundamental harness investment.
- Use the fresh-session test to grade repo quality.
- Keep knowledge near code, minimal but complete, updated with code. It's about placement, not volume.
- Apply ACID to state: atomic commits, consistency checks, concurrency isolation, durable critical knowledge.
- Knowledge decay is the biggest enemy — stale docs steer the agent confidently wrong.

## How this maps to my harness

- **claude-mem is my durability + cross-session continuity layer.** It externalizes "what we decided / what failed / where we are" so a fresh session recovers state — the persistent system of record this lecture says long tasks demand. context-mode's `ctx_*` knowledge base plays the same role for indexed/searchable project knowledge.
- **`create-app-implementation-docs` is, in effect, the fresh-session test built into a pipeline.** Its spec-first chain (constitution → research → requirements → design → design-system → architecture → implementation-plan → agent-assignments → validation) front-loads exactly the five questions into `docs/implementation/`, so the map is drawn before any code exists.
- **`repo-engineering-review`'s "review live repo state, not memory" is the System-of-Record principle as an audit rule.** It refuses to trust recollection and grades the repo on what's actually visible — and its §1 mental-model … §14 limitations numbered-section README standard is the standardized entry/landing page this lecture asks for.
- **My ACID state mapping is already in the toolkit:** atomicity → my TDD habit of one logical change per commit + `using-git-worktrees` for isolation; consistency → the "end green, report counts" rule; durability → claude-mem + git-tracked `docs/`.
- **My evidence-labeling (Evidence / Repository-fact / Assumption) directly measures the Knowledge Visibility Gap** — it forces a distinction between what the repo proves and what I'm assuming from outside it.
- **Action item for my own projects:** keep per-package knowledge *next to code* (module `ARCHITECTURE.md` / `CONSTRAINTS.md`) rather than only in the global `CLAUDE.md`, to cut discovery cost and decay.

**Source:** https://walkinglabs.github.io/learn-harness-engineering/en/lectures/lecture-03-why-the-repository-must-become-the-system-of-record/
