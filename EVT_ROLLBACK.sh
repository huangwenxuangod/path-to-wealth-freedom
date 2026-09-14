#!/bin/sh
set -eu
target="${1:?target copy required}"
rm -f -- "$target"
test ! -e "$target"
printf '%s\n' 'restored behavior/status: rollback copy removed'
