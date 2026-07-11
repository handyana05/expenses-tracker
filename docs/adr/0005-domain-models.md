# ADR-0005: Reuse Models When API and UI Shapes Match

## Status

Accepted

## Context

Frontend models often match backend DTOs. Creating separate API contracts,
mappers, and view models for every response adds maintenance cost without always
creating a useful boundary. Some UI commands do differ from API request shapes
and still require explicit mapping.

## Decision

Use one model when the backend contract and frontend representation are
effectively identical. Introduce separate contracts and mapping only when shapes
or representations genuinely differ.

Shared domain concepts belong under `shared/models`. Numeric enum values must
match the backend contract exactly:

```ts
export enum CategoryType {
  Income = 1,
  Expense = 2,
}
```

Service tests assert literal serialized values for cross-boundary enums so a
frontend-only enum change cannot silently alter persisted meaning.

## Consequences

### Positive

- Fewer duplicate interfaces and mapping functions.
- API-aligned features remain straightforward.
- Mapping remains explicit where it provides real value.

### Negative

- Backend contract changes may directly affect presentation models.
- Numeric enums require coordinated cross-stack changes and regression tests.
- Developers must reassess the decision when UI-specific derived fields appear.
