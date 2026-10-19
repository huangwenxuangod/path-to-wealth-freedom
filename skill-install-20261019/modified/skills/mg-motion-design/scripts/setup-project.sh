#!/bin/sh
# usage: sh setup-project.sh /path/to/workspace [--skip-install]
set -e
SKILL=$(cd "$(dirname "$0")/.." && pwd)
TARGET=$1
[ -n "$TARGET" ] || { echo "usage: sh setup-project.sh <target> [--skip-install]"; exit 1; }
mkdir -p "$TARGET"
TARGET=$(cd "$TARGET" && pwd)
cp -R "$SKILL/assets/harness" "$SKILL/assets/lib" "$TARGET/"
mkdir -p "$TARGET/assets"
cp -R "$SKILL/assets/fonts" "$TARGET/assets/"
cp -R "$SKILL/assets/textures" "$TARGET/assets/"
cp "$SKILL/assets/package.json" "$SKILL/assets/requirements.txt" "$TARGET/"
mkdir -p "$TARGET/demos"
for d in 09-bauhaus 01-flat-vector 10-synthwave; do cp -R "$SKILL/examples/$d" "$TARGET/demos/$d"; done
if [ "$2" != "--skip-install" ]; then (cd "$TARGET" && npm install --no-audit --no-fund); fi
echo "workspace: $TARGET"
echo "fonts are not bundled: add the files in assets/fonts/README.md, or empty assets/fonts/fonts.css to use system fallbacks"
echo "export MG_CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'  # or your path"
echo "node harness/render.mjs demos/09-bauhaus --stills 0.5,3,6,9"
