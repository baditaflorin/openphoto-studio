# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The repository needs both project documentation under `docs/` and a built static app for GitHub Pages. Building into `docs/` would overwrite ADRs and documentation.

## Decision

Publish GitHub Pages from the `gh-pages` branch root. Keep source and documentation on `main`. `make publish-pages` builds `dist/`, copies it to an orphan/updated `gh-pages` checkout, adds `.nojekyll`, and pushes.

The live URL is `https://baditaflorin.github.io/openphoto-studio/`.

## Consequences

- `dist/` remains gitignored on `main`.
- The built site still lands in git, but on the publishing branch.
- Rollback is done by reverting or resetting the `gh-pages` publish commit.

## Alternatives Considered

- `main/docs`: rejected because documentation also belongs in `docs/`.
- GitHub Actions deploy: rejected because local hooks and manual publish are required.
