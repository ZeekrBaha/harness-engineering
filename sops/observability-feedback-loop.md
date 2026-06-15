# Observability Feedback Loop

Use this SOP when debugging is slow, agents keep claiming success without
evidence, or runtime behavior is harder to inspect than the source code. The
fix is to give the agent a feedback loop over logs, metrics, traces, and a
rerunnable workload so it reasons from execution, not just from reading code.

## Goal

Let the agent reason from runtime evidence. Every claim of success must be
backed by a signal (a trace, a score, a metric), and every change must be
verifiable by rerunning the same workload.

## Minimum Stack

- The app emits structured logs.
- The app emits metrics and traces when feasible.
- A local collection/query layer for those signals.
- Query interfaces for logs, metrics, and traces.
- A repeatable workload or user journey to rerun after each change.

## The Loop

```
instrument -> run workload -> query/correlate -> reason -> implement
     ^                                                          |
     |                                                          v
   verify  <-  rerun same workload  <-  restart  <-------------+
```

## Execution SOP

1. Define the golden runtime journeys that matter most.
2. Add structured logs to startup and the critical path.
3. Add metrics for latency, failure counts, or queue depth where useful.
4. Add traces or timing markers for slow or multi-step flows.
5. Make every signal queryable from the local dev environment.
6. Give the agent one repeatable workload or scenario to rerun.
7. Enforce the loop: query -> correlate -> reason -> implement -> restart ->
   rerun -> verify.

## Debug Session Checklist

- [ ] What failed?
- [ ] Which signal proves the failure?
- [ ] Which layer owns the failure?
- [ ] What changed after the fix?
- [ ] Did the app restart cleanly?
- [ ] Did the same workload pass after rerun?

## Definition of Done

- The agent can explain a failure mode from runtime evidence.
- The same workload can be rerun after each change.
- Restart and rerun are part of the normal task loop.
- Reliability signals are documented in `docs/RELIABILITY.md`.

## In My Harness

For LLM/agent work, the feedback loop maps cleanly onto Langfuse plus the
session-memory tools:

| SOP step | My tooling |
| --- | --- |
| Instrument the critical path | Langfuse **traces/observations** (`listTraces`, `getObservation`, `listObservations`) wrap each LLM/agent run; structured logs stay queryable via `ctx_batch_execute` + `ctx_search`. |
| Define golden journeys | Langfuse **datasets** (`upsertDataset`, `upsertDatasetItem`) hold the repeatable workloads; rerun with `createDatasetRunItem` / `listDatasetRuns`. |
| Score / evaluate | `createScore` for manual or programmatic scores; `upsertEvaluator` + `createEvaluationRule` for automated LLM-as-judge; **annotation queues** (`createAnnotationQueue`, `createAnnotationQueueItem`) for human review. |
| Reason from evidence | `queryMetrics` for latency/failure aggregates; compare dataset runs across changes. |
| Capture findings | **claude-mem** auto-captures decisions/errors as observations (`observation_search`, `timeline`); **context-mode** session timeline (`ctx_search sort:"timeline"`) recalls prior reasoning across compaction. |
| Feed back into prompts/skills | Langfuse **prompt management** (`createTextPrompt`, `updatePromptLabels`); findings flow back into skill/prompt edits and into the **evaluator rubric** produced by `create-app-implementation-docs`' validation doc. |

The rubric from `create-app-implementation-docs` is the bridge between code-time
and runtime: its evaluator criteria become Langfuse `createScoreConfig` /
`upsertEvaluator` definitions, so the same standards that gate the spec also
gate the live traces. Pair with `superpowers:systematic-debugging` to keep the
"no fix without root cause from a signal" discipline, and
`verification-before-completion` so success claims are always backed by a rerun.

**Source:** https://raw.githubusercontent.com/walkinglabs/learn-harness-engineering/main/docs/en/resources/openai-advanced/sops/observability-feedback-loop.md
