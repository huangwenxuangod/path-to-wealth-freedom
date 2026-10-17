#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "--test-copy" ]]; then
  copy="${2:?copy path required}"
  [[ -f "$copy" ]] || exit 2
  rm -- "$copy"
  [[ ! -e "$copy" ]]
  echo 'copy restored to absent baseline'
  exit 0
fi
root="$(cygpath -u "$USERPROFILE")/.codex/skills"
target="$root/sun-skill"
[[ -d "$target" ]]
[[ "$(dirname "$(realpath "$target")")" == "$(realpath "$root")" ]]
rm -r -- "$target"
echo 'sun-skill uninstalled'