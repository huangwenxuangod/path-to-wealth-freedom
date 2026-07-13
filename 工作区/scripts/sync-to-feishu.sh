#!/bin/bash
# 热点雷达 - 飞书知识库自动同步脚本
# Usage: ./scripts/sync-to-feishu.sh <markdown-file> [parent-node-token]

set -uo pipefail

# 取消 hermes 环境避免冲突
if [[ -n "${HERMES_HOME:-}" ]]; then
  unset HERMES_HOME
fi

# 默认配置
DEFAULT_PARENT="VGPQw3UKfizQU8kpDLdc3iAJnzg"
DEFAULT_SPACE="7622564892733656025"

# 参数检查
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <markdown-file> [parent-node-token]"
  echo "   示例: $0 '内容/AI牛马/热点雷达-20260508-xxx.md'"
  exit 1
fi

MD_FILE="$1"
PARENT_NODE="${2:-${FEISHU_PARENT_NODE_TOKEN:-$DEFAULT_PARENT}}"
SPACE_ID="${3:-${FEISHU_SPACE_ID:-$DEFAULT_SPACE}}"

if [[ ! -f "$MD_FILE" ]]; then
  echo "File not found: $MD_FILE"
  exit 1
fi

TITLE=$(head -n 20 "$MD_FILE" | grep -m 1 "^# " | sed 's/^# //' || echo "热点雷达")

echo "Syncing: $TITLE -> Feishu Wiki"

# 清理 Obsidian 语法
TMP="scripts/.tmp-sync-$(date +%s).md"
mkdir -p scripts
sed -e 's/\[\[\([^]]*\)\]\]/\1/g' \
    -e 's/\^[a-zA-Z0-9-]*//g' \
    "$MD_FILE" > "$TMP"

# Step 1: 创建 docx 到个人文档库
CREATE=$(lark-cli docs +create --api-version v2 \
  --content "@$TMP" \
  --doc-format markdown \
  --parent-position my_library 2>/dev/null || echo '{"ok":false}')

rm "$TMP"

DOC_TOKEN=$(echo "$CREATE" | jq -r '.data.document.document_id // empty' 2>/dev/null)

if [[ -z "$DOC_TOKEN" ]]; then
  echo "Create doc failed:"
  echo "$CREATE"
  exit 1
fi

echo "Doc created: https://iigf5k70ohp.feishu.cn/docx/$DOC_TOKEN"

# Step 2: 移动到 Wiki 知识库
MOVE=$(lark-cli wiki +move \
  --obj-token "$DOC_TOKEN" \
  --obj-type docx \
  --target-space-id "$SPACE_ID" \
  --target-parent-token "$PARENT_NODE" 2>/dev/null || echo '{"ok":false}')

NODE_TOKEN=$(echo "$MOVE" | jq -r '.data.node_token // empty' 2>/dev/null)

if [[ -n "$NODE_TOKEN" ]]; then
  echo "Synced! https://www.feishu.cn/wiki/$NODE_TOKEN"
else
  echo "Wiki move failed:"
  echo "$MOVE"
  echo "Doc link: https://iigf5k70ohp.feishu.cn/docx/$DOC_TOKEN"
  exit 1
fi
