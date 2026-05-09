# 0063 - Half-Baked Feature Triage Decisions

## Status

Accepted

## Context

The audits found several UI elements that are technically wired but not honest enough for a stranger.

## Decision

Triage outcomes:

- `WebGPU ready`: finish as truthful capability messaging, not feature signaling
- `Remove bg`: keep, but relabel and warn that the result is heuristic
- `2x upscale`: keep, but relabel and warn that it is a local resize enhancement, not model quality
- `Save local` / `Load last`: finish into a proper project workflow with autosave and import/export portability
- export format select: keep, but drive it with recommendations and warnings

## Consequences

- some user-facing copy must get more specific and less flashy
- hidden capability claims are treated as bugs

## Alternatives Considered

- leave labels aspirational: rejected because it damages trust
- delete all advanced controls: rejected because the controls are useful once their limits are made explicit
