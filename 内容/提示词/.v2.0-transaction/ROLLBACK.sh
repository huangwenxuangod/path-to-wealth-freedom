#!/bin/sh
set -eu
BASE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
python3 - "$BASE/../文轩_AI封面_Prompt工程规范_v2.0.md" <<'PY'
import sys
from pathlib import Path
p=Path(sys.argv[1])
if p.exists():
    p.unlink()
print(f"removed={p}")
PY
