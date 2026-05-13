import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { narration } from "./data";

await mkdir("assets/audio", { recursive: true });
await writeFile("assets/audio/narration.txt", narration, "utf8");

const inputText = await readFile("assets/audio/narration.txt", "utf8");
const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");
const tts = new MsEdgeTTS();
await tts.setMetadata("zh-CN-YunxiNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
const result = await tts.toFile("assets/audio", inputText, {
  rate: 0.12,
  pitch: "-2Hz",
  volume: 1,
});

if (!result.audioFilePath) {
  throw new Error("TTS did not create an audio file.");
}

await writeFile("assets/audio/narration.mp3", await Bun.file(result.audioFilePath).arrayBuffer());

await new Promise<void>((resolve, reject) => {
  const child = spawn(
    "ffmpeg",
    ["-y", "-i", "assets/audio/narration.mp3", "-af", "atempo=1.08,volume=1.05", "assets/audio/narration.wav"],
    { stdio: "inherit" },
  );
  child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
});

