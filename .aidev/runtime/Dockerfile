# The image AIDEV runs this project's suites in (`environment.image` in
# .aidev/project.yaml). Suites run with `--network none` and the caller's uid, so
# everything they need is in the image.
#
# Node and pnpm come from common-ci-configuration's node-test-tools image, the one
# hive's CI templates use; this file pins no Node version of its own. It adds a
# pnpm store filled from pnpm-lock.yaml (`pnpm fetch`, with the @hiveio registry
# of .npmrc), so `pnpm install --offline --frozen-lockfile` links node_modules in
# the sandbox.
#
# .aidev/runtime/build.sh builds it on the digest node-test-tools:develop names at
# the time; the result is pinned as `environment.image`. Rebuild it whenever
# pnpm-lock.yaml changes.
#
# At onboarding (2026-10-29) pnpm-lock.yaml names @hiveio/wax
# 1.27.6-rc1-stable.240731102828, which no registry serves any more (gone from
# the @hiveio GitLab registry and never on npmjs.org), so a frozen install cannot
# succeed anywhere. The fetch below tolerates exactly that one 404, leaving the
# store with whatever it fetched, so the image exists and the suites' `install`
# case reports the failure. Any other fetch error, and every lockfile without
# that version, still fails the build.
ARG BASE_IMAGE=registry.gitlab.syncad.com/hive/common-ci-configuration/node-test-tools:develop
FROM ${BASE_IMAGE}
USER root
# The suite runs as an arbitrary uid with no passwd entry, so HOME must be a
# directory anyone can write. pnpm must not switch to `packageManager`'s version:
# that would download at run time, offline. The environment variable covers the
# outer pnpm only: a pnpm started from a package script reads the setting from
# its global rc ($XDG_CONFIG_HOME/pnpm/rc).
ENV HOME=/tmp \
    XDG_CONFIG_HOME=/opt/xdg-config \
    npm_config_store_dir=/opt/pnpm-store \
    npm_config_manage_package_manager_versions=false \
    CI=1 \
    DO_NOT_TRACK=1
RUN mkdir -p /opt/xdg-config/pnpm \
    && printf 'manage-package-manager-versions=false\n' > /opt/xdg-config/pnpm/rc \
    && chmod -R a+rX /opt/xdg-config
COPY package.json pnpm-lock.yaml .npmrc /tmp/pnpm-fetch/
RUN cd /tmp/pnpm-fetch \
    && { pnpm fetch 2>&1 | tee /tmp/fetch.log; rc=${PIPESTATUS[0]}; \
         [ "$rc" -eq 0 ] || grep -qF '@hiveio/wax-1.27.6-rc1-stable.240731102828.tgz: Not Found - 404' /tmp/fetch.log; } \
    && cd / && rm -rf /tmp/pnpm-fetch /tmp/fetch.log /tmp/.npm /tmp/.cache /tmp/.local \
    && chmod -R a+rwX /opt/pnpm-store
