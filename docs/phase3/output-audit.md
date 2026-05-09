# Phase 3 Output Audit

Date: 2026-05-09

Build audited: v0.1.0, commit `7a82360`.

Status key:

- `green`: works end-to-end
- `yellow`: technically works but incomplete or surprising
- `red`: not built or broken
- `gray`: candidate permanent out-of-scope

| Output pathway                   | Status | What happens today                       | Gap                                                                                  |
| -------------------------------- | ------ | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Image download                   | yellow | PNG/JPEG/WebP download works             | No provenance, no sidecar, no export recommendations, no animation/downscale warning |
| Export full project state        | red    | Not built                                | No canonical portable project file                                                   |
| Re-import exported state         | red    | Not built                                | No round-trip path                                                                   |
| Copy image to clipboard          | red    | Not built                                | No output-to-clipboard workflow                                                      |
| Copy state/metadata to clipboard | red    | Not built                                | No automation-ready output                                                           |
| Shareable link                   | red    | Not built                                | No hash/state URL                                                                    |
| Metadata sidecar download        | red    | Not built                                | No reproducibility artifact                                                          |
| Print/PDF-friendly output        | gray   | Not built                                | Candidate out-of-scope if not needed for the product                                 |
| API/curl-ready output            | gray   | Not built                                | Candidate out-of-scope for a browser-only photo editor                               |
| Saved local project              | yellow | `Save local` stores only latest snapshot | No versioned schema, no migration, no visible restore policy                         |

## Before/After Goal

Phase 3 target is that every user can leave the app with:

- an edited image
- a reusable state file
- a shareable URL when the project is small enough
- provenance metadata explaining exactly what was exported
