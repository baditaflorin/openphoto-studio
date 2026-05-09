# Phase 3 Feature Claims Audit

Date: 2026-05-09

Build audited: v0.1.0, commit `7a82360`.

| Claim source | Claim                                                                                   | Status            | Notes                                                                                     |
| ------------ | --------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| README       | Import local images                                                                     | shipped fully     | True for common browser-decodable images                                                  |
| README       | Load built-in demo image                                                                | shipped fully     | True                                                                                      |
| README       | Adjust exposure, contrast, saturation, warmth, shadows, highlights, sharpness, vignette | shipped fully     | True                                                                                      |
| README       | Auto tone, background removal, 2x upscale                                               | shipped partially | Tools work, but labels overstate certainty/quality                                        |
| README       | Save/load latest project in browser storage                                             | shipped partially | Only one latest snapshot, no auto-restore, no import/export portability                   |
| README       | Export PNG, JPEG, WebP                                                                  | shipped partially | Download works, but no provenance and no warnings for lossy transforms                    |
| README       | Browser-based photo editor with local WebGPU AI features                                | not shipped       | There is no actual WebGPU-powered path today; only a capability badge                     |
| README       | PWA / installable behavior implied by docs and plugin choice                            | shipped partially | Manifest and service worker exist, but no tested install/reinstall workflow is documented |
| UI           | `WebGPU ready`                                                                          | not shipped       | It reports browser capability, not app behavior                                           |
| UI           | `Remove bg`                                                                             | shipped partially | Works heuristically; lacks confidence and quality framing                                 |
| UI           | `2x upscale`                                                                            | shipped partially | Works as a local resize, not model-based upscale                                          |

## Highest-Priority Mismatches

1. `local WebGPU AI features`
2. `WebGPU ready`
3. Save/load language that sounds like a durable project workflow but only stores one opaque snapshot
