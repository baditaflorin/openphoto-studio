# Postmortem

Date: 2026-05-08

## What Was Built

OpenPhoto Studio v0.1.0 is a public GitHub Pages app at https://baditaflorin.github.io/openphoto-studio/.

Repository: https://github.com/baditaflorin/openphoto-studio

The app includes:

- A static Vite/React/TypeScript frontend published from the `gh-pages` branch.
- A local-first editor with file import, demo image generation, canvas preview, before/after toggle, and export to PNG, JPEG, and WebP.
- Worker-backed pixel processing through Comlink for exposure, contrast, saturation, warmth, shadows, highlights, sharpness, and vignette.
- Local AI-style tools: auto tone, heuristic background removal, and 2x upscale.
- IndexedDB save/load for the most recent project.
- Visible GitHub repository link, PayPal support link, app version, and commit on the live page.
- Required docs, ADRs, security/community files, local hooks, Playwright smoke test, and semver release flow.

## Was Mode A Correct?

Yes. Mode A was the right choice for v1. The app does not need secrets, accounts, cross-device sync, server-side mutations, or a runtime API. Image processing and persistence work in the browser, and the live public surface is only GitHub Pages.

A backend may become useful later for optional cloud sync, hosted model inference, or collaborative editing, but none of those are v1 requirements.

## What Worked

- GitHub Pages from `gh-pages` kept source docs under `docs/` without conflicts.
- The first-load payload stayed small while the image worker is split into its own lazy asset.
- Playwright smoke testing caught a real selector issue before publishing.
- Local hooks successfully ran gitleaks, lint, typecheck, tests, build, and smoke without GitHub Actions.

## What Did Not Work

- The original scaffold hit Vite/Vitest type skew, fixed by moving Vitest to the current compatible version.
- jsdom lacked `ImageData`, so the pixel tests needed a small test-only polyfill.
- The v1 AI tools are heuristic, not model-backed Real-ESRGAN, RemBG, or Stable Diffusion Turbo.

## Surprises

- GitHub Pages was already enabled immediately after the first publish branch appeared.
- The full app plus worker still stayed comfortably inside the initial JavaScript budget.

## Accepted Tech Debt

- Background removal is edge-color heuristic based, useful for simple backgrounds but not production-grade segmentation.
- Upscale is bilinear plus sharpening, not Real-ESRGAN quality.
- HEIF/JXL import is declared in the file picker, but browser support varies and no libheif/libjxl WASM module is bundled yet.
- Only the latest project snapshot is saved locally.

## Next Three Improvements

1. Add true model-backed background removal behind a lazy WebGPU/WASM boundary.
2. Add crop, rotate, brush mask, and non-destructive history panels.
3. Add optional codec modules for HEIF/JXL and benchmark their payload and browser compatibility.

## Time Spent vs Estimate

Estimated v1 scaffold plus editor slice: 3-5 hours.

Actual focused implementation time in this session: about 1.5-2 hours.

The difference is because v1 intentionally implements a credible browser editor foundation and lazy AI boundary, not the full compiled GIMP/ImageMagick/model stack.
