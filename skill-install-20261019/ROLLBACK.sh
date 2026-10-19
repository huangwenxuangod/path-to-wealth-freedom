#!/usr/bin/env bash
# Remove the five installed skills and restore the baseline registry.
#
# Defaults target the live Codex skills directory.
# Override for a sandbox test:
#   SKILLS_ROOT=/path/to/copy TARGET_REGISTRY=/path/to/registry.json ./ROLLBACK.sh
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
SKILLS_ROOT=${SKILLS_ROOT:-$HOME/.codex/skills}
BASELINE_REGISTRY=${BASELINE_REGISTRY:-$HERE/baseline/skills-registry.json}
TARGET_REGISTRY=${TARGET_REGISTRY:-$HERE/modified/skills-registry.json}
NAMES=(mg-motion-design weilanx-video-studio video-production-playbook lemo-opuscar ancient-rap-battle)

[ -d "$SKILLS_ROOT" ] || { echo "skills root not found: $SKILLS_ROOT" >&2; exit 1; }
[ -f "$BASELINE_REGISTRY" ] || { echo "baseline registry not found: $BASELINE_REGISTRY" >&2; exit 1; }

ROOT_REAL=$(cd "$SKILLS_ROOT" && pwd -P)

for name in "${NAMES[@]}"; do
  target="$ROOT_REAL/$name"
  if [ -e "$target" ]; then
    case "$target" in
      "$ROOT_REAL"/*) rm -rf -- "$target"; echo "removed $target" ;;
      *) echo "refusing to remove outside skills root: $target" >&2; exit 1 ;;
    esac
  else
    echo "absent $target"
  fi
done

cp -- "$BASELINE_REGISTRY" "$TARGET_REGISTRY"
echo "restored registry: $TARGET_REGISTRY"
echo "baseline sha256: $(sha256sum "$BASELINE_REGISTRY" | cut -d' ' -f1)"
echo "target   sha256: $(sha256sum "$TARGET_REGISTRY" | cut -d' ' -f1)"
