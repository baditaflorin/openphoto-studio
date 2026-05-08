# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode A serves a static app only.

## Decision

Deployment topology is GitHub Pages only:

- Source branch: `main`.
- Publish branch: `gh-pages`.
- Public URL: `https://baditaflorin.github.io/openphoto-studio/`.
- No `deploy/` directory, Docker Compose, nginx, Prometheus, or server runbook in v1.

## Consequences

- Operations are simple: build, publish branch, verify URL.
- Runtime scaling is handled by GitHub Pages.

## Alternatives Considered

- Docker backend: rejected by ADR 0001.
