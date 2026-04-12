#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
APP_DIR=$(cd "${SCRIPT_DIR}/.." && pwd)

fail() {
  echo "rtk-safe: $*" >&2
  exit 2
}

if [[ "${CI:-}" == "1" || "${CI:-}" =~ ^[Tt][Rr][Uu][Ee]$ ||
  -n "${GITHUB_ACTIONS:-}" || -n "${CIRCLECI:-}" || -n "${TRAVIS:-}" ||
  -n "${JENKINS_URL:-}" || -n "${GITLAB_CI:-}" || -n "${BITBUCKET_BUILD_NUMBER:-}" ]]; then
  fail "CI では rtk を使わないでください"
fi

if [[ $# -lt 1 ]]; then
  cat >&2 <<'USAGE'
Usage:
  ./scripts/rtk-safe.sh git diff [args...]
  ./scripts/rtk-safe.sh git status [args...]
  ./scripts/rtk-safe.sh git log [args...]
  ./scripts/rtk-safe.sh git show [args...]

Required environment:
  RTK_BIN=/absolute/path/to/rtk
  RTK_SOURCE_URL=https://...
  RTK_VERSION=x.y.z
  RTK_SHA256=<sha256 of RTK_BIN>

This wrapper is for local, manual review only. It never installs hooks.
USAGE
  exit 2
fi

if git_root=$(git -C "${PWD}" rev-parse --show-toplevel 2>/dev/null); then
  [[ "${git_root}" == "${APP_DIR}" ]] || fail "この repo 内でだけ実行してください: ${APP_DIR}"
else
  fail "git repo 内で実行してください"
fi

case "${1}" in
  aws|curl|wget|docker|kubectl)
    fail "${1} は rtk-safe では禁止です"
    ;;
  gh)
    fail "gh は rtk-safe では禁止です"
    ;;
esac

case "${1}:${2:-}" in
  git:diff|git:status|git:log|git:show)
    ;;
  *)
    fail "許可コマンドは git diff/status/log/show のみです"
    ;;
esac

# The allowlist above rejects rtk-level init/hook commands. Do not block
# generic flags such as -g here because they may be valid for allowed commands.
for token in "$@"; do
  case "${token}" in
    --global|--global=*)
      fail "global 操作は禁止です"
      ;;
  esac
done

for arg in "$@"; do
  lower_arg=$(printf '%s' "${arg}" | tr '[:upper:]' '[:lower:]')
  case "${lower_arg}" in
    *.env|*.env.*|*/.env|*/.env.*|*credentials*|--secret=*|--token=*|--password=*)
      fail "secret / .env / credentials を含む引数は禁止です: ${arg}"
      ;;
  esac
done

[[ -n "${RTK_BIN:-}" ]] || fail "RTK_BIN=/absolute/path/to/rtk を指定してください"
[[ -n "${RTK_SOURCE_URL:-}" ]] || fail "RTK_SOURCE_URL に承認済み配布元URLを指定してください"
[[ -n "${RTK_VERSION:-}" ]] || fail "RTK_VERSION に検証済みバージョンを指定してください"
[[ -n "${RTK_SHA256:-}" ]] || fail "RTK_SHA256 に RTK_BIN の SHA256 を指定してください"

rtk_bin="${RTK_BIN}"
[[ "${rtk_bin}" = /* ]] || fail "RTK_BIN は絶対パスで指定してください: ${rtk_bin}"
[[ -x "${rtk_bin}" ]] || fail "RTK_BIN is not executable: ${rtk_bin}"
[[ "${RTK_SOURCE_URL}" =~ ^https:// ]] || fail "RTK_SOURCE_URL は https URL を指定してください"
[[ "${RTK_SHA256}" =~ ^[a-fA-F0-9]{64}$ ]] || fail "RTK_SHA256 は64文字のhex文字列で指定してください"

if command -v sha256sum >/dev/null 2>&1; then
  actual_sha256=$(sha256sum "${rtk_bin}" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
  actual_sha256=$(shasum -a 256 "${rtk_bin}" | awk '{print $1}')
else
  fail "sha256sum または shasum が見つかりません"
fi
if [[ "${actual_sha256}" != "${RTK_SHA256}" ]]; then
  fail "RTK_BIN の SHA256 が一致しません: expected=${RTK_SHA256} actual=${actual_sha256}"
fi

export RTK_TELEMETRY_DISABLED=1
export RTK_TEE=0
export RTK_SOURCE_URL
export RTK_VERSION

exec "${rtk_bin}" "$@"
