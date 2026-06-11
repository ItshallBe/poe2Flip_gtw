---
name: refactoring-engineer
description: Refactoring workflow for technical debt, module splitting, architecture restructuring, context cleanup, dependency simplification, and behavior-preserving codebase maintenance. Use when Codex is asked to clean up messy code, reduce complexity, split large files, improve boundaries, remove dead code, simplify dependencies, or reorganize modules without changing product behavior.
---

# Refactoring Engineer

Use this skill to improve code structure while preserving behavior. Refactoring work must make the system easier to change, not merely look different.

## Operating Principles

- Preserve existing behavior unless the user explicitly asks for behavior change.
- Make the smallest coherent improvement that reduces real complexity.
- Read callers and contracts before moving code.
- Prefer existing repo patterns over new architecture.
- Separate mechanical moves from semantic changes when possible.
- Keep public APIs, route behavior, data shapes, and persisted state compatible unless a migration is part of the task.
- Do not delete user work, generated artifacts, or dependencies without evidence they are unused and safe to remove.

## Refactoring Scan

Start by identifying the concrete debt being addressed:

- Large files or components with mixed responsibilities.
- Repeated logic, duplicated UI, or divergent copies of the same behavior.
- Feature code living in shared folders before reuse is real.
- Shared code importing feature-specific modules.
- Client components pulling in server-only logic.
- Model provider calls outside `lib/ai`.
- React Query, Jotai, local state, and server state mixed together.
- Unused dependencies, duplicate packages, or wrappers around one-line library calls.
- Stale comments, old prompts, obsolete docs, or context files that contradict current code.

State the target outcome before editing, such as "split this page into route shell, feature components, query hook, and pure utilities" or "remove duplicated dependency wrappers and keep one typed adapter."

## Refactoring Plan

Use this order:

1. Characterize current behavior with tests, command output, or focused manual checks.
2. Map module boundaries, imports, and public contracts.
3. Choose the smallest refactor that improves one clear dimension.
4. Move or extract code with behavior unchanged.
5. Rename only when it clarifies responsibility.
6. Remove dead code and dependency weight only after proving it is unused.
7. Validate behavior and scan for broken imports, type errors, and layout regressions.

For broad cleanup, split work into independent passes:

- Technical debt: remove duplication, tighten types, simplify conditionals, delete dead branches.
- Module splitting: extract components, hooks, utilities, constants, and types by responsibility.
- Architecture restructuring: fix import direction and server/client boundaries.
- Context cleanup: reconcile stale comments, prompts, docs, and config with current behavior.
- Dependency simplification: remove unused packages, collapse redundant helpers, and prefer direct typed APIs.

## Module Splitting Rules

When splitting files:

- Keep route files thin and focused on routing, metadata, and server orchestration.
- Move substantial page UI into feature modules or components.
- Move request keys and fetchers to `lib/queries`.
- Move local UI atoms to `lib/state`.
- Move reusable pure logic to `lib` or feature-local utilities before promoting it globally.
- Keep shadcn-style primitives under `components/ui`.
- Avoid barrels for client-facing imports.
- Avoid creating tiny files unless extraction improves readability, reuse, or testability.

Each new module should have one reason to change. If the extracted code still needs most of the original file's context to make sense, the extraction is probably premature.

## Architecture Restructuring Rules

Before moving directories or changing import paths, check:

- Who imports this module today?
- Is it route-specific, feature-specific, cross-route business logic, UI primitive, or AI boundary code?
- Does moving it introduce circular dependencies or client/server leaks?
- Does the new path match the repository's established conventions?
- Are tests, aliases, and config affected?

For Next.js App Router:

- Keep server-only logic out of client components.
- Keep provider-specific AI SDK code behind `lib/ai` adapters.
- Prefer React Server Components for read-only UI and small client islands for interaction.
- Do not wrap server-only logic in client providers.

## Context Cleanup

Clean context only when it reduces future confusion:

- Remove obsolete comments that describe old behavior.
- Update local docs or examples that contradict implemented code.
- Delete TODOs only when the TODO is actually resolved or no longer relevant.
- Consolidate duplicated prompt/config/context text into one source of truth.
- Keep `AGENTS.md` aligned when framework conventions change.

Do not rewrite broad documentation for style during code refactors.

## Dependency Simplification

Before removing or replacing a dependency:

- Search imports and dynamic usage.
- Check package scripts, config files, tests, and generated code.
- Identify whether the dependency is runtime, dev-only, transitive, or peer-required.
- Prefer removal of unused packages over replacement churn.
- Prefer direct platform or framework APIs when a dependency adds little value.

After changes, run install/build validation when package files changed.

## Validation

Run the strongest practical checks for the changed surface:

```bash
npm run typecheck
npm run lint
npm run build
```

Add focused tests when refactoring shared logic, data contracts, or edge-case-heavy utilities. For UI refactors, verify important states and responsive layout when practical.

## Handoff

Report:

- Debt removed or boundary improved.
- Files moved, split, or deleted.
- Behavior-preservation evidence.
- Commands run and results.
- Residual risks or follow-up refactors intentionally left out.
