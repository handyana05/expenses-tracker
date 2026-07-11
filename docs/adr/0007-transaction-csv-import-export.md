# ADR-0007: Parse CSV in the Frontend and Import Atomically Through JSON

## Status

Accepted

## Context

Users need to export and import transactions as CSV. The frontend already holds
the authenticated user's transaction list, while the backend owns authorization,
category ownership, domain validation, and persistence transactions.

Uploading raw CSV to the backend would require transport-specific parsing in the
API. Creating imported rows through repeated single-transaction requests could
leave a partially imported file after a failure.

## Decision

- Generate CSV exports in the frontend from the already-loaded transaction list.
  No export API endpoint is added.
- Parse CSV in the frontend and validate its exact header, quoting, dates,
  positive amounts, category names and types, descriptions, and row count.
- Resolve CSV category names and types to category IDs already owned by the user.
- Send validated rows to `POST /api/transactions/import` as a JSON batch.
- Limit a batch to 500 transactions.
- Revalidate values and category ownership in the backend.
- Construct and validate every entity before tracking it, then save once through
  the unit of work so the import is atomic.

The CSV contract is:

```csv
Date,Category,Type,Amount,Description
```

## Consequences

### Positive

- Export requires no additional API request.
- CSV presentation concerns remain in the browser.
- Authorization and domain rules remain authoritative in the backend.
- Failed imports do not persist partial batches.
- JSON keeps the API endpoint independent of a specific CSV parser library.

### Negative

- Imported categories must already exist and match by name and type.
- Frontend and backend both validate parts of the import contract.
- Large imports are intentionally capped rather than streamed.
- Client-side export reflects the currently loaded transaction query.
