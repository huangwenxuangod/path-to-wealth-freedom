#!/usr/bin/env bash
set -euo pipefail
TARGET="$(cygpath -u "${1:?pass a skill directory}")"
EXPECTED="1993151ca39afd7880a20d871aacc0ddd348090530d8135dc5ea51af28f25305"
[[ -f "$TARGET/SKILL.md" ]] || { echo 'ROLLBACK missing SKILL.md'; exit 2; }
ACTUAL="$(sha256sum "$TARGET/SKILL.md" | cut -d ' ' -f 1)"
[[ "$ACTUAL" == "$EXPECTED" ]] || { echo 'ROLLBACK hash mismatch'; exit 3; }
[[ ! -e "$TARGET.rolled-back" ]] || { echo 'ROLLBACK destination exists'; exit 4; }
mv -- "$TARGET" "$TARGET.rolled-back"
echo 'ROLLBACK restored installed=False; saved copy=True'