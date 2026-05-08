# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project explicitly avoids GitHub Actions. Checks must run locally.

## Decision

Use plain `.githooks/` scripts wired by `make install-hooks`. Hooks include:

- `pre-commit`: lint, format check, optional staged gitleaks scan.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: test, build, smoke.

## Consequences

- Contributors must install hooks locally.
- Missing optional tools like gitleaks are reported but do not block the first scaffold.

## Alternatives Considered

- Lefthook: deferred to keep v1 dependency surface smaller.
- GitHub Actions: rejected by requirement.
