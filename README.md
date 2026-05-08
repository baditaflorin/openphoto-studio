# OpenPhoto Studio

Live site: https://baditaflorin.github.io/openphoto-studio/

GitHub repo: https://github.com/baditaflorin/openphoto-studio

Support via PayPal: https://www.paypal.com/paypalme/florinbadita

Browser-based photo editor with WASM-ready imaging tools and local WebGPU AI features.

OpenPhoto Studio is a static GitHub Pages app for quick, private photo edits in the browser. It focuses on the 80% workflow most creators reach for first: import, adjust, mask, upscale, retouch, compare, and export without an account or subscription.

![OpenPhoto Studio editor](docs/assets/screenshot.png)

## What Works in v1

- Import local images or load the built-in demo image.
- Adjust exposure, contrast, saturation, warmth, shadows, highlights, sharpness, and vignette.
- Run local worker-backed tools for auto tone, heuristic background removal, and 2x upscale.
- Save/load the latest project in browser storage and export PNG, JPEG, or WebP.
- See version and commit directly in the GitHub Pages UI.

## Quickstart

```bash
npm install
make install-hooks
make dev
```

## Build

```bash
make lint
make test
make build
make smoke
```

## Architecture

```mermaid
C4Context
    title OpenPhoto Studio Context
    Person(user, "Creator", "Edits photos locally in the browser")
    System_Boundary(pages, "GitHub Pages") {
      System(app, "OpenPhoto Studio", "Static Vite app")
    }
    System_Ext(github, "GitHub Repository", "Source, issues, stars")
    System_Ext(paypal, "PayPal", "Optional support link")
    Rel(user, app, "Uses")
    Rel(app, github, "Links to")
    Rel(app, paypal, "Links to")
```

See `docs/architecture.md` and `docs/adr/` for implementation decisions.

## Deployment

GitHub Pages serves the `gh-pages` branch. `make publish-pages` builds `dist/` and publishes it.

Complete deploy notes: `docs/deploy.md`
