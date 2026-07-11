# ADR-0002: Use Facades and Services for Commands

## Status

Accepted

## Context

Commands such as create, update, delete, login, registration, and CSV import
change application state. They require HTTP communication, mutation-specific
loading and error state, and follow-up UI actions.

Putting all of this behavior directly in components makes them difficult to test.
Putting navigation, forms, and notifications in HTTP services couples transport
code to presentation concerns.

## Decision

Use the following command flow:

```text
Component → Facade → Service → Backend API
```

- Components own forms, subscriptions, navigation, notifications, dialogs, and
  query reloads.
- Facades own mutation loading and error signals and return Observables.
- Services own HTTP communication and necessary contract mapping only.
- Facades do not accept success callbacks and do not subscribe internally unless
  a concrete orchestration requirement justifies it.

## Consequences

### Positive

- UI orchestration and HTTP transport remain separate.
- Mutation state is reusable and independently testable.
- Components remain explicit about successful UI outcomes.
- Services are small and focused.

### Negative

- Commands require more files than direct component HTTP calls.
- Small mutations still carry a facade layer.
- Observable errors must be consumed correctly by components and tests.
