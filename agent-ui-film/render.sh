#!/bin/sh
set -eu
cd "$(dirname "$0")"
export HYPERFRAMES_BROWSER_PATH="${HYPERFRAMES_BROWSER_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
export PRODUCER_HEADLESS_SHELL_PATH="$HYPERFRAMES_BROWSER_PATH"
export HYPERFRAMES_FFMPEG_PATH="${HYPERFRAMES_FFMPEG_PATH:-$(command -v ffmpeg)}"
export HYPERFRAMES_FFPROBE_PATH="${HYPERFRAMES_FFPROBE_PATH:-$(command -v ffprobe)}"
npm run check
npx --yes hyperframes@0.8.40 render --format webm --output renders/agent-ui-transparent.webm --fps 30 --quality high --workers 1 --vp9-cpu-used 5
ffmpeg -hide_banner -loglevel error -y -c:v libvpx-vp9 -i renders/agent-ui-transparent.webm -f lavfi -i 'color=c=0x090c0b:s=1920x1080:r=30:d=6' -filter_complex '[1:v][0:v]overlay=shortest=1:format=auto,format=yuv420p[v]' -map '[v]' -c:v libx264 -crf 17 -preset medium -movflags +faststart renders/agent-ui-preview.mp4
ffmpeg -hide_banner -loglevel error -y -c:v libvpx-vp9 -i renders/agent-ui-transparent.webm -c:v prores_ks -profile:v 4 -pix_fmt yuva444p10le renders/agent-ui-alpha.mov
