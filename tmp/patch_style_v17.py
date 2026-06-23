"""
全局放大字体 + 强化视觉层级
- 痛点矩阵：行高 72→110，字体 13/10/8 → 16/13/11，padding 6/10 → 12/16
- 概念卡片：h4 18→21, dim 13→15
- 场景/技术行：name 16-17→19, body 12→14
- 人物画像：role/sub/pain 12→14
- 路线图/inno：字微调
"""
import re

CSS = r'''D:\path-to-wealth-freedom\opendesign\mockups\hidden-fee-hunter-deck\style.css'''

with open(CSS, 'r', encoding='utf-8') as f:
    s = f.read()

# === 1. lede 16 → 18 ===
s = s.replace(
    """  font-size:16px;color:var(--text-2);
  line-height:1.65;margin-top:14px;""",
    """  font-size:18px;color:var(--text-2);
  line-height:1.65;margin-top:14px;"""
)

# === 2. h2 42 → 46 (跟 h1 64 比例更协调) ===
s = s.replace(
    """  font-size:42px;line-height:1.1;
  font-weight:700;letter-spacing:-.015em;""",
    """  font-size:46px;line-height:1.1;
  font-weight:700;letter-spacing:-.015em;"""
)

# === 3. concept-box h4 18 → 21 ===
s = s.replace(
    """  font-size:18px;font-weight:700;
  color:var(--accent);
  margin:6px 0 4px;""",
    """  font-size:21px;font-weight:700;
  color:var(--accent);
  margin:6px 0 6px;"""
)

# === 4. concept-box dim 13 → 15 ===
s = s.replace(
    """  font-size:13px;color:var(--text-2);line-height:1.55;""",
    """  font-size:15px;color:var(--text-1);line-height:1.6;"""
)

# === 5. concept-box no 11 → 12 ===
s = s.replace(
    """  font-size:11px;letter-spacing:.18em;font-weight:700;
  color:var(--accent-2);""",
    """  font-size:12px;letter-spacing:.18em;font-weight:700;
  color:var(--accent-2);"""
)

# === 6. concept-box en 10 → 11 ===
s = s.replace(
    """  display:block;font-size:10px;letter-spacing:.16em;""",
    """  display:block;font-size:11px;letter-spacing:.16em;"""
)

# === 7. persona role 12 → 14, sub 12 → 14, pain 12 → 14 ===
s = s.replace(
    """.tpl-course-module .persona .role{
  font-size:12px;color:var(--text-2);
  margin-bottom:10px;
}""",
    """.tpl-course-module .persona .role{
  font-size:14px;color:var(--text-1);
  margin-bottom:12px;font-weight:500;
}"""
)
s = s.replace(
    """.tpl-course-module .persona .sub{
  font-size:12px;color:var(--text-2);
  margin:6px 0;
}""",
    """.tpl-course-module .persona .sub{
  font-size:14px;color:var(--text-1);
  margin:8px 0;font-weight:500;
}"""
)
s = s.replace(
    """.tpl-course-module .persona .pain p,
.tpl-course-module .persona .pain{font-size:12px;color:var(--text-1);line-height:1.55;margin:0}""",
    """.tpl-course-module .persona .pain p,
.tpl-course-module .persona .pain{font-size:14px;color:var(--text-1);line-height:1.6;margin:0}"""
)
# pain-label 10 → 11
s = s.replace(
    """  color:var(--accent-2);text-transform:uppercase;
  font-weight:700;display:block;margin-bottom:4px;
}""",
    """  color:var(--accent-2);text-transform:uppercase;
  font-weight:700;display:block;margin-bottom:5px;
}"""
)

# === 8. SWOT ul.l 12 → 14 ===
s = s.replace(
    """.tpl-course-module .concept-box ul.l li{
  font-size:12px;color:var(--text-1);line-height:1.55;
  padding:4px 0 4px 14px;position:relative;
  border-bottom:1px dashed var(--border);
}""",
    """.tpl-course-module .concept-box ul.l li{
  font-size:14px;color:var(--text-1);line-height:1.6;
  padding:6px 0 6px 16px;position:relative;
  border-bottom:1px dashed var(--border);
}"""
)
# swot-grid sub overrides
s = s.replace(
    """.tpl-course-module .swot-grid .concept-box{
  padding:18px 20px;
}
.tpl-course-module .swot-grid .concept-box h4{font-size:18px;margin-bottom:8px}
.tpl-course-module .swot-grid .concept-box .en{font-size:10px;margin-bottom:10px}
.tpl-course-module .swot-grid .concept-box ul.l{
  font-size:12px;line-height:1.55;
}
.tpl-course-module .swot-grid .concept-box ul.l li{margin-bottom:6px;padding-left:14px}""",
    """.tpl-course-module .swot-grid .concept-box{
  padding:20px 22px;
}
.tpl-course-module .swot-grid .concept-box h4{font-size:22px;margin-bottom:8px}
.tpl-course-module .swot-grid .concept-box .en{font-size:11px;margin-bottom:10px}
.tpl-course-module .swot-grid .concept-box ul.l{
  font-size:14px;line-height:1.65;
}
.tpl-course-module .swot-grid .concept-box ul.l li{margin-bottom:8px;padding-left:16px}"""
)

# === 9. module h4 24 → 26 ===
s = s.replace(
    """.tpl-course-module .concept-box.module{text-align:left;padding:18px 20px}
.tpl-course-module .module h4{font-size:24px;margin:6px 0}""",
    """.tpl-course-module .concept-box.module{text-align:left;padding:22px 24px}
.tpl-course-module .module h4{font-size:28px;margin:8px 0}"""
)

# === 10. inno ===
s = s.replace(
    """.tpl-course-module .concept-box.inno{
  display:grid;grid-template-columns:auto 1fr;gap:14px;
  padding:14px 18px;
  align-items:start;
}""",
    """.tpl-course-module .concept-box.inno{
  display:grid;grid-template-columns:auto 1fr;gap:18px;
  padding:18px 22px;
  align-items:start;
}"""
)

# === 11. phase h4 20 → 22, ul.l 11.5 → 13 ===
s = s.replace(
    """.tpl-course-module .phase h4{font-size:20px;margin:0 0 4px}
.tpl-course-module .phase ul.l li{font-size:11.5px;padding:3px 0 3px 14px}""",
    """.tpl-course-module .phase h4{font-size:23px;margin:0 0 6px}
.tpl-course-module .phase ul.l li{font-size:14px;padding:6px 0 6px 16px;line-height:1.55}"""
)

# === 12. metric .l 13 → 14, .cite 9 → 10 ===
s = s.replace(
    """.tpl-course-module .metric .l{
  font-size:13px;color:var(--text-2);
  line-height:1.4;
}""",
    """.tpl-course-module .metric .l{
  font-size:15px;color:var(--text-1);
  line-height:1.5;font-weight:500;
}"""
)
s = s.replace(
    """.tpl-course-module .metric .cite{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;letter-spacing:.12em;""",
    """.tpl-course-module .metric .cite{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:.12em;font-weight:500;"""
)

# === 13. callout 14 → 16 ===
s = s.replace(
    """  font-size:14px;color:var(--text-1);line-height:1.6;
}
.tpl-course-module .callout b{color:var(--accent-2)}""",
    """  font-size:16px;color:var(--text-1);line-height:1.65;
}
.tpl-course-module .callout b{color:var(--accent-2);font-size:17px;font-weight:800}"""
)

# === 14. row.sc: 改用 4 列 + 大字号 ===
old_sc = """.tpl-course-module .row.sc{
  display:grid;grid-template-columns:48px 1fr 1.4fr 160px;
  align-items:center;gap:16px;
  padding:8px 14px;
  border-bottom:1px solid var(--border);
  background:var(--surface);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  font-size:13px;
}
.tpl-course-module .row.sc .no{
  font-family:'JetBrains Mono',monospace;
  font-size:14px;font-weight:700;color:var(--accent-2);
}
.tpl-course-module .row.sc .name{
  font-family:'Playfair Display',serif;
  font-size:16px;font-weight:700;color:var(--text-1);
}
.tpl-course-module .row.sc .brands{font-size:12px;color:var(--text-2)}
.tpl-course-module .row.sc .stat{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;letter-spacing:.04em;
  color:var(--accent);font-weight:700;text-align:right;
}"""
new_sc = """.tpl-course-module .row.sc{
  display:grid;grid-template-columns:60px 1.3fr 1.5fr 200px;
  align-items:center;gap:20px;
  padding:14px 22px;
  border-bottom:1px solid var(--border);
  background:var(--surface);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  font-size:15px;
  min-height:64px;
}
.tpl-course-module .row.sc .no{
  font-family:'JetBrains Mono',monospace;
  font-size:18px;font-weight:800;color:var(--accent-2);
}
.tpl-course-module .row.sc .name{
  font-family:'Playfair Display',serif;
  font-size:20px;font-weight:700;color:var(--text-1);
}
.tpl-course-module .row.sc .brands{font-size:15px;color:var(--text-1);font-weight:500}
.tpl-course-module .row.sc .stat{
  font-family:'JetBrains Mono',monospace;
  font-size:15px;letter-spacing:.04em;
  color:var(--accent);font-weight:800;text-align:right;
}"""
s = s.replace(old_sc, new_sc)

# === 15. row.tech: 大字号 ===
old_tech = """.tpl-course-module .row.tech{
  display:grid;grid-template-columns:48px 1fr 80px 2fr;
  align-items:center;gap:16px;
  padding:8px 14px;
  border-bottom:1px solid var(--border);
  background:var(--surface);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
}
.tpl-course-module .row.tech.primary{
  background:var(--bg-soft);
  border-left:4px solid var(--accent);
}
.tpl-course-module .row.tech.future{opacity:.55}
.tpl-course-module .row.tech .no{
  font-family:'JetBrains Mono',monospace;
  font-size:18px;font-weight:700;color:var(--accent);
}
.tpl-course-module .row.tech .name{
  font-family:'Playfair Display',serif;
  font-size:17px;font-weight:700;color:var(--text-1);
}
.tpl-course-module .row.tech .pct{
  font-family:'JetBrains Mono',monospace;
  font-size:13px;font-weight:700;color:var(--accent);
}
.tpl-course-module .row.tech .body{font-size:12px;color:var(--text-2);line-height:1.5}"""
new_tech = """.tpl-course-module .row.tech{
  display:grid;grid-template-columns:60px 1.3fr 100px 2.2fr;
  align-items:center;gap:20px;
  padding:14px 22px;
  border-bottom:1px solid var(--border);
  background:var(--surface);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  min-height:64px;
}
.tpl-course-module .row.tech.primary{
  background:var(--bg-soft);
  border-left:5px solid var(--accent);
}
.tpl-course-module .row.tech.future{opacity:.65}
.tpl-course-module .row.tech .no{
  font-family:'JetBrains Mono',monospace;
  font-size:22px;font-weight:800;color:var(--accent);
}
.tpl-course-module .row.tech .name{
  font-family:'Playfair Display',serif;
  font-size:21px;font-weight:700;color:var(--text-1);
}
.tpl-course-module .row.tech .pct{
  font-family:'JetBrains Mono',monospace;
  font-size:17px;font-weight:800;color:var(--accent);
  text-align:right;
}
.tpl-course-module .row.tech .body{font-size:15px;color:var(--text-1);line-height:1.55;font-weight:500}"""
s = s.replace(old_tech, new_tech)

# === 16. row.risk ===
s = s.replace(
    """.tpl-course-module .row.risk{
  display:grid;grid-template-columns:48px 1fr;
  align-items:center;gap:16px;
  padding:8px 14px;
  border-bottom:1px solid var(--border);
  background:var(--surface);
  border-radius:var(--radius);
}
.tpl-course-module .row.risk .no{
  font-family:'Playfair Display',serif;
  font-size:18px;font-weight:900;color:var(--accent-2);
}
.tpl-course-module .row.risk .body{font-size:12px;color:var(--text-1);line-height:1.5}
.tpl-course-module .row.risk .body b{color:var(--accent);font-weight:700}""",
    """.tpl-course-module .row.risk{
  display:grid;grid-template-columns:60px 1fr;
  align-items:center;gap:20px;
  padding:12px 20px;
  border-bottom:1px solid var(--border);
  background:var(--surface);
  border-radius:var(--radius);
  min-height:60px;
}
.tpl-course-module .row.risk .no{
  font-family:'Playfair Display',serif;
  font-size:22px;font-weight:900;color:var(--accent-2);
}
.tpl-course-module .row.risk .body{font-size:15px;color:var(--text-1);line-height:1.55;font-weight:500}
.tpl-course-module .row.risk .body b{color:var(--accent);font-weight:800}"""
)

# === 17. MATRIX BLOCK — 重大重做：行高 72→110, 字号 13/10/8→16/13/11, padding 6/10→12/16 ===
old_matrix = """.tpl-course-module .matrix-block{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:14px 16px;
  box-shadow:var(--shadow);
}
.tpl-course-module .matrix-grid{
  display:grid;
  grid-template-columns:60px repeat(3,1fr);
  grid-template-rows:auto repeat(3,72px) auto;
  gap:0;
  height:auto;
}
.tpl-course-module .m-corner{grid-row:1;grid-column:1}
.tpl-course-module .m-axis-top{
  grid-row:1;grid-column:2 / 5;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:.18em;
  color:var(--text-3);text-align:right;
  padding:0 8px 6px;
}
.tpl-course-module .m-axis-bot{
  display:none;
}
.tpl-course-module .m-row-label{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:.18em;
  color:var(--text-3);font-weight:700;
  display:flex;align-items:center;justify-content:flex-end;
  padding-right:8px;
  text-transform:uppercase;
}
.tpl-course-module .m-cell{
  padding:6px 10px;
  border:1px solid var(--border);
  margin:-.5px;
  display:flex;flex-direction:column;gap:2px;
  position:relative;
  background:var(--surface);
  min-height:0;
}
.tpl-course-module .m-cell .t{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;letter-spacing:.16em;font-weight:700;
  color:var(--accent);text-transform:uppercase;
}
.tpl-course-module .m-cell .n{
  font-family:'Playfair Display',serif;
  font-size:13px;font-weight:700;color:var(--text-1);
  line-height:1.2;margin:1px 0;
}
.tpl-course-module .m-cell .d{font-size:10px;color:var(--text-2);line-height:1.3}
.tpl-course-module .m-cell .f{
  font-family:'JetBrains Mono',monospace;
  font-size:8px;letter-spacing:.06em;color:var(--text-3);
  margin-top:auto;
}
.tpl-course-module .m-cell.hi{background:var(--accent);color:#fff;border-color:var(--accent)}
.tpl-course-module .m-cell.hi .t,.tpl-course-module .m-cell.hi .n,.tpl-course-module .m-cell.hi .d,.tpl-course-module .m-cell.hi .f{color:#fff}
.tpl-course-module .m-cell.hi .t{color:#fff;font-weight:700}
.tpl-course-module .m-cell.hi .n{color:#fff}
.tpl-course-module .m-cell.hi .d{color:rgba(255,255,255,.85)}
.tpl-course-module .m-cell.hi .f{color:rgba(255,255,255,.7)}
.tpl-course-module .m-cell.mid{background:var(--bg-soft)}
.tpl-course-module .m-cell.low{background:var(--surface-2);opacity:.75}
.tpl-course-module .matrix-axis{
  display:flex;justify-content:space-between;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:.14em;
  color:var(--text-3);
}
.tpl-course-module .matrix-axis .ax-mid{color:var(--accent);font-weight:700}"""
new_matrix = """.tpl-course-module .matrix-block{
  background:var(--surface);
  border:1px solid var(--border-strong);
  border-radius:var(--radius-lg);
  padding:22px 28px;
  box-shadow:var(--shadow);
}
.tpl-course-module .matrix-grid{
  display:grid;
  grid-template-columns:80px repeat(3,1fr);
  grid-template-rows:36px repeat(3,110px) 36px;
  gap:0;
  height:auto;
}
.tpl-course-module .m-corner{grid-row:1;grid-column:1}
.tpl-course-module .m-axis-top{
  grid-row:1;grid-column:2 / 5;
  font-family:'JetBrains Mono',monospace;
  font-size:13px;letter-spacing:.18em;font-weight:700;
  color:var(--accent-2);text-align:right;
  padding:0 12px 8px;
  text-transform:uppercase;
}
.tpl-course-module .m-axis-bot{
  display:none;
}
.tpl-course-module .m-row-label{
  font-family:'JetBrains Mono',monospace;
  font-size:13px;letter-spacing:.18em;
  color:var(--accent-2);font-weight:800;
  display:flex;align-items:center;justify-content:flex-end;
  padding-right:12px;
  text-transform:uppercase;
}
.tpl-course-module .m-cell{
  padding:14px 16px;
  border:1.5px solid var(--border);
  margin:-1px;
  display:flex;flex-direction:column;gap:4px;
  position:relative;
  background:var(--surface);
  min-height:0;
  border-radius:4px;
  transition:all .15s ease;
}
.tpl-course-module .m-cell .t{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;letter-spacing:.18em;font-weight:800;
  color:var(--accent);text-transform:uppercase;
  display:inline-block;
  background:rgba(45,125,110,.12);
  padding:2px 8px;
  border-radius:3px;
  align-self:flex-start;
}
.tpl-course-module .m-cell .n{
  font-family:'Playfair Display',serif;
  font-size:17px;font-weight:700;color:var(--text-1);
  line-height:1.25;margin:4px 0 2px;
}
.tpl-course-module .m-cell .d{font-size:13px;color:var(--text-1);line-height:1.4;font-weight:500}
.tpl-course-module .m-cell .f{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:.06em;color:var(--text-3);
  margin-top:auto;padding-top:4px;
  border-top:1px dashed var(--border);
  font-weight:600;
}
.tpl-course-module .m-cell.hi{
  background:linear-gradient(135deg,#2d7d6e,#4ea893);
  color:#fff;border-color:var(--accent);
  box-shadow:0 8px 24px rgba(45,125,110,.25);
  transform:scale(1.02);
  z-index:2;
}
.tpl-course-module .m-cell.hi .t{
  background:rgba(255,255,255,.25);color:#fff;
}
.tpl-course-module .m-cell.hi .n{color:#fff;font-size:18px}
.tpl-course-module .m-cell.hi .d{color:rgba(255,255,255,.95)}
.tpl-course-module .m-cell.hi .f{color:rgba(255,255,255,.85);border-top-color:rgba(255,255,255,.3)}
.tpl-course-module .m-cell.mid{
  background:var(--bg-soft);
  border-color:var(--border-strong);
}
.tpl-course-module .m-cell.mid .t{background:rgba(216,138,58,.15);color:var(--accent-2)}
.tpl-course-module .m-cell.low{background:var(--surface-2);opacity:.85}
.tpl-course-module .m-cell.low .t{background:rgba(138,127,104,.15);color:var(--text-3)}
.tpl-course-module .matrix-axis{
  display:flex;justify-content:space-between;
  font-family:'JetBrains Mono',monospace;
  font-size:12px;letter-spacing:.14em;font-weight:600;
  color:var(--text-2);
  margin-top:12px;
  padding:0 8px;
}
.tpl-course-module .matrix-axis .ax-mid{color:var(--accent);font-weight:800}"""
s = s.replace(old_matrix, new_matrix)

# === 18. concept-box (通用) padding 18/20 → 22/26 让卡片更呼吸 ===
s = s.replace(
    """.tpl-course-module .concept-box{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:18px 20px;
  box-shadow:var(--shadow);
  position:relative;
}""",
    """.tpl-course-module .concept-box{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:22px 26px;
  box-shadow:var(--shadow);
  position:relative;
}"""
)

# === 19. grid gap 16 → 20 让卡片之间更松 ===
s = s.replace(
    """.tpl-course-module .grid{display:grid;gap:16px;margin-top:18px}""",
    """.tpl-course-module .grid{display:grid;gap:20px;margin-top:20px}"""
)

# === 20. persona padding 20/22 → 24/28 ===
s = s.replace(
    """.tpl-course-module .concept-box.persona{
  padding:20px 22px;
}""",
    """.tpl-course-module .concept-box.persona{
  padding:26px 28px;
}"""
)

# === 21. figure-block (嵌入图片) - 当前 max-width 720 太小, 改为更宽 ===
s = s.replace(
    """.tpl-course-module .figure-block{
  margin:18px 0;
  display:block;
  width:100%;
  max-width:720px;
}""",
    """.tpl-course-module .figure-block{
  margin:18px 0;
  display:block;
  width:100%;
  max-width:100%;
}"""
)

# === 22. SWOT layout - swot-fig 改为 360px, 让左侧文字更宽 ===
s = s.replace(
    """.tpl-course-module .swot-layout{
  display:grid;
  grid-template-columns:1fr 480px;
  gap:32px;
  align-items:start;
}""",
    """.tpl-course-module .swot-layout{
  display:grid;
  grid-template-columns:1.4fr 1fr;
  gap:36px;
  align-items:start;
}"""
)

# === 23. concept-box 字号具体覆盖（4 象限） ===
# 已有上面的 swot-grid override 即可

with open(CSS, 'w', encoding='utf-8') as f:
    f.write(s)

print("style.css patched")
print(f"size: {len(s)} chars")
