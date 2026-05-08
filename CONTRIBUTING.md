# Contributing

Thanks for helping improve OpenPhoto Studio.

## Local Setup

```bash
npm install
make install-hooks
make dev
```

## Workflow

- Use Conventional Commits, for example `feat: add crop handles`.
- Keep changes focused and include tests for behavior changes.
- Run `make lint`, `make test`, `make build`, and `make smoke` before pushing.
- Never commit secrets, private keys, or real `.env` files.

## Architecture

Read the ADRs in `docs/adr/` before changing deployment, storage, worker, or build behavior.
