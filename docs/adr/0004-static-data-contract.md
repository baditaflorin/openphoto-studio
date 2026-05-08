# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode A does not have a backend API or scheduled data pipeline. The frontend still needs stable metadata for version, commit, repository URL, support URL, tool registry, and optional sample presets.

## Decision

Keep static data small and bundled with the frontend:

- Build metadata comes from Vite defines: `__APP_VERSION__`, `__COMMIT_SHA__`, `__REPOSITORY_URL__`, and `__PAYPAL_URL__`.
- Tool presets are TypeScript data under `src/features/editor/presets.ts`.
- Any future large demo assets must live in GitHub Releases and be fetched only after user action.

## Consequences

- No JSON contract is needed for v1 runtime behavior.
- Breaking changes are source changes and follow semver tags.

## Alternatives Considered

- Mode B static JSON: unnecessary until the app has a real offline-generated catalog.
- Mode C REST API: rejected by ADR 0001.
