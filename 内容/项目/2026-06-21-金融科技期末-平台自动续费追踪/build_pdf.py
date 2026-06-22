"""docx → PDF 通过 mammoth + Chrome headless
不需要 LibreOffice / MS Word，只用 python-docx + mammoth + chrome
"""
import os
import mammoth
import base64

# 读 docx 转 html
src = r"D:\path-to-wealth-freedom\内容\项目\2026-06-21-金融科技期末-平台自动续费追踪\金融科技应用前沿-醒账-答题纸版.docx"
html_path = r"D:\path-to-wealth-freedom\内容\项目\2026-06-21-金融科技期末-平台自动续费追踪\_intermediate.html"

with open(src, "rb") as f:
    result = mammoth.convert_to_html(f)
body = result.value

# 包裹成完整 A4 文档
full_html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>金融科技应用前沿 · 答辩报告</title>
<style>
  @page {{ size: A4; margin: 2.54cm 3.18cm; }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: "宋体", "SimSun", "Noto Sans SC", serif;
    font-size: 12pt;
    line-height: 1.75;
    color: #000;
    margin: 0;
  }}
  table {{
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0 16px;
  }}
  td, th {{
    border: 1px solid #000;
    padding: 6px 10px;
    font-size: 11pt;
    text-align: left;
    vertical-align: middle;
  }}
  p {{
    margin: 0 0 8px;
    text-align: justify;
  }}
  p:first-child {{ margin-top: 0; }}
  h1, h2, h3, h4 {{ font-family: "黑体", "SimHei", sans-serif; }}
  h1 {{ font-size: 20pt; text-align: center; margin: 18px 0 12px; font-weight: bold; }}
  h2 {{ font-size: 15pt; margin: 18px 0 10px; font-weight: bold; }}
  h3 {{ font-size: 13pt; margin: 14px 0 8px; font-weight: bold; }}
  h4 {{ font-size: 12pt; margin: 12px 0 6px; font-weight: bold; }}
  ul {{ margin: 6px 0; padding-left: 24px; }}
  li {{ margin: 4px 0; }}
  img {{
    display: block;
    margin: 12px auto;
    max-width: 100%;
    height: auto;
    page-break-inside: avoid;
  }}
  em {{ font-style: italic; }}
  strong {{ font-weight: bold; }}
  hr {{ border: none; border-top: 1px solid #000; margin: 12px 0; }}
</style>
</head>
<body>
{body}
</body>
</html>"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(full_html)

print(f"HTML generated: {html_path}")
print(f"HTML size: {os.path.getsize(html_path)} bytes")