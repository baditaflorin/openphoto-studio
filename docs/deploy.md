# Deploy

Live URL: https://baditaflorin.github.io/openphoto-studio/

Repository: https://github.com/baditaflorin/openphoto-studio

## Publish

```bash
npm install
make lint
make test
make smoke
make publish-pages
```

`make publish-pages` builds `dist/`, copies it to the `gh-pages` branch root, and pushes that branch.

## Rollback

Find the previous publish commit on `gh-pages`, reset the branch to that commit locally, and push with lease:

```bash
git fetch origin gh-pages
git switch gh-pages
git reset --hard <previous_publish_commit>
git push --force-with-lease origin gh-pages
git switch main
```

## Custom Domain

No custom domain is configured in v1. If one is added, create a `CNAME` file in the published branch and configure DNS with a CNAME or A records according to GitHub Pages documentation.

## Pages Gotchas

- Vite `base` must stay `/openphoto-studio/`.
- GitHub Pages does not support `_headers` or `_redirects`.
- SPA fallback is provided by copying `index.html` to `404.html`.
- Service worker scope must stay under `/openphoto-studio/`.
