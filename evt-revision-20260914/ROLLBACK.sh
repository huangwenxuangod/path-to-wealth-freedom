#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
target_dir=${1:?target directory required}
mkdir -p -- "$target_dir"
cp -- "$script_dir/ORIGINAL_FILE" "$target_dir/SKILL.md"
cp -- "$script_dir/ORIGINAL_REFERENCES_FILE" "$target_dir/references.md"
printf '%s\n' 'restored behavior/status: original EVT skill and references restored on target copy'
