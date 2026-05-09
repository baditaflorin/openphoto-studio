# Phase 3 Input Audit

Date: 2026-05-09

Build audited: v0.1.0, commit `7a82360`.

Status key:

- `green`: works end-to-end on real user data
- `yellow`: partly works, surprising, or limited in a way the UI does not explain
- `red`: not built, broken, or claimed but not real
- `gray`: intentionally out of scope candidate

| Pathway                             | Status | What happens today                                    | Gap                                                                                   |
| ----------------------------------- | ------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| File upload from desktop            | yellow | Single image file opens through the hidden file input | No preflight diagnosis, no batch, no state-file import, no user-facing support matrix |
| Drag and drop                       | yellow | First dropped file opens                              | Multiple files ignored, no drop affordance, no unsupported-file explanation           |
| Paste image from clipboard          | red    | Nothing happens                                       | No paste handler                                                                      |
| Paste text / HTML                   | red    | Nothing happens                                       | No state paste, URL paste, or user guidance                                           |
| URL input                           | red    | No control exists                                     | No supported pathway for hosted images                                                |
| Clipboard read API                  | red    | Not built                                             | No permission flow or fallback                                                        |
| Mobile picker                       | yellow | Likely works through native file input on mobile      | Not tested, no camera-facing affordance, no hint text                                 |
| Multi-file input                    | red    | Only the first file is used                           | No queue, partial success, or batch reporting                                         |
| Folder input                        | gray   | Not present                                           | Candidate permanent out-of-scope for v0.2                                             |
| Demo/sample image                   | green  | Demo button loads a synthetic image                   | Works                                                                                 |
| Restored autosave on reload         | red    | Last project is not auto-restored                     | User must click `Load last` manually                                                  |
| Imported saved project / state file | red    | Not built                                             | No importable canonical state format                                                  |
| Deep link / shared state            | red    | Not built                                             | No URL-hash/project-link input path                                                   |
| Empty / corrupt input handling      | yellow | Generic decode error appears                          | Does not diagnose empty, corrupt, unsupported, animated, or downscaled cases          |
| Unsupported format handling         | yellow | Generic decode error appears                          | No format-specific next step                                                          |

## Before/After Goal

Phase 3 target is that a stranger can start from:

- a local image file
- drag-drop
- clipboard image paste
- restored autosave
- an exported state file
- a share link

without guessing what the app supports or what happened to their file.
