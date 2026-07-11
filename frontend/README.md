# Expense Tracker Frontend

Angular 22 frontend for the Expense Tracker application. It provides a public
landing page and an authenticated personal-finance workspace for categories,
transactions, dashboard summaries, and monthly reports.

## Technology

- Angular 22 with standalone components
- Angular Material
- Signals and `httpResource`
- Typed Reactive Forms
- RxJS for command workflows
- Vitest and Angular TestBed
- Chart.js and ng2-charts (installed for planned report visualizations)

## Features

- Public landing page
- Registration and login
- JWT persistence and authenticated route guard
- Automatic logout and login redirect when an authenticated request returns 401
- Responsive authenticated shell with active navigation
- Category CRUD
- Transaction CRUD
- Current-month dashboard summary and recent transactions
- Monthly income, expense, and balance reports
- Reusable loading, empty-state, page-card, page-header, summary-card, confirmation,
  and snackbar UI

## Architecture

```text
src/app/
├── core/       Application-wide technical concerns
├── shared/     Reusable non-business UI, models, constants, and services
├── layout/     Authenticated application shell
└── features/   Landing, authentication, and finance features
```

Simple GET requests use `httpResource` directly in the component. Mutations use
the following flow:

```text
Component → Facade → HTTP Service → Backend API
```

Components own forms and UI orchestration. Facades own mutation state. Services
only perform HTTP communication. More detail is available in
[`docs/adr`](../docs/adr) and the
[frontend coding guidelines](../docs/development/coding-guidelines.md).

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/dashboard` | Authenticated | Current-month overview |
| `/categories` | Authenticated | Category management |
| `/transactions` | Authenticated | Transaction management |
| `/reports` | Authenticated | Monthly summary |

The authenticated routes render inside the responsive application shell. If an
API request made with a token returns `401 Unauthorized`, the interceptor clears
the local session and redirects to `/login`. A `403 Forbidden` response does not
clear the session.

## Local Development

### Prerequisites

- Node.js version supported by Angular 22
- npm
- The Expense Tracker backend and PostgreSQL database

Install dependencies:

```bash
npm install
```

The API base URL is currently provided through `API_URL` in
`src/app/app.config.ts`. Ensure it matches the HTTPS URL used by the local backend.

Start the frontend:

```bash
npm start
```

Open `http://localhost:4200`.

## Verification

Run all frontend tests:

```bash
npm test -- --watch=false
```

Create a production build:

```bash
npm run build
```

The build currently reports an existing initial-bundle budget warning. New
features should avoid adding further budget warnings.

## Testing Conventions

- Services verify HTTP methods, URLs, bodies, and responses.
- Facades verify service calls, loading signals, errors, and Observable behavior.
- Components verify form behavior and UI orchestration.
- Required signal inputs are set before the first `detectChanges()`.
- Expected Observable errors are always consumed in tests.
- Components using router directives provide a test router.

## Current Frontend Roadmap

1. Keep the complete test suite and production build green.
2. Finish mobile-layout verification at phone and tablet widths.
3. Add useful Reports visualizations.
4. Improve Dashboard recent-transaction presentation.
5. Add CSV import and export.
6. Complete production Docker configuration and deployment.
7. Add observability and, later, AI-powered spending insights.
