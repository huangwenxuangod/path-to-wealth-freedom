"""
答题纸填充脚本 v2：为文轩哥的金融科技报告生成最终 .docx 提交物
输入：00-报告骨架.md（已写完正文 1.3 万字）
输出：金融科技应用前沿-醒账-答题纸版.docx
特性：
  - 仿学校专用答题纸模板表头
  - 完整 1.3 万字正文（6 章 7 节）
  - 嵌入 5 张用户图（journey/home-hero/swot/track/cancel）+ 9pt 楷体居中图注
"""
import re
import os
from docx import Document
from docx.shared import Pt, Inches, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

# ============ 路径配置 ============
BASE = r"D:\path-to-wealth-freedom\内容\项目\2026-06-21-金融科技期末-平台自动续费追踪"
ASSETS = r"D:\path-to-wealth-freedom\opendesign\mockups\hidden-fee-hunter-deck\assets"
md_path = os.path.join(BASE, "00-报告骨架.md")
output_path = os.path.join(BASE, "金融科技应用前沿-醒账-答题纸版.docx")

# ============ 5 张图插入配置 ============
# (触发 H3 编号, 图片路径, 图注, 宽度 inch)
IMAGES = [
    ("1.3", os.path.join(ASSETS, "journey.png"),
     "图 1.1 醒账 · 自动续费用户旅程 5 阶段（签约 → 遗忘 → 扣款 → 发现 → 解救）", 6.0),
    ("2.2", os.path.join(ASSETS, "home-hero.png"),
     "图 2.1 醒账 App 首页原型 · 过去 12 个月你为遗忘付出 ¥684 元（2 顿海底捞 / 8 杯奶茶 / 1 双球鞋）", 3.5),
    ("4.3", os.path.join(ASSETS, "swot.png"),
     "图 4.1 SWOT 战略矩阵 · SO 战略 = 借监管红利 + 真空市场先发 2 年", 6.0),
    ("5.3", os.path.join(ASSETS, "track-page.png"),
     "图 5.1 醒账追踪页原型 · 黄底 30 天未用 + 红底涨价 50% 双警示标签", 3.5),
    ("5.4", os.path.join(ASSETS, "cancel-guide.png"),
     "图 5.2 一键取消教程 · 微信 → 我 → 服务 → 钱包 → 自动续费 → 关闭（4 步带截图）", 3.5),
]

# ============ 读 markdown 正文 ============
with open(md_path, "r", encoding="utf-8") as f:
    md_content = f.read()

# ============ 创建新 docx ============
doc = Document()

# 全局字体：宋体小四
style = doc.styles['Normal']
style.font.name = '宋体'
style.font.size = Pt(12)  # 小四
style.element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')

# 页边距 A4
for section in doc.sections:
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(3.18)
    section.right_margin = Cm(3.18)


# ============ 1. 学校专用答题纸表头 ============
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
title_run = title.add_run("深圳大学考试答题纸")
title_run.bold = True
title_run.font.size = Pt(20)
title_run.font.name = '黑体'
title_run._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

subtitle = doc.add_paragraph()
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle_run = subtitle.add_run("(以论文、报告等形式考核专用)")
subtitle_run.font.size = Pt(12)
subtitle_run.italic = True

# 课程信息表格
table = doc.add_table(rows=4, cols=4)
table.style = 'Table Grid'
table.cell(0, 0).text = "课程编号"
table.cell(0, 1).text = "2901000008"
table.cell(0, 2).text = "课序号"
table.cell(0, 3).text = "01"
table.cell(1, 0).text = "课程名称"
table.cell(1, 1).text = "金融科技应用前沿"
table.cell(1, 2).text = "学年度"
table.cell(1, 3).text = "2025-2026（2）"
table.cell(2, 0).text = "任课教师"
table.cell(2, 1).text = "（导师签字栏）"
table.cell(2, 2).text = "成绩"
table.cell(2, 3).text = ""
table.cell(3, 0).text = "题目"
table.cell(3, 1).merge(table.cell(3, 3))
table.cell(3, 1).text = "醒账：基于行为金融视角的自动续费追踪与取消辅助产品设计"

# 表头内字
for row in table.rows:
    for cell in row.cells:
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(10.5)
                r.font.name = '宋体'
                r._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')

doc.add_paragraph()

# 学生信息小行
student_info = doc.add_paragraph()
student_info.alignment = WD_ALIGN_PARAGRAPH.RIGHT
info_run = student_info.add_run("姓名：黄文轩、张晋豪、林瀚羽、王子轩、彭琰轲、曾泓霖　|　学院：微众金融科技学院　|　日期：2026-06-25")
info_run.font.size = Pt(10.5)
info_run.italic = True

# 标题线
hr = doc.add_paragraph()
hr_run = hr.add_run("─" * 70)
hr_run.font.size = Pt(8)
hr.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph()


# ============ 2. 正文解析 + 5 张图嵌入 ============
def parse_inline(text):
    """处理 **加粗**、*斜体*、`行内代码` —— 真的生成 bold/italic runs，而不是剥掉符号"""
    runs = []
    pattern = re.compile(r'(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)')
    pos = 0
    for m in pattern.finditer(text):
        if m.start() > pos:
            runs.append((text[pos:m.start()], False))
        if m.group(2) is not None:        # **加粗**
            runs.append((m.group(2), 'bold'))
        elif m.group(3) is not None:      # *斜体*
            runs.append((m.group(3), 'italic'))
        elif m.group(4) is not None:      # `行内代码`
            runs.append((m.group(4), 'mono'))
        pos = m.end()
    if pos < len(text):
        runs.append((text[pos:], False))
    if not runs:
        runs = [(text, False)]
    return runs


def add_runs_to_paragraph(p, runs, base_font='宋体', base_size=12):
    """把 [(text, format)] 列表追加到段落，format ∈ {'bold','italic','mono',False}"""
    for txt, fmt in runs:
        if not txt:
            continue
        r = p.add_run(txt)
        r.font.name = base_font
        r._element.rPr.rFonts.set(qn('w:eastAsia'), base_font)
        r.font.size = Pt(base_size)
        if fmt == 'bold':
            r.bold = True
        elif fmt == 'italic':
            r.italic = True
        elif fmt == 'mono':
            r.font.name = 'Consolas'
            r._element.rPr.rFonts.set(qn('w:eastAsia'), 'Consolas')
            r.font.size = Pt(11)


def fill_cell_with_runs(cell, runs, base_font='宋体', base_size=11):
    """把 runs 写进表格单元格（清空默认空 run）"""
    p = cell.paragraphs[0]
    for run in list(p.runs):
        run.text = ''
    if not runs:
        runs = [('', False)]
    add_runs_to_paragraph(p, runs, base_font=base_font, base_size=base_size)


def add_caption(doc, caption_text):
    """插入图注：9pt 楷体居中"""
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(caption_text)
    r.font.size = Pt(9)
    r.font.name = '楷体'
    r._element.rPr.rFonts.set(qn('w:eastAsia'), '楷体')
    r.italic = True
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(8)


def add_image(doc, img_path, caption_text, width_inch=6.0):
    """插入图片 + 图注"""
    if not os.path.exists(img_path):
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    run.add_picture(img_path, width=Inches(width_inch))
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(0)
    add_caption(doc, caption_text)


def insert_image_at(doc, trigger_section, trigger_substr):
    """检查 trigger_section 标题是否被触发，触发则插入对应图"""
    for trigger, img_path, caption, width in IMAGES:
        if trigger == trigger_section and trigger_substr in trigger_section:
            add_image(doc, img_path, caption, width)


# 用于跟踪当前所在的章节，决定是否插入图
current_h2 = None
current_h3 = None

lines = md_content.split('\n')
i = 0
in_code = False
in_table = False
table_lines = []

while i < len(lines):
    line = lines[i].rstrip()

    # 跳过前 12 行 meta + 摘要
    if i < 12:
        i += 1
        continue

    # 跳过 markdown 分隔线
    if line.strip() == '---':
        i += 1
        continue

    # 跳过代码块
    if line.strip().startswith('```'):
        in_code = not in_code
        i += 1
        continue
    if in_code:
        i += 1
        continue

    # 标题处理
    if line.startswith('# '):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(line[2:].strip())
        r.bold = True
        r.font.size = Pt(18)
        r.font.name = '黑体'
        r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
        current_h2 = None
        current_h3 = None
    elif line.startswith('## '):
        title_text = line[3:].strip()
        p = doc.add_paragraph()
        r = p.add_run(title_text)
        r.bold = True
        r.font.size = Pt(15)
        r.font.name = '黑体'
        r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
        current_h2 = title_text
        current_h3 = None
        # 触发图 4.1（SWOT）- 章节 §4 出现 §4.3 时插入
        # 这里 H2 只是 "4 竞品分析"，§4.3 在 H3 触发
    elif line.startswith('### '):
        title_text = line[4:].strip()
        p = doc.add_paragraph()
        r = p.add_run(title_text)
        r.bold = True
        r.font.size = Pt(13)
        r.font.name = '黑体'
        r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')
        current_h3 = title_text
        # 触发 5 张图：基于 H3 编号匹配
        for trigger_num, img_path, caption, width in IMAGES:
            if current_h3.startswith(trigger_num + ' ') or current_h3.startswith(trigger_num + '、') or current_h3.startswith(trigger_num + '.'):
                add_image(doc, img_path, caption, width)
                break
    elif line.startswith('#### '):
        p = doc.add_paragraph()
        r = p.add_run(line[5:].strip())
        r.bold = True
        r.font.size = Pt(11.5)
    elif line.startswith('- '):
        p = doc.add_paragraph(style='List Bullet')
        runs = parse_inline(line[2:].strip())
        add_runs_to_paragraph(p, runs, base_font='宋体', base_size=12)
    elif line.startswith('|'):
        if not in_table:
            in_table = True
            table_lines = []
        table_lines.append(line)
    else:
        if in_table:
            if len(table_lines) > 1:
                rows = [re.split(r'\|', tl.strip().strip('|')) for tl in table_lines if '|' in tl]
                rows = [[c.strip() for c in r] for r in rows if any(c.strip() for c in r)]
                rows = [r for r in rows if not all(re.match(r'^[-:]+$', c) for c in r if c)]
                if rows:
                    n_rows = len(rows)
                    n_cols = max(len(r) for r in rows)
                    t = doc.add_table(rows=n_rows, cols=n_cols)
                    t.style = 'Table Grid'
                    for r_idx, row in enumerate(rows):
                        for c_idx in range(n_cols):
                            cell_text = row[c_idx] if c_idx < len(row) else ''
                            runs = parse_inline(cell_text)
                            fill_cell_with_runs(t.cell(r_idx, c_idx), runs, base_size=11)
                            if r_idx == 0:
                                for run in t.cell(r_idx, c_idx).paragraphs[0].runs:
                                    run.bold = True
            in_table = False
            table_lines = []
        if line.strip():
            p = doc.add_paragraph()
            p.paragraph_format.first_line_indent = Pt(24)  # 首行缩进 2 字符
            runs = parse_inline(line)
            add_runs_to_paragraph(p, runs, base_font='宋体', base_size=12)

    i += 1

# 处理最后可能残留的表格
if in_table and table_lines:
    rows = [re.split(r'\|', tl.strip().strip('|')) for tl in table_lines if '|' in tl]
    rows = [[c.strip() for c in r] for r in rows if any(c.strip() for c in r)]
    rows = [r for r in rows if not all(re.match(r'^[-:]+$', c) for c in r if c)]
    if rows:
        n_rows = len(rows)
        n_cols = max(len(r) for r in rows)
        t = doc.add_table(rows=n_rows, cols=n_cols)
        t.style = 'Table Grid'
        for r_idx, row in enumerate(rows):
            for c_idx in range(n_cols):
                cell_text = row[c_idx] if c_idx < len(row) else ''
                runs = parse_inline(cell_text)
                fill_cell_with_runs(t.cell(r_idx, c_idx), runs, base_size=11)
                if r_idx == 0:
                    for run in t.cell(r_idx, c_idx).paragraphs[0].runs:
                        run.bold = True

# 落盘
doc.save(output_path)
print(f"Done: {output_path}")
print(f"Images embedded: {len(IMAGES)}")