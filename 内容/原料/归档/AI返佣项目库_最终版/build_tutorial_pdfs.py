# -*- coding: utf-8 -*-
"""把两份教程 MD 转成 PDF 补到资料包"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (SimpleDocTemplate, Table, TableStyle,
                                  Paragraph, Spacer, PageBreak)
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
import re

OUT_DIR = r"D:\path-to-wealth-freedom\内容\归档\AI返佣项目库_最终版"
pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))

# ========= 样式定义 =========
def make_styles():
    return {
        "h1": ParagraphStyle('h1', fontName='STSong-Light', fontSize=18, leading=24,
                            textColor=colors.HexColor('#1F4E79'),
                            spaceBefore=14, spaceAfter=8),
        "h2": ParagraphStyle('h2', fontName='STSong-Light', fontSize=14, leading=20,
                            textColor=colors.HexColor('#2F5496'),
                            spaceBefore=10, spaceAfter=6),
        "h3": ParagraphStyle('h3', fontName='STSong-Light', fontSize=12, leading=18,
                            textColor=colors.HexColor('#2F5496'),
                            spaceBefore=8, spaceAfter=4),
        "body": ParagraphStyle('body', fontName='STSong-Light', fontSize=10, leading=14),
        "code": ParagraphStyle('code', fontName='STSong-Light', fontSize=9, leading=12,
                              backColor=colors.HexColor('#F5F5F5'),
                              leftIndent=10, rightIndent=10,
                              spaceBefore=4, spaceAfter=4),
        "quote": ParagraphStyle('quote', fontName='STSong-Light', fontSize=10, leading=14,
                                textColor=colors.HexColor('#666666'),
                                leftIndent=15, rightIndent=10,
                                spaceBefore=4, spaceAfter=4),
        "li": ParagraphStyle('li', fontName='STSong-Light', fontSize=10, leading=14,
                              leftIndent=15),
    }

# ========= MD 解析器（轻量级）=========
def parse_md_to_flowables(md_text, styles):
    """把 MD 文本转成 reportlab flowables 列表"""
    flowables = []
    lines = md_text.split("\n")
    i = 0
    in_table = False
    table_rows = []

    def flush_table():
        nonlocal table_rows, in_table
        if not table_rows:
            return
        # 计算列宽
        n_cols = max(len(r) for r in table_rows)
        col_width = 16 * cm / n_cols
        # 清洗数据
        clean_rows = []
        for r in table_rows:
            cr = [c.strip().replace("|", "/") for c in r]
            while len(cr) < n_cols:
                cr.append("")
            clean_rows.append(cr)
        t = Table(clean_rows, colWidths=[col_width] * n_cols)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#2F5496')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,-1), 'STSong-Light'),
            ('FONTSIZE', (0,0), (-1,0), 9),
            ('FONTSIZE', (0,1), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.3, colors.grey),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LEFTPADDING', (0,0), (-1,-1), 4),
            ('RIGHTPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        flowables.append(t)
        flowables.append(Spacer(1, 0.2*cm))
        table_rows = []
        in_table = False

    while i < len(lines):
        line = lines[i].rstrip()

        # 跳过空行
        if not line.strip():
            if in_table:
                flush_table()
            flowables.append(Spacer(1, 0.1*cm))
            i += 1
            continue

        # 表格行
        if line.strip().startswith("|") and line.strip().endswith("|"):
            in_table = True
            # 跳过分隔行 |---|---|
            if re.match(r'^\|[\s\-:|]+\|$', line.strip()):
                i += 1
                continue
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            table_rows.append(cells)
            i += 1
            continue
        else:
            if in_table:
                flush_table()

        # 标题
        if line.startswith("### "):
            flowables.append(Paragraph(self_inline(line[4:]), styles["h3"]))
        elif line.startswith("## "):
            flowables.append(Paragraph(self_inline(line[3:]), styles["h2"]))
        elif line.startswith("# "):
            flowables.append(Paragraph(self_inline(line[2:]), styles["h1"]))
        # 分隔线
        elif line.strip() == "---":
            flowables.append(Spacer(1, 0.3*cm))
        # 引用
        elif line.startswith("> "):
            txt = line[2:].strip()
            flowables.append(Paragraph(self_inline(txt), styles["quote"]))
        # 无序列表
        elif line.strip().startswith("- ") or line.strip().startswith("* "):
            txt = line.strip()[2:]
            flowables.append(Paragraph("• " + self_inline(txt), styles["li"]))
        # 有序列表
        elif re.match(r'^\d+\.\s', line.strip()):
            txt = re.sub(r'^\d+\.\s', '', line.strip())
            flowables.append(Paragraph("• " + self_inline(txt), styles["li"]))
        # 复选框
        elif line.strip().startswith("- [ ]") or line.strip().startswith("- [x]"):
            mark = "☐" if "[ ]" in line else "☑"
            txt = line.strip().replace("- [ ] ", "").replace("- [x] ", "")
            flowables.append(Paragraph(f"{mark} {self_inline(txt)}", styles["li"]))
        # 代码块
        elif line.strip().startswith("```"):
            i += 1
            code_buf = []
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_buf.append(lines[i])
                i += 1
            code_text = "<br/>".join(self_inline(c) for c in code_buf)
            flowables.append(Paragraph(code_text, styles["code"]))
        # 普通段落
        else:
            flowables.append(Paragraph(self_inline(line), styles["body"]))
        i += 1

    if in_table:
        flush_table()

    return flowables

def self_inline(text):
    """处理行内 markdown: **bold** `code`"""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # bold
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    # code
    text = re.sub(r'`(.+?)`', r'<font name="Courier" size="9">\1</font>', text)
    return text

# ========= 生成 PDF =========
def md_to_pdf(md_path, pdf_path, title):
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()
    styles = make_styles()
    flowables = parse_md_to_flowables(md_text, styles)

    doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm,
                            title=title)
    doc.build(flowables)
    return os.path.getsize(pdf_path)

# 1. 中文教程 PDF
cn_md = os.path.join(OUT_DIR, "先看教程.md")
cn_pdf = os.path.join(OUT_DIR, "先看教程.pdf")
size = md_to_pdf(cn_md, cn_pdf, "AI 工具联盟营销教程 - 30 天 SOP")
print(f"✅ 已生成: 先看教程.pdf ({size/1024:.1f} KB)")

# 2. 英文教程 PDF
en_md = os.path.join(OUT_DIR, "readme.md")
en_pdf = os.path.join(OUT_DIR, "readme.pdf")
size = md_to_pdf(en_md, en_pdf, "AI Affiliate Marketing Tutorial - 30-day SOP")
print(f"✅ 已生成: readme.pdf ({size/1024:.1f} KB)")

print("\n教程 PDF 全部生成完毕。")
