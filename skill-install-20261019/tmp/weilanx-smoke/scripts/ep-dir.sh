#!/usr/bin/env bash
# 查一期在 materials/ 或 out/ 里的目录。两个目录都按风格分类、风格内从 00 重新编号（如 out/06-战术屏科普风/00-躲进掩体/），
# 代码里的作品 ID（ep25-behind-cover）不变；每期目录里的隐藏文件 .ep 记着它对应的作品 ID。
#
#   bash scripts/ep-dir.sh <作品ID> [materials|out]                         # 打印目录（不存在就建到 未分类/<作品ID>/）
#   bash scripts/ep-dir.sh <作品ID> materials --new <风格目录> <中文短题>    # 新一期：在风格目录里建下一个编号
#     例：bash scripts/ep-dir.sh ep37-xxx materials --new 06-战术屏科普风 开镜打不中
#
# 同一期的竖版变体（ep06-context-tall）和原期共用 materials；out 里放在原期目录的 竖版/ 子目录。
set -euo pipefail
cd "$(dirname "$0")/.."
EP=${1:?用法：bash scripts/ep-dir.sh <作品ID> [materials|out] [--new <风格目录> <中文短题>]}
KIND=${2:-materials}
BASE=${EP%-tall}

find_dir() {
  local root=$1
  local hit
  hit=$(grep -rlx --include=.ep -- "$BASE" "$root" 2>/dev/null | head -1 || true)
  [[ -n "$hit" ]] && dirname "$hit"
}

if [[ "${3:-}" == "--new" ]]; then
  STYLE=${4:?缺风格目录，如 06-战术屏科普风}
  TITLE=${5:?缺中文短题}
  if [[ -n "$(find_dir materials)" ]]; then
    echo "$EP 已经有目录：$(find_dir materials)" >&2
  else
    mkdir -p "materials/$STYLE"
    last=$(ls "materials/$STYLE" 2>/dev/null | grep -E '^[0-9]{2}-' | sort | tail -1 | cut -c1-2 || true)
    if [[ -z "$last" ]]; then n=00; else n=$(printf '%02d' $((10#$last + 1))); fi
    mkdir -p "materials/$STYLE/$n-$TITLE" "out/$STYLE/$n-$TITLE"
    echo "$BASE" > "materials/$STYLE/$n-$TITLE/.ep"
    echo "$BASE" > "out/$STYLE/$n-$TITLE/.ep"
  fi
fi

dir=$(find_dir "$KIND" || true)
if [[ -z "$dir" ]]; then
  # 还没归类的新期数：先放进 未分类/，之后再挪到风格目录、编号
  dir="$KIND/未分类/$BASE"
  mkdir -p "$dir"
  echo "$BASE" > "$dir/.ep"
fi
if [[ "$KIND" == "out" && "$EP" != "$BASE" ]]; then
  dir="$dir/竖版"
  mkdir -p "$dir"
fi
echo "$dir"
