# 0013 - Testing Strategy

## Status

Accepted

## Context

The editor needs quick local confidence and a smoke check matching GitHub Pages behavior.

## Decision

Use:

- Vitest for unit tests.
- React Testing Library for component tests.
- Playwright for one or more happy-path smoke tests against the built app.
- `make test`, `make lint`, `make build`, and `make smoke` as the local check surface.

## Consequences

- Tests can run in hooks without GitHub Actions.
- Browser-level regressions are caught before publishing.

## Alternatives Considered

- Manual-only testing: rejected because image workflows regress easily.
- Full visual regression: deferred until UI stabilizes.
