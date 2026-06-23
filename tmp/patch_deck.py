import re
import sys

fp = r'D:\path-to-wealth-freedom\opendesign\mockups\hidden-fee-hunter-deck\deck.html'
with open(fp, 'r', encoding='utf-8') as f:
    s = f.read()

# ============ 改动 1：删除 12 个 sidebar（slide-cover/agenda/qa 之外的 12 张 slide）========
# 用 re 找 section.slide（非 .full）里的 <aside class="sidebar">...</aside><div class="main">...</div>
# 模式：sidebar 块包含 brand + h5 + ul.obj-list + h5 + dim p，紧跟 <div class="main">
# 我们用更简单的：每个 section（非 full）里第一个 <aside> 到 <div class="main"> 之间的内容全删

# 找所有 <section class="slide"...>（不含 .full）块
def remove_sidebar(html):
    pattern = re.compile(
        r'(<section class="slide"[^>]*>)\s*<aside class="sidebar">.*?</aside>\s*(<div class="main">)',
        re.DOTALL
    )
    new_html, n = pattern.subn(r'\1\2', html)
    print(f'  removed {n} sidebar blocks')
    return new_html

s = remove_sidebar(s)

# ============ 改动 2：page 7（Persona）删原型图 =========
# 找 <figure class="figure-block mt-l"> ... home-hero.png ... </figure>
pattern7 = re.compile(
    r'<figure class="figure-block mt-l">\s*<img src="assets/home-hero\.png"[^>]*>\s*<figcaption>[^<]*</figcaption>\s*</figure>\s*',
    re.DOTALL
)
s_new, n7 = pattern7.subn('', s)
print(f'  removed home-hero figure: {n7}')
s = s_new

# ============ 改动 3：page 9 SWOT 重排：4 象限卡片 + 原图 =========
# 当前：4 个 concept-box grid + figure-block 下方
# 改为：左边 4 象限（grid g2 压缩）+ 右边原图（figure-block 浮动右边）
# 简单方案：把 figure-block 移到 main 内的最前面 + 加 float right
# 或：grid 改为 1 列（左 50%）+ figure 右 50%

old_swot = '''<div class="grid g2 mt-l">
        <div class="concept-box s"><span class="no">S</span><h4>内部优势</h4><span class="en">Strengths</span>
          <ul class="l">
            <li>中国市场真空：无 App 实现自动跨平台追踪 + 一键取消</li>
            <li>监管红利：消保条例（2024.7.1）+ 工信部 5 日提醒</li>
            <li>团队技术能力：AI 短信解析 + NLP + 行为金融理论</li>
            <li>海外验证模型：Rocket Money 7 年 $2.5B 已节省可对标</li>
          </ul>
        </div>
        <div class="concept-box w"><span class="no">W</span><h4>内部劣势</h4><span class="en">Weaknesses</span>
          <ul class="l">
            <li>无银行 API 通道：4 轨混合方案有妥协</li>
            <li>谈判经验不足：需 6-12 个月数据积累</li>
            <li>启动期用户少：双边冷启动</li>
            <li>短信读取权限获客成本高</li>
          </ul>
        </div>
        <div class="concept-box o"><span class="no">O</span><h4>外部机会</h4><span class="en">Opportunities</span>
          <ul class="l">
            <li>5 亿免密支付绑定用户基数</li>
            <li>中消协点名 + 投诉量年增 32.62%</li>
            <li>89% 用户低估订阅支出 2.5 倍</li>
            <li>Gen-Z 财务觉醒 + 知识付费意愿提升</li>
          </ul>
        </div>
        <div class="concept-box t"><span class="no">T</span><h4>外部威胁</h4><span class="en">Threats</span>
          <ul class="l">
            <li>微信 / 支付宝官方可能自做聚合入口</li>
            <li>商家可能抵制谈判分成（30%）</li>
            <li>数据合规风险 · 短信读取 + 谈判录音</li>
            <li>Trim 2024.11 倒闭警示纯追踪不可持续</li>
          </ul>
        </div>
      </div>

      <figure class="figure-block mt-l">
        <img src="assets/swot.png" alt="SWOT 战略矩阵">
        <figcaption>图 9.1 · SWOT 战略矩阵 · SO 战略 = 借监管红利 + 真空市场先发 2 年</figcaption>
      </figure>

      <div class="callout">
        <b>SO 战略.</b> 借监管红利起飞，用 4 轨混合技术构筑护城河——<strong>2026-2028 抢真空市场先发 2 年</strong>。
      </div>'''

new_swot = '''<div class="swot-layout mt-l">
        <div class="swot-grid">
          <div class="concept-box s"><span class="no">S</span><h4>内部优势</h4><span class="en">Strengths</span>
            <ul class="l">
              <li>中国市场真空：无 App 实现自动跨平台追踪 + 一键取消</li>
              <li>监管红利：消保条例（2024.7.1）+ 工信部 5 日提醒</li>
              <li>团队技术能力：AI 短信解析 + NLP + 行为金融理论</li>
              <li>海外验证：Rocket Money 7 年 $2.5B 已节省可对标</li>
            </ul>
          </div>
          <div class="concept-box w"><span class="no">W</span><h4>内部劣势</h4><span class="en">Weaknesses</span>
            <ul class="l">
              <li>无银行 API 通道：4 轨混合方案有妥协</li>
              <li>谈判经验不足：需 6-12 个月数据积累</li>
              <li>启动期用户少：双边冷启动</li>
              <li>短信读取权限获客成本高</li>
            </ul>
          </div>
          <div class="concept-box o"><span class="no">O</span><h4>外部机会</h4><span class="en">Opportunities</span>
            <ul class="l">
              <li>5 亿免密支付绑定用户基数</li>
              <li>中消协点名 + 投诉量年增 32.62%</li>
              <li>89% 用户低估订阅支出 2.5 倍</li>
              <li>Gen-Z 财务觉醒 + 知识付费意愿提升</li>
            </ul>
          </div>
          <div class="concept-box t"><span class="no">T</span><h4>外部威胁</h4><span class="en">Threats</span>
            <ul class="l">
              <li>微信 / 支付宝官方可能自做聚合入口</li>
              <li>商家可能抵制谈判分成（30%）</li>
              <li>数据合规风险 · 短信读取 + 谈判录音</li>
              <li>Trim 2024.11 倒闭警示纯追踪不可持续</li>
            </ul>
          </div>
        </div>
        <figure class="figure-block swot-fig">
          <img src="assets/swot.png" alt="SWOT 战略矩阵">
          <figcaption>图 9.1 · SWOT 战略矩阵 · SO 战略 = 借监管红利 + 真空市场先发 2 年</figcaption>
        </figure>
      </div>

      <div class="callout">
        <b>SO 战略.</b> 借监管红利起飞，用 4 轨混合技术构筑护城河——<strong>2026-2028 抢真空市场先发 2 年</strong>。
      </div>'''

if old_swot in s:
    s = s.replace(old_swot, new_swot)
    print('  SWOT 重排 OK')
else:
    print('  SWOT 旧块未找到，匹配失败')

# ============ 改动 4：page 11 原型页加第 3 张图（home-hero）=========
old_proto = '''      <div class="grid g2 mt-l">
        <figure class="figure-block">
          <img src="assets/track-page.png" alt="醒账追踪页">
          <figcaption>图 11.1 · 追踪页 · 黄/红双警示标签</figcaption>
        </figure>
        <figure class="figure-block">
          <img src="assets/cancel-guide.png" alt="3 步取消腾讯视频自动续费">
          <figcaption>图 11.2 · 取消页 · 4 步教程带截图</figcaption>
        </figure>
      </div>

      <p class="pill-academic mt-l">4 大创新点</p>'''

new_proto = '''<div class="grid g3 mt-l">
        <figure class="figure-block">
          <img src="assets/home-hero.png" alt="醒账首页 Hero">
          <figcaption>图 11.1 · 首页 Hero · ¥684 12 个月累计</figcaption>
        </figure>
        <figure class="figure-block">
          <img src="assets/track-page.png" alt="醒账追踪页">
          <figcaption>图 11.2 · 追踪页 · 黄/红双警示标签</figcaption>
        </figure>
        <figure class="figure-block">
          <img src="assets/cancel-guide.png" alt="3 步取消腾讯视频自动续费">
          <figcaption>图 11.3 · 取消页 · 4 步教程带截图</figcaption>
        </figure>
      </div>

      <p class="pill-academic mt-l">4 大创新点</p>'''

if old_proto in s:
    s = s.replace(old_proto, new_proto)
    print('  原型 3 张图 OK')
else:
    print('  原型旧块未找到')

with open(fp, 'w', encoding='utf-8') as f:
    f.write(s)
print('Saved')
