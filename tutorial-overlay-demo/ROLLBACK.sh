#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
cp -f index.pre-keyframes.txt index.html
printf '%s\n' 'restored index.html from index.pre-keyframes.txt'