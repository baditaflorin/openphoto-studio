# Phase 3 Findings

Date: 2026-05-09

## Top 5 Usability Gaps

1. Users can only reliably start from one kind of input: a browser-decodable local file.
2. Users can only really leave with one kind of output: a downloaded image.
3. The app hides destructive or lossy behavior such as downscaling, animation flattening, and metadata loss.
4. Project persistence is too shallow for real work: one opaque snapshot, no auto-restore, no import/export portability.
5. Several UI labels promise more than the implementation delivers: `WebGPU ready`, `Remove bg`, `2x upscale`.

## Top 5 Half-Baked Features

1. `WebGPU ready` badge: finish as real capability signaling or hide/delete.
2. `Save local` / `Load last`: finish as a complete project workflow or simplify honestly.
3. Export format selector: finish with recommendations and warnings or reduce the claim surface.
4. Background removal label: finish with confidence and warnings or relabel.
5. Upscale label: finish with honest quality framing or relabel.

## Top 5 Codebase Pain Points

1. `EditorApp.tsx` centralizes too many responsibilities.
2. No canonical project document schema or migration policy.
3. No central error/status convention.
4. Input/output logic is mixed directly into UI event handlers.
5. Test coverage follows demo success, not real-user flows.

## Top 5 Documentation / Reality Mismatches

1. `local WebGPU AI features`
2. `WebGPU ready`
3. Project saving language implies a more complete workflow than exists
4. Export wording implies a trustworthy final artifact without provenance
5. README does not warn about unsupported formats or silent downscaling

## Fully Usable Means

1. A stranger can open their own image, or restore a saved project, without guessing what the app supports.
2. A stranger can understand whether the app changed resolution, dropped animation, or preserved transparency before export.
3. A stranger can save work, reload it later, and share or import that state on another device.
4. A stranger can recover from unsupported or broken files because the app explains what happened and what to do next.
5. A stranger can trust the labels on the screen because every visible control does exactly what it says.

## Phase 3 Success Metrics

1. Input audit: every non-gray row becomes green.
2. Output audit: every non-gray row becomes green.
3. Controls audit: no yellow controls remain without an explicit ADR saying they are intentionally limited.
4. Codebase audit: zero dead exports, zero unsafe UI-boundary casts, and no god-module input/output orchestration in a single component.
5. Stranger test: top 3 confusion points are fixed in the same phase.

## Out of Scope

- No new editing tools beyond making the current ones honest and usable.
- No polish pass, branding refresh, dark mode, animation pass, or marketing work.
- No backend, auth, sync service, or architecture mode change.
- No model-backed segmentation or upscale engine in this phase.
