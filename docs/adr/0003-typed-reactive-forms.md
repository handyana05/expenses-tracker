# ADR-0003: Use Typed Reactive Forms with Form Factories

## Status

Accepted

## Context

Authentication, categories, and transactions use forms with defaults,
validation, and non-nullable controls. Constructing these forms in components
duplicates setup and makes form behavior harder to test independently.

## Decision

Use typed Reactive Forms. Every form-based feature owns a form factory containing
form construction, defaults, validators, and non-nullable configuration.

```text
features/categories/
├── category-form.factory.ts
├── categories.ts
└── categories.spec.ts
```

Components use the factory and remain responsible for marking controls touched,
building commands, reset behavior, and UI orchestration.

## Consequences

### Positive

- Form values and controls are statically typed.
- Defaults and validators have one source of truth.
- Form construction can be tested without rendering a component.
- Create and edit flows reuse the same form definition.

### Negative

- Each form feature has an additional factory file.
- Factories must stay presentation-focused and must not accumulate business or
  HTTP behavior.
