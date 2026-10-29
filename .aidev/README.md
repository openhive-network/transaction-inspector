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

This repository has no CI pipeline of its own.

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
filled from `pnpm-lock.yaml` by `pnpm fetch`. Rebuild and re-pin it with
`.aidev/runtime/build.sh --push` when the Dockerfile or the files it copies change, or to follow a
new `node-test-tools:develop`, and put the printed `repo@sha256:…` into `environment.image`.

At onboarding the image's fetch tolerates exactly one missing tarball (below); see the comment
in the Dockerfile.

## Known state at onboarding (2026-10-29)

- `install` fails, so every slot fails: `pnpm-lock.yaml` names `@hiveio/wax`
  `1.27.6-rc1-stable.240731102828`, which no registry serves any more (gone from the @hiveio
  GitLab registry `.npmrc` names, and never on npmjs.org). A frozen install cannot succeed
  anywhere until the lockfile moves to a published wax; the image then has to be rebuilt and
  re-pinned. The 208 other packages of the lockfile are in the image's store.
- `typecheck` and `build` could therefore not be run at onboarding.
