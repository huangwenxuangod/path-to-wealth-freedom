#!/usr/bin/env bash
# 用三条分轨重新混音并替换成片音轨：音效 -3dB，最后 −1dBFS 限幅，避免削波
# 用法：scripts/mix-stems.sh <目录> <文件名>（一般由 scripts/export.sh 调用）
set -euo pipefail
DIR=${1:?目录}
NAME=${2:?文件名}
ffmpeg -v error -y \
  -i "$DIR/$NAME" \
  -i "$DIR/stems/voice.wav" -i "$DIR/stems/bgm.wav" -i "$DIR/stems/sfx.wav" \
  -filter_complex "[1:a]aformat=sample_rates=48000:channel_layouts=stereo[v];\
[2:a]aformat=sample_rates=48000:channel_layouts=stereo[b];\
[3:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=-3dB[s];\
[v][b][s]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.89:attack=2:release=50:level=disabled[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -movflags +faststart \
  "$DIR/.mixed-$NAME"
mv "$DIR/.mixed-$NAME" "$DIR/$NAME"
echo "mixed → $DIR/$NAME"
