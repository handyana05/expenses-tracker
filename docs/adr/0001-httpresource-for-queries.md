# ADR-0001: Use httpResource for Queries

## Status

Accepted

## Context

The frontend needs to load data from the backend, such as categories, transactions, reports and dashboard summaries.

These operations are read-only GET requests and need standard UI states:

- loading
- error
- value
- reload

## Decision

Use Angular `httpResource` for simple GET requests.

Example:

```ts
readonly categories = httpResource<Category[]>(
  () => `${this.apiUrl}/categories`,
  {
    defaultValue: [],
  }
);