# Automated contributions

This directory configures the automated development platform that contributes to this
repository. This note says which branches it uses here and how its work reaches the
project's main line.

## Branches

- `aidev/integration` — the integration branch. Automated work lands here and nowhere else.
- `main` — the project's main line; reached from `aidev/integration` only by merge request (`aidev handoff`). Merge it **keeping the source branch**: `aidev/integration` is protected for that reason.
- `ai/*` — one branch per task, created and deleted by the platform. Do not commit to them.
- `session/*` — a session's accumulated work, landed on the integration branch as a batch.

## How work reaches the main line

Task and session branches never reach `aidev/integration` through merge requests; the platform
lands them after its own verification. `aidev/integration` reaches `main` by this project's
usual process, merge requests included — the platform never merges into any other branch.

`.gitlab-ci.yml` runs the same type check and build (`type_check`, `build`) on branch and tag
pipelines from common-ci-configuration's npm templates; it runs no pipeline for `ai/*`,
`session/*` or pushes to `aidev/integration`, which the suites below verify instead.

## Suites run before work lands

Declared in `.aidev/project.yaml` under `verification`, all through `.aidev/run-checks.sh`,
which writes `test-results/<slot>/junit.xml` (one case per step, the step's log as the
failure body). Every run first installs dependencies offline from the lockfile
(`.aidev/pnpm-deps.sh`), one case `install`; the slots name the steps after it:

- `quick` — typecheck build
- `full` — typecheck build
- `baseline` — typecheck build
- `canary` — typecheck build
- `static` — typecheck
- `coverage` — typecheck build
- `system` — build

Steps: `typecheck` is `vue-tsc --build --force` (package.json `type-check`); `build` is
`vite build` (package.json `build-only`; package.json's `build` runs both). The repository has
**no tests and no linter**, so every slot is install + type check + build (`static` the type
check only, `system` the build only) and the slots necessarily repeat that evidence. There is no
coverage tooling: `coverage` runs the type check and the build.

This is hive/transaction-inspector, not the newer hive/tx-inspector (a separate project).

## Test runtime

`.aidev/runtime/Dockerfile` builds on common-ci-configuration's `node-test-tools:develop` (Node
and pnpm come from there; this repository pins no Node of its own in it) and adds a pnpm store
filled from `pnpm-lock.yaml` by `pnpm fetch`. Dependency versions come from the pnpm catalogs of
common-ci-configuration (`pnpm-workspace.yaml` is a symlink into the `npm-common-config`
submodule, which must be checked out). Rebuild and re-pin it with
`.aidev/runtime/build.sh --push` when the Dockerfile or the files it copies change, or to follow a
new `node-test-tools:develop` or a new ccc catalog, and put the printed `repo@sha256:…` into
`environment.image`.
