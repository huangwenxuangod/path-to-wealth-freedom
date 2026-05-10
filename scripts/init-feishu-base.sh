#!/bin/bash
# =============================================================================
# 选题库 - 飞书多维表格初始化脚本
# Usage: ./scripts/init-feishu-base.sh [folder-token]
# =============================================================================

set -uo pipefail

if [[ -n "${HERMES_HOME:-}" ]]; then
  unset HERMES_HOME
fi

FOLDER_TOKEN="${1:-}"
# 注意：Base已创建，如需重新创建请删除本文件中的硬编码token
BASE_NAME="选题库"
TABLE_NAME="选题库"
# 已创建的Base Token: FK84bOya9aB5zTsSxcjcC8JYnIc

# 如果没有提供 folder-token，尝试从环境变量获取
if [[ -z "$FOLDER_TOKEN" ]]; then
  FOLDER_TOKEN="${FEISHU_FOLDER_TOKEN:-}"
fi

if [[ -z "$FOLDER_TOKEN" ]]; then
  echo "Usage: $0 [folder-token]"
  echo "  folder-token: 飞书文件夹的 token（可选，默认存到个人文档）"
  echo "  也可以在环境变量中设置 FEISHU_FOLDER_TOKEN"
  echo ""
  echo "  如何获取 folder-token:"
  echo "  1. 打开飞书云文档，进入目标文件夹"
  echo "  2. 从URL中复制 folder token（fldxxxxx 部分）"
  echo "  3. 或直接省略，Base会创建在你的个人文档根目录"
  echo ""
fi

echo "Creating Feishu Base: $BASE_NAME"

# Step 1: 创建 Base
if [[ -n "$FOLDER_TOKEN" ]]; then
  CREATE_RESULT=$(lark-cli base +base-create \
    --name "$BASE_NAME" \
    --folder-token "$FOLDER_TOKEN" \
    --time-zone "Asia/Shanghai" 2>/dev/null)
else
  CREATE_RESULT=$(lark-cli base +base-create \
    --name "$BASE_NAME" \
    --time-zone "Asia/Shanghai" 2>/dev/null)
fi

BASE_TOKEN=$(echo "$CREATE_RESULT" | jq -r '.base.base_token // empty' 2>/dev/null)

if [[ -z "$BASE_TOKEN" ]]; then
  echo "Create base failed:"
  echo "$CREATE_RESULT"
  exit 1
fi

echo "Base created!"
echo "  Base Token: $BASE_TOKEN"
echo "  URL: https://iigf5k70ohp.feishu.cn/base/$BASE_TOKEN"
echo ""

# Step 2: 创建表格（带字段）
echo "Creating table: $TABLE_NAME"

# 字段定义（参考飞书多维表格API字段类型）
FIELDS_JSON='[
  {"name":"标题","type":1},
  {"name":"逐字稿","type":1},
  {"name":"核心观点","type":1},
  {"name":"选题方向","type":1},
  {"name":"我需要做的事","type":1},
  {"name":"状态","type":3,"property":{"options":[{"name":"待处理","color":"0"},{"name":"已确认","color":"1"},{"name":"进行中","color":"2"},{"name":"已完成","color":"3"},{"name":"放弃","color":"4"}]}},
  {"name":"优先级","type":3,"property":{"options":[{"name":"高","color":"0"},{"name":"中","color":"1"},{"name":"低","color":"2"}]}},
  {"name":"来源链接","type":15},
  {"name":"来源类型","type":3,"property":{"options":[{"name":"视频","color":"0"},{"name":"文章","color":"1"},{"name":"播客","color":"2"},{"name":"论文","color":"3"},{"name":"报告","color":"4"}]}},
  {"name":"选题领域","type":3,"property":{"options":[{"name":"AI工具","color":"0"},{"name":"AI商业","color":"1"},{"name":"科技趋势","color":"2"},{"name":"个人成长","color":"3"},{"name":"自媒体","color":"4"},{"name":"其他","color":"5"}]}},
  {"name":"预估工作量","type":3,"property":{"options":[{"name":"1小时","color":"0"},{"name":"半天","color":"1"},{"name":"1天","color":"2"},{"name":"3天","color":"3"},{"name":"1周","color":"4"}]}},
  {"name":"创建时间","type":5}
]'

TABLE_RESULT=$(lark-cli base +table-create \
  --base-token "$BASE_TOKEN" \
  --name "$TABLE_NAME" \
  --fields "$FIELDS_JSON" 2>/dev/null)

TABLE_ID=$(echo "$TABLE_RESULT" | jq -r '.table_id // empty' 2>/dev/null)

if [[ -n "$TABLE_ID" ]]; then
  echo "Table created!"
  echo "  Table ID: $TABLE_ID"
else
  echo "Table create may have failed (but base is ready):"
  echo "$TABLE_RESULT"
  echo ""
  echo "You can manually create the table in Feishu UI, then run:"
  echo "  lark-cli base +table-list --base-token $BASE_TOKEN"
fi

echo ""
echo "========================================"
echo "初始化完成！请保存以下信息："
echo "========================================"
echo "export FEISHU_BASE_TOPIC_TOKEN=\"$BASE_TOKEN\""
echo ""
echo "建议添加到 ~/.bashrc 或 ~/.zshrc："
echo "  echo 'export FEISHU_BASE_TOPIC_TOKEN=\"$BASE_TOKEN\"' >> ~/.bashrc"
echo ""
echo "飞书Base链接: https://iigf5k70ohp.feishu.cn/base/$BASE_TOKEN"
echo "========================================"
