
## `docs/development/coding-guidelines.md`

```md
# Coding Guidelines

## Frontend Architecture

The frontend follows a pragmatic feature-based architecture.

## Queries

Use `httpResource` for simple GET requests.

```ts
readonly categories = httpResource<Category[]>(
  () => `${this.apiUrl}/categories`,
  {
    defaultValue: [],
  }
);