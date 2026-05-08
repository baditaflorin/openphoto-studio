.DEFAULT_GOAL := help

VERSION ?= v$(shell node -p "require('./package.json').version")

.PHONY: help install-hooks dev build test test-integration smoke lint fmt pages-preview publish-pages release clean hooks-pre-commit hooks-commit-msg hooks-pre-push

help:
	@printf "Targets:\n"
	@printf "  make install-hooks     Wire local git hooks\n"
	@printf "  make dev               Run the frontend dev server\n"
	@printf "  make build             Build Pages-ready frontend into dist/\n"
	@printf "  make test              Run unit tests\n"
	@printf "  make test-integration  Reserved for integration tests\n"
	@printf "  make smoke             Build and run Playwright smoke tests\n"
	@printf "  make lint              Run linters and format checks\n"
	@printf "  make fmt               Autoformat files\n"
	@printf "  make pages-preview     Serve dist/ exactly as Pages would\n"
	@printf "  make publish-pages     Publish dist/ to gh-pages branch\n"
	@printf "  make release           Run checks, publish Pages, tag semver\n"
	@printf "  make clean             Remove generated outputs\n"

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/*

dev:
	npm run dev

build:
	npm run build
	test -s dist/index.html
	test -s dist/404.html

test:
	npm run test

test-integration:
	@printf "No separate integration suite for Mode A yet.\n"

smoke: build
	npm run smoke

lint:
	npm run lint
	npm run typecheck
	npm run fmt:check
	npm audit --audit-level=high

fmt:
	npm run fmt

pages-preview: build
	npm run serve:dist

publish-pages: build
	./scripts/publish-pages.sh

release: lint test smoke publish-pages
	git tag -a "$(VERSION)" -m "release: $(VERSION)"
	git push origin "$(VERSION)"

hooks-pre-commit:
	.githooks/pre-commit

hooks-commit-msg:
	.githooks/commit-msg .git/COMMIT_EDITMSG

hooks-pre-push:
	.githooks/pre-push

clean:
	rm -rf dist coverage playwright-report test-results
