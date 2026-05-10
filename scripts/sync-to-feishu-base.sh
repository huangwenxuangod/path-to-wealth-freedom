#!/bin/bash
# =============================================================================
# 文稿→选题 飞书多维表格同步脚本
# Usage: ./scripts/sync-to-feishu-base.sh <transcript-file> [base-token] [table-name]
# =============================================================================

set -uo pipefail

if [[ -n "${HERMES_HOME:-}" ]]; then
  unset HERMES_HOME
fi

# 默认配置
DEFAULT_BASE_TOKEN="${FEISHU_BASE_TOPIC_TOKEN:-}"
DEFAULT_TABLE="选题库"

# 参数检查
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <transcript-file> [base-token] [table-name]"
  echo "   示例: $0 '内容/逐字稿/某大V视频-20260510.md'"
  echo ""
  echo "   base-token: 飞书多维表格的 base_token（可选，默认从 FEISHU_BASE_TOPIC_TOKEN 读取）"
  echo "   table-name: 表格名称（可选，默认 '$DEFAULT_TABLE'）"
  echo ""
  echo "   首次使用请先运行初始化脚本："
  echo "     ./scripts/init-feishu-base.sh [folder-token]"
  exit 1
fi

MD_FILE="$1"
BASE_TOKEN="${2:-${FEISHU_BASE_TOPIC_TOKEN:-}}"
TABLE_NAME="${3:-$DEFAULT_TABLE}"

if [[ ! -f "$MD_FILE" ]]; then
  echo "File not found: $MD_FILE"
  exit 1
fi

if [[ -z "$BASE_TOKEN" ]]; then
  echo "Error: 需要提供 base-token 或设置 FEISHU_BASE_TOPIC_TOKEN 环境变量"
  echo "  首次使用请先运行: ./scripts/init-feishu-base.sh"
  exit 1
fi

# 提取标题（第一行 # 开头）
TITLE=$(head -n 20 "$MD_FILE" | grep -m 1 "^# " | sed 's/^# //' || echo "")

# 如果找不到标题，使用文件名
if [[ -z "$TITLE" ]]; then
  TITLE=$(basename "$MD_FILE" .md)
fi

# 提取来源链接（如果有）
SOURCE_URL=$(grep -oP 'https?://[^\s\)]+' "$MD_FILE" | head -n 1 || echo "")

# 读取逐字稿内容（截取前30000字符，避免超限）
# 使用临时文件避免jq参数过长问题
TMP_DIR="scripts/.tmp-base"
mkdir -p "$TMP_DIR"

TRANSCRIPT_TMP="$TMP_DIR/transcript-$(date +%s).txt"
head -c 30000 "$MD_FILE" > "$TRANSCRIPT_TMP"

# 创建时间
CREATED_AT=$(date "+%Y-%m-%d %H:%M:%S")

echo "Syncing transcript to Feishu Base"
echo "  Title: $TITLE"
echo "  File: $MD_FILE"
echo "  Base: $BASE_TOKEN"
echo "  Table: $TABLE_NAME"

# 构建JSON（使用jq --slurpfile读取大文本）
RECORD_JSON=$(jq -n \
  --arg title "$TITLE" \
  --arg transcript "$(cat "$TRANSCRIPT_TMP")" \
  --arg source "$SOURCE_URL" \
  --arg created "$CREATED_AT" \
  '{
    "标题": $title,
    "逐字稿": $transcript,
    "来源链接": $source,
    "状态": "待处理",
    "优先级": "中",
    "来源类型": "文章",
    "选题领域": "AI工具",
    "预估工作量": "1天",
    "创建时间": $created
  }')

# 写入飞书多维表格
RESULT=$(lark-cli base +record-upsert \
  --base-token "$BASE_TOKEN" \
  --table-id "$TABLE_NAME" \
  --json "$RECORD_JSON" 2>/dev/null)

RECORD_ID=$(echo "$RESULT" | jq -r '.record.record_id // empty' 2>/dev/null)

# 清理临时文件
rm -f "$TRANSCRIPT_TMP"

if [[ -n "$RECORD_ID" ]]; then
  echo "Synced! Record ID: $RECORD_ID"
  echo "  Base URL: https://iigf5k70ohp.feishu.cn/base/$BASE_TOKEN"
else
  echo "Sync failed:"
  echo "$RESULT"
  exit 1
fi
