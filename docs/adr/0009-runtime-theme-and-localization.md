# ADR 0009: Runtime theme and localization preferences

- Status: Accepted
- Date: 2026-07-12

## Context

The Angular application needs light and dark presentation and must allow users
to change the interface language without a reload. Both preferences must remain
stable between visits.

Angular compile-time i18n is optimized for separately deployed locale builds.
That does not fit an in-app language switch. A third-party translation package
would also add a dependency for a small, currently two-language application.

## Decision

Theme and locale are application-wide technical preferences under `core/`.

- `Theme` exposes a signal, applies `data-theme` to the root HTML element,
  honors the operating-system preference on first use, and persists a selection.
- Angular Material generates light tokens by default and dark tokens under
  `html[data-theme='dark']`.
- `Localization` exposes the `en` or `de` locale as a signal, initializes it from
  local storage or browser language, updates the document `lang` attribute, and
  resolves keys from typed dictionaries.
- `TranslatePipe` is the template adapter. Components use `Localization`
  directly when a translated value is required in TypeScript.

## Consequences

- Theme and language change immediately without reloading or calling the API.
- Preferences survive logout and browser restarts on the same browser profile.
- Translation keys are compile-time checked against the English dictionary.
- New interface copy must be added to both dictionaries.
- Domain data, backend validation messages, and user-entered values are not translated.
- A larger language set may justify a dedicated localization platform later.
