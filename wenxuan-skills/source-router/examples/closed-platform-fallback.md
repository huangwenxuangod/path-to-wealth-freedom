# 示例：封闭平台检索失败时如何降级

## 问题
小红书上 AI 选题博主都在讲什么？

## 正确路由

### Step 1：先分类
- `question_type`: `social_tactic`
- `needs_code_evidence`: no
- `needs_user_feedback`: yes
- `needs_freshness`: high
- `needs_authority`: low
- `geo_bias`: cn
- `local_first`: no

### Step 2：优先封闭平台公开信号
先查：
- 搜索引擎 `site:` 结果
- 小红书公开页面/作者主页（如可见）
- 标题、描述、关键词、评论 snippet

### Step 3：若环境允许，再增强
- 已登录浏览器会话
- TikHub API
- OpenClaw / browser automation

### Step 4：若仍不充分，降级到替代证据
- B站 / YouTube / 公众号 / 博客复盘
- 相关创作者对 XHS 流量玩法的拆解
- 搜索引擎收录的外链摘要

### Step 5：明确说明边界
输出时必须说明：
- 当前结论基于公开可见信号
- 不是平台内完整榜单
- 哪些部分还需要人工站内复核

## 为什么这样做

因为封闭平台最容易出现两种错误：
1. 根本拿不到数据，却假装自己已经看全了
2. 拿到少量零散结果，却包装成“行业全景”

source-router 的要求是：
- 宁可诚实降级
- 也不要伪造完整性

## 正确输出应该包含

- 查到的公开信号有哪些
- 这些信号说明了什么
- 哪些结论只是趋势性推断
- 还缺哪些数据
- 用户下一步该用什么关键词继续站内验证
