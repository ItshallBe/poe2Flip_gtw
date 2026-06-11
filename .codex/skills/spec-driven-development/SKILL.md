---
name: spec-driven-development
description: Spec-first implementation workflow for complex product or engineering changes. Use when Codex is asked to build a non-trivial feature, modify multiple files, change architecture, add AI/tooling flows, create API behavior, or complete work where requirements can drift; require a written spec, task plan, implementation, and self-check before handoff.
---

# Spec-Driven Development

Use this skill to keep complex implementation work controlled. The required sequence is:

1. Write the spec.
2. Write the task plan.
3. Implement the plan.
4. Self-check against the spec.

Do not skip the sequence for multi-file, user-facing, architectural, or AI orchestration changes. For tiny fixes, keep each phase short, but still preserve the order.

## Phase 1: Spec

Before editing files, write a compact implementation spec in the working response or task notes. Create a file only when the user asks for a persistent spec or the project already has a spec directory.

Include:

- Goal: the user-visible outcome.
- Scope: what will change and what will not change.
- Current state: relevant files, flows, contracts, and constraints discovered from the repo.
- Proposed behavior: expected states, edge cases, errors, loading behavior, and data shape changes.
- Architecture: modules, boundaries, ownership, and where logic belongs.
- Acceptance criteria: concrete checks that must be true before handoff.
- Risks and unknowns: assumptions, migration concerns, compatibility risks, or questions that block safe execution.

Keep the spec short enough to guide implementation. Do not turn it into a PRD unless the user asks for product discovery.

## Phase 2: Task Plan

After the spec, create an ordered task plan. Each task must map to the spec and have a clear completion condition.

Prefer this shape:

```md
1. Inspect current implementation and affected contracts.
2. Add or update types, schemas, and tests where needed.
3. Implement the smallest vertical slice.
4. Wire UI/API/state boundaries.
5. Validate with typecheck, lint, build, tests, or targeted runtime checks.
```

Use the planning tool when available for multi-step implementation. Keep exactly one task in progress at a time. Update the plan as facts change.

## Phase 3: Implementation

Implement from the plan, not from memory.

Rules:

- Read the existing code before choosing an approach.
- Keep changes scoped to the spec.
- Prefer repository conventions over new abstractions.
- Preserve server/client boundaries in Next.js App Router.
- Keep provider, tool, context, memory, and orchestration code under `lib/ai`.
- Keep reusable UI in `components`, primitives in `components/ui`, queries in `lib/queries`, and Jotai atoms in `lib/state`.
- Start independent async work early and await it late when a route needs multiple data sources.
- Add or update focused validation when touching shared behavior.
- If implementation reveals the spec is wrong, update the spec/plan explicitly before continuing.

Ask the user only when a decision changes product behavior, security posture, data persistence, or public API contracts in a way that cannot be inferred safely.

## Phase 4: Self-Check

Before handoff, compare the result against the spec and acceptance criteria.

Check:

- Spec coverage: every acceptance criterion is implemented or explicitly deferred.
- Type safety: changed data contracts are typed and compile.
- Boundary integrity: server-only logic is not pulled into client components; model providers are not called from the browser.
- State ownership: React Query owns browser-side server state; Jotai owns local UI state.
- UX integrity: loading, empty, error, disabled, and mobile states are handled when relevant.
- Regression risk: changed flows have focused tests or command validation.
- Cleanup: no leftover TODOs, dead imports, duplicated logic, or speculative abstractions.

Run the strongest practical validation available, usually:

```bash
npm run typecheck
npm run lint
npm run build
```

If a command cannot run, state why and what risk remains.

## Handoff

End with:

- What changed and why.
- Validation commands run and results.
- Any spec items deferred or assumptions made.
- New setup steps or environment variables, if any.
