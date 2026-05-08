# 0002 - Architecture Overview and Module Boundaries

## Status

Accepted

## Context

The app needs a fast public shell, a heavier editor surface, local persistence, and browser-only processing.

## Decision

Use feature modules under `src/features/`:

- `editor`: UI composition, tool state, project lifecycle.
- `image-engine`: pure pixel transforms, worker bridge, export helpers.
- `storage`: IndexedDB-backed project snapshots.
- `metadata`: app version, commit, repository, support links.

Shared UI primitives live in `src/components/`. Shared types live next to the feature that owns them.

## Consequences

- Editor behavior can be tested without rendering the whole app.
- Worker code stays isolated from React.
- Future WASM integrations can attach behind `image-engine`.

## Alternatives Considered

- Single-file app: rejected because tool state and processing would become tangled.
- Server-backed architecture: rejected by ADR 0001.
