#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cp "$ROOT/index.original.txt" "$ROOT/index.html"
echo "restored index.html from index.original.txt"
