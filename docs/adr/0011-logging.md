# 0011 - Logging Strategy

## Status

Accepted

## Context

Mode A has no server logs. Browser logs should help development without leaking data or spamming production users.

## Decision

Use minimal browser console output in production. Errors visible to users should appear in UI toasts or panels. Development may use targeted console diagnostics during local runs, removed before commit unless they are deliberate error reports.

## Consequences

- No server log aggregation is needed.
- Production console noise is treated as a bug.

## Alternatives Considered

- Client log collection: rejected for privacy and scope.
