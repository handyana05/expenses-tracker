# ADR-0005: Domain Models and API Contracts

## Status

Accepted

## Context

Frontend models often match backend DTOs closely. Creating separate contract, mapper and view model files for every feature can add unnecessary complexity.

However, in some cases the UI model may differ from the backend contract.

## Decision

Use one model when the backend contract and frontend view model are the same.

Introduce separate contracts and mappers only when the frontend model genuinely differs from the API contract.

Shared domain concepts, such as `CategoryType`, belong in `shared/models`.

Example:

```ts
export enum CategoryType {
  Income = 0,
  Expense = 1,
}