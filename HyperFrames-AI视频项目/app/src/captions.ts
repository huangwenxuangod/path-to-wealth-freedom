import { mkdir, writeFile } from "node:fs/promises";
import { scriptLines } from "./data";

function fmt(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

const srt = scriptLines
  .map((line, i) => `${i + 1}\n${fmt(line.start)} --> ${fmt(line.end)}\n${line.text}\n`)
  .join("\n");

await mkdir("assets/data", { recursive: true });
await mkdir("output", { recursive: true });
await writeFile("assets/data/wenxuan-dynamic.srt", srt, "utf8");
await writeFile("output/wenxuan-dynamic.srt", srt, "utf8");

