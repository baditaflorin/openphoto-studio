# 0014 - Error Handling Conventions

## Status

Accepted

## Context

Client-side image processing can fail because of unsupported formats, memory limits, browser APIs, or storage quota.

## Decision

Represent recoverable failures as typed `Error` objects with user-safe messages. Surface failures in the editor status area. Never silently swallow processing or persistence errors. Do not expose stack traces in the UI.

## Consequences

- Users receive actionable feedback.
- Tests can assert error states.

## Alternatives Considered

- Global alerts: rejected because they interrupt editing flow.
- Console-only errors: rejected because users would not see failures.
