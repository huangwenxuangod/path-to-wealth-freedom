# 示例：有没有现成 GitHub 项目能做社媒搜索路由？

## 问题
有没有现成 GitHub 项目能做社媒搜索路由？

## 正确路由

### Step 1：先分类
- `question_type`: `repo_lookup`
- `needs_code_evidence`: yes
- `needs_user_feedback`: yes
- `needs_freshness`: medium
- `needs_authority`: medium
- `geo_bias`: global
- `local_first`: no

### Step 2：GitHub first
先看：
- repo 本体
- README
- stars / forks
- recent activity
- issues / discussions
- 是否覆盖 GitHub / Reddit / XHS / 抖音 / YouTube / B站 这些源

### Step 3：再补 Reddit / X / 视频评测
因为用户真正关心的不只是“有没有”，而是：
- 好不好用
- 稳不稳定
- 适不适合个人开发者
- 有没有反爬 / 登录态 / 逆向问题

### Step 4：最后再补 Web 总结文章
用于找横评或框架性总结，但不作为一手核心证据。

## 为什么这样路由

这个问题本质上是：
> 我想复用现成项目，并判断是否值得纳入自己的技能栈。

所以最关键证据必须来自：
- GitHub 项目本体
- 维护与 issue 生态
- 社区真实反馈

## 正确输出应该包含

- 值得关注的 repo 名单
- 每个 repo 做什么
- 覆盖哪些平台
- stars / recent activity / issue 质量
- 适不适合个人开发者
- 是否依赖闭源 API / 登录态 / 逆向签名
- 哪些项目只是 demo，哪些更像能落地的基础设施
