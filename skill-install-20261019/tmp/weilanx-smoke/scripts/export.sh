#!/usr/bin/env bash
# 导出一期视频：npm run export -- ep03-cc
# materials/ 和 out/ 按风格分类、风格内从 00 编号（如 out/06-战术屏科普风/04-残局手抖/），用 scripts/ep-dir.sh 按作品 ID 找目录。
# 成片 → <out 目录>/<期>.mp4；有人声的期数再导出 stems/（人声、配乐、音效）并用分轨重新混音限幅；
# materials 目录里的 封面-3x4.png、封面-16x9.png、字幕稿.md、发布文案.md 复制到 out 目录
set -euo pipefail
EP=${1:?用法：npm run export -- <期，如 ep03-cc>}
# 同一期的变体版本（比如竖屏的 ep06-context-tall）和原期共用人声、配乐和 materials
BASE=${EP%-tall}
OUT=$(bash scripts/ep-dir.sh "$EP" out)
MAT=$(bash scripts/ep-dir.sh "$EP" materials)
AUDIO=public/audio/$BASE
mkdir -p "$OUT"
npx remotion render src/index.ts "$EP" "$OUT/$EP.mp4" --crf=18 --log=error
if [[ -f "$AUDIO/voice.wav" ]]; then
  mkdir -p "$OUT/stems"
  npx remotion render src/index.ts "$EP" "$OUT/stems/sfx.wav" --codec=wav --props='{"mix":"sfx"}' --log=error
  cp "$AUDIO/voice.wav" "$OUT/stems/voice.wav"
  cp "$AUDIO/bgm.wav" "$OUT/stems/bgm.wav"
  bash scripts/mix-stems.sh "$OUT" "$EP.mp4"
fi
# 封面图、字幕稿、发布文案（标题、描述、话题）一起放进导出目录
for doc in 封面-3x4.png 封面-16x9.png 字幕稿.md 发布文案.md; do
  if [[ -f "$MAT/$doc" ]]; then
    cp "$MAT/$doc" "$OUT/$doc"
  fi
done
echo "✓ $OUT/$EP.mp4"
