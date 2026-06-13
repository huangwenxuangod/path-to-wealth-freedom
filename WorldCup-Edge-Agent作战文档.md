# WorldCup Edge Agent · 完整作战文档（v2.0 · Playbook 中心版）

> **Bitget AI Base Camp Hackathon S1 · 赛道一 · 交易 Agent**
> 文档版本：v2.0 · 2026/6/13 · 作者：AI 协作生成
> 适用窗口：2026/6/13 - 6/30（10 天开发 + 5 天评审）
> 配套项目：`worldcup-edge-agent/`
>
> **v2.0 重大变更**（vs v1.0）：Bitget Playbook 成为项目核心，polymarket-paper-trader 降级为可选加分项。

---

## 📑 目录

- [0. 文档元信息](#0-文档元信息)
- [1. 项目背景与定位](#1-项目背景与定位)
- [2. 技术栈推荐（Playbook 中心版）](#2-技术栈推荐playbook-中心版)
- [3. 核心策略设计](#3-核心策略设计)
- [4. 10 天倒计时执行计划](#4-10-天倒计时执行计划)
- [5. 代码骨架（精简到 100 行）](#5-代码骨架精简到-100-行)
- [6. 项目说明 200 字草稿（3 个版本）](#6-项目说明-200-字草稿3-个版本)
- [7. 风险提示与兜底方案](#7-风险提示与兜底方案)
- [8. 即刻行动清单](#8-即刻行动清单)
- [附录 A：参考资料](#附录-a参考资料)
- [附录 B：常用命令速查](#附录-b常用命令速查)

---

## 0. 文档元信息

| 字段 | 值 |
|---|---|
| 项目名 | **WorldCup Edge Agent** |
| 比赛 | Bitget AI Base Camp Hackathon S1 |
| 赛道 | 🟦 赛道一 — 交易 Agent |
| 报名截止 | 2026/6/14 24:00（UTC+8）|
| 提交截止 | 2026/6/25 24:00（UTC+8）|
| 颁奖 | 2026/6/30 |
| 文档版本 | **v2.0 · Playbook 中心版** |
| 项目类型 | 单刷 |
| 目标奖项 | 二等奖 1,500 USDT（兜底）+ 社区奖 500 + 参与奖 50 = **2,050 USDT** |
| 冲奖目标 | 一等奖 6,600 USDT（30% 概率） |
| 技术核心 | **Bitget Playbook（自然语言生成策略）+ Polymarket 信号 + Agent Hub 部署** |
| 资金风险 | **零**（Playbook 模拟盘 + Polymarket 端可选 paper trading） |
| 代码量目标 | < 100 行 Python（核心策略由 Playbook 自然语言生成） |

---

## 1. 项目背景与定位

### 1.1 比赛核心信息（基于 2026/6/13 抓取的官方文档）

- **总奖金池**：50,000 USDT
- **奖项结构**：
  - 一等奖 1 名 × 6,600 USDT（全赛道共评）
  - 二等奖 3 名 × 1,500 USDT（每赛道 1 名）
  - 三等奖 3 名 × 800 USDT
  - 最佳社区传播奖 3 名 × 500 USDT
  - 优秀参与奖 +50 USDT / 队
- **基础门槛**（所有赛道）：Demo 真实可运行 / 解决真实问题 / 有可核查使用记录
- **赛道一评审标准**：策略闭环是否完整（感知→决策→执行→风控）；是否经过回测或模拟验证
- **重要提示**：**"不要求真实资金，模拟交易和回测记录同样有效"**

### 1.2 项目定位（一句话）

> **用 Bitget Playbook 自然语言生成 + Polymarket 信号驱动的世界杯事件套利 Agent** —— 我用自然语言告诉 Playbook 我的套利策略，AI 自动生成可执行代码、基于真实历史数据回测、自动输出 PnL/最大回撤/夏普三个指标、一键部署到 Bitget 模拟盘，Polymarket 端 100+ 场世界杯赛事赔率作为外部事件信号源。

### 1.3 解决的真实问题（评审要听的"真实痛点"）

> 散户买世界杯彩票/预测市场只能看一家平台（一般是 Polymarket），**不知道市场已经严重错价**。Edge Agent 用 LLM 读新闻 + 赔率，给"事件真实概率"一个 AI 估计值，当估计值 vs 市场价格偏离 > 10% 时，自动在 Bitget 合约市场做对冲。这是一个**真实存在、每天都在发生、普通人靠人工根本盯不过来**的痛点。

### 1.4 为什么这个项目能赢（对应评审标准逐项）

| 评审标准 | 我的项目如何满足 |
|---|---|
| 策略闭环完整（感知→决策→执行→风控） | ✅ 4 步齐全，每步都有对应模块 |
| 回测或模拟验证 | ✅ Playbook 自动输出 PnL/回撤/夏普 |
| Demo 真实可运行 | ✅ Playbook 一键部署到 Bitget 模拟盘 |
| 解决真实问题 | ✅ 散户赔率错价是真问题，4 年一次世界杯流量 |
| **用了 Bitget AI 模块** | ✅ **全套**：Playbook（核心）+ Agent Hub 58 API + 5 个 Skill |
| 跨市场套利 | ✅ Polymarket ↔ Bitget 合约 |
| 零资金风险 | ✅ Playbook 模拟盘 + polymarket-paper-trader（可选）|

### 1.5 项目差异化（v2.0 强化的核心故事）

**v1.0 的故事**："我们做了一个 AI 套利 Agent"
**v2.0 的故事**："我们**用 Bitget Playbook 的自然语言能力**做了一个**零代码**的世界杯套利 Agent，**整个策略生成到部署完全在 Bitget 工具链内完成**"

**评审为什么会选 v2.0**：
- ✅ **官方工具深度采用** = "支持 Bitget AI 战略"
- ✅ **自然语言生成** = "AI 原生思维"的极致体现
- ✅ **自动输出指标** = "可验证使用记录"现成
- ✅ **零代码主策略** = 故事性强（10 天单刷 + AI 实战家 + 几乎不写代码）

---

## 2. 技术栈推荐（Playbook 中心版）

### 2.1 一句话总结

> **Bitget Playbook（核心）+ Polymarket Gamma API（信号源）+ Bitget Agent Hub MCP（部署 + 5 个 Skill）+ Claude API（信号决策）+ polymarket-paper-trader（可选加分）= 零代码主策略、官方工具链完整、评审最高认可度。**

### 2.2 完整依赖清单（精简版）

| 依赖 | 版本 | 用途 | 是否必装 | 优先级 |
|---|---|---|---|---|
| **Node.js** | 18+ | Playbook 工具链运行环境 | ✅ 必装 | P0 |
| **@bitget-ai/getagent-skill** | 最新 | **Bitget Playbook 官方技能**（核心）| ✅ 必装 | P0 |
| **npx bitget-hub** | 最新 | Bitget Agent Hub 一键安装 | ✅ 必装 | P0 |
| **Claude Code** | 最新 | AI Coding Agent 调度 | ✅ 必装 | P0 |
| **Bitget Playbook API Key** | - | Playbook 子账户凭证 | ✅ 必装 | P0 |
| **Bitget API Key** | - | 主账户 Read + Trade 权限 | ✅ 必装 | P0 |
| Python | 3.11+ | 信号采集 + 可选 paper trading | ⭕ 部分场景必装 | P1 |
| anthropic | 最新 | Claude API（信号 LLM 决策）| ⭕ 推荐 | P1 |
| requests | 2.31+ | 拉 Polymarket Gamma API | ⭕ 推荐 | P1 |
| polymarket-paper-trader | 0.1.6+ | **可选**：Polymarket 端 paper trading | ⭕ 加分项 | P2 |
| ccxt | 4.4+ | 备选：Bitget 模拟盘 | ⭕ 加分项 | P2 |
| gradio | 4.0+ | 可选 Web Demo 界面 | ⭕ 加分项 | P3 |
| matplotlib | 3.7+ | PnL 曲线图 | ⭕ 加分项 | P3 |

### 2.3 关键决策依据

#### 决策 1：**核心工具 — Bitget Playbook（不是 polymarket-paper-trader）**

**为什么 Playbook 应该是核心**：

| 维度 | Playbook（官方）| polymarket-paper-trader（第三方）|
|---|---|---|
| **官方背书** | ✅ Bitget 官方产品 | ❌ 第三方（agent-next 开源）|
| **策略生成** | ✅ **自然语言 → AI 自动生成** | ❌ 自己写 Python |
| **回测指标** | ✅ **自动输出 PnL/回撤/夏普** | ⚠️ 有但要自己接 |
| **部署** | ✅ **一键部署到模拟盘** | ❌ 自己接 Bitget API |
| **代码量** | ✅ **零代码主策略** | ❌ 350+ 行 Python |
| **评审加分** | ✅ **"用了 Bitget 完整工具链"** | ⚠️ "用了第三方 paper trading" |
| **AI 原生程度** | ✅ **极致**（自然语言 → 策略 → 回测 → 部署）| ⚠️ 中等（要写代码）|

**结论**：**用 Playbook 做核心**，polymarket-paper-trader 降级为**可选加分项**（用于在 Polymarket 端也模拟成交）。

#### 决策 2：数据流 — Polymarket 作为**信号源**（不是独立执行端）

v1.0 思维：Polymarket 自己下注 + Bitget 对冲
v2.0 思维：**Polymarket 赔率作为外部信号** → 喂给 Playbook → Playbook 在 Bitget 模拟盘执行合约对冲

这样架构更清晰：
```
[Polymarket Gamma API] 
    ↓ 实时赔率
[Claude LLM] 
    ↓ 评估"真实概率" + 计算 Edge
[Bitget Playbook]
    ↓ 自然语言策略：发现 Edge > 10% 时下单
[Bitget 模拟盘]
    ↓ 自动执行合约对冲
[回测] → PnL/最大回撤/夏普
```

#### 决策 3：AI Agent 编排 — 不用框架

Playbook 本身就是"自然语言 → 策略"的 AI 编排层。
信号采集层用 Python 简单脚本即可（< 50 行）。
**不需要 LangGraph / smolagents / CrewAI**。

#### 决策 4：数据库 — SQLite 起步

和 v1.0 一样，100-1000 笔/天 SQLite 够用。

### 2.4 反面教材（不要做）

| ❌ 不要 | ✅ 应该 | 原因 |
|---|---|---|
| 自己写策略代码当主策略 | **用 Playbook 自然语言生成** | 评审看"用了 Bitget Playbook"加分 |
| 用第三方 paper trading 当核心 | 用 Playbook 一键部署 | 官方产品优先 |
| 不用 Playbook 自带的回测 | 用 Playbook 自动输出指标 | 少写 200 行回测代码 |
| 把 polymarket 当独立执行端 | 把 Polymarket 当信号源 | 架构更清晰 |
| 装 5 个 Skill 全用 | 选 1-2 个核心 Skill | 评审看"用得精"不是"用得多" |
| 写 LangGraph 状态机 | 写 Python 简单循环 | Playbook 自己就是状态机 |

---

## 3. 核心策略设计

### 3.1 策略闭环（4 步）

```
┌─────────────────────────────────────────────────────────────┐
│  [感知层]                                                      │
│  - Polymarket Gamma API：100+ 场世界杯赛事赔率（外部信号）     │
│  - Bitget Playbook 接入的 Bitget 行情数据                      │
│  - sentiment-analyst / news-briefing Skill（可选）            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  [决策层]                                                      │
│  - LLM 推理：事件真实概率 vs Polymarket 市场赔率              │
│  - Playbook 自然语言策略：                                     │
│    "当 Polymarket 显示的 YES 概率 vs LLM 评估偏离 > 10%，     │
│     且 Bitget 合约对应市场流动性 > $100k，                    │
│     在 Bitget 模拟盘用 5% 资金做反向对冲"                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  [执行层]                                                      │
│  - Bitget Playbook 一键部署到模拟盘                           │
│  - （可选）polymarket-paper-trader 在 Polymarket 端模拟       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  [风控层]                                                      │
│  - Playbook 内置风控参数：单笔 5% 仓位、总回撤 8% 暂停         │
│  - 自然语言描述："事件开始前 2h 强制平仓，LLM 置信度 < 60% 观望"│
└─────────────────────────────────────────────────────────────┘
                            ↓
[回测] → Playbook 自动输出 PnL/最大回撤/夏普
```

### 3.2 Playbook 自然语言策略示例

**核心策略（直接喂给 Playbook 的 prompt）**：

```text
策略名称：WorldCup-Edge-Polymarket-Hedge

策略核心：
实时监控 Polymarket 上所有 2026 世界杯赛事的赔率。当某个赛事的
YES 赔率 vs 我的 LLM 评估（基于最近 1h 新闻 + 比赛信息）偏离 > 10%
时，在 Bitget 模拟盘做合约对冲。

执行规则：
1. 每次只用 5% 模拟资金建仓
2. 单日最大交易次数：10 次
3. 事件开始前 2 小时强制平仓
4. 总回撤 > 8% 暂停 24 小时
5. LLM 评估置信度 < 60% 观望

预期表现：
- 月化收益目标：3-8%
- 最大回撤容忍：8%
- 夏普比率目标：> 1.0
```

**这是你唯一需要写的"策略代码"**。Playbook 把它变成可执行策略 + 回测 + 部署。

### 3.3 4 种套利策略对比（保留 v1.0 思路）

| 策略 | 胜率 | 月化收益 | 延迟要求 | 10 天可做？ | 推荐度 |
|---|---|---|---|---|---|
| 自动化做市 | 78-85% | 1-3% | 秒级 | ★★☆ | 低 |
| AI 概率套利 | 65-75% | 3-8% | 分钟级 | ★★★ | 中（**v2.0 主推**）|
| **逻辑套利** | **70-80%** | **2-5%** | **秒级** | **★ 强烈推荐** | **高（v2.0 副推）** |
| 高频动量 | 60-70% | 8-15% | <100ms | 不可能 | 不可做 |

**v2.0 推荐组合**：
- **主策略（60% 仓位）**：AI 概率套利（用 LLM 评估真实概率）
- **副策略（40% 仓位）**：逻辑套利（互斥事件偏离检测）
- 两者都通过 Playbook 部署，**主策略由 Playbook 自然语言生成，副策略作为补充规则**

### 3.4 真实下注 vs Paper Trading（保持 v1.0 决策）

**关键发现**：
- ✅ Bitget Playbook **本身就是模拟盘部署**（不用 ccxt 切换 sandbox）
- ✅ Polymarket 端可选 `polymarket-paper-trader` 做 paper trading
- ✅ **双端零风险，完美契合 Bitget 黑客松"模拟/回测即可"**

### 3.5 Playbook 核心能力（来自比赛官方文档）

根据 https://bitget-ai.gitbook.io/hackathon/untitled 第四章明确描述：

> "Bitget Playbook 是 AI 驱动的量化策略平台。用自然语言描述交易想法，AI 生成可执行策略，基于真实历史数据回测，查看 PnL、最大回撤、夏普比率等指标，一键部署上线自动执行。"

**安装命令**（官方原文）：
```bash
npm i @bitget-ai/getagent-skill
```

**使用 prompt**（官方原文）：
```text
1. 用 https://www.npmjs.com/package/@bitget-ai/getagent-skill 安装 getagent
2. 使用 getagent 创建一个关于 [你的策略想法] 的策略 playbook，
   并上传、回测、发布
3. 回测成功后把指标列个表格给我看看
```

**我们的策略描述（直接套用）**：
```text
playbook 策略哲思：
自适应市场行情，趋势时跟踪，震荡时均值回归，不明确时空仓
+ 当 Polymarket 显示的 YES 概率 vs LLM 评估偏离 > 10% 时
+ 在 Bitget 模拟盘做反向合约对冲
+ 单笔 5% 仓位，总回撤 8% 暂停
```

---

## 4. 10 天倒计时执行计划（Playbook 中心版）

### 4.1 Day 0（今天 6/13 + 明天 6/14）—— 报名 + 装 Playbook

**今天 6/13 22:00 前必须完成（4 件事）**：

| 时间 | 任务 | 命令/操作 |
|---|---|---|
| 22:00-22:15 | 报名 | https://www.bitget.com/zh-CN/activity-hub/hackathon |
| 22:15-22:25 | 加官方 Telegram 群 | 领 2,000 MuleRun Credits + 抢 Token 补贴 |
| 22:25-22:50 | 创建 Bitget API Key + Playbook API Key | 见 5.2 |
| 22:50-23:30 | **装 Playbook + 跑通第一个策略** | 见 5.3 |

**今晚 23:30 的成功标准**：
- ✅ Playbook 安装成功
- ✅ 跑通官方示例 prompt 创建一个简单策略
- ✅ 看到回测的 PnL/回撤/夏普 3 个数字
- ✅ **这是你项目说明的核心截图素材**

**明天 6/14**：

| 时间 | 任务 | 产出 |
|---|---|---|
| 09:00-10:00 | 拉取 Polymarket 世界杯市场数据 | `wc_markets.json` 30+ 条 |
| 10:00-12:00 | 用 Playbook 生成 3 个策略变体 | 3 个 playbook 上传 + 回测 |
| 14:00-16:00 | 对比 3 个策略的回测指标 | 选出 PnL/回撤/夏普最优的 |
| 16:00-18:00 | 接入 1-2 个 Bitget Skill | sentiment / news 信号增强 |
| 20:00-22:00 | 优化策略参数 + 重新回测 | 优化版回测指标 |
| 22:00-23:00 | **跑通 polymarket-paper-trader（可选加分）** | $10,000 模拟资金连通 |

### 4.2 Day 1-2（6/15-16）—— 提交窗口开启 + 信号接入

- [ ] Playbook 策略 v1.0 正式提交
- [ ] LLM 信号层（Claude 评估真实概率）接入 Playbook
- [ ] polymarket-paper-trader 端 paper trading 跑通
- [ ] 第一次完整闭环：Polymarket 赔率 → Claude 评估 → Playbook 决策 → 模拟盘

### 4.3 Day 3-5（6/17-19）—— 核心迭代

- [ ] 策略 v2.0：加入逻辑套利模块
- [ ] 策略 v3.0：多策略组合（60% AI + 40% 逻辑）
- [ ] 历史数据回测（2024 欧洲杯 / 2022 卡塔尔世界杯）
- [ ] 优化参数：仓位大小、Edge 阈值、止损点

### 4.4 Day 6-7（6/20-21）—— 模拟盘跑起来

- [ ] Playbook 一键部署到 Bitget 模拟盘
- [ ] 跑 48-72h 模拟盘
- [ ] 记录真实模拟盘交易日志
- [ ] 接入 Bitget Agent Hub MCP（如未接入）

### 4.5 Day 8-9（6/22-23）—— Demo 打磨

- [ ] **重写项目说明 200 字**（按 CLAUDE.md 爆款选题 SOP）
- [ ] 录 3 分钟视频演示（重点演示 Playbook 自然语言生成过程）
- [ ] 准备回测曲线、模拟盘日志、Playbook 截图 3 张图
- [ ] 可选：Gradio Web UI 一键 Demo

### 4.6 Day 10（6/24）—— 传播

- [ ] 写"我用 Bitget Playbook 自然语言生成做出了世界杯套利 Agent"内容
- [ ] 发 X / 小红书 / 即刻，带 #BitgetHackathon + @Bitget AI
- [ ] **强调 3 个关键点**：用了 Playbook、零代码、官方工具链

### 4.7 Day 11（6/25）—— 提交

- [ ] 6/25 24:00 前提交
- [ ] 提交清单：
  - **Demo 链接**（公网可访问，重点展示 Playbook 回测结果）
  - **项目说明**（200 字）
  - **Playbook 截图**（自然语言策略 + 回测指标）
  - **模拟盘交易记录**截图
  - **传播帖链接**
  - 视频（选填，不超过 3 分钟）

---

## 5. 代码骨架（精简到 100 行）

### 5.1 项目目录结构（精简版）

```
worldcup-edge-agent/
├── .env                          # API 密钥（gitignore）
├── .gitignore
├── README.md
├── playbook_strategy.md          # ⭐ 核心：自然语言策略描述
│
├── src/
│   ├── config.py                 # 加载 .env
│   ├── polymarket_signal.py      # 拉 Polymarket 数据 + Claude 评估
│   ├── playbook_client.py        # Playbook API 封装
│   └── agent.py                  # 主循环
│
├── scripts/
│   ├── fetch_wc.py               # 拉世界杯市场
│   ├── ai_signal.py              # LLM 信号
│   ├── create_playbook.py        # 创建 Playbook
│   └── report.py                 # 生成报告
│
├── data/
│   ├── wc_markets.json
│   ├── ai_signals.json
│   └── pnl_chart.png
│
└── docs/
    ├── day1_report.md
    └── final_report.md
```

**代码量对比**：
- v1.0：~350 行 Python
- v2.0：~100 行 Python（**减少 70%**，因为主策略由 Playbook 自然语言生成）

### 5.2 Step 0：环境初始化（精简版）

```bash
# 项目目录
mkdir worldcup-edge-agent && cd worldcup-edge-agent

# 装 Bitget 工具链（核心）
npm install -g @bitget-ai/getagent-skill
npx bitget-hub upgrade-all --target claude

# 创建 .env
cat > .env << 'EOF'
BITGET_API_KEY=把你的_key_粘这里
BITGET_SECRET_KEY=把你的_secret_粘这里
BITGET_PASSPHRASE=把你的_passphrase_粘这里
PLAYBOOK_API_KEY=把你的_playbook_key_粘这里
ANTHROPIC_API_KEY=把你的_claude_key_粘这里
EOF

# .gitignore
echo ".env" > .gitignore
echo "node_modules/" >> .gitignore
```

### 5.3 Step 1：拉世界杯市场（`scripts/fetch_wc.py`）

```python
"""Step 1: 拉取世界杯市场作为 Playbook 外部信号"""
import requests
import json

print("🔍 正在拉取 Polymarket 世界杯市场...")

r = requests.get(
    "https://gamma-api.polymarket.com/markets",
    params={"closed": "false", "limit": 500, 
            "order": "liquidity", "ascending": "false"},
    timeout=30
)
all_markets = r.json()

# 筛选世界杯
wc_markets = []
for m in all_markets:
    text = (m.get("question", "") + m.get("description", "")).lower()
    if "world cup" in text or "fifa" in text:
        wc_markets.append({
            "id": m.get("id"),
            "question": m.get("question"),
            "yes_price": m.get("yes_price"),
            "no_price": m.get("no_price"),
            "liquidity": m.get("liquidity"),
        })

with open("data/wc_markets.json", "w", encoding="utf-8") as f:
    json.dump(wc_markets, f, ensure_ascii=False, indent=2)

print(f"✅ 找到 {len(wc_markets)} 个世界杯市场")
for m in wc_markets[:5]:
    print(f"  {m['question'][:60]} @ {m['yes_price']}")
```

### 5.4 Step 2：LLM 信号生成（`scripts/ai_signal.py`）

```python
"""Step 2: 用 Claude 评估真实概率（喂给 Playbook 的信号）"""
import json, os, re
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

with open("data/wc_markets.json", encoding="utf-8") as f:
    markets = json.load(f)

signals = []
for m in markets[:10]:  # 取 10 个市场做评估
    prompt = f"""评估这个世界杯事件的真实概率。
市场：{m['question']}
当前 YES 赔率：{m['yes_price']}
流动性：${m['liquidity']}

只输出 0.00-1.00 之间的数字，保留 2 位小数。"""
    
    try:
        msg = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=20,
            messages=[{"role": "user", "content": prompt}]
        )
        text = msg.content[0].text.strip()
        match = re.search(r"0\.\d+", text)
        p_true = float(match.group()) if match else None
    except:
        p_true = None
    
    if p_true is not None and m['yes_price']:
        edge = p_true - float(m['yes_price'])
        signals.append({
            "question": m['question'],
            "market_yes": m['yes_price'],
            "llm_yes": p_true,
            "edge": round(edge, 3),
            "action": "BUY_YES" if edge > 0.10 else "BUY_NO" if edge < -0.10 else "HOLD"
        })

with open("data/ai_signals.json", "w", encoding="utf-8") as f:
    json.dump(signals, f, ensure_ascii=False, indent=2)

print(f"✅ 生成 {len(signals)} 个 LLM 信号")
for s in signals[:5]:
    print(f"  {s['question'][:50]}: Edge={s['edge']:+.2f} → {s['action']}")
```

### 5.5 Step 3：创建 Playbook（核心：`scripts/create_playbook.py`）

```python
"""Step 3: 用 getagent 创建 Playbook 策略（核心）"""
import subprocess

# 官方推荐的 prompt（直接用我们准备好的自然语言策略）
playbook_prompt = """
playbook 策略哲思：
自适应市场行情 + 事件驱动对冲。当 Polymarket 世界杯赛事显示的
YES 概率 vs LLM 评估偏离 > 10% 时，在 Bitget 模拟盘做反向
合约对冲。

playbook key: ${PLAYBOOK_API_KEY}

1. 用 @bitget-ai/getagent-skill 安装 getagent
2. 创建一个关于"WorldCup Edge Polymarket Hedge"的策略 playbook
3. 策略：实时监控 Polymarket 世界杯赛事赔率，Edge > 10% 时建仓
4. 单笔 5% 仓位，总回撤 8% 暂停，事件前 2h 强制平仓
5. 上传、回测、发布
6. 回测成功后把 PnL/最大回撤/夏普指标列个表格给我看看
"""

# 调用 getagent（直接用 npm 命令）
result = subprocess.run(
    ["npx", "@bitget-ai/getagent-skill", "create", 
     "--strategy", "WorldCup Edge Polymarket Hedge",
     "--key", os.getenv("PLAYBOOK_API_KEY")],
    capture_output=True, text=True
)
print(result.stdout)
if result.returncode != 0:
    print(f"❌ 错误: {result.stderr}")
```

**或者用 Claude Code 直接驱动**（更优雅）：

打开 Claude Code，输入：
```text
请用 @bitget-ai/getagent-skill 帮我创建一个 Playbook 策略：

playbook 策略哲思：
自适应市场行情 + 事件驱动对冲。当 Polymarket 世界杯赛事显示的
YES 概率 vs LLM 评估偏离 > 10% 时，在 Bitget 模拟盘做反向
合约对冲。

playbook key: <粘贴你的 PLAYBOOK_API_KEY>

1. 安装 getagent
2. 创建一个名为"WorldCup Edge Polymarket Hedge"的策略
3. 单笔 5% 仓位，总回撤 8% 暂停，事件前 2h 强制平仓
4. 上传、回测、发布到 Bitget 模拟盘
5. 把回测的 PnL/最大回撤/夏普指标列个表格给我
```

### 5.6 Step 4：完整主循环（`src/agent.py`，约 30 行）

```python
"""v2.0 完整闭环：Polymarket 信号 → Claude 评估 → Playbook 决策 → 模拟盘"""
import schedule
import time
from polymarket_signal import fetch_signals
from ai_signal import evaluate_with_claude
from playbook_client import submit_to_playbook

def run_cycle():
    """每 15 分钟跑一轮"""
    # 1. 感知：拉 Polymarket 世界杯市场
    markets = fetch_signals()
    print(f"[感知] 找到 {len(markets)} 个世界杯市场")
    
    # 2. 决策：LLM 评估真实概率
    signals = evaluate_with_claude(markets)
    strong_signals = [s for s in signals if abs(s['edge']) > 0.10]
    print(f"[决策] {len(strong_signals)} 个强信号")
    
    # 3. 执行：喂给 Playbook（Playbook 自己处理执行）
    for s in strong_signals:
        submit_to_playbook(s)
        print(f"[执行] {s['action']} {s['question'][:40]}")
    
    # 4. 风控：Playbook 自带
    # 5. 回测：Playbook 自动输出指标

# 每 15 分钟跑一次
schedule.every(15).minutes.do(run_cycle)

if __name__ == "__main__":
    run_cycle()  # 先跑一次
    while True:
        schedule.run_pending()
        time.sleep(60)
```

### 5.7 完整运行顺序

```bash
# 1. 拉市场
python scripts/fetch_wc.py

# 2. AI 信号
python scripts/ai_signal.py

# 3. ⭐ 创建 Playbook（核心）
claude  # 在 Claude Code 里输入上面的 prompt

# 4. 跑主循环
python src/agent.py
```

---

## 6. 项目说明 200 字草稿（3 个版本）

### 6.1 草稿 A（按 CLAUDE.md 爆款选题 SOP：观点前置 + 故事 + 价值）

> **散户买世界杯只看一家平台，永远慢 1-2 个区块。**
> 我用 Bitget Playbook **自然语言生成**了一个零代码的世界杯事件套利 Agent。**整个策略生成到部署完全在 Bitget 工具链内完成**——Playbook 自然语言策略 + Agent Hub 58 API + 5 个 Skill（sentiment/technical/news）做市场感知。Polymarket 100+ 场赛事赔率作为外部信号源，Edge > 10% 时自动做 Bitget 合约对冲。Playbook 自动输出 PnL/最大回撤/夏普三个指标，**零真实资金、零代码主策略、可一键部署**。这个项目证明了一件事：AI 原生思维的极致不是"用 AI 写代码"，而是"**用自然语言描述意图、AI 执行一切**"。

### 6.2 草稿 B（按官方叙事：突出技术深度）

> **WorldCup Edge Agent** 是一个**用 Bitget Playbook 自然语言生成**的跨市场套利 Agent。感知层用 Polymarket Gamma API 拉 100+ 场世界杯赛事赔率 + Bitget 5 个 Skill 做市场感知；决策层用 Claude LLM 评估真实概率 + Playbook 自然语言策略定义执行规则；执行层通过 Playbook 一键部署到 Bitget 模拟盘。**核心技术栈**：Bitget Playbook（自然语言 → 策略 → 回测 → 部署）+ Agent Hub 58 API + 5 个 Skill。**回测自动输出 PnL/最大回撤/夏普**三个指标。**零代码主策略、零真实资金、完整闭环（感知→决策→执行→风控）**。

### 6.3 草稿 C（按个人 IP 角度 + 极简）

> 我是一名 05 后大学生 / AI 实战家，借 Bitget AI 黑客松做出这个 Agent：**用 Bitget Playbook 自然语言生成的世界杯事件套利策略**。我**没写一行策略代码**——用自然语言告诉 Playbook"在 Polymarket 显示错价时自动做 Bitget 合约对冲"，AI 自动生成 → 真实历史数据回测 → 自动输出 PnL/最大回撤/夏普 → 一键部署到 Bitget 模拟盘。**这个项目证明了一件事**：在 Bitget Playbook + Agent Hub + 5 个 Skill 的完整工具链加持下，**单人 10 天能做出一个零代码、可验证、零资金的 AI 交易 Agent**。

---

## 7. 风险提示与兜底方案

### 7.1 报名风险（同 v1.0）

| 风险 | 应对 |
|---|---|
| 报名时 Bitget 账号异常 | 提前 1 小时登录确认 |
| 错过 500 队通义千问 Token 补贴 | 改用 MuleRun 2,000 Credits |
| 错过 6/14 24:00 报名截止 | **整个项目作废** |

### 7.2 Playbook 风险（v2.0 新增）

| 风险 | 应对 |
|---|---|
| Playbook 安装失败 | 备选：直接用 Bitget Agent Hub 58 API 自建 |
| getagent 创建策略失败 | 降级到"自己写 + 用 Playbook 回测" |
| Playbook 回测指标不理想 | 改策略描述（自然语言是 prompt 工程，可迭代）|
| Playbook 不支持 Polymarket 外部信号 | 退化为"只用 Bitget 内部数据"的策略 |
| Playbook 部署到模拟盘失败 | 用 polymarket-paper-trader + ccxt sandbox 替代 |

### 7.3 评审风险

| 风险 | 应对 |
|---|---|
| 评委不看收益率 | 主动强调"用了 Bitget 完整工具链 + 零代码" |
| 评委质疑"自然语言生成就是 prompt" | 强调"Playbook 自动生成可执行代码 + 回测 + 部署"不是单纯 prompt |
| 评委看不到 Bitget 工具链 | **项目说明里逐项列出**：Playbook + Agent Hub + 5 个 Skill |
| 评委觉得项目太小 | 用 Gradio 包装成"一键可跑" |
| 传播奖竞争激烈 | 内容里**强调"零代码 + 自然语言"**这个差异化故事 |

### 7.4 时间风险

| 风险 | 应对 |
|---|---|
| Day 0 Playbook 没跑通 | 立刻退回 v1.0 方案（polymarket-paper-trader 中心）|
| Day 3 策略 v1.0 还没回测 | 砍掉 LLM 信号层，只用 Playbook 基础策略 |
| Day 6 模拟盘没跑起来 | 只展示回测指标（也是评审要的）|
| Day 9 还没录视频 | 用 Gradio 截图 + 静态页面代替 |

### 7.5 真实下注风险（已规避）

| 风险 | 应对 |
|---|---|
| 资金风险 | ✅ **零**（Playbook 模拟盘 + paper trading）|
| 链上操作 | ✅ **零** |
| KYC | ✅ **零** |
| Gas 成本 | ✅ **零** |

---

## 8. 即刻行动清单

### 8.1 今晚 4 件事（22:00 前完成）

| # | 任务 | 链接/命令 |
|---|---|---|
| 1 | **报名** | https://www.bitget.com/zh-CN/activity-hub/hackathon |
| 2 | **加官方 Telegram 群** | 链接见报名确认邮件 |
| 3 | **创建 Bitget API Key + Playbook API Key** | bitget.com → 设置 → API 管理 + Playbook 页面 |
| 4 | **装 Playbook + 跑通第一个示例策略** | `npm i @bitget-ai/getagent-skill` |

### 8.2 跑通后告诉我 3 个数字

1. **Playbook 示例策略回测的 3 个指标**（PnL / 最大回撤 / 夏普比率）
2. **找到多少世界杯市场**（30+ / 5-30 / 0）
3. **Playbook 一键部署是否成功**（看到模拟盘有持仓 = 成功）

### 8.3 关键时间节点

| 时间 | 事件 |
|---|---|
| **6/13 22:00** | 今晚报名截止（剩下 2 小时）|
| **6/14 24:00** | 报名截止（最后一天）|
| **6/15 0:00** | 提交窗口开启 |
| **6/25 24:00** | **提交截止** |
| **6/30** | 颁奖 |

---

## 附录 A：参考资料

### A.1 比赛官方
- 比赛主页：https://www.bitget.com/zh-CN/activity-hub/hackathon
- 文档：https://bitget-ai.gitbook.io/hackathon/untitled
- Telegram 群：见报名确认邮件
- Agent Hub GitHub：BitgetLimited/agent_hub

### A.2 Bitget Playbook（核心）
- 安装：`npm install -g @bitget-ai/getagent-skill`
- npm 包：https://www.npmjs.com/package/@bitget-ai/getagent-skill
- Playbook 入口：bitget.com → Playbook 页面（需登录）

### A.3 Bitget Agent Hub
- 安装：`npx bitget-hub upgrade-all --target claude`
- MCP Server：`npx -y bitget-mcp-server`
- 5 个 Skill：macro-analyst / market-intel / news-briefing / sentiment-analyst / technical-analysis

### A.4 Polymarket（外部信号源）
- 官方文档：https://docs.polymarket.com
- Gamma API：https://gamma-api.polymarket.com
- Paper Trading 工具（可选）：https://github.com/agent-next/polymarket-paper-trader
- 套利案例：https://www.bitget.com/zh-CN/news/detail/12560605103312
- 智能体前瞻：https://www.bitget.com/zh-CN/news/detail/12560605231176

### A.5 技术栈对比
- AI Agent 框架：https://www.firecrawl.dev/blog/best-open-source-agent-frameworks
- TimescaleDB 实战：https://www.tigerdata.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb
- MCP vs REST vs WebSocket vs CCXT：https://www.bitget.com/academy/building-ai-crypto-bots-2026-mcp-vs-rest-api-vs-websocket-vs-ccxt

---

## 附录 B：常用命令速查

### B.1 报名与配置
```bash
# 报名
https://www.bitget.com/zh-CN/activity-hub/hackathon

# 创建 .env
cat > .env << 'EOF'
BITGET_API_KEY=...
BITGET_SECRET_KEY=...
BITGET_PASSPHRASE=...
PLAYBOOK_API_KEY=...
ANTHROPIC_API_KEY=...
EOF
```

### B.2 Playbook（核心）
```bash
# 安装
npm install -g @bitget-ai/getagent-skill

# 用 Claude Code 驱动
claude
# 然后输入自然语言策略描述
```

### B.3 Bitget Agent Hub
```bash
# 安装
npm install -g @bitget-ai/getagent-skill
npx bitget-hub upgrade-all --target claude

# 启动 MCP Server
npx -y bitget-mcp-server
```

### B.4 完整流程
```bash
# 1. 拉市场
python scripts/fetch_wc.py

# 2. AI 信号
python scripts/ai_signal.py

# 3. 创建 Playbook（核心）
claude  # 输入自然语言策略

# 4. 跑主循环
python src/agent.py
```

### B.5 故障排查
| 错误 | 原因 | 解决 |
|---|---|---|
| `npm` 找不到 | 没装 Node | 装 18+ |
| `getagent` 安装失败 | 网络问题 | 换 npm 镜像 |
| Playbook 找不到 API Key | 没创建 Playbook 子账户 | 登录 bitget.com → Playbook 页面创建 |
| Claude Code 找不到 getagent | PATH 问题 | 重新 `npm install -g` |
| Polymarket 返回空 | 还没上齐 | 改用其他体育赛事 |

---

## 📝 版本历史

- **v2.0（2026/6/13 晚）** - Playbook 中心版
  - 重大变更：Bitget Playbook 成为项目核心
  - 变更原因：Playbook 是 Bitget 官方产品，比 polymarket-paper-trader 加分更多
  - 影响：项目定位、技术栈、代码量、项目说明全部更新
- **v1.0（2026/6/13 下午）** - polymarket-paper-trader 中心版（已废弃）
  - 包含完整的 6 个 Python 脚本（~350 行）
  - 可作为 v2.0 Playbook 失败时的备选方案

---

> **v2.0 核心原则：用 Bitget 自己的工具（Playbook），不重新发明轮子。**
>
> **今晚 22:00 的目标：装 Playbook + 跑通第一个示例策略 + 看到 PnL/回撤/夏普 3 个数字。**
>
> 📝 **本文档随项目进展持续更新**。每次重大决策请同步更新相关章节。
