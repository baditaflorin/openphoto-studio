# 0003 - Frontend Framework and Build Tooling

## Status

Accepted

## Context

The GUI needs a rich interactive editor, strict TypeScript, a small first load, and GitHub Pages-safe asset paths.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, Vitest, Playwright, and vite-plugin-pwa. Use lucide-react for icons, zod for typed configuration validation, TanStack Query for cache-ready metadata/data access, and Comlink for worker RPC.

## Consequences

- The app has production-grade tooling with quick local feedback.
- Vite `base` is fixed to `/openphoto-studio/`.
- The initial bundle budget excludes lazy editor workers and future WASM/model assets.

## Alternatives Considered

- Plain JavaScript: rejected because the editor state benefits from typed contracts.
- Next.js: rejected because static Pages hosting and no backend are simpler with Vite.
