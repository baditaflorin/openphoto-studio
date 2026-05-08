# 0017 - Dependency Policy

## Status

Accepted

## Context

The app needs production-ready libraries without a bloated first load or risky abandoned packages.

## Decision

Use actively maintained dependencies with clear ownership and browser suitability. Prefer native browser APIs for hot pixel loops and add WASM/model packages only after a measured lazy-load budget review. Run `npm audit --audit-level=high` in lint checks.

## Consequences

- New dependencies need a concrete feature reason.
- Large dependencies must be lazy-loaded or rejected.

## Alternatives Considered

- Custom implementations for everything: rejected where battle-tested libraries exist.
- Accept all AI/codec packages upfront: rejected due payload and maintenance risk.
