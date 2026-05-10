#!/bin/bash
# =============================================================================
# 文稿→选题 飞书多维表格同步脚本
# Usage: ./scripts/transcript-to-topic.sh <transcript-file> [base-token] [table-name]
# =============================================================================

set -uo pipefail

# 参数解析
TRANSCRIPT_FILE="${1:-}"
BASE_TOKEN="${2:-${FEISHU_BASE_TOKEN:-}}"
TABLE_NAME="${3:-选题库}"

if [[ -z "$TRANSCRIPT_FILE" ]]; then
  echo "Usage: $0 <transcript-file> [base-token] [table-name]"
  echo "  示例: $0 '内容/逐字稿/某大V视频-20260510.md'"
  exit 1
fi

if [[ ! -f "$TRANSCRIPT_FILE" ]]; then
  echo "File not found: $TRANSCRIPT_FILE"
  exit 1
fi

if [[ -z "$BASE_TOKEN" ]]; then
  echo "Error: 需要提供 base-token 或设置 FEISHU_BASE_TOKEN 环境变量"
  echo "  创建方法: lark-cli base +base-create --name '选题库' --folder-token <folder-token>"
  exit 1
fi

# 读取逐字稿内容（截取前20000字，避免超限）
TRANSCRIPT_CONTENT=$(head -c 20000 "$TRANSCRIPT_FILE")
FILE_NAME=$(basename "$TRANSCRIPT_FILE")

# 提取标题（第一行 # 开头，或文件名）
TITLE=$(echo "$TRANSCRIPT_CONTENT" | grep -m 1 "^# " | sed 's/^# //')
if [[ -z "$TITLE" ]]; then
  TITLE="${FILE_NAME%.*}"
fi

# 提取来源链接（如果有）
SOURCE_URL=$(echo "$TRANSCRIPT_CONTENT" | grep -oP 'https?://[^ ]+' | head -n 1)
if [[ -z "$SOURCE_URL" ]]; then
  SOURCE_URL=""
fi

# 提取创建时间（文件修改时间）
CREATED_AT=$(date -r "$TRANSCRIPT_FILE" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || stat -c %y "$TRANSCRIPT_FILE" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)

# 构建 JSON（处理换行符）
RECORD_JSON=$(jq -n \
  --arg title "$TITLE" \
  --arg transcript "$TRANSCRIPT_CONTENT" \
  --arg source "$SOURCE_URL" \
  --arg created "$CREATED_AT" \
  '{
    "标题": $title,
    "逐字稿": $transcript,
    "来源链接": $source,
    "状态": "待处理",
    "优先级": "中",
    "创建时间": $created
  }')

echo "Syncing transcript to Feishu Base: $TITLE"
echo "  Base: $BASE_TOKEN"
echo "  Table: $TABLE_NAME"

RESULT=$(lark-cli base +record-upsert \
  --base-token "$BASE_TOKEN" \
  --table-id "$TABLE_NAME" \
  --json "$RECORD_JSON" 2>/dev/null)

RECORD_ID=$(echo "$RESULT" | jq -r '.record.record_id // empty' 2>/dev/null)

if [[ -n "$RECORD_ID" ]]; then
  echo "Success! Record ID: $RECORD_ID"
else
  echo "Failed to sync:"
  echo "$RESULT"
  exit 1
fi
