# 0001 - Deployment Mode

## Status

Accepted

## Context

OpenPhoto Studio should default to GitHub Pages unless a runtime backend is genuinely required. The v1 workflow edits user-provided images, stores projects locally, and links to GitHub and PayPal. It does not need accounts, server-side mutations, runtime secrets, or cross-device sync.

## Decision

Use Mode A: Pure GitHub Pages. The app is a static Vite build served from the `gh-pages` branch. Image processing runs in browser APIs, Web Workers, Canvas, IndexedDB, OPFS where available, and lazy-loaded static assets.

## Consequences

- No Go runtime backend, Docker image, nginx, server metrics, runtime database, or deployed secrets in v1.
- GitHub Pages is the only public hosting surface.
- Heavy editor and AI code must be lazy-loaded behind user intent.
- Browser compatibility and device memory are the main operational constraints.

## Alternatives Considered

- Mode B: unnecessary because v1 has no scheduled data artifacts.
- Mode C: rejected because there are no runtime secrets, auth, or shared writes.
