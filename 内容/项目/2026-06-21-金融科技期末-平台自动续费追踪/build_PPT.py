"""
Build PPT for 醒账答辩.
Reads 05-答辩PPT-内容大纲.md and generates a 14-page Rocket Money style pptx.

Visual: Rocket Money 风格 (#0A2540 深海蓝 + #00C896 薄荷绿 + #FFD700 鎏金)
14 pages, 10 min talk = 109 字/分钟, 1,091 字 total
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pathlib import Path

# ===== 配色 (Rocket Money 风格) =====
COL_NAVY = RGBColor(0x0A, 0x25, 0x40)        # 深海蓝
COL_MINT = RGBColor(0x00, 0xC8, 0x96)        # 薄荷绿
COL_GOLD = RGBColor(0xFF, 0xD7, 0x00)        # 鎏金
COL_ORANGE = RGBColor(0xFF, 0x6B, 0x35)      # 暖橙
COL_PURPLE = RGBColor(0x6B, 0x46, 0xC1)      # 紫罗兰
COL_BG = RGBColor(0xF7, 0xFA, 0xFC)          # 浅雾灰
COL_BORDER = RGBColor(0xE2, 0xE8, 0xF0)       # 边框灰
COL_TEXT = RGBColor(0x1A, 0x20, 0x2C)        # 标题黑
COL_TEXT_GREY = RGBColor(0x4A, 0x55, 0x68)   # 文字灰
COL_WHITE = RGBColor(0xFF, 0xFF, 0xFF)
COL_RED = RGBColor(0xEF, 0x44, 0x44)
COL_SUCCESS = RGBColor(0x10, 0xB9, 0x81)
COL_WARN = RGBColor(0xF5, 0x9E, 0x0B)

# 16:9 widescreen
SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

prs = Presentation()
prs.slide_width = SLIDE_W
prs.slide_height = SLIDE_H


def add_blank_slide():
    return prs.slides.add_slide(prs.slide_layouts[6])  # blank


def add_rect(slide, left, top, width, height, fill_color, line_color=None, line_width=0):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.adjustments[0] = 0.1
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if line_color is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line_color
        shape.line.width = Pt(line_width)
    return shape


def add_rect_sharp(slide, left, top, width, height, fill_color, line_color=None, line_width=0):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if line_color is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line_color
        shape.line.width = Pt(line_width)
    return shape


def add_text(slide, left, top, width, height, text, *, font_size=18, bold=False, color=COL_TEXT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, font_name='微软雅黑'):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(0)
    tf.margin_right = Pt(0)
    tf.margin_top = Pt(0)
    tf.margin_bottom = Pt(0)
    tf.vertical_anchor = anchor

    lines = text.split('\n') if isinstance(text, str) else text
    for i, line in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.alignment = align
        p.space_before = Pt(0)
        p.space_after = Pt(0)
        run = p.add_run()
        run.text = line
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.color.rgb = color
    return tb


def add_page_header(slide, page_num, total_pages, title_text):
    """统一页头:深海蓝细条 + 页码 + 标题"""
    # 顶部装饰条
    add_rect_sharp(slide, Inches(0), Inches(0), SLIDE_W, Inches(0.08), COL_NAVY)
    # 底部装饰条
    add_rect_sharp(slide, Inches(0), Inches(7.42), SLIDE_W, Inches(0.08), COL_NAVY)
    # 页码徽章
    badge = add_rect(slide, Inches(0.5), Inches(7.0), Inches(1.0), Inches(0.32), COL_NAVY)
    add_text(slide, Inches(0.5), Inches(7.0), Inches(1.0), Inches(0.32),
             f"{page_num:02d} / {total_pages:02d}", font_size=11, bold=True, color=COL_WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    # 右侧版权
    add_text(slide, Inches(10.5), Inches(7.0), Inches(2.5), Inches(0.32),
             "金融科技应用前沿 · 文轩 · 2026", font_size=10, color=COL_TEXT_GREY,
             align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P1: 封面
# ============================================================
def page_1_cover():
    s = add_blank_slide()
    # 深海蓝背景
    add_rect_sharp(s, Inches(0), Inches(0), SLIDE_W, SLIDE_H, COL_NAVY)
    # 鎏金斜条纹
    add_rect_sharp(s, Inches(0), Inches(6.0), SLIDE_W, Inches(0.3), COL_GOLD)
    add_rect_sharp(s, Inches(0), Inches(6.3), SLIDE_W, Inches(0.1), COL_MINT)
    # 顶部薄荷绿小圆点
    for i in range(5):
        add_rect_sharp(s, Inches(0.5 + i * 0.3), Inches(0.5), Inches(0.15), Inches(0.15), COL_MINT)

    # 主标题
    add_text(s, Inches(0.8), Inches(2.0), Inches(11.7), Inches(1.4),
             "醒账", font_size=72, bold=True, color=COL_WHITE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.8), Inches(3.4), Inches(11.7), Inches(0.6),
             "Hidden Renewal Hunter", font_size=22, color=COL_MINT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.8), Inches(4.1), Inches(11.7), Inches(0.5),
             "基于行为金融视角的自动续费守护 — 基于行为金融视角的自动续费追踪与取消辅助产品",
             font_size=18, color=COL_GOLD, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 鎏金分隔线
    add_rect_sharp(s, Inches(0.8), Inches(4.85), Inches(2.0), Inches(0.04), COL_GOLD)

    # 副信息
    add_text(s, Inches(0.8), Inches(5.0), Inches(11.7), Inches(0.4),
             "金融科技应用前沿 · 期末答辩", font_size=16, color=COL_WHITE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.8), Inches(5.4), Inches(11.7), Inches(0.4),
             "汇报人：文轩    |    2026.06.21    |    深圳大学",
             font_size=14, color=COL_BG, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P2: 目录
# ============================================================
def page_2_toc():
    s = add_blank_slide()
    add_page_header(s, 2, 14, "目录")

    # 大标题
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.8),
             "目录 / Contents", font_size=40, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.3), Inches(1.5), Inches(0.04), COL_GOLD)

    chapters = [
        ("01", "现状与痛点", "5 亿 + 89% 的隐性扣费黑洞"),
        ("02", "需求分析", "1,200 亿市场 + 5 大场景 + 行为金融 4 象限"),
        ("03", "用户画像", "小张 + 小李：知道在被扣，但不愿查"),
        ("04", "竞品分析", "9 款扫描 + 真空结论 + SWOT"),
        ("05", "产品设计", "3 模块 + 4 轨混合技术 + 4 大创新点"),
        ("06", "商业模式", "Pro 订阅 + 谈判返佣 + 联盟佣金"),
        ("07", "未来路线", "2026 MVP / 2027 多银行 / 2028 Agent"),
    ]

    for i, (num, title, sub) in enumerate(chapters):
        top = Inches(1.7 + i * 0.78)
        # 序号方块
        add_rect(s, Inches(0.8), top, Inches(0.8), Inches(0.6), COL_NAVY)
        add_text(s, Inches(0.8), top, Inches(0.8), Inches(0.6),
                 num, font_size=20, bold=True, color=COL_GOLD,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # 标题
        add_text(s, Inches(1.8), top, Inches(3.5), Inches(0.6),
                 title, font_size=22, bold=True, color=COL_NAVY,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 副标题
        add_text(s, Inches(5.3), top, Inches(7.5), Inches(0.6),
                 sub, font_size=14, color=COL_TEXT_GREY,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 底部分割线
        add_rect_sharp(s, Inches(1.8), top + Inches(0.6), Inches(11), Inches(0.01), COL_BORDER)


# ============================================================
# P3: 现状 — 5 亿用户的扣费黑洞
# ============================================================
def page_3_status():
    s = add_blank_slide()
    add_page_header(s, 3, 14, "现状")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§1 现状：5 亿用户的「扣费黑洞」", font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 左: 3 个数据卡片
    data_cards = [
        ("5 亿+", "免密支付绑定用户", "工信部 2025 通报", COL_MINT),
        ("89%", "用户低估订阅支出 2.5x+", "艾瑞咨询 2024 调研", COL_ORANGE),
        ("171 元", "洪女士被自动续费 9 次累计", "中消协 2025.11.7 案例", COL_RED),
    ]
    for i, (num, sub, source, color) in enumerate(data_cards):
        top = Inches(1.6 + i * 1.6)
        # 色条
        add_rect_sharp(s, Inches(0.8), top, Inches(0.1), Inches(1.3), color)
        # 数字
        add_text(s, Inches(1.1), top + Inches(0.1), Inches(2.2), Inches(0.7),
                 num, font_size=40, bold=True, color=color,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 副标题
        add_text(s, Inches(1.1), top + Inches(0.8), Inches(4.0), Inches(0.4),
                 sub, font_size=14, color=COL_TEXT,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 来源
        add_text(s, Inches(1.1), top + Inches(1.05), Inches(4.0), Inches(0.3),
                 f"📊 {source}", font_size=10, color=COL_TEXT_GREY,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 右: 监管时间轴
    add_rect(s, Inches(5.8), Inches(1.6), Inches(6.7), Inches(5.0), COL_BG, line_color=COL_BORDER, line_width=0.75)
    add_text(s, Inches(6.0), Inches(1.7), Inches(6.3), Inches(0.4),
             "📅 监管时间轴 (2024-2026)", font_size=16, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    timeline = [
        ("2024.7.1", "消保条例生效", "第十条：5 日前显著提醒", COL_NAVY),
        ("2024.10", "FTC Click-to-Cancel 通过", "美国对标", COL_TEXT_GREY),
        ("2025.5.17", "工信部 5 日前要求", "强制执行", COL_ORANGE),
        ("2025.11.7", "中消协公开点名", "投诉量 +32.62%", COL_RED),
        ("2026.1.6", "工信部 22 款 App 通报", "常态化执法", COL_PURPLE),
    ]
    for i, (date, title, sub, color) in enumerate(timeline):
        top = Inches(2.2 + i * 0.85)
        # 圆点
        add_rect_sharp(s, Inches(6.1), top + Inches(0.1), Inches(0.2), Inches(0.2), color)
        # 日期
        add_text(s, Inches(6.4), top, Inches(1.4), Inches(0.4),
                 date, font_size=12, bold=True, color=color,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 标题
        add_text(s, Inches(7.7), top, Inches(4.6), Inches(0.4),
                 title, font_size=14, bold=True, color=COL_TEXT,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 副
        add_text(s, Inches(7.7), top + Inches(0.35), Inches(4.6), Inches(0.3),
                 sub, font_size=10, color=COL_TEXT_GREY,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 连接线
        if i < len(timeline) - 1:
            add_rect_sharp(s, Inches(6.19), top + Inches(0.3), Inches(0.02), Inches(0.55), COL_BORDER)

    # 底部金句
    add_rect_sharp(s, Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4), COL_NAVY)
    add_text(s, Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4),
             "💡 你以为每月只花 50 块，实际可能正在为 125 元的隐性订阅买单",
             font_size=15, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P4: 痛点 — 行为金融 4 象限
# ============================================================
def page_4_pain():
    s = add_blank_slide()
    add_page_header(s, 4, 14, "痛点")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§1 痛点：行为金融 4 象限", font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    add_text(s, Inches(0.8), Inches(1.3), Inches(11.7), Inches(0.4),
             "为什么用户「知道在被扣，却从不主动取消」？ 4 个行为偏差共同作用：",
             font_size=14, color=COL_TEXT_GREY, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 4 象限 2x2
    quads = [
        ("现状偏见\nStatus Quo Bias", "找不到取消入口", "「我以为会自动停」\n3 级菜单下无人主动取消", COL_NAVY),
        ("损失厌恶\nLoss Aversion", "取消路径太深", "「懒得折腾，金额也不大」\n9 元的痛感被稀释", COL_ORANGE),
        ("心理账户\nMental Accounting", "试了取消没成功", "「之前的钱都白花了」\n已付 vs 续费分账户", COL_PURPLE),
        ("锚定效应\nAnchoring Effect", "完全忘了订阅存在", "「当时是免费 / 9 元啊」\n首月低价掩盖后续", COL_RED),
    ]
    pos = [
        (Inches(0.8), Inches(1.9)),
        (Inches(7.0), Inches(1.9)),
        (Inches(0.8), Inches(4.6)),
        (Inches(7.0), Inches(4.6)),
    ]
    for i, ((theory, pain, quote, color), (left, top)) in enumerate(zip(quads, pos)):
        add_rect(s, left, top, Inches(5.5), Inches(2.5), COL_BG, line_color=color, line_width=2)
        # 色条
        add_rect_sharp(s, left, top, Inches(0.15), Inches(2.5), color)
        # 理论
        add_text(s, left + Inches(0.3), top + Inches(0.15), Inches(5.0), Inches(0.5),
                 theory, font_size=16, bold=True, color=color,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 痛点
        add_text(s, left + Inches(0.3), top + Inches(0.85), Inches(5.0), Inches(0.5),
                 "→ " + pain, font_size=18, bold=True, color=COL_TEXT,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 引文
        add_text(s, left + Inches(0.3), top + Inches(1.5), Inches(5.0), Inches(0.9),
                 quote, font_size=12, color=COL_TEXT_GREY,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 底部金句
    add_rect_sharp(s, Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4), COL_NAVY)
    add_text(s, Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4),
             "💡 单次 9 元的痛感远低于累计 171 元的剧痛 — 行为金融学的「沉默扣费」机制",
             font_size=15, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P5: 市场规模
# ============================================================
def page_5_market():
    s = add_blank_slide()
    add_page_header(s, 5, 14, "市场")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§2 市场规模：1,200 亿 SaaS 订阅 + 5 大场景",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 左: 3 个核心 KPI
    add_rect(s, Inches(0.8), Inches(1.6), Inches(5.0), Inches(2.4), COL_NAVY)
    add_text(s, Inches(1.0), Inches(1.7), Inches(4.6), Inches(0.4),
             "💰 中国 SaaS 订阅市场规模", font_size=14, color=COL_MINT)
    add_text(s, Inches(1.0), Inches(2.1), Inches(4.6), Inches(1.0),
             "¥ 1,200 亿", font_size=60, bold=True, color=COL_GOLD,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(1.0), Inches(3.2), Inches(4.6), Inches(0.4),
             "年复合增长 18.7%   |   来源：艾瑞 2024", font_size=12, color=COL_WHITE)

    add_rect(s, Inches(0.8), Inches(4.2), Inches(2.4), Inches(1.5), COL_BG, line_color=COL_BORDER, line_width=0.75)
    add_text(s, Inches(0.9), Inches(4.3), Inches(2.2), Inches(0.3),
             "📱 订阅类 App", font_size=12, color=COL_TEXT_GREY)
    add_text(s, Inches(0.9), Inches(4.6), Inches(2.2), Inches(0.7),
             "4,500+", font_size=36, bold=True, color=COL_MINT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.9), Inches(5.3), Inches(2.2), Inches(0.3),
             "QuestMobile 2025.6", font_size=9, color=COL_TEXT_GREY)

    add_rect(s, Inches(3.4), Inches(4.2), Inches(2.4), Inches(1.5), COL_BG, line_color=COL_BORDER, line_width=0.75)
    add_text(s, Inches(3.5), Inches(4.3), Inches(2.2), Inches(0.3),
             "⚠️ 违规 App 通报", font_size=12, color=COL_TEXT_GREY)
    add_text(s, Inches(3.5), Inches(4.6), Inches(2.2), Inches(0.7),
             "3,852 款", font_size=32, bold=True, color=COL_RED,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(3.5), Inches(5.3), Inches(2.2), Inches(0.3),
             "工信部 2025 · 同比 +152%", font_size=9, color=COL_TEXT_GREY)

    # 右: 5 大场景
    add_text(s, Inches(6.2), Inches(1.6), Inches(6.3), Inches(0.4),
             "📊 5 大订阅场景分布", font_size=18, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    scenes = [
        ("流媒体会员", "爱奇艺 / 优酷 / 腾讯", "3 亿+", "35%", COL_BLUE := RGBColor(0x3B, 0x82, 0xF6)),
        ("平台免密支付", "美团 / 京东 / 拼多多", "5 亿绑定", "30%", COL_ORANGE),
        ("小程序内购", "游戏 / 工具月卡", "50+", "20%", COL_PURPLE),
        ("知识付费", "得到 / 樊登 / 极客", "8,000 万", "10%", COL_SUCCESS),
        ("海外工具", "Adobe / Notion / ChatGPT", "2,000 万", "5%", COL_GOLD),
    ]
    for i, (name, brands, scale, pct, color) in enumerate(scenes):
        top = Inches(2.1 + i * 0.85)
        # 色条
        add_rect_sharp(s, Inches(6.2), top, Inches(0.1), Inches(0.7), color)
        # 名称
        add_text(s, Inches(6.4), top, Inches(2.5), Inches(0.4),
                 name, font_size=14, bold=True, color=COL_TEXT,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 品牌
        add_text(s, Inches(6.4), top + Inches(0.35), Inches(2.5), Inches(0.3),
                 brands, font_size=9, color=COL_TEXT_GREY,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 规模
        add_text(s, Inches(9.0), top, Inches(1.7), Inches(0.4),
                 scale, font_size=14, bold=True, color=color,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 百分比条
        bar_w = Inches(2.5 * float(pct.strip('%')) / 100)
        add_rect_sharp(s, Inches(10.8), top + Inches(0.2), Inches(2.5), Inches(0.1), COL_BORDER)
        add_rect_sharp(s, Inches(10.8), top + Inches(0.2), bar_w, Inches(0.1), color)
        add_text(s, Inches(10.8), top + Inches(0.3), Inches(2.5), Inches(0.4),
                 pct, font_size=14, bold=True, color=color,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 底部金句
    add_rect_sharp(s, Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4), COL_NAVY)
    add_text(s, Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4),
             "💡 违规越多，需求越被低估 — 供给端持续膨胀 + 用户端认知偏差 = 扣费黑洞",
             font_size=15, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P6: 用户痛点 (复用 4 象限)
# ============================================================
def page_6_user_pain():
    s = add_blank_slide()
    add_page_header(s, 6, 14, "用户")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§2 用户痛点：5 大场景痛点强度矩阵",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    add_text(s, Inches(0.8), Inches(1.3), Inches(11.7), Inches(0.4),
             "按「无提醒 + 难取消 + 金额累积」三维度评估痛点强度，平台免密支付痛点最高 ★★★★★",
             font_size=13, color=COL_TEXT_GREY, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 表头
    headers = ["订阅场景", "代表平台", "用户规模", "痛点强度", "行为金融归因"]
    col_widths = [Inches(2.0), Inches(3.0), Inches(1.8), Inches(1.6), Inches(3.3)]
    col_x = [Inches(0.8)]
    for w in col_widths[:-1]:
        col_x.append(col_x[-1] + w)
    # 表头
    add_rect_sharp(s, Inches(0.8), Inches(2.0), Inches(11.7), Inches(0.5), COL_NAVY)
    for i, h in enumerate(headers):
        add_text(s, col_x[i], Inches(2.0), col_widths[i], Inches(0.5),
                 h, font_size=13, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    rows = [
        ("流媒体会员", "爱奇艺 / 优酷 / 腾讯视频", "3 亿+", "★★★★", "锚定效应（首月低价）", COL_WARN),
        ("平台免密支付", "美团 / 京东 / 拼多多", "5 亿绑定", "★★★★★", "现状偏见 + 损失厌恶", COL_RED),
        ("小程序内购", "游戏 / 工具月卡", "50+", "★★★", "心理账户分离", COL_TEXT_GREY),
        ("知识付费", "得到 / 樊登 / 极客", "8,000 万", "★★★", "沉没成本", COL_TEXT_GREY),
        ("海外工具", "Adobe / Notion / ChatGPT", "2,000 万", "★★★★", "锚定 + 现状偏见", COL_WARN),
    ]
    for i, (scene, brand, scale, star, theory, color) in enumerate(rows):
        top = Inches(2.5 + i * 0.6)
        # 偶数行底色
        if i % 2 == 0:
            add_rect_sharp(s, Inches(0.8), top, Inches(11.7), Inches(0.6), COL_BG)
        # 平台免密支付高亮整行
        if i == 1:
            add_rect_sharp(s, Inches(0.8), top, Inches(11.7), Inches(0.6), RGBColor(0xFE, 0xE2, 0xE2))
        cells = [scene, brand, scale, star, theory]
        for j, c in enumerate(cells):
            c_color = COL_TEXT_GREY if j == 1 else COL_TEXT
            if j == 3:  # 痛点强度列
                add_text(s, col_x[j], top, col_widths[j], Inches(0.6),
                         c, font_size=14, bold=True, color=color,
                         align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
            elif j == 0:  # 场景
                add_text(s, col_x[j], top, col_widths[j], Inches(0.6),
                         c, font_size=12, bold=True, color=c_color,
                         align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
            else:
                add_text(s, col_x[j], top, col_widths[j], Inches(0.6),
                         c, font_size=12, color=c_color,
                         align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 底部 P0 结论
    add_rect(s, Inches(0.8), Inches(5.8), Inches(11.7), Inches(1.2), COL_NAVY)
    add_text(s, Inches(1.0), Inches(5.9), Inches(11.3), Inches(0.4),
             "🎯 P0 优先场景", font_size=14, bold=True, color=COL_GOLD)
    add_text(s, Inches(1.0), Inches(6.3), Inches(11.3), Inches(0.4),
             "平台免密支付（5 亿绑定） — 嵌在常用 App 内 + 扣费静默 + 跨渠道",
             font_size=15, bold=True, color=COL_WHITE)
    add_text(s, Inches(1.0), Inches(6.7), Inches(11.3), Inches(0.4),
             "→ 本研究产品优先解决此场景的「跨平台识别 + 一键取消」需求",
             font_size=12, color=COL_MINT)

    add_rect_sharp(s, Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3), COL_BG)
    add_text(s, Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3),
             "数据来源：艾瑞咨询 2024 + QuestMobile 2025.6 + 中消协 2025",
             font_size=10, color=COL_TEXT_GREY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P7: 用户画像 - 小张 + 小李
# ============================================================
def page_7_personas():
    s = add_blank_slide()
    add_page_header(s, 7, 14, "画像")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§3 用户画像：小张 + 小李", font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 左侧: 小张
    add_rect(s, Inches(0.8), Inches(1.6), Inches(5.8), Inches(5.0), COL_BG, line_color=COL_NAVY, line_width=2)
    # 头像占位 (圆角矩形)
    add_rect(s, Inches(1.0), Inches(1.8), Inches(1.4), Inches(1.4), COL_NAVY)
    add_text(s, Inches(1.0), Inches(1.8), Inches(1.4), Inches(1.4),
             "👨‍💼", font_size=60, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    # 名字
    add_text(s, Inches(2.6), Inches(1.85), Inches(3.8), Inches(0.5),
             "小张  /  28 岁深圳白领", font_size=20, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(2.6), Inches(2.35), Inches(3.8), Inches(0.4),
             "运营 · 月薪 1.5 万 · 订阅重度用户", font_size=12, color=COL_TEXT_GREY)
    add_text(s, Inches(2.6), Inches(2.7), Inches(3.8), Inches(0.4),
             "📍 深圳", font_size=12, color=COL_MINT)

    # 数据
    add_rect_sharp(s, Inches(1.0), Inches(3.4), Inches(5.4), Inches(0.05), COL_BORDER)
    add_text(s, Inches(1.0), Inches(3.5), Inches(2.5), Inches(0.4),
             "真实订阅", font_size=11, color=COL_TEXT_GREY)
    add_text(s, Inches(1.0), Inches(3.8), Inches(2.5), Inches(0.5),
             "¥ 600 / 月", font_size=22, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(3.5), Inches(3.5), Inches(2.7), Inches(0.4),
             "主观感知", font_size=11, color=COL_TEXT_GREY)
    add_text(s, Inches(3.5), Inches(3.8), Inches(2.7), Inches(0.5),
             "¥ 200 / 月", font_size=22, bold=True, color=COL_ORANGE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 痛点
    add_text(s, Inches(1.0), Inches(4.5), Inches(5.4), Inches(0.4),
             "💔 痛点：ChatGPT Plus 想取消但忘了 5 月截止", font_size=13, bold=True, color=COL_RED)
    add_text(s, Inches(1.0), Inches(4.85), Inches(5.4), Inches(1.6),
             "已多付 2 个月共 ¥300\n订阅：腾讯视频 + 网易云 + ChatGPT Plus +\nNotion + 得到 + 百度网盘\n每月实际 ¥600，却只感知 ¥200",
             font_size=12, color=COL_TEXT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 右侧: 小李
    add_rect(s, Inches(6.9), Inches(1.6), Inches(5.8), Inches(5.0), COL_BG, line_color=COL_PURPLE, line_width=2)
    add_rect(s, Inches(7.1), Inches(1.8), Inches(1.4), Inches(1.4), COL_PURPLE)
    add_text(s, Inches(7.1), Inches(1.8), Inches(1.4), Inches(1.4),
             "👨‍🎓", font_size=60, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(8.7), Inches(1.85), Inches(3.8), Inches(0.5),
             "小李  /  21 岁深大学生", font_size=20, bold=True, color=COL_PURPLE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(8.7), Inches(2.35), Inches(3.8), Inches(0.4),
             "大三 · 月生活费 ¥2,500 · 轻量订阅", font_size=12, color=COL_TEXT_GREY)
    add_text(s, Inches(8.7), Inches(2.7), Inches(3.8), Inches(0.4),
             "📍 深圳大学", font_size=12, color=COL_PURPLE)

    add_rect_sharp(s, Inches(7.1), Inches(3.4), Inches(5.4), Inches(0.05), COL_BORDER)
    add_text(s, Inches(7.1), Inches(3.5), Inches(2.5), Inches(0.4),
             "首月价格", font_size=11, color=COL_TEXT_GREY)
    add_text(s, Inches(7.1), Inches(3.8), Inches(2.5), Inches(0.5),
             "¥ 0 (试用 7 天)", font_size=20, bold=True, color=COL_MINT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(9.6), Inches(3.5), Inches(2.7), Inches(0.4),
             "次月续费", font_size=11, color=COL_TEXT_GREY)
    add_text(s, Inches(9.6), Inches(3.8), Inches(2.7), Inches(0.5),
             "¥ 19 / 月", font_size=20, bold=True, color=COL_RED,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    add_text(s, Inches(7.1), Inches(4.5), Inches(5.4), Inches(0.4),
             "💔 痛点：被「免费试用 7 天」套路", font_size=13, bold=True, color=COL_RED)
    add_text(s, Inches(7.1), Inches(4.85), Inches(5.4), Inches(1.6),
             "试用结束自动按 ¥19/月续费\n订阅：Keep + 百度网盘 + 某工具 App\n月生活费 ¥2,500 中被扣 30-50 元\n完全不知道这笔钱去了哪里",
             font_size=12, color=COL_TEXT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 底部共性金句
    add_rect_sharp(s, Inches(0.8), Inches(6.85), Inches(11.7), Inches(0.5), COL_NAVY)
    add_text(s, Inches(0.8), Inches(6.85), Inches(11.7), Inches(0.5),
             "💡 共性：知道在被扣，但懒得逐一查 + 找不到统一管理入口",
             font_size=15, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P8: 竞品分析
# ============================================================
def page_8_competitors():
    s = add_blank_slide()
    add_page_header(s, 8, 14, "竞品")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§4 竞品分析：9 款扫描 + 真空结论",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 海外 3 强
    add_text(s, Inches(0.8), Inches(1.3), Inches(5.8), Inches(0.4),
             "🌍 海外 3 强", font_size=16, bold=True, color=COL_MINT,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    overseas = [
        ("Rocket Money", "12.7 亿美元被收购", "银行接入 + AI 识别 + 真人谈判双引擎", COL_SUCCESS),
        ("Trim", "2024.11 关闭", "纯追踪模式无法独立商业化", COL_TEXT_GREY),
        ("Subby", "2024-2025 走红", "AI 读 Gmail 路线", COL_MINT),
    ]
    for i, (name, status, model, color) in enumerate(overseas):
        top = Inches(1.8 + i * 1.0)
        add_rect(s, Inches(0.8), top, Inches(5.8), Inches(0.85), COL_BG, line_color=color, line_width=1.5)
        add_rect_sharp(s, Inches(0.8), top, Inches(0.1), Inches(0.85), color)
        add_text(s, Inches(1.0), top + Inches(0.05), Inches(2.5), Inches(0.4),
                 name, font_size=14, bold=True, color=color)
        add_text(s, Inches(1.0), top + Inches(0.4), Inches(2.5), Inches(0.4),
                 status, font_size=10, color=COL_TEXT_GREY)
        add_text(s, Inches(3.6), top + Inches(0.1), Inches(2.9), Inches(0.7),
                 model, font_size=11, color=COL_TEXT, anchor=MSO_ANCHOR.MIDDLE)

    # 国内 6 款
    add_text(s, Inches(6.9), Inches(1.3), Inches(5.8), Inches(0.4),
             "🇨🇳 国内 6 款", font_size=16, bold=True, color=COL_ORANGE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    domestic = [
        ("订阅宝 / SubsTracker", "手动录入 + 提醒", "❌ 无自动识别"),
        ("Tellio / 钱迹 / 鲨鱼记账", "手动追踪 + 记账", "❌ 无取消功能"),
        ("微信支付 / 支付宝 / 云闪付", "3-4 级菜单官方入口", "❌ 跨渠道盲区"),
    ]
    for i, (name, status, model) in enumerate(domestic):
        top = Inches(1.8 + i * 1.0)
        add_rect(s, Inches(6.9), top, Inches(5.8), Inches(0.85), COL_BG, line_color=COL_ORANGE, line_width=1.5)
        add_rect_sharp(s, Inches(6.9), top, Inches(0.1), Inches(0.85), COL_ORANGE)
        add_text(s, Inches(7.1), top + Inches(0.05), Inches(3.2), Inches(0.4),
                 name, font_size=12, bold=True, color=COL_TEXT)
        add_text(s, Inches(7.1), top + Inches(0.4), Inches(3.2), Inches(0.4),
                 status, font_size=10, color=COL_TEXT_GREY)
        add_text(s, Inches(10.3), top + Inches(0.1), Inches(2.3), Inches(0.7),
                 model, font_size=11, color=COL_RED, bold=True, anchor=MSO_ANCHOR.MIDDLE)

    # 真空结论
    add_rect(s, Inches(0.8), Inches(5.0), Inches(11.9), Inches(1.6), COL_NAVY)
    add_text(s, Inches(1.0), Inches(5.1), Inches(11.5), Inches(0.4),
             "🎯 真空结论", font_size=16, bold=True, color=COL_GOLD)
    add_text(s, Inches(1.0), Inches(5.5), Inches(11.5), Inches(0.7),
             "跨平台识别 + 一键代取消 = 0 玩家",
             font_size=32, bold=True, color=COL_WHITE,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(1.0), Inches(6.25), Inches(11.5), Inches(0.4),
             "→ 全部 9 款竞品止步于「手动录入 + 提醒」— 这就是市场真空",
             font_size=13, color=COL_MINT)

    add_rect_sharp(s, Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4), COL_NAVY)
    add_text(s, Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4),
             "💡 借 Rocket Money 的双引擎模型 + Subby 的 AI 读邮件思路（平移到读短信）= 切入真空",
             font_size=15, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P9: SWOT
# ============================================================
def page_9_swot():
    s = add_blank_slide()
    add_page_header(s, 9, 14, "SWOT")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§4 SWOT 战略矩阵 + SO 战略选择",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 2x2 矩阵
    quads = [
        (Inches(0.8), Inches(1.6), "S 优势", "✓ 中国市场真空\n✓ 监管红利（消保条例）\n✓ 4 轨技术差异化\n✓ Rocket Money 模型可对标", COL_SUCCESS),
        (Inches(7.0), Inches(1.6), "O 机会", "✓ 5 亿免密支付用户\n✓ 中消协点名\n✓ 89% 用户低估订阅\n✓ Gen-Z 财务觉醒", COL_BLUE := RGBColor(0x3B, 0x82, 0xF6)),
        (Inches(0.8), Inches(4.5), "W 劣势", "✗ 无银行 API 通道\n✗ 谈判经验不足\n✗ 启动期用户少\n✗ 短信读取获客成本", COL_ORANGE),
        (Inches(7.0), Inches(4.5), "T 威胁", "✗ 微信/支付宝可能自做\n✗ 商家抵制 30% 分成\n✗ 数据合规风险\n✗ Trim 倒闭警示", COL_RED),
    ]
    for left, top, title, content, color in quads:
        add_rect(s, left, top, Inches(5.5), Inches(2.7), COL_BG, line_color=color, line_width=2)
        add_rect_sharp(s, left, top, Inches(5.5), Inches(0.5), color)
        add_text(s, left + Inches(0.2), top, Inches(5.0), Inches(0.5),
                 title, font_size=18, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, left + Inches(0.3), top + Inches(0.65), Inches(5.0), Inches(2.0),
                 content, font_size=13, color=COL_TEXT,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    # 中心战略
    add_rect_sharp(s, Inches(5.4), Inches(3.9), Inches(2.5), Inches(1.0), COL_NAVY)
    add_text(s, Inches(5.4), Inches(3.9), Inches(2.5), Inches(0.4),
             "SO 战略", font_size=14, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(5.4), Inches(4.3), Inches(2.5), Inches(0.6),
             "借监管红利起飞\n用 4 轨混合构筑护城河", font_size=11, bold=True, color=COL_WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    add_rect_sharp(s, Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3), COL_BG)
    add_text(s, Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3),
             "战略收口：2026 先发抢真空 + 2027 跨平台 + 2028 Agent 化",
             font_size=11, color=COL_TEXT_GREY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P10: 产品设计 - 3 模块 + 4 轨
# ============================================================
def page_10_product():
    s = add_blank_slide()
    add_page_header(s, 10, 14, "产品")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§5 产品设计：3 大模块 + 4 轨技术",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 上方 3 大模块
    modules = [
        ("🎯 追踪", "自动识别所有订阅", "30 天未用 / 涨价 / 即将扣费", COL_MINT),
        ("⏰ 提醒", "三重推送", "5 日 + 24 小时 + 实时", COL_ORANGE),
        ("🛑 取消", "一键代劳", "教程生成 + 真人谈判", COL_PURPLE),
    ]
    for i, (name, sub, detail, color) in enumerate(modules):
        left = Inches(0.8 + i * 4.1)
        add_rect(s, left, Inches(1.5), Inches(3.8), Inches(1.7), COL_BG, line_color=color, line_width=2)
        add_rect_sharp(s, left, Inches(1.5), Inches(3.8), Inches(0.5), color)
        add_text(s, left, Inches(1.5), Inches(3.8), Inches(0.5),
                 name, font_size=18, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, left + Inches(0.2), Inches(2.1), Inches(3.4), Inches(0.4),
                 sub, font_size=14, bold=True, color=COL_TEXT)
        add_text(s, left + Inches(0.2), Inches(2.5), Inches(3.4), Inches(0.6),
                 detail, font_size=12, color=COL_TEXT_GREY)

    # 下方 4 轨技术
    add_text(s, Inches(0.8), Inches(3.4), Inches(11.7), Inches(0.4),
             "🔧 4 轨混合技术方案（破局：欧美读 Gmail，中国读短信）",
             font_size=16, bold=True, color=COL_NAVY)

    tracks = [
        ("A", "短信解析", "60%", "📱 核心壁垒", "AI 读扣费短信", COL_MINT),
        ("B", "截屏 OCR", "30%", "📷 自动识别", "用户主动上传", COL_BLUE := RGBColor(0x3B, 0x82, 0xF6)),
        ("C", "手动录入", "10%", "⌨️ 兜底方案", "首次输入", COL_PURPLE),
        ("D", "商家爬虫", "2.0", "🕷️ 未来启用", "退订页 + 模拟登录", COL_TEXT_GREY),
    ]
    for i, (label, name, pct, icon, desc, color) in enumerate(tracks):
        left = Inches(0.8 + i * 3.05)
        # 标签
        add_rect(s, left, Inches(3.9), Inches(0.7), Inches(2.5), color)
        add_text(s, left, Inches(3.9), Inches(0.7), Inches(0.7),
                 label, font_size=36, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, left, Inches(4.6), Inches(0.7), Inches(0.5),
                 pct, font_size=12, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, left, Inches(5.0), Inches(0.7), Inches(1.3),
                 icon, font_size=24,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # 内容
        add_rect(s, left + Inches(0.7), Inches(3.9), Inches(2.3), Inches(2.5), COL_BG, line_color=COL_BORDER, line_width=0.75)
        add_text(s, left + Inches(0.85), Inches(4.05), Inches(2.1), Inches(0.5),
                 name, font_size=16, bold=True, color=COL_TEXT)
        add_text(s, left + Inches(0.85), Inches(4.55), Inches(2.1), Inches(1.7),
                 desc, font_size=12, color=COL_TEXT_GREY, anchor=MSO_ANCHOR.TOP)

    # 破局思路
    add_rect(s, Inches(0.8), Inches(6.6), Inches(11.7), Inches(0.7), COL_NAVY)
    add_text(s, Inches(0.8), Inches(6.6), Inches(11.7), Inches(0.7),
             "💡 破局思路：欧美是「读邮件」(Subby 路线)，中国是「读短信」— 海外产品入华必须重做的事",
             font_size=14, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P11: 原型 + 4 大创新
# ============================================================
def page_11_prototype():
    s = add_blank_slide()
    add_page_header(s, 11, 14, "原型")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§5 产品原型：3 张核心页 + 4 大创新点",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 3 张原型 mockup
    pages = [
        ("首页", "💰", "过去 12 个月你为\n遗忘付出 ¥684 元", "鎏金 Hero 钩子", COL_GOLD),
        ("追踪页", "📋", "腾讯视频 VIP\n¥25/月 · 黄底 30 天未用", "智能标记警示", COL_ORANGE),
        ("取消页", "🛑", "3 步取消腾讯 VIP\n截图 + 步骤教程", "一键生成教程", COL_MINT),
    ]
    for i, (name, icon, content, sub, color) in enumerate(pages):
        left = Inches(0.8 + i * 4.1)
        # iPhone mockup 框
        add_rect(s, left, Inches(1.6), Inches(3.8), Inches(2.6), COL_TEXT, line_color=color, line_width=1)
        # 内屏
        add_rect_sharp(s, left + Inches(0.15), Inches(1.75), Inches(3.5), Inches(2.3), COL_BG)
        # 状态栏
        add_text(s, left + Inches(0.15), Inches(1.78), Inches(3.5), Inches(0.3),
                 "9:41", font_size=10, color=COL_TEXT_GREY, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # icon
        add_text(s, left + Inches(0.15), Inches(2.1), Inches(3.5), Inches(0.7),
                 icon, font_size=40, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # 内容
        add_text(s, left + Inches(0.15), Inches(2.85), Inches(3.5), Inches(0.9),
                 content, font_size=14, bold=True, color=COL_TEXT,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # 标签
        add_rect(s, left + Inches(0.6), Inches(3.7), Inches(2.6), Inches(0.3), color)
        add_text(s, left + Inches(0.6), Inches(3.7), Inches(2.6), Inches(0.3),
                 sub, font_size=11, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # 名称
        add_text(s, left, Inches(4.3), Inches(3.8), Inches(0.4),
                 f"图 {i+2}：{name}", font_size=14, bold=True, color=COL_NAVY,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # 4 大创新点
    add_text(s, Inches(0.8), Inches(4.9), Inches(11.7), Inches(0.4),
             "🎨 4 大创新点", font_size=18, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)

    innovations = [
        ("AI 短信解析", "中国化 Subby", COL_MINT),
        ("震惊数字", "病毒式钩子", COL_GOLD),
        ("一键教程", "截屏 + 步骤", COL_ORANGE),
        ("谈判返佣", "合规改造", COL_PURPLE),
    ]
    for i, (name, sub, color) in enumerate(innovations):
        left = Inches(0.8 + i * 2.95)
        add_rect(s, left, Inches(5.4), Inches(2.8), Inches(1.0), color)
        add_text(s, left, Inches(5.5), Inches(2.8), Inches(0.5),
                 name, font_size=16, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, left, Inches(5.95), Inches(2.8), Inches(0.4),
                 sub, font_size=11, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    add_rect_sharp(s, Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4), COL_NAVY)
    add_text(s, Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4),
             "💡 核心创新：技术 + 文案 + UX + 商业 — 四位一体闭环",
             font_size=15, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P12: 商业模式
# ============================================================
def page_12_business():
    s = add_blank_slide()
    add_page_header(s, 12, 14, "商业")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§6 商业模式：三轨混合 + 算式",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 3 大收入来源
    incomes = [
        ("B2C Pro 订阅", "¥9.9 / 月", "10 万付费用户 × 9.9 × 12", "712.8 万", "60%", COL_MINT),
        ("B2B 谈判返佣", "30% 分成", "3 万次触发 × 25% 成功率 × ¥24", "216 万", "30%", COL_PURPLE),
        ("B2B2C 联盟佣金", "¥5 / 次", "18 万次推荐 × ¥5", "90 万", "10%", COL_ORANGE),
    ]
    for i, (name, unit, formula, total, pct, color) in enumerate(incomes):
        left = Inches(0.8 + i * 4.1)
        add_rect(s, left, Inches(1.5), Inches(3.8), Inches(2.6), COL_BG, line_color=color, line_width=2)
        add_rect_sharp(s, left, Inches(1.5), Inches(3.8), Inches(0.5), color)
        add_text(s, left, Inches(1.5), Inches(3.8), Inches(0.5),
                 name, font_size=16, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # unit
        add_text(s, left + Inches(0.2), Inches(2.15), Inches(3.4), Inches(0.4),
                 unit, font_size=14, color=COL_TEXT_GREY)
        # formula
        add_text(s, left + Inches(0.2), Inches(2.55), Inches(3.4), Inches(0.6),
                 "= " + formula, font_size=12, color=COL_TEXT)
        # total
        add_text(s, left + Inches(0.2), Inches(3.2), Inches(3.4), Inches(0.6),
                 "= ¥" + total, font_size=24, bold=True, color=color,
                 align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # pct
        add_text(s, left + Inches(0.2), Inches(3.85), Inches(3.4), Inches(0.3),
                 f"占年收入 {pct}", font_size=11, color=COL_TEXT_GREY)

    # 合计
    add_rect(s, Inches(0.8), Inches(4.4), Inches(11.9), Inches(1.6), COL_NAVY)
    add_text(s, Inches(1.0), Inches(4.5), Inches(11.5), Inches(0.4),
             "💰 合计预期年收入（第 1 年）", font_size=14, color=COL_MINT)
    add_text(s, Inches(1.0), Inches(4.9), Inches(11.5), Inches(0.8),
             "¥ 1,189 万", font_size=56, bold=True, color=COL_GOLD,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(1.0), Inches(5.7), Inches(11.5), Inches(0.3),
             "单付费用户年化贡献 ¥107.9   |   单 DAU 年化贡献 ¥36.0",
             font_size=11, color=COL_WHITE)

    # 风险控制
    add_text(s, Inches(0.8), Inches(6.1), Inches(11.7), Inches(0.4),
             "⚖️ 风险控制（合规边界）", font_size=14, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    risks = [
        ("✓ 不做支付", "仅追踪 + 提醒 + 教程"),
        ("✓ 不接管账户", "用户手动操作"),
        ("✓ 透明分成", "谈判前明示 30% 服务费"),
        ("✓ 录音存档", "应对《个人信息保护法》§13"),
    ]
    for i, (name, sub) in enumerate(risks):
        left = Inches(0.8 + i * 3.0)
        add_rect(s, left, Inches(6.5), Inches(2.8), Inches(0.7), COL_BG, line_color=COL_SUCCESS, line_width=1)
        add_text(s, left + Inches(0.15), Inches(6.55), Inches(2.6), Inches(0.3),
                 name, font_size=12, bold=True, color=COL_SUCCESS)
        add_text(s, left + Inches(0.15), Inches(6.85), Inches(2.6), Inches(0.3),
                 sub, font_size=10, color=COL_TEXT_GREY)


# ============================================================
# P13: 未来路线图
# ============================================================
def page_13_roadmap():
    s = add_blank_slide()
    add_page_header(s, 13, 14, "路线")
    add_text(s, Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.6),
             "§7 未来路线图：2026-2028 三年",
             font_size=32, bold=True, color=COL_NAVY,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
    add_rect_sharp(s, Inches(0.8), Inches(1.15), Inches(1.5), Inches(0.04), COL_GOLD)

    # 3 阶段卡片
    phases = [
        ("2026", "MVP 1.0", "验证产品价值", [
            "微信小程序 + iOS/Android",
            "AI 短信解析引擎 F1 ≥ 0.92",
            "100 商家取消教程入库",
            "目标：1 万付费用户",
        ], "1 万付费", COL_BLUE := RGBColor(0x3B, 0x82, 0xF6)),
        ("2027", "多银行 2.0", "跨平台聚合", [
            "云闪付合作 + 银行 App 试点",
            "涨价预警模型上线",
            "替代订阅联盟 100+ 商家",
            "目标：10 万付费用户",
        ], "10 万付费", COL_ORANGE),
        ("2028", "Agent 3.0", "自然语言代劳", [
            "自然语言 Agent 谈判",
            "多设备协同 + 家庭共享",
            "出海东南亚（新加坡等）",
            "目标：50 万付费用户",
        ], "50 万付费", COL_SUCCESS),
    ]
    for i, (year, name, sub, milestones, goal, color) in enumerate(phases):
        left = Inches(0.8 + i * 4.1)
        # 顶部年份
        add_rect_sharp(s, left, Inches(1.5), Inches(3.8), Inches(0.7), color)
        add_text(s, left, Inches(1.5), Inches(3.8), Inches(0.7),
                 year, font_size=28, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # 名称
        add_text(s, left, Inches(2.3), Inches(3.8), Inches(0.5),
                 name, font_size=20, bold=True, color=color,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, left, Inches(2.75), Inches(3.8), Inches(0.3),
                 sub, font_size=11, color=COL_TEXT_GREY,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        # 卡片
        add_rect(s, left, Inches(3.15), Inches(3.8), Inches(3.0), COL_BG, line_color=color, line_width=2)
        for j, m in enumerate(milestones):
            add_text(s, left + Inches(0.2), Inches(3.3 + j * 0.4), Inches(3.4), Inches(0.4),
                     f"✓ {m}", font_size=11, color=COL_TEXT,
                     align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.MIDDLE)
        # 目标徽章
        add_rect_sharp(s, left + Inches(0.5), Inches(5.4), Inches(2.8), Inches(0.5), color)
        add_text(s, left + Inches(0.5), Inches(5.4), Inches(2.8), Inches(0.5),
                 f"🎯 {goal}", font_size=14, bold=True, color=COL_WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # 时间线连接
    add_rect_sharp(s, Inches(0.8), Inches(6.4), Inches(11.9), Inches(0.04), COL_BORDER)
    for i in range(3):
        left = Inches(0.8 + i * 4.1)
        add_rect_sharp(s, left + Inches(1.9), Inches(6.35), Inches(0.15), Inches(0.15), COL_GOLD)

    # 长期愿景
    add_rect_sharp(s, Inches(0.8), Inches(6.6), Inches(11.7), Inches(0.7), COL_NAVY)
    add_text(s, Inches(0.8), Inches(6.6), Inches(11.7), Inches(0.4),
             "🌟 长期愿景", font_size=14, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.8), Inches(6.95), Inches(11.7), Inches(0.4),
             "基于行为金融视角的自动续费守护 → 全球华人订阅守护者",
             font_size=15, bold=True, color=COL_WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# P14: Q&A + 致谢
# ============================================================
def page_14_qa():
    s = add_blank_slide()
    # 深海蓝背景
    add_rect_sharp(s, Inches(0), Inches(0), SLIDE_W, SLIDE_H, COL_NAVY)
    add_rect_sharp(s, Inches(0), Inches(6.0), SLIDE_W, Inches(0.3), COL_GOLD)
    add_rect_sharp(s, Inches(0), Inches(6.3), SLIDE_W, Inches(0.1), COL_MINT)

    # 顶部小圆点
    for i in range(5):
        add_rect_sharp(s, Inches(0.5 + i * 0.3), Inches(0.5), Inches(0.15), Inches(0.15), COL_MINT)

    # 居中 Q & A
    add_text(s, Inches(0.8), Inches(1.5), Inches(11.7), Inches(1.5),
             "Q & A", font_size=96, bold=True, color=COL_GOLD,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    add_rect_sharp(s, Inches(5.4), Inches(3.0), Inches(2.5), Inches(0.04), COL_GOLD)

    # 愿景收束
    add_text(s, Inches(0.8), Inches(3.3), Inches(11.7), Inches(0.6),
             "5 亿用户的「被偷走的钱」，一笔笔找回来", font_size=24, bold=True, color=COL_WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.8), Inches(3.9), Inches(11.7), Inches(0.5),
             "—— 这是「醒账」的产品愿景，也是我对这个赛道的承诺",
             font_size=14, color=COL_MINT, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # 致谢
    add_text(s, Inches(0.8), Inches(5.0), Inches(11.7), Inches(0.6),
             "感谢各位老师聆听", font_size=28, bold=True, color=COL_WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(0.8), Inches(5.55), Inches(11.7), Inches(0.4),
             "Thanks for Listening", font_size=16, color=COL_MINT,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # 底部信息
    add_text(s, Inches(0.8), Inches(6.8), Inches(11.7), Inches(0.4),
             "文轩  |  深圳大学  |  金融科技应用前沿  |  2025-2026 学年",
             font_size=12, color=COL_WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============================================================
# 主流程
# ============================================================
if __name__ == "__main__":
    page_1_cover()
    page_2_toc()
    page_3_status()
    page_4_pain()
    page_5_market()
    page_6_user_pain()
    page_7_personas()
    page_8_competitors()
    page_9_swot()
    page_10_product()
    page_11_prototype()
    page_12_business()
    page_13_roadmap()
    page_14_qa()

    output_dir = Path(r"D:\path-to-wealth-freedom\内容\项目\2026-06-21-金融科技期末-平台自动续费追踪")
    output_dir.mkdir(parents=True, exist_ok=True)
    out = output_dir / "金融科技应用前沿-醒账-答辩PPT.pptx"
    prs.save(str(out))
    print(f"Done: {out}")
    print(f"Pages: {len(prs.slides)}")
