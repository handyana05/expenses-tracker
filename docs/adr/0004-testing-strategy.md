# ADR-0004: Frontend Testing Strategy

## Status

Accepted

## Context

The frontend contains several layers:

- Components
- Facades
- Services
- Guards
- Interceptors
- State classes

Each layer should be tested according to its responsibility.

## Decision

Use the following testing strategy.

| Layer | Test Responsibility |
|---|---|
| Service | HTTP method, URL and request body |
| Facade | loading state, error state and service interaction |
| Component | form behavior, user actions and facade interaction |
| Guard | route access decision |
| Interceptor | authorization header behavior |
| State | signal state changes |

Component tests should not test Angular framework internals such as `httpResource` implementation details.

## Consequences

### Positive

- Tests are more stable.
- Tests focus on application behavior.
- HTTP details are tested only in service tests.
- Component tests remain simple.

### Negative

- Some behavior is covered indirectly instead of testing every internal implementation detail.