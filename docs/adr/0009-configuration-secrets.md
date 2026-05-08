# 0009 - Configuration and Secrets Management

## Status

Accepted

## Context

Mode A must not contain runtime secrets. The app needs public URLs and build metadata.

## Decision

Use Vite build-time constants for public, non-secret configuration. Commit `.env.example` with placeholders only. Do not commit `.env` files. Run gitleaks in pre-commit when available.

## Consequences

- Configuration in the published app is public by design.
- Any future secret-bearing integration requires Mode B generation or Mode C backend justification.

## Alternatives Considered

- Encrypted frontend secrets: rejected because frontend secrets are still exposed.
- Runtime config API: rejected by ADR 0001.
