# 0005 - Client-Side Storage Strategy

## Status

Accepted

## Context

Users should be able to preserve recent work without creating an account. Browser storage must avoid sending images to a server.

## Decision

Use IndexedDB through `idb-keyval` for project snapshots and preferences. Use in-memory object URLs for active image previews. Use OPFS later for very large projects if browser support and UX justify it.

## Consequences

- Work remains local to the device and browser profile.
- Storage quota and private-browsing behavior must be handled gracefully.
- There is no cross-device sync in v1.

## Alternatives Considered

- `localStorage`: rejected for image/project data because it is synchronous and size-limited.
- Backend storage: rejected because accounts and sync are non-goals.
