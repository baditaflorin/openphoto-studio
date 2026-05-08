# 0008 - Go Backend Project Layout

## Status

Accepted

## Context

The bootstrap template asks for a Go layout in Mode B or Mode C. ADR 0001 selects Mode A.

## Decision

Do not create Go backend directories in v1. If the project later moves to Mode B, add generator commands under `cmd/` and document the artifact contract first. If it later moves to Mode C, add `cmd/server/`, `internal/`, `api/`, `configs/`, `deploy/`, and a new deployment ADR.

## Consequences

- The repository stays focused on the static app.
- Backend-only hook steps are omitted cleanly.

## Alternatives Considered

- Empty Go skeleton: rejected because unused scaffolding creates maintenance noise.
