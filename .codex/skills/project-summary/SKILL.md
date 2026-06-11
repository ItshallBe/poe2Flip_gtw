---
name: project-summary
description: Project summary maintenance workflow for preserving repo context across conversations. Use when the user asks in Chinese or English to summarize/update the project, says "summarize project", or after completing any single meaningful app, architecture, database, AI, skill, PRD, or configuration change; update PRD/project-summary.md so a new chat can load that one file and quickly understand the project state.
---

# Project Summary

Use this skill to keep `PRD/project-summary.md` current as the compact source of truth for future AI conversations.

The summary file is not a changelog dump. It is a high-signal handoff document that lets a new agent understand what the project is, how it is structured, what decisions are already made, and what changed most recently.

## Target File

Always use:

```txt
PRD/project-summary.md
```

If the file does not exist, create it. If `PRD/` does not exist, create `PRD/` first.

## Trigger Behavior

Update the summary when:

- The user explicitly asks in Chinese or English to summarize/update the project.
- A single meaningful change is completed, including code, architecture, database setup, AI runtime behavior, local skills, PRD files, environment setup, or configuration.
- A major decision is made that future agents should not rediscover.
- A previous assumption is invalidated.

Do not update it for trivial read-only Q&A, failed exploratory commands with no resulting decision, or purely temporary debugging notes.

## Update Rules

Before editing, read the current `PRD/project-summary.md` and the files touched in the completed change.

Keep the file:

- Concise enough to load at the start of a new conversation.
- Current rather than exhaustive.
- Written for future AI agents and engineers.
- Free of secrets, tokens, passwords, private URLs, and user data.
- Focused on stable context, current architecture, decisions, active risks, and recent changes.

Prefer updating existing sections over appending duplicate notes. Remove stale context when it becomes misleading.

## Required Structure

Maintain these sections:

```md
# Project Summary

## Snapshot
## Product Intent
## Tech Stack
## Architecture
## AI Runtime
## Data And Persistence
## Local Skills
## Current Decisions
## Recent Changes
## Validation Baseline
## Open Questions And Risks
## New Conversation Bootstrap
```

Section guidance:

- Snapshot: one short paragraph with the current project state.
- Product Intent: what this app/template is for.
- Tech Stack: frameworks, language, styling, state, runtime, important packages.
- Architecture: where routes, components, UI primitives, queries, state, and shared logic live.
- AI Runtime: provider boundary, demo/provider-backed behavior, tool/context/model boundaries.
- Data And Persistence: current persistence state, database choices, migrations, env vars.
- Local Skills: available local skills and when they matter.
- Current Decisions: durable decisions future agents should respect.
- Recent Changes: latest meaningful changes, newest first, with dates.
- Validation Baseline: commands expected before handoff and latest known results.
- Open Questions And Risks: unresolved decisions, assumptions, or technical risks.
- New Conversation Bootstrap: exact instruction for a new AI conversation to read this file first.

## After A Change

When updating after completing a change:

1. Add or revise the relevant stable context section.
2. Add one dated bullet under Recent Changes.
3. Update Validation Baseline with commands run and commands not run.
4. Add open risks only if they matter for the next agent.
5. Keep unrelated historical detail short or remove it.

Do not include full command logs. Summarize outcomes.

## Explicit Project Summary Request

When the user asks to summarize the project:

1. Read `PRD/project-summary.md`.
2. Inspect key repo files only if the summary appears stale or incomplete.
3. Update the file.
4. Reply with the updated file path and a brief note about what changed.

## Handoff

After updating the file, report:

- The path updated.
- The sections changed.
- Any validation command run, if relevant.
