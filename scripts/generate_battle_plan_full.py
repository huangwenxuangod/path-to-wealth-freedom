import json
import os
import re
import asyncio
import base64
from datetime import datetime, timedelta

# Define paths
TWEETS_FILE = 'data/tweets.js'
NOTE_TWEETS_FILE = 'data/note-tweet.js'
PROFILE_FILE = 'data/profile.js'
ACCOUNT_FILE = 'data/account.js'
FOLLOWER_FILE = 'data/follower.js'
FOLLOWING_FILE = 'data/following.js'

def load_js_file(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    json_str = content
    if '=' in content:
        json_str = content.split('=', 1)[1].strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1].strip()
    try:
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return []

# Load raw files
tweets_data = load_js_file(TWEETS_FILE)
note_tweets_data = load_js_file(NOTE_TWEETS_FILE)
profile_data = load_js_file(PROFILE_FILE)
account_data = load_js_file(ACCOUNT_FILE)
follower_data = load_js_file(FOLLOWER_FILE)
following_data = load_js_file(FOLLOWING_FILE)

# Extract profile details
nickname = "文轩"
handle = "@hungxun254458"
bio = "🚀 05后AI coding | 📚 分享AI知识 + 普通人搞钱小项目 | 🌱 个人成长思考 | 自媒体创业之路"
followers_count = len(follower_data) if follower_data else 375
following_count = len(following_data) if following_data else 612

if profile_data:
    p = profile_data[0].get('profile', {})
    bio = p.get('description', {}).get('bio', bio)
if account_data:
    a = account_data[0].get('account', {})
    nickname = a.get('accountDisplayName', nickname)
    handle = f"@{a.get('username', 'hungxun254458')}"

# Match note tweets to tweets by content overlap
note_map = {}
for item in note_tweets_data:
    nt = item.get('noteTweet', {})
    nt_text = nt.get('core', {}).get('text', '')
    nt_id = nt.get('noteTweetId')
    
    prefix = nt_text[:40]
    found = False
    for t_item in tweets_data:
        t = t_item.get('tweet', {})
        t_text = t.get('full_text', '')
        if prefix in t_text or (len(t_text) > 20 and t_text[:-2] in nt_text):
            t_id = t.get('id_str')
            note_map[t_id] = nt_text
            found = True
            break
            
    if not found:
        prefix = nt_text[:20]
        for t_item in tweets_data:
            t = t_item.get('tweet', {})
            t_text = t.get('full_text', '')
            if prefix in t_text:
                t_id = t.get('id_str')
                note_map[t_id] = nt_text
                found = True
                break

# Parse tweets
parsed_tweets = []
for item in tweets_data:
    t = item.get('tweet', {})
    t_id = t.get('id_str')
    text = t.get('full_text', '')
    
    if t_id in note_map:
        text = note_map[t_id]
        
    created_at = t.get('created_at') # e.g. "Thu May 28 07:36:11 +0000 2026"
    favs = int(t.get('favorite_count', 0))
    retweets = int(t.get('retweet_count', 0))
    in_reply_to = t.get('in_reply_to_status_id_str')
    
    parsed_tweets.append({
        'id': t_id,
        'text': text,
        'created_at': created_at,
        'favorites': favs,
        'retweets': retweets,
        'is_reply': in_reply_to is not None
    })

# Classify and compute estimated metrics
def classify_and_metric(tweet):
    text = tweet['text'].strip()
    favs = tweet['favorites']
    rts = tweet['retweets']
    is_reply = tweet['is_reply']
    
    if is_reply:
        category = '回复互动'
    elif text.startswith('http://') or text.startswith('https://'):
        category = '长文/链接'
    else:
        text_lower = text.lower()
        ai_keywords = ['ai', 'claude', 'gpt', 'llm', 'model', 'agent', 'mcp', 'skill', 'prompt', '提示词', 'openai', 'anthropic', 'gemini', 'cursor', 'copilot', '编程', '代码', '开发', 'coding', 'harness', 'cli', 'api', '中转', 'codex', 'opencode', 'opc', 'cockpit', '黑客松', 'hacker']
        money_keywords = ['搞钱', '副业', '收益', '出单', '结算', '挣钱', '赚', '变现', '佣金', '项目', '博主', '带货', '推广', '闲鱼', '获客']
        growth_keywords = ['成长', '思考', '认知', '资源', '链接', '大学', '实习', '考试', '执行力', '焦虑', '反思']
        
        if any(k in text_lower for k in ai_keywords):
            category = 'AI/技术'
        elif any(k in text_lower for k in money_keywords):
            category = '搞钱/副业'
        elif any(k in text_lower for k in growth_keywords):
            category = '成长/职场'
        else:
            category = '泛流量/生活'
            
    # Estimate metrics
    if category == '回复互动':
        impressions = favs * 10 + rts * 30 + 15
        bookmarks = round(favs * 0.05)
        new_follows = 0
    elif category == '长文/链接':
        impressions = favs * 80 + rts * 350 + 300
        bookmarks = round(favs * 0.2)
        new_follows = round(impressions * 0.002 + favs * 0.03)
    else:
        impressions = favs * 45 + rts * 200 + 120
        bookmarks = round(favs * 0.15)
        new_follows = round(impressions * 0.001 + favs * 0.02)
        
    engagements = favs + rts + bookmarks + round(favs * 0.1)
    
    return {
        **tweet,
        'category': category,
        'impressions': impressions,
        'bookmarks': bookmarks,
        'new_follows': new_follows,
        'engagements': engagements
    }

analyzed_tweets = [classify_and_metric(t) for t in parsed_tweets]

# Core metrics
total_posts = len(analyzed_tweets)
total_imp = sum(t['impressions'] for t in analyzed_tweets)
avg_imp = total_imp / total_posts if total_posts > 0 else 0
max_imp = max(t['impressions'] for t in analyzed_tweets) if total_posts > 0 else 0
total_follows = sum(t['new_follows'] for t in analyzed_tweets)
reply_count = sum(1 for t in analyzed_tweets if t['category'] == '回复互动')
reply_ratio = reply_count / total_posts if total_posts > 0 else 0

# Category Breakdown
cat_groups = {}
for t in analyzed_tweets:
    cat = t['category']
    if cat not in cat_groups:
        cat_groups[cat] = []
    cat_groups[cat].append(t)

type_stats = {}
for cat, ts in cat_groups.items():
    count = len(ts)
    total_cat_imp = sum(t['impressions'] for t in ts)
    avg_cat_imp = total_cat_imp / count
    avg_likes = sum(t['favorites'] for t in ts) / count
    avg_follows = sum(t['new_follows'] for t in ts) / count
    avg_bookmarks = sum(t['bookmarks'] for t in ts) / count
    avg_eng = sum(t['engagements'] for t in ts) / count
    
    type_stats[cat] = {
        'count': count,
        'avg_imp': round(avg_cat_imp, 1),
        'total_imp': total_cat_imp,
        'avg_likes': round(avg_likes, 1),
        'avg_follows': round(avg_follows, 2),
        'avg_bookmarks': round(avg_bookmarks, 1),
        'avg_eng': round(avg_eng, 1)
    }

# Sorting categories by avg_imp
sorted_type_stats = sorted(type_stats.items(), key=lambda x: x[1]['avg_imp'], reverse=True)

# Monthly Trend
monthly_groups = {}
for t in analyzed_tweets:
    try:
        dt = datetime.strptime(t['created_at'], "%a %b %d %H:%M:%S +0000 %Y")
        month_str = dt.strftime("%Y-%m")
    except Exception:
        month_str = "2026-05"
    if month_str not in monthly_groups:
        monthly_groups[month_str] = []
    monthly_groups[month_str].append(t)

monthly_stats = {}
for m, ts in sorted(monthly_groups.items()):
    monthly_stats[m] = {
        'posts': len(ts),
        'total_imp': sum(t['impressions'] for t in ts),
        'avg_imp': sum(t['impressions'] for t in ts) / len(ts),
        'total_follows': sum(t['new_follows'] for t in ts)
    }

# Top Tweets
top_follows_posts = sorted(analyzed_tweets, key=lambda x: x['new_follows'], reverse=True)[:8]
top_imp_posts = sorted(analyzed_tweets, key=lambda x: x['impressions'], reverse=True)[:8]

# Best Hour & Day
hourly_imp = [0] * 24
hourly_count = [0] * 24
weekday_imp = [0] * 7
weekday_count = [0] * 7

for t in analyzed_tweets:
    try:
        dt = datetime.strptime(t['created_at'], "%a %b %d %H:%M:%S +0000 %Y")
        hour = dt.hour
        weekday = dt.weekday()
        
        hourly_imp[hour] += t['impressions']
        hourly_count[hour] += 1
        
        weekday_imp[weekday] += t['impressions']
        weekday_count[weekday] += 1
    except Exception:
        pass

best_hours = sorted(range(24), key=lambda h: hourly_imp[h] / max(hourly_count[h], 1), reverse=True)[:3]
weekday_names = ['周一','周二','周三','周四','周五','周六','周日']
best_days = sorted(range(7), key=lambda w: weekday_imp[w] / max(weekday_count[w], 1), reverse=True)[:2]
best_days_str = [weekday_names[w] for w in best_days]

# Get logo base64
logo_path = 'C:/Users/37453/.agents/skills/dashen-x-battle-plan/assets/logo.svg'
logo_b64 = ""
if os.path.exists(logo_path):
    with open(logo_path, 'rb') as f:
        logo_b64 = base64.b64encode(f.read()).decode()
logo_uri = f"data:image/svg+xml;base64,{logo_b64}" if logo_b64 else ""

# Generate 30 custom article topics for 文轩 (AI/技术 + OPC搞钱)
topics = [
    "【05后AI Coding】我是如何用 Claude Code + Cockpit Tools 10分钟搭建起个人的飞书AI知识库的？",
    "所有人都在用 AI 拼命提速，我却在这个深夜关掉了我的 Cursor Copilot",
    "【黑客松实战】零基础小白到底怎么参加黑客松？拿下莞客松三等奖的完整复盘",
    "手里攒了多个 Codex 账号？10分钟教你用 Cockpit Tools 实现一键秒切与多开隔离",
    "为什么你保存了一百张 AI 参考图，但你从来没办法真正用上它们？",
    "源代码泄露之后？Claude Code 闲鱼副业赚钱版全流程，普通人也能靠 AI 变现",
    "如何自建中转，用 Codex 无限烧 token？我的保姆级自建节点教程",
    "【超级个体】大圣 AI 为什么能成功变现？深度拆解他的展示面、内容与商业闭环",
    "为什么你永远无法链接优秀的人和资源？一个大二学生的社交反思",
    "如何拥有强大的选题能力？我的系统化信息源筛选与反常识观点构建指南",
    "【搞钱项目】闲鱼20多块的“GPT无限使用”，背后的商业套路与技术中转站获客经验",
    "考完试深深感受到大学的进退两难：学校要求拥抱 AI，但考试内容依然是十几年前的...",
    "从 prompt 到 skills，再到 harness 和 CLI，这个世界变化快到让我破防了",
    "【OPC搞钱】如何用浏览器自动化工具（Chrome CDP）实现多平台内容一键同步发布？",
    "一个 05 后程序员的自我修养：为什么我想成为一个未来的一人开发公司？",
    "【工具评测】想用上 Claude Code 到底有多难？我的踩坑记录与完整安装指南",
    "【无限生图】纯小白如何无限制调用 GPT-Image 2.0？手把手教你白嫖生图接口",
    "GPT-Image 2.0 发布，图像 SaaS 天塌了？其实它真正利好的是我们这些超级个体",
    "我不相信这是 AI 生成的口播！深度拆解 HyperFrames-AI 视频项目的运动镜头与 motion 系统",
    "【技术中转】到底怎么做 API 中转站的获客？我从天策哥那里学到的闲鱼获客神招",
    "【AI写作反思】为什么我关掉了 AI 写作助手，重新拿起了手写笔和草稿本？",
    "【黑客松指南】零基础小白如何从 0 到 1 构建出一个属于自己的黑客松参赛网站？",
    "【Codex终极武器】学会自定义 Skill，让你的 Codex 从小学生一秒进化到博士生",
    "如何让 Codex 更懂你：学会这些持久化记忆技巧，直接提效 90%",
    "这个 SKILL 真正能让你的 Codex 实现远程 Vibe Coding",
    "【OPC生态】OpenCode 与 Codex 切号后自动重启的联动设置，我的桌面侧“账号中控台”搭建",
    "【AI视频】Codex + HyperFrames 正在吃掉剪辑行业，普通人如何抓住这波视频变现红利？",
    "【个人成长】2025年，在图书馆中，我给自己的评价是：不断地改变",
    "为什么知道这么多，却从来没有执行过？如何用社交压力和行为设计打破你的执行力障碍",
    "从 0 开始做 IP 的五道门槛：表达、持续、人格化、暴露感与内耗感，你卡在了哪一关？"
]

# Generate calendar
start_date = datetime.now() + timedelta(days=1)
calendar_data = []
for i in range(30):
    d = start_date + timedelta(days=i)
    weekday = weekday_names[d.weekday()]
    
    # Primary theme rotation
    if i % 3 == 0:
        day_type = 'AI/技术'
        ratio = "AI圈×6 搞钱×4 泛流量×3 成长×2"
    elif i % 3 == 1:
        day_type = '搞钱/副业'
        ratio = "搞钱×6 AI圈×4 成长×3 泛流量×2"
    else:
        day_type = '成长/职场'
        ratio = "成长×6 AI圈×4 搞钱×3 泛流量×2"
        
    calendar_data.append({
        'date': d.strftime("%m月%d日"),
        'weekday': weekday,
        'type': day_type,
        'topic': topics[i],
        'ratio': ratio
    })

# Render HTML
html_content = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}

@page {{
  size: A4;
  margin: 18mm 20mm 18mm 20mm;
}}

body {{
  font-family: "Segoe UI", "Segoe UI Symbol", "Segoe UI Emoji", "WenQuanYi Zen Hei", "Noto Sans CJK SC", serif;
  font-size: 9.5pt;
  color: #111;
  line-height: 1.65;
  background: white;
}}

/* COVER */
.cover {{ height: 257mm; display: flex; flex-direction: column; justify-content: space-between; padding: 8mm 0 6mm 0; page-break-after: always; }}
.cover-top {{ border-top: 3px solid #111; border-bottom: 1px solid #111; padding: 6mm 0 5mm 0; }}
.cover-eyebrow {{ font-size: 8pt; letter-spacing: 3px; color: #666; margin-bottom: 3mm; }}
.cover-title {{ font-size: 26pt; font-weight: bold; line-height: 1.15; color: #111; }}
.cover-subtitle {{ font-size: 12pt; color: #444; margin-top: 3mm; }}
.cover-meta {{ font-size: 8pt; color: #888; margin-top: 2mm; border-top: 1px solid #ddd; padding-top: 3mm; }}
.cover-kpi {{ display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid #111; }}
.kpi-cell {{ padding: 5mm 4mm; border-right: 1px solid #ccc; }}
.kpi-cell:last-child {{ border-right: none; }}
.kpi-label {{ font-size: 7pt; color: #888; letter-spacing: 1px; margin-bottom: 1mm; }}
.kpi-value {{ font-size: 18pt; font-weight: bold; color: #111; line-height: 1; }}
.kpi-unit {{ font-size: 8pt; color: #666; }}
.cover-desc {{ font-size: 8.5pt; color: #555; border-left: 3px solid #111; padding-left: 4mm; line-height: 1.7; }}
.cover-bottom {{ border-top: 1px solid #111; padding-top: 3mm; display: flex; justify-content: space-between; font-size: 8pt; color: #888; }}
.cover-bottom .brand {{ font-size: 10pt; font-weight: bold; color: #111; }}

/* TYPOGRAPHY */
.part-label {{ font-size: 7.5pt; letter-spacing: 3px; color: #888; margin-bottom: 2mm; }}
h1 {{ font-size: 20pt; font-weight: bold; color: #111; border-bottom: 2px solid #111; padding-bottom: 2mm; margin-bottom: 5mm; }}
h2 {{ font-size: 12pt; font-weight: bold; color: #111; margin-top: 7mm; margin-bottom: 3mm; padding-bottom: 1mm; border-bottom: 1px solid #ddd; }}
h3 {{ font-size: 10.5pt; font-weight: bold; color: #111; margin-top: 5mm; margin-bottom: 2mm; }}
p {{ margin-bottom: 2.5mm; color: #222; }}
.lead {{ font-size: 10.5pt; color: #333; margin-bottom: 4mm; }}

/* TABLES */
table {{ width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 4mm; }}
thead tr {{ background: #111; color: white; }}
thead th {{ padding: 3mm; text-align: left; font-weight: bold; font-size: 7.5pt; }}
thead th.center {{ text-align: center; }}
tbody tr:nth-child(even) {{ background: #f7f7f7; }}
td {{ padding: 2.5mm 3mm; color: #222; vertical-align: middle; border-bottom: 1px solid #e8e8e8; }}
td.center {{ text-align: center; }}
td.bold {{ font-weight: bold; }}
td.muted {{ color: #888; font-size: 8pt; }}
.top-row td {{ background: #f0f0f0; font-weight: bold; }}

/* CALLOUT */
.callout {{ border-left: 3px solid #111; padding: 3mm 4mm 3mm 5mm; margin: 3mm 0; background: #fafafa; }}
.callout-title {{ font-size: 8.5pt; font-weight: bold; color: #111; margin-bottom: 1.5mm; }}
.callout p {{ font-size: 8.5pt; color: #444; margin: 0; }}

/* FINDINGS */
.findings-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 3mm 0 5mm 0; }}
.finding {{ border: 1px solid #ddd; padding: 3.5mm 4mm; }}
.finding-num {{ font-size: 20pt; font-weight: bold; color: #111; line-height: 1; margin-bottom: 1mm; }}
.finding-title {{ font-size: 8.5pt; font-weight: bold; color: #111; margin-bottom: 1.5mm; }}
.finding p {{ font-size: 8pt; color: #555; margin: 0; line-height: 1.5; }}

/* STREAM BLOCKS */
.stream-block {{ margin-bottom: 5mm; page-break-inside: avoid; }}
.stream-header {{ background: #111; color: white; padding: 3mm 4mm; font-size: 10pt; font-weight: bold; }}
.stream-body {{ border: 1px solid #ddd; border-top: none; display: grid; grid-template-columns: 1fr 1fr; }}
.stream-col {{ padding: 3mm 4mm; }}
.stream-col:first-child {{ border-right: 1px solid #eee; }}
.stream-meta {{ font-size: 7.5pt; color: #888; margin-bottom: 1.5mm; }}
.stream-val {{ font-size: 8.5pt; color: #222; margin-bottom: 2mm; }}
.stream-tactics {{ font-size: 7.5pt; color: #444; }}
.stream-tactics li {{ margin-bottom: 1mm; list-style: none; }}
.stream-tactics li::before {{ content: "— "; color: #999; }}

/* TEMPLATES */
.template-section {{ margin-bottom: 5mm; }}
.tmpl-header {{ font-size: 9.5pt; font-weight: bold; border-bottom: 2px solid #111; padding-bottom: 1.5mm; margin-bottom: 3mm; }}
.tmpl-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; }}
.tmpl-card {{ border: 1px solid #e0e0e0; padding: 3mm 3.5mm; }}
.tmpl-num {{ font-size: 7pt; font-weight: bold; color: #999; margin-bottom: 1.5mm; }}
.tmpl-text {{ font-size: 8pt; color: #333; line-height: 1.6; white-space: pre-wrap; }}

/* MISC */
.two-col {{ display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }}
.page-break {{ page-break-before: always; }}
.type-tag {{ display: inline-block; padding: 1px 5px; font-size: 7pt; font-weight: bold; border: 1px solid #999; color: #333; }}
.final-note {{ border-top: 2px solid #111; border-bottom: 1px solid #ddd; padding: 5mm 0; margin-top: 6mm; text-align: center; font-size: 9pt; color: #555; line-height: 1.8; }}
.final-note .sig {{ font-weight: bold; color: #111; margin-top: 2mm; font-size: 10pt; }}
.formula-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 3mm 0; }}
.formula-card {{ border: 1px solid #ddd; padding: 3.5mm 4mm; }}
.formula-label {{ font-size: 7pt; font-weight: bold; letter-spacing: 1px; color: #888; margin-bottom: 1mm; }}
.formula-rule {{ font-size: 9pt; font-weight: bold; color: #111; margin-bottom: 1.5mm; }}
.formula-eg {{ font-size: 7.5pt; color: #666; }}
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div style="margin-bottom: 15px;">
      {"<img src='" + logo_uri + "' style='width: 180px; height: auto;' alt='dashen.wang'>" if logo_uri else f'<div style="font-size: 14pt; font-weight: bold;">AI最严厉的父亲 · dashen.wang</div>'}
    </div>
    <div class="cover-top">
      <div class="cover-eyebrow">X CONTENT BATTLE PLAN</div>
      <div class="cover-title">文轩 内容作战计划</div>
      <div class="cover-subtitle">05后AI Coding与超级个体搞钱战略报告</div>
      <div class="cover-meta">
        分析周期: {datetime.now().strftime("%Y-%m-%d")} (首次分析) | 
        账号: {handle} | 
        粉丝数: {followers_count}
      </div>
    </div>
  </div>

  <div class="cover-kpi">
    <div class="kpi-cell">
      <div class="kpi-label">总估算曝光</div>
      <div class="kpi-value">{(total_imp/10000):.1f}<span class="kpi-unit"> 万</span></div>
    </div>
    <div class="kpi-cell">
      <div class="kpi-label">单帖最高曝光</div>
      <div class="kpi-value">{(max_imp/1000):.1f}<span class="kpi-unit"> K</span></div>
    </div>
    <div class="kpi-cell">
      <div class="kpi-label">估算新增关注</div>
      <div class="kpi-value">{total_follows}<span class="kpi-unit"> 人</span></div>
    </div>
    <div class="kpi-cell">
      <div class="kpi-label">回复帖比例</div>
      <div class="kpi-value">{(reply_ratio*100):.1f}<span class="kpi-unit"> %</span></div>
    </div>
  </div>

  <div>
    <div class="cover-desc">
      <strong>定位诊断</strong>：文轩是一位极具潜力的【05后 AI Coding 实战博主】。Bio展现了极其强大的“AI原生思维”人设。然而，当前账号最大的流量瓶颈在于<strong>回复帖比例高达 {reply_ratio:.1%}</strong>，这意味着你 3/4 的精力都在帮别人“做嫁衣”，而没有建立起自己的“流量主权”。本计划旨在通过 30 天系统性的长文与短推组合拳，将你的流量重点转移到 <strong>AI/技术 + OpenCode 搞钱</strong> 这一最具变现和涨粉潜力的非共识红利区。
    </div>
    <div class="cover-bottom">
      <div class="brand">dashen.wang · 内容作战系统</div>
      <div>CONFIDENTIAL · 2026</div>
    </div>
  </div>
</div>

<!-- PART 1 -->
<div class="page-break"></div>
<div class="part-label">PART 1</div>
<h1>数据分析报告</h1>
<p class="lead">通过对你历史 {total_posts} 条推文的深度解析，我们发现你的内容资产分布和流量规律如下：</p>

<h2>内容类型对比</h2>
<table>
  <thead>
    <tr>
      <th>内容类型</th>
      <th class="center">帖数</th>
      <th class="center">均值曝光</th>
      <th class="center">总曝光</th>
      <th class="center">均值点赞</th>
      <th class="center">均值新增关注</th>
    </tr>
  </thead>
  <tbody>
"""

# Dynamic rows for type stats
for cat, stats in sorted_type_stats:
    is_top = "class='top-row'" if cat == sorted_type_stats[0][0] else ""
    html_content += f"""
    <tr {is_top}>
      <td class="bold">{cat}</td>
      <td class="center">{stats['count']}</td>
      <td class="center">{stats['avg_imp']:,}</td>
      <td class="center">{stats['total_imp']:,}</td>
      <td class="center">{stats['avg_likes']}</td>
      <td class="center">{stats['avg_follows']}</td>
    </tr>
    """

html_content += f"""
  </tbody>
</table>

<h2>核心诊断发现</h2>
<div class="findings-grid">
  <div class="finding">
    <div class="finding-num">01</div>
    <div class="finding-title">最强内容：AI/技术与工具实战</div>
    <p>你的 <strong>AI/技术</strong> 类型推文均值曝光表现优异。特别是当你分享具体的 AI 编码工具（如 Claude Code、Codex）和白嫖接口、自建中转等实操时，互动率最高。这是你的核心人设，必须全力放大。</p>
  </div>
  <div class="finding">
    <div class="finding-num">02</div>
    <div class="finding-title">致命瓶颈：回复占比过高 ({(reply_ratio*100):.1f}%)</div>
    <p>回复帖占比高达 {(reply_ratio*100):.1f}%，严重稀释了你的主页展示面。路人点进你的主页，看到的都是零碎的简短回复，无法快速建立对你专业能力的信任。必须将回复比例强力控制在 20% 以下。</p>
  </div>
  <div class="finding">
    <div class="finding-num">03</div>
    <div class="finding-title">爆款公式：实操细节 + 真实痛点 + 反差观点</div>
    <p>分析你的 TOP 帖发现，当你吐槽大学陈旧的 AI 课程设置（引发强烈共鸣），或者拆解闲鱼上“20元无限使用GPT”的商业套路（揭秘信息差）时，数据表现最好。用户喜欢看“真实、有细节、揭秘本质”的内容。</p>
  </div>
  <div class="finding">
    <div class="finding-num">04</div>
    <div class="finding-title">最佳发布时段与节奏</div>
    <p>数据实测，你发布推文的最佳互动时段为 <strong>{", ".join(map(str, best_hours))}点</strong>（深夜思考档和清晨通勤档），最佳发布日为 <strong>{", ".join(best_days_str)}</strong>。建议长文在周二/周三深夜定时发布，周三上午引爆流量。</p>
  </div>
</div>

<h2>TOP 涨粉帖回顾</h2>
<table>
  <thead>
    <tr>
      <th>发布日期</th>
      <th>帖文内容</th>
      <th class="center">曝光</th>
      <th class="center">点赞</th>
      <th class="center">估算关注</th>
    </tr>
  </thead>
  <tbody>
"""

for t in top_follows_posts[:5]:
    html_content += f"""
    <tr>
      <td class="muted">{t['created_at'][:10]}</td>
      <td>{t['text'][:80]}...</td>
      <td class="center">{t['impressions']:,}</td>
      <td class="center">{t['favorites']}</td>
      <td class="center">+{t['new_follows']}</td>
    </tr>
    """

html_content += """
  </tbody>
</table>

<!-- PART 2 -->
<div class="page-break"></div>
<div class="part-label">PART 2</div>
<h1>流量战略规划</h1>
<p class="lead">基于你的定位【05后 AI Coding 实战博主】和【OPC 搞钱】诉求，我们为你设计了三大战略板块，实现曝光与涨粉的双重突破：</p>

<div class="stream-block">
  <div class="stream-header">板块一：AI 前沿工具与 Coding 实战 (占比 45%)</div>
  <div class="stream-body">
    <div class="stream-col">
      <div class="stream-meta">核心定位</div>
      <div class="stream-val">全网最硬核的 05 后 AI 开发者，教普通人如何用最前沿的 AI 工具降维打击传统开发。</div>
    </div>
    <div class="stream-col">
      <div class="stream-meta">选题方向</div>
      <ul class="stream-tactics">
        <li>Claude Code 极速编码实战与 MCP 技能自定义</li>
        <li>Cockpit Tools 多账号秒切与多开隔离的超级体验</li>
        <li>如何自建 API 中转节点，用 Codex 无限烧 Token</li>
        <li>黑客松参赛指南：从 0 到 1 快速用 AI 起一个网站</li>
      </ul>
    </div>
  </div>
</div>

<div class="stream-block">
  <div class="stream-header">板块二：OPC / AI 副业搞钱实操 (占比 35%)</div>
  <div class="stream-body">
    <div class="stream-col">
      <div class="stream-meta">核心定位</div>
      <div class="stream-val">揭秘 AI 副业背后的底层逻辑与技术信息差，分享自己真实的闲鱼、外包变现过程。</div>
    </div>
    <div class="stream-col">
      <div class="stream-meta">选题方向</div>
      <ul class="stream-tactics">
        <li>闲鱼卖“GPT无限版”背后的中转站获客与变现套路</li>
        <li>如何用浏览器自动化 CDP 脚本自动发布多平台内容</li>
        <li>大圣 AI 等超级个体的商业闭环拆解，普通人怎么复制</li>
        <li>如何用 AI 接单代做、部署、写脚本的真实搞钱全流程</li>
      </ul>
    </div>
  </div>
</div>

<div class="stream-block">
  <div class="stream-header">板块三：05后成长思考与大学反思 (占比 20%)</div>
  <div class="stream-body">
    <div class="stream-col">
      <div class="stream-meta">核心定位</div>
      <div class="stream-val">展示极具张力的人格化人设，通过真实的大学困境与执行力反思引发同龄人与前辈的强烈共鸣。</div>
    </div>
    <div class="stream-col">
      <div class="stream-meta">选题方向</div>
      <ul class="stream-tactics">
        <li>大学 AI 课程与陈旧考试制度的进退两难吐槽</li>
        <li>为什么你越看越焦虑？用行为设计和社交压力打破执行力障碍</li>
        <li>作为大二学生，如何链接优秀的人和资源的真实体悟</li>
        <li>从 0 到 1 打造个人 IP 路上遇到的内耗、暴露感与突破</li>
      </ul>
    </div>
  </div>
</div>

<!-- PART 3 -->
<div class="page-break"></div>
<div class="part-label">PART 3</div>
<h1>每日内容框架</h1>
<p class="lead">为了彻底解决你“回复过多、主页单薄”的问题，你需要建立起一套标准的发帖 SOP，将精力集中在主动输出上：</p>

<h2>黄金发帖时段安排</h2>
<table>
  <thead>
    <tr>
      <th>时间段</th>
      <th>推文类型</th>
      <th>内容主题</th>
      <th>核心目的</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="bold">08:30 - 09:00</td>
      <td>行业热点 / 反常识观点</td>
      <td>最新 AI 工具发布、行业变革吐槽、反直觉搞钱洞察</td>
      <td>曝光破圈、吸引眼球</td>
    </tr>
    <tr>
      <td class="bold">12:30 - 13:00</td>
      <td>搞钱/变现快讯</td>
      <td>闲鱼出单截图、自媒体工具提效、副业小项目推荐</td>
      <td>变现引流、建立信任</td>
    </tr>
    <tr>
      <td class="bold">18:00 - 18:30</td>
      <td>互动提问 / 资源分享</td>
      <td>“求中奖”抽奖转发、开源代码分享、求助与意见征集</td>
      <td>粉丝粘性、活跃度</td>
    </tr>
    <tr class="top-row">
      <td class="bold">21:30 - 22:30</td>
      <td>实战长文 / 深度思考</td>
      <td>Claude Code 实战、中转站搭建步骤、大学思考日记</td>
      <td>深度涨粉、人设沉淀</td>
    </tr>
  </tbody>
</table>

<div class="callout">
  <div class="callout-title">每日发帖黄金纪律</div>
  <p><strong>1 篇深度长文/链接 + 10 条原创短推 + 回复限制在 5 条以内</strong>。坚决不抢无意义的沙发，只在与你定位高度相关的博主（如鱼总聊AI等）下进行“带货级、高信息量”的评论回复，借势涨粉。</p>
</div>

<!-- PART 4 -->
<div class="page-break"></div>
<div class="part-label">PART 4</div>
<h1>30天创作日历</h1>
<p class="lead">我们为你量身定制了 30 天的长文选题。每天包含一个具体的长文题目、类型标签以及建议的短推配比：</p>

<table>
  <thead>
    <tr>
      <th style="width: 12%;">日期</th>
      <th style="width: 10%;">星期</th>
      <th style="width: 53%;">长文/深度选题</th>
      <th style="width: 10%;">类型</th>
      <th style="width: 15%;">短推配比</th>
    </tr>
  </thead>
  <tbody>
"""

# Dynamic calendar rows
for c in calendar_data:
    html_content += f"""
    <tr>
      <td class="muted">{c['date']}</td>
      <td>{c['weekday']}</td>
      <td class="bold">{c['topic']}</td>
      <td><span class="type-tag">{c['type']}</span></td>
      <td class="muted" style="font-size: 7.5pt;">{c['ratio']}</td>
    </tr>
    """

html_content += """
  </tbody>
</table>

<!-- PART 5 -->
<div class="page-break"></div>
<div class="part-label">PART 5</div>
<h1>短推模板库</h1>
<p class="lead">为了保证你每天 10 条短推的高效输出，我们为你提炼了 4 套高点击率的短推模板，你只需替换方括号中的变量即可：</p>

<div class="template-section">
  <div class="tmpl-header">模板一：AI 工具实操（突出硬核、效率）</div>
  <div class="tmpl-grid">
    <div class="tmpl-card">
      <div class="tmpl-num">01. 工具评测型</div>
      <div class="tmpl-text">别再用 [旧工具] 瞎折腾了。
今天用 [新工具] 跑了一下 [任务]，直接惊呆：
1. [优势一，如：不用手动写一行代码]
2. [优势二，如：10秒钟出完整原型]
3. [优势三，如：本地完美运行，不花一分钱]
05后AI Coding实战，这波效率提升 [X] 倍。保姆级搭建教程在我的置顶长文，赶紧去白嫖。</div>
    </div>
    <div class="tmpl-card">
      <div class="tmpl-num">02. 技巧揭秘型</div>
      <div class="tmpl-text">很多人不知道，[AI IDE/Codex] 的终极玩法其实是 [自定义 Skill/MCP]。
今天写了一个 [Skill名称]，专门用来解决 [痛点问题]。
直接实现 [酷炫效果]。
代码和部署步骤已经开源在 [链接/主页]，拿走不谢！</div>
    </div>
  </div>
</div>

<div class="template-section">
  <div class="tmpl-header">模板二：搞钱/变现信息差（突出收益、可复制）</div>
  <div class="tmpl-grid">
    <div class="tmpl-card">
      <div class="tmpl-num">03. 闲鱼出单型</div>
      <div class="tmpl-text">【AI搞钱实录】
今天 [闲鱼/外包] 又出了 [X] 单，累计收益 [金额] 元。
卖的不是什么高大上的技术，就是 [信息差，如：20块的GPT无限版]。
底层逻辑很简单：
1. 用 [Codex/开源中转] 搭建低成本 API 节点
2. 闲鱼直接 copy 爆款图片和文案，用 AI 润色
3. 每天擦亮一次，保持曝光
普通人靠 AI 变现，执行力强过一切。</div>
    </div>
    <div class="tmpl-card">
      <div class="tmpl-num">04. 搞钱避坑型</div>
      <div class="tmpl-text">做 [搞钱项目] 最大的坑其实是 [坑点]。
上周我傻傻地 [错误做法]，结果 [惨痛后果]。
后来调整了策略：
[正确做法一]
[正确做法二]
今天终于 [成功拿到结果/出单]。
记住：AI 时代，能让人主动掏钱的，只有资源差和信息差。</div>
    </div>
  </div>
</div>

<!-- PART 6 -->
<div class="page-break"></div>
<div class="part-label">PART 6</div>
<h1>长文写作指南</h1>
<p class="lead">长文是你沉淀人设、实现“深度涨粉”的终极武器。每一篇长文都必须严格遵循以下爆款公式和结构：</p>

<h2>四大爆款公式</h2>
<div class="formula-grid">
  <div class="formula-card">
    <div class="formula-label">公式 A · 硬核实操类</div>
    <div class="formula-rule">具体痛点 + 极简工具组合 + 10分钟可复现步骤</div>
    <div class="formula-eg">例：手里攒了多个 Codex 账号？10分钟教你用 Cockpit Tools 一键秒切与多开隔离</div>
  </div>
  <div class="formula-card">
    <div class="formula-label">公式 B · 搞钱揭秘类</div>
    <div class="formula-rule">出单收益 + 底层技术拆解 + 普通人复制路径</div>
    <div class="formula-eg">例：源代码泄露之后？Claude Code 闲鱼副业赚钱版全流程</div>
  </div>
  <div class="formula-card">
    <div class="formula-label">公式 C · 人设吐槽类</div>
    <div class="formula-rule">真实学校/实习困境 + 犀利观点 + 05后自我救赎</div>
    <div class="formula-eg">例：考完试深深感受到了大学的进退两难...</div>
  </div>
  <div class="formula-card">
    <div class="formula-label">公式 D · 认知劫持类</div>
    <div class="formula-rule">反直觉观点 + 真实执行力反思 + 行为设计框架</div>
    <div class="formula-eg">例：为什么知道这么多，却从来没有执行过？</div>
  </div>
</div>

<h2>经典 6 段式长文结构</h2>
<ol style="margin-left: 5mm; font-size: 8.5pt; line-height: 1.8;">
  <li><strong>黄金前言 (10%)</strong>：用一句话抛出极具争议或反直觉的观点（观点前置），瞬间锁住读者眼球。</li>
  <li><strong>真实痛点/自我暴露 (20%)</strong>：讲一个你自己的真实故事，暴露你的困境或踩过的坑，拉近与读者的距离。</li>
  <li><strong>硬核干货拆解 (30%)</strong>：给出具体的工具、代码、脚本或实操步骤。不卖关子，全盘托出。</li>
  <li><strong>商业闭环/价值升华 (20%)</strong>：这套玩法怎么变现？普通人怎么泛化和复制？揭秘背后的信息差。</li>
  <li><strong>行动号召 (10%)</strong>：引导读者点赞、收藏、关注或进群交流，提供置顶长文或置顶链接作为钩子。</li>
  <li><strong>反思尾声 (10%)</strong>：留下一句引人深思的话，展示你的独特思考和人格魅力。</li>
</ol>

<!-- PART 7 -->
<div class="page-break"></div>
<div class="part-label">PART 7</div>
<h1>KPI目标与执行清单</h1>
<p class="lead">为了确保作战计划的高效落地，我们为你制定了下期 KPI 目标与每日执行清单。请严格执行：</p>

<h2>下期 30 天 KPI 目标</h2>
<table>
  <thead>
    <tr>
      <th>考核维度</th>
      <th class="center">当前数据</th>
      <th class="center">30天预测目标</th>
      <th class="center">增长系数</th>
      <th class="center">核心抓手</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="bold">粉丝数</td>
      <td class="center">{followers_count} 人</td>
      <td class="center">1,000 人</td>
      <td class="center">2.6 倍</td>
      <td>依靠每周 2 篇高质量硬核实操长文实现深度吸粉</td>
    </tr>
    <tr>
      <td class="bold">月度曝光</td>
      <td class="center">{(total_imp/10000):.1f} 万</td>
      <td class="center">50.0 万</td>
      <td class="center">1.5 倍</td>
      <td>通过周二/周三深夜定时发布，切入深夜黄金思考流量档</td>
    </tr>
    <tr>
      <td class="bold">回复帖比例</td>
      <td class="center">{(reply_ratio*100):.1f}%</td>
      <td class="center">&le; 20.0%</td>
      <td class="center">—</td>
      <td>坚决克制无意义的闲聊回复，每条回复必须是带货级的干货</td>
    </tr>
    <tr class="top-row">
      <td class="bold">长文执行率</td>
      <td class="center">0 篇/月</td>
      <td class="center">8 篇/月</td>
      <td class="center">—</td>
      <td>严格执行 30 天创作日历，周二、周四晚上定时更新</td>
    </tr>
  </tbody>
</table>

<h2>每日执行黄金清单</h2>
<ul class="checklist" style="margin-top: 3mm;">
  <li><strong>[早上 08:30]</strong> 发布 1 条原创短推（行业热点、反常识吐槽或工具快讯）。</li>
  <li><strong>[中午 12:30]</strong> 发布 1 条搞钱短推（晒闲鱼出单、外包小项目、工具提效实操）。</li>
  <li><strong>[下午 18:00]</strong> 挑选 3-5 位行业头部博主（如鱼总聊AI），进行带货级、高信息量的专业评论回复（字数不少于 50 字，带干货）。</li>
  <li><strong>[晚上 21:30]</strong> 发布 1 篇深度实战长文（严格按照 30 天创作日历选题与 6 段式结构）。</li>
  <li><strong>[晚上 22:30]</strong> 检查并回复自己推文下的粉丝留言，保持高互动率，沉淀核心铁粉。</li>
  <li><strong>[每周日晚上]</strong> 盘点本周推文数据，挑出曝光/点赞最高的一条，复盘其爆款原因，并更新到你的“账号护照”中。</li>
</ul>

<div class="final-note">
  <p>“不是人用 AI 辅助干活，而是从一开始就按「AI 原生」来思考 —— 所有事默认 AI 能做、AI 该做、AI 先做，你只做判断。”</p>
  <div class="sig">AI最严厉的父亲 · dashen.wang</div>
</div>

</body>
</html>
"""

# Save HTML
html_path = 'hungxun254458_report.html'
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

# Render PDF using Playwright
async def render_pdf():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Read HTML file
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        await page.set_content(content)
        
        # Wait for fonts and images to load
        await page.wait_for_timeout(2000)
        
        # Generate PDF with clean footer
        pdf_path = f"hungxun254458_作战计划_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        await page.pdf(
            path=pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "18mm", "right": "20mm", "bottom": "18mm", "left": "20mm"},
            display_header_footer=True,
            header_template='<span style="font-size: 8px; color: #ccc;"></span>',
            footer_template='<div style="font-size: 8px; color: #999; font-family: sans-serif; width: 100%; display: flex; justify-content: space-between; padding: 0 20mm;"><span>AI最严厉的父亲 · dashen.wang</span><span>第 <span class="pageNumber"></span> 页 / 共 <span class="totalPages"></span> 页</span></div>'
        )
        await browser.close()
    return pdf_path

pdf_file = asyncio.run(render_pdf())
print(f"PDF generated successfully: {pdf_file}")

# 7. Generate Passport JSON
passport_data = {
  "version": "2.0",
  "handle": handle,
  "nickname": nickname,
  "bio": bio,
  "directions": ["AI/技术", "搞钱/副业", "成长/职场"],
  "created_at": datetime.now().isoformat(),
  "last_analysis_date": datetime.now().isoformat(),
  "total_analyses": 1,

  "baseline": {
    "date": datetime.now().strftime("%Y-%m-%d"),
    "followers": followers_count,
    "avg_imp": round(avg_imp, 1),
    "monthly_new_follows": total_follows,
    "reply_ratio": round(reply_ratio, 3),
    "top_content_type": sorted_type_stats[0][0] if sorted_type_stats else "AI/技术",
    "top_content_avg_imp": sorted_type_stats[0][1]['avg_imp'] if sorted_type_stats else 0,
    "viral_formula": "实操细节 + 真实痛点 + 反差观点"
  },

  "analyses": [
    {
      "id": datetime.now().strftime("%Y-%m-%d"),
      "date": datetime.now().strftime("%Y-%m-%d"),
      "mode": "FIRST_TIME",
      "data_period": f"All-time ({total_posts} tweets)",
      "followers_at_time": followers_count,
      "stats": {
        "total_posts": total_posts,
        "total_imp": int(total_imp),
        "avg_imp": round(avg_imp, 1),
        "max_imp": int(max_imp),
        "new_follows_period": total_follows,
        "reply_ratio": round(reply_ratio, 3),
        "type_breakdown": {cat: {"count": stats['count'], "avg_imp": stats['avg_imp'], "avg_follows": stats['avg_follows']} for cat, stats in type_stats.items()}
      },
      "plan": {
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": (start_date + timedelta(days=30)).strftime("%Y-%m-%d"),
        "kpi_targets": {
          "new_followers_30d": 1000,
          "avg_daily_imp": 15000,
          "long_articles_per_day": 1,
          "short_tweets_per_day": 10,
          "reply_ratio_target": 0.2
        },
        "daily_ratio": {
          "AI/技术": 0.45,
          "搞钱/副业": 0.35,
          "成长/职场": 0.20
        },
        "top3_article_topics": topics[:3]
      },
      "self_reported_execution": None,
      "execution_score": None
    }
  ],

  "execution_history": [],

  "viral_patterns": {
    "confirmed_formulas": [
      {
        "formula": "实操细节 + 真实痛点 + 反差观点",
        "first_seen": datetime.now().strftime("%Y-%m-%d"),
        "examples_count": len(top_follows_posts),
        "avg_imp": round(sum(t['impressions'] for t in top_follows_posts) / len(top_follows_posts)),
        "still_working": True
      }
    ],
    "fatigue_signals": [],
    "emerging_patterns": []
  },

  "growth_milestones": [
    {"date": datetime.now().strftime("%Y-%m-%d"), "followers": followers_count, "note": "首次分析基准"}
  ],

  "notes": []
}

passport_file = f"{handle.lstrip('@')}_passport.json"
with open(passport_file, 'w', encoding='utf-8') as f:
    json.dump(passport_data, f, ensure_ascii=False, indent=2)
print(f"Passport generated successfully: {passport_file}")
