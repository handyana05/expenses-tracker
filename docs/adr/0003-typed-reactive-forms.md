
# ADR-0003: Use Typed Reactive Forms with Form Factories

## Status

Accepted

## Context

The application uses forms for authentication, categories and transactions.

Forms should be strongly typed, reusable and easy to test.

## Decision

Each feature owns its own form factory.

Example:

```text
features/categories/
├── category-form.factory.ts
├── category.models.ts
└── categories.ts
```