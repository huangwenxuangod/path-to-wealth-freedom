import re

src = r"d:\path-to-wealth-freedom\内容\文章\翻译\译文-盯墙实验专注力vlog-2026-08-15.srt"
out = r"d:\path-to-wealth-freedom\内容\文章\翻译\译文-盯墙实验专注力vlog-2026-08-15.md"

with open(src, encoding="utf-8") as f:
    raw = f.read()

# 按空行切分字幕块
blocks = re.split(r"\r?\n\r?\n", raw.strip())
blocks = [b for b in blocks if b.strip()]

lines = []
lines.append("# 译文：盯墙实验 · 专注力 Vlog（中文文稿）")
lines.append("")
lines.append("> 原文为英文 productivity vlog，本文件为其 SRT 字幕的中文译文（按时间码切分）。")
lines.append("")
lines.append("---")
lines.append("")

for b in blocks:
    parts = b.splitlines()
    # 找时间码行 (含 -->)
    tc = None
    text_lines = []
    for ln in parts:
        if "-->" in ln:
            tc = ln.split("-->")[0].strip()
            # 去掉毫秒
            tc = tc.split(",")[0]
        elif re.match(r"^\d+$", ln.strip()):
            continue  # 块序号
        else:
            text_lines.append(ln.strip())
    if not text_lines:
        continue
    text = " ".join(text_lines)
    lines.append(f"**{tc}**　{text}")
    lines.append("")

with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("done:", out)
