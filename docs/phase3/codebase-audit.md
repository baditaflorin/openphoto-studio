# Phase 3 Codebase Audit

Date: 2026-05-09

Build audited: v0.1.0, commit `7a82360`.

## DRY Violations

1. Status/error handling is hand-rolled throughout [EditorApp.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/EditorApp.tsx)
   Same `try/catch/setBusy/setStatus` shape is repeated across load, auto tone, save, load, export, and destructive operations.
2. Export metadata decisions are split between [defaults.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/defaults.ts) and [imageIO.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/imageIO.ts)
   File naming, format choice, and encoding are not centralized.
3. Canvas creation logic is duplicated in [imageIO.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/imageIO.ts)
   Both import and export create temporary canvases and repeat error handling.

## SOLID Violations

1. [EditorApp.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/EditorApp.tsx) is a god module.
   It owns input handling, worker orchestration, persistence, export, status copy, undo, and UI composition.
2. Storage boundary is too thin in [projects.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/storage/projects.ts)
   No schema validation, no migrations, no provenance, no explicit error classification.
3. Metadata and runtime capability logic are mixed into UI components rather than domain/application helpers.

## Dead Code / Abandoned Surface

- `disposeImageWorker` in [client.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/image-engine/client.ts) is unused.
- `EngineResult` in [types.ts](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/types.ts) is unused.

## TODO / FIXME / XXX / HACK Count

Current count: 0 explicit markers.

That is better than fake cleanliness, but some unfinished behavior is currently hidden in product copy rather than TODO markers.

## Type-Safety Holes

1. `document.getElementById('root') as HTMLElement` in [main.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/main.tsx)
2. `event.currentTarget.value as ExportFormat` in [ActionsPanel.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/components/ActionsPanel.tsx)
3. Broad `unknown` catches in [EditorApp.tsx](/Users/live/Documents/Codex/2026-05-08/implemment-the-following-photoshop-240-yr/src/features/editor/EditorApp.tsx) without central narrowing/policy

## Inconsistent Patterns

- Status messages are set directly inline instead of through a central convention.
- Some UI strings are precise (`Saved locally in this browser.`), others are vague (`Working locally...`).
- Capability signaling is inconsistent: `WebGPU ready` sounds operational, while the app does not actually branch behavior on GPU availability.

## Real-User Path Test Holes

1. No automated test for saving, reloading, and restoring a project.
2. No automated test for unsupported formats, corrupt files, or empty files.
3. No automated test for export warnings or provenance.
4. No automated test for drag-drop or clipboard input.
5. No automated test for round-trip state import/export.
