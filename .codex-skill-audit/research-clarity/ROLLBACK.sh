#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-/c/Users/37453/.codex/skills/research-clarity}"
case "$(basename "$TARGET")" in
  research-clarity|research-clarity-test) ;;
  *) echo "ROLLBACK_REFUSED unexpected target: $TARGET"; exit 64 ;;
esac
if [[ ! -f "$TARGET/SKILL.md" ]]; then
  echo "ROLLBACK_NOOP target absent: $TARGET"
  exit 0
fi
rm -rf -- "$TARGET"
if [[ -e "$TARGET" ]]; then
  echo "ROLLBACK_FAILED target still exists: $TARGET"
  exit 1
fi
echo "ROLLBACK_OK removed: $TARGET"
echo "RESTORED original hv-analysis remains installed"
