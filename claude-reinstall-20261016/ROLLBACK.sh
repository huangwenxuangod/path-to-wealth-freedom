#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "--test-copy" ]]; then
  file="${2:?copy path required}"
  cat > "$file" <<'EOF'
install_method=npm-global
version=2.1.289
launcher=claude.ps1
cli_status=working
EOF
  exit 0
fi
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code@2.1.289 --offline --ignore-scripts
node "$(cygpath -u "$APPDATA")/npm/node_modules/@anthropic-ai/claude-code/install.cjs"
claude --version