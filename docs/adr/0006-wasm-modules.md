# 0006 - WASM Modules and Browser Compute

## Status

Accepted

## Context

The product direction includes GIMP/ImageMagick-style transforms, modern codecs, upscaling, background removal, and WebGPU-assisted AI. v1 must stay deployable on GitHub Pages and under the first-load budget.

## Decision

Ship v1 with Canvas and Worker-based processing, with an explicit lazy boundary for future WASM/model integrations. Do not bundle large WASM or model files into the initial payload. Future modules must be static assets loaded after user action and versioned by release.

Candidate modules:

- ImageMagick/WASM for advanced format transforms.
- libheif/libjxl WASM for import/export experiments.
- WebGPU inference for enhancement models where browser support is sufficient.

## Consequences

- The current app is useful without blocking on multi-megabyte engines.
- Advanced codecs and model-backed tools can be added incrementally.
- GitHub Pages cannot set COOP/COEP headers, so modules requiring cross-origin isolation need a documented fallback or service-worker strategy before adoption.

## Alternatives Considered

- Bundle all engines immediately: rejected because it would blow the initial payload and slow first visit.
- Runtime backend inference: rejected for v1 privacy and cost reasons.
