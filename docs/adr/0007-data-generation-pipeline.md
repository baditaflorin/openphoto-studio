# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

The bootstrap template requires a Mode B data-generation pipeline only when static artifacts are produced offline. ADR 0001 selects Mode A.

## Decision

Do not create a data-generation pipeline in v1. If future sample packs, presets, benchmarks, or model catalogs need offline generation, introduce Mode B artifacts under a versioned contract and add `make data`.

## Consequences

- No generated data is committed in v1.
- `make data` is omitted until there is a real artifact to regenerate.

## Alternatives Considered

- Empty `make data`: rejected because it would imply a pipeline exists.
