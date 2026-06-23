"""deck.html → PDF：Chrome headless 直接打印 14 页 HTML deck
视觉品质 = course-module 模板（你认可的）
输出：金融科技应用前沿-醒账-答辩PPT.pdf（14 页横版 A4 landscape）
"""
import subprocess
import os
import time

CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
URL = "http://localhost:8289/mockups/hidden-fee-hunter-deck/deck.html"
OUT = r"D:\path-to-wealth-freedom\内容\项目\2026-06-21-金融科技期末-平台自动续费追踪\金融科技应用前沿-醒账-答辩PPT.pdf"

# 删除旧 pptx（python-pptx 那版太丑）+ 旧 PDF（docx 转出来的那版）
old_pptx = r"D:\path-to-wealth-freedom\内容\项目\2026-06-21-金融科技期末-平台自动续费追踪\金融科技应用前沿-醒账-答辩PPT.pptx"
if os.path.exists(old_pptx):
    os.remove(old_pptx)
    print(f"删除旧 pptx: {old_pptx}")

# Chrome 打印 deck.html 为 PDF（横版 1920x1080 → A4 landscape）
# 用 --no-pdf-header-footer 去掉页眉页脚
# 用 --print-to-pdf-no-header + custom paper size
cmd = [
    CHROME,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    f"--print-to-pdf={OUT}",
    "--print-to-pdf-no-header",
    "--no-pdf-header-footer",
    "--virtual-time-budget=15000",
    # 横版 A4 landscape 优先；不指定就是默认 8.5x11
    # deck 是 1920x1080，更接近 16:9，所以用自定义 paper size
    "--paper-width=16.93",   # 16.93 inch ≈ 430mm ≈ 1920px@113dpi
    "--paper-height=9.5",     # 9.5 inch ≈ 241mm
    URL,
]

print(f"Chrome printing deck.html → PDF ...")
print(f"Output: {OUT}")
start = time.time()
r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
print(f"Done in {time.time()-start:.1f}s")
if r.returncode == 0:
    size = os.path.getsize(OUT) if os.path.exists(OUT) else 0
    print(f"PDF size: {size/1024:.0f} KB")
else:
    print(f"ERROR (returncode={r.returncode})")
    print("stderr:", r.stderr[-500:])
