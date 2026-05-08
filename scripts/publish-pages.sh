#!/usr/bin/env bash
set -euo pipefail

if [ ! -d dist ] || [ ! -s dist/index.html ]; then
  echo "dist/index.html is missing; run make build first" >&2
  exit 1
fi

repo_url="$(git config --get remote.origin.url)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

git clone --branch gh-pages --single-branch "$repo_url" "$tmp_dir" 2>/dev/null || {
  git clone "$repo_url" "$tmp_dir"
  git -C "$tmp_dir" checkout --orphan gh-pages
  git -C "$tmp_dir" rm -rf . >/dev/null 2>&1 || true
}

find "$tmp_dir" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$tmp_dir"/
touch "$tmp_dir/.nojekyll"

git -C "$tmp_dir" add -A
if git -C "$tmp_dir" diff --cached --quiet; then
  echo "gh-pages already up to date"
  exit 0
fi

git -C "$tmp_dir" commit -m "deploy: publish pages"
git -C "$tmp_dir" push origin gh-pages
