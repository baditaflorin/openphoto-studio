# Phase 3 Controls Audit

Date: 2026-05-09

Build audited: v0.1.0, commit `7a82360`.

| Control               | Status | Current behavior                         | Audit note                                                                    |
| --------------------- | ------ | ---------------------------------------- | ----------------------------------------------------------------------------- |
| `Open`                | yellow | Opens one file                           | Works, but only for browser-decodable image files and offers no diagnosis     |
| `Demo`                | green  | Loads synthetic demo image               | Works                                                                         |
| `Undo`                | yellow | Reverts destructive edit only            | Does not undo slider changes or session actions                               |
| `Edited` / `Original` | green  | Switches displayed buffer                | Works                                                                         |
| `Star`                | green  | Opens repository                         | Works                                                                         |
| `Support`             | green  | Opens PayPal                             | Works                                                                         |
| Adjustment sliders    | green  | Re-render preview                        | Work for loaded image                                                         |
| `Reset adjustments`   | green  | Restores defaults                        | Works                                                                         |
| `Auto tone`           | green  | Updates slider defaults from image stats | Works                                                                         |
| `Remove bg`           | yellow | Applies heuristic alpha removal          | Works but label overpromises because result quality varies a lot              |
| `2x upscale`          | yellow | Bilinear resize plus sharpening          | Works but label implies stronger quality than delivered                       |
| `Project` text field  | yellow | Changes export/save name                 | Not validated, not persisted independently                                    |
| `Save local`          | yellow | Saves latest snapshot in browser         | No schema version, no confirmation of what is saved                           |
| `Load last`           | yellow | Loads latest snapshot if present         | Manual only, no picker, no empty-state discoverability                        |
| Export format select  | yellow | Switches encoder target                  | No recommendations or warnings                                                |
| `Export image`        | yellow | Downloads image                          | No metadata, no shareable state, no transparency/animation/downscale warnings |
| Drop area             | yellow | Accepts dropped file                     | Hidden capability until user experiments                                      |

## Controls That Feel Half-Baked

- `WebGPU ready` pill: informational only, not tied to any actual acceleration path.
- `Remove bg`: finish with proper confidence/warning language or relabel honestly.
- `2x upscale`: finish with honest quality language or relabel honestly.
