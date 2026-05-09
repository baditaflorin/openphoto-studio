# 0062 - Output Pathway Coverage Policy

## Status

Accepted

## Context

Today the app mainly exports a rendered image. That is insufficient for a real editing workflow because users also need to preserve state, move work across devices, and understand what was lost or changed.

## Decision

Phase 3 output coverage is:

- rendered image download
- copy rendered image to clipboard
- project state file export/import
- project share URL hash for small projects
- metadata sidecar export

The following are intentionally out of scope for this phase:

- print/PDF view
- server-side share tokens
- API/curl output

## Consequences

- every exported image needs a corresponding provenance record
- state export becomes the canonical portability path
- image export warnings must fire before the user leaves the app

## Alternatives Considered

- image-only export: rejected because it strands user work inside one browser session
