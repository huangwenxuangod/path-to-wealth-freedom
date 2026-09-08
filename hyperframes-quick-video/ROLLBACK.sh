#!/bin/sh
set -eu
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
TARGET=${1:?Provide a test-copy path to restore}
cp "$DIR/FONT_BASELINE.txt" "$TARGET"
cmp -s "$DIR/FONT_BASELINE.txt" "$TARGET"
printf 'RESTORED: pre-font-change 20-second Astra composition\n'
