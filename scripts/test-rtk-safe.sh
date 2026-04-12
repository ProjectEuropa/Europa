#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
APP_DIR=$(cd "${SCRIPT_DIR}/.." && pwd)
RTK_SAFE="${APP_DIR}/scripts/rtk-safe.sh"

tmp_dir=$(mktemp -d)
trap 'rm -rf "${tmp_dir}"' EXIT

fake_rtk="${tmp_dir}/rtk"
cat >"${fake_rtk}" <<'FAKE_RTK'
#!/usr/bin/env bash
printf 'fake-rtk:%s\n' "$*"
FAKE_RTK
chmod +x "${fake_rtk}"

if command -v sha256sum >/dev/null 2>&1; then
  fake_sha=$(sha256sum "${fake_rtk}" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
  fake_sha=$(shasum -a 256 "${fake_rtk}" | awk '{print $1}')
else
  echo "sha256sum または shasum が見つかりません" >&2; exit 1
fi

run_rtk_safe() {
  env \
    RTK_BIN="${fake_rtk}" \
    RTK_SOURCE_URL="https://github.com/rtk-ai/rtk/releases/tag/v0.0.0-test" \
    RTK_VERSION="0.0.0-test" \
    RTK_SHA256="${fake_sha}" \
    "$@"
}

expect_success() {
  local name=$1
  shift

  if output=$(run_rtk_safe "$@" 2>&1); then
    printf 'ok - %s\n' "${name}"
  else
    printf 'not ok - %s\n%s\n' "${name}" "${output}" >&2
    exit 1
  fi
}

expect_failure() {
  local name=$1
  shift

  set +e
  output=$(run_rtk_safe "$@" 2>&1)
  status=$?
  set -e

  if [[ ${status} -ne 0 ]]; then
    printf 'ok - %s\n' "${name}"
  else
    printf 'not ok - %s\nunexpected success: %s\n' "${name}" "${output}" >&2
    exit 1
  fi
}

cd "${APP_DIR}"

expect_success 'allows git diff' "${RTK_SAFE}" git diff
expect_success 'allows git show' "${RTK_SAFE}" git show
expect_success 'allows token in normal git path' "${RTK_SAFE}" git log -- src/auth/token-service.ts
expect_failure 'rejects CI' env CI=true "${RTK_SAFE}" git status
expect_failure 'rejects disallowed command' "${RTK_SAFE}" bash -c whoami
expect_failure 'rejects npm test' "${RTK_SAFE}" npm test
expect_failure 'rejects --global' "${RTK_SAFE}" git log --global
expect_failure 'rejects credential option' "${RTK_SAFE}" git log --token=abc

set +e
bad_hash_output=$(
  env \
    RTK_BIN="${fake_rtk}" \
    RTK_SOURCE_URL="https://github.com/rtk-ai/rtk/releases/tag/v0.0.0-test" \
    RTK_VERSION="0.0.0-test" \
    RTK_SHA256="0000000000000000000000000000000000000000000000000000000000000000" \
    "${RTK_SAFE}" git status 2>&1
)
bad_hash_status=$?
set -e

if [[ ${bad_hash_status} -ne 0 && "${bad_hash_output}" == *"SHA256"* ]]; then
  printf 'ok - rejects sha256 mismatch\n'
else
  printf 'not ok - rejects sha256 mismatch\n%s\n' "${bad_hash_output}" >&2
  exit 1
fi

set +e
missing_env_output=$(env -u RTK_BIN -u RTK_SOURCE_URL -u RTK_VERSION -u RTK_SHA256 "${RTK_SAFE}" git status 2>&1)
missing_env_status=$?
set -e

if [[ ${missing_env_status} -ne 0 && "${missing_env_output}" == *"RTK_BIN"* ]]; then
  printf 'ok - rejects missing environment\n'
else
  printf 'not ok - rejects missing environment\n%s\n' "${missing_env_output}" >&2
  exit 1
fi

set +e
bad_hash_show_output=$(
  env \
    RTK_BIN="${fake_rtk}" \
    RTK_SOURCE_URL="https://github.com/rtk-ai/rtk/releases/tag/v0.0.0-test" \
    RTK_VERSION="0.0.0-test" \
    RTK_SHA256="0000000000000000000000000000000000000000000000000000000000000000" \
    "${RTK_SAFE}" git show 2>&1
)
bad_hash_show_status=$?
set -e

if [[ ${bad_hash_show_status} -ne 0 && "${bad_hash_show_output}" == *"SHA256"* ]]; then
  printf 'ok - rejects sha256 mismatch for git show\n'
else
  printf 'not ok - rejects sha256 mismatch for git show\n%s\n' "${bad_hash_show_output}" >&2
  exit 1
fi

set +e
missing_env_show_output=$(env -u RTK_BIN -u RTK_SOURCE_URL -u RTK_VERSION -u RTK_SHA256 "${RTK_SAFE}" git show 2>&1)
missing_env_show_status=$?
set -e

if [[ ${missing_env_show_status} -ne 0 && "${missing_env_show_output}" == *"RTK_BIN"* ]]; then
  printf 'ok - rejects missing environment for git show\n'
else
  printf 'not ok - rejects missing environment for git show\n%s\n' "${missing_env_show_output}" >&2
  exit 1
fi
