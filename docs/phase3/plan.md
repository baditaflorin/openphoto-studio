# Phase 3 Plan

Date: 2026-05-09

Priority order is based on real-user impact for a stranger trying to use the app on their own data.

## Ranked Implementation Picklist

1. Add import preflight diagnosis for empty, unsupported, corrupt, animated, alpha, and downscaled inputs.
2. Add canonical project document schema with versioning and migrations.
3. Add autosave restore on reload.
4. Add explicit `Start fresh` reset that clears runtime state and autosave.
5. Add project state export file.
6. Add project state import file.
7. Add shareable URL hash export/import for small projects.
8. Add clipboard image paste input.
9. Add clipboard project-state paste input.
10. Add copy edited image to clipboard.
11. Add export metadata sidecar.
12. Add export recommendations and warnings based on source facts.
13. Surface animation flattening warning.
14. Surface downscale warning with original vs working dimensions.
15. Surface transparency-preservation warning for JPEG export.
16. Relabel and document heuristic tools honestly.
17. Replace `WebGPU ready` with truthful capability language.
18. Add settings panel with real persisted settings only.
19. Persist export preference, autosave preference, and warning-dismissal preference.
20. Split `EditorApp` orchestration into smaller hooks/services.
21. Centralize status/error message creation.
22. Remove dead code and unsafe casts.
23. Add automated tests for state round-trip.
24. Add automated tests for input diagnosis.
25. Add automated tests for clipboard/share-link restore path.
26. Update README and docs to match shipped behavior and explicit limitations.
27. Run and document stranger test, then fix the top 3 issues found.

## Batch Order

### Batch 1: Trust the Input

- Items 1, 8, 9, 13, 14, 15

### Batch 2: Trust the State

- Items 2, 3, 4, 5, 6, 7, 18, 19

### Batch 3: Trust the Output

- Items 10, 11, 12

### Batch 4: Trust the Labels

- Items 16, 17, 26

### Batch 5: Trust the Codebase

- Items 20, 21, 22, 23, 24, 25

### Batch 6: Stranger Test

- Item 27
