
## `0002-command-pattern.md`

```md
# ADR-0002: Use Facade and Service for Commands

## Status

Accepted

## Context

Commands change application state. Examples:

- create category
- update category
- delete category
- create transaction
- update transaction
- delete transaction
- login
- register
- logout

These operations usually need loading state, error handling, form handling and follow-up UI actions.

## Decision

Use this flow for commands:

```text
Component
→ Facade
→ Service
→ Backend API