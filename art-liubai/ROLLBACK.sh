#!/bin/sh
set -eu
base=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
target=${1:?Pass a separate test-copy path}
cp "$base/ORIGINAL.txt" "$target"
cmp -s "$base/ORIGINAL.txt" "$target"
printf 'ROLLBACK_OK: original template restored byte-for-byte\n'
