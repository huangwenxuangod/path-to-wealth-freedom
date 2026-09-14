#!/bin/sh
set -eu
target="${1:?target copy required}"
if [ -e "$target" ]; then rm -f -- "$target"; fi
test ! -e "$target"
printf '%s\n' 'restored behavior/status: rollback copy removed'
