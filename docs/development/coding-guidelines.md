# Frontend Coding Guidelines

## Architecture

Use a pragmatic feature-based structure. Feature-specific forms, models,
services, facades, templates, and styles stay inside their feature. Move code to
`shared/` only after it is genuinely reused and is not business-feature-specific.

Do not introduce base components, generic CRUD frameworks, or global state
management without a concrete requirement.

## Queries

Use `httpResource` for simple read-only GET requests:

```ts
readonly categories = httpResource<Category[]>(
  () => `${this.apiUrl}${ApiEndpoints.categories}`,
  { defaultValue: [] }
);
```

Templates must handle loading, error, empty, and populated states. Reload the
resource after a successful mutation.

## Commands

Use the following flow for POST, PUT, PATCH, and DELETE operations:

```text
Component → Facade → Service → Backend API
```

- Components create commands, subscribe, update forms, reload resources, and
  show notifications.
- Facades expose mutation state and return Observables.
- Services contain HTTP communication and necessary contract mapping only.
- Facades do not subscribe internally or accept success callbacks.

## Forms

Use typed Reactive Forms. Every form-based feature owns a form factory containing
construction, defaults, non-nullable configuration, and validators. Components
must not duplicate form construction.

## Dependency Injection and State

- Prefer `inject()`.
- Use Signals for local synchronous UI state.
- Use `readonly` for injected dependencies and stable fields.
- Keep token persistence and authenticated state in `AuthState`.
- Handle authenticated `401` responses centrally in the auth interceptor.

## Material and Shared UI

Use Angular Material for controls, navigation, tables, dialogs, and feedback.
Keep Material imports local to standalone components.

Use the existing shared components consistently:

- `PageHeader` for page titles
- `PageCard` for page sections
- `LoadingSpinner` while queries load
- `EmptyState` for empty and appropriate failure states
- `SummaryCard` for financial totals
- `ConfirmDialog` for destructive actions

Use Material system tokens instead of hardcoded theme colors where practical.

## Error Handling

- Facade error signals contain failure messages only.
- Components show success and expected error notifications.
- Preserve backend ProblemDetails messages where practical.
- Do not leave expected Observable errors unhandled.
- Treat `401 Unauthorized` as an expired or invalid session when a token was sent.
- Do not treat `403 Forbidden` as an expired session.

## Testing

- Service tests cover HTTP details.
- Facade tests cover loading, error, service interaction, and termination state.
- Component tests cover forms and UI orchestration.
- Guard and interceptor tests cover routing and request behavior.
- Set required signal inputs before the first `detectChanges()`.
- Provide `API_URL` and router dependencies explicitly in tests that need them.

Before completing frontend work, run:

```bash
npm test -- --watch=false
npm run build
```

Template, routing, dependency-injection, and build-configuration changes always
require a production build.

## Responsive UI

- Start with layouts that work at desktop, tablet, and phone widths.
- Allow data tables to scroll horizontally when a compact representation would
  hide important information.
- Keep touch targets usable on mobile.
- Verify long values, validation messages, and action groups do not overflow.

## Documentation

Update documentation when behavior, architecture, setup, or conventions change.
Do not create ADRs for local styling or ordinary component implementation details.
