# 0012 - Metrics and Observability

## Status

Accepted

## Context

The app is static and privacy-sensitive. Usage insight is nice to have but not required for v1 success.

## Decision

Ship v1 with no analytics. Operational verification uses local tests, smoke checks, GitHub Pages status, and user feedback through GitHub issues.

## Consequences

- No PII or behavioral telemetry is collected.
- Product decisions rely on explicit feedback and repository engagement.

## Alternatives Considered

- Plausible analytics: deferred until there is a clear need and privacy notice.
- Custom beacon: rejected because it would introduce runtime infrastructure.
