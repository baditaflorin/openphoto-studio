# 0069 - Type-Safety Policy at Boundaries

## Status

Accepted

## Context

The current app trusts persisted state, imported values, and UI casts too freely. Phase 3 introduces more boundary types: state files, URL hashes, clipboard payloads, and richer import diagnoses.

## Decision

Use zod validation for:

- project document persistence
- imported state files
- URL-hash project state
- settings persistence
- export metadata sidecars

UI event values should be parsed or narrowed explicitly rather than cast.

## Consequences

- unsafe `as` casts at user-controlled boundaries are removed
- old or malformed state is recoverable through migrations or actionable errors

## Alternatives Considered

- keep trusting browser/local data: rejected because portability features make boundary safety essential
