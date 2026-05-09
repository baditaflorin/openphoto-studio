# 0061 - Input Pathway Coverage Policy

## Status

Accepted

## Context

The editor currently works mainly for one pathway: a single browser-decodable image file. Real users also arrive through drag-drop, clipboard paste, autosave restore, imported project state, and shared links.

## Decision

Phase 3 input coverage is:

- local file open
- drag-drop
- clipboard image paste
- clipboard project-state paste
- demo image
- restored autosave
- imported project state file
- shared URL hash for small projects

The following are intentionally out of scope for this phase:

- folder import
- remote URL fetch with runtime CORS workarounds
- multi-file editing workflow beyond clear first-file messaging

## Consequences

- the app must preflight files before decode and classify empty, corrupt, unsupported, animated, alpha, and downscaled cases
- unsupported pathways must be absent or explicitly explained, not implied

## Alternatives Considered

- support every imaginable input path now: rejected because it would blur the product and delay completeness on the paths users will actually hit first
