# ADR-0001: Use httpResource for Simple Queries

## Status

Accepted

## Context

The frontend loads categories, transactions, reports, and dashboard summaries
through read-only HTTP GET requests. These requests need consistent value,
loading, error, and reload states.

Wrapping every query in a feature service or facade would add indirection without
providing additional business behavior.

## Decision

Use Angular `httpResource` directly in components for simple read-only queries.

```ts
readonly categories = httpResource<Category[]>(
  () => `${this.apiUrl}${ApiEndpoints.categories}`,
  { defaultValue: [] }
);
```

Components render loading, error, empty, and populated states and call
`reload()` after successful mutations. A facade may coordinate queries only when
a page becomes complex enough that it materially simplifies the component.

## Consequences

### Positive

- Query state uses Angular's built-in reactive primitives.
- Simple pages avoid unnecessary services and facades.
- Reload behavior remains explicit in the component.
- Templates receive consistent loading, error, and value APIs.

### Negative

- Query URLs and orchestration remain visible in components.
- Complex pages may eventually require a dedicated coordination layer.
- Tests should focus on rendered behavior rather than `httpResource` internals.
