#!/bin/sh
set -eu

source_dir=/Users/ai1/.Trash/evt-skill-deleted-20260914.HgQWqH/evt
target_dir=${1:?target directory required}
test ! -e "$target_dir"
cp -R "$source_dir" "$target_dir"
printf '%s\n' 'restored behavior/status: EVT skill copy restored'
