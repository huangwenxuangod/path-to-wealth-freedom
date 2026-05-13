# routing-policy

## 目标

这个文档定义：
- 什么问题应该优先去哪里搜
- 为什么这样路由
- 当多个来源都相关时，如何分主次
- 最后输出答案时应该怎样把证据组织起来

---

## 一、问题类型 -> 信息源优先级矩阵

| 问题类型 | 一优先 | 二优先 | 三优先 | 说明 |
|---|---|---|---|---|
| 概念解释 `concept_explainer` | 本地知识库 / `mem-search` / `knowledge-agent` | 官方文档 / 权威 Web | 视频 / GitHub（仅作补充） | 不要默认 GitHub first |
| 技术实现 `technical_howto` | GitHub / 官方文档 | issues / discussions / Reddit | 视频 walkthrough / 博客复盘 | 重点是代码证据与真实坑点 |
| 项目查找 `repo_lookup` | GitHub | Reddit / X / YouTube | Web 总结文章 | 先找项目，再看评价 |
| 工具选型 `tool_selection` | GitHub + 官方站点 | Reddit / X / 视频评测 | Web 横评文章 | 既要功能，也要真实体验 |
| 趋势热议 `trend_signal` | X / Reddit / GitHub Trending | YouTube / B站 | Web 新闻 / 官方公告 | 重点是时效性和讨论热度 |
| 平台打法 `social_tactic` | XHS / 抖音 / X（公开信号） | B站 / YouTube / 公众号复盘 | Web 搜索索引 | 遇到封闭源必须诚实降级 |
| 本地知识匹配 `local_knowledge_match` | 本地内容 / 跨会话记忆 | Web / GitHub | 社区讨论 | 先用已有沉淀，避免重复劳动 |

---

## 二、辅助判断维度

除了问题类型，每次还要看这几个维度：

### 1. 是否需要代码证据
如果需要代码证据：
- GitHub 权重上升
- README / docs / examples / issues 变成核心证据

### 2. 是否需要真实用户反馈
如果需要真实反馈：
- Reddit / X / issue / discussion 权重上升
- 不能只看官网和 README

### 3. 是否需要高时效性
如果时效性高：
- X / Reddit / GitHub Trending / 官方 release 权重上升
- 老博客和旧视频权重下降

### 4. 是否偏中文平台
如果是中文平台问题：
- XHS / 抖音 / B站 / 公众号 权重上升
- 全球平台只作补充

### 5. 是否本地知识优先
如果仓库里已写过：
- 先读本地文档
- 再用外部资料校准和补证据

---

## 三、典型路由案例

### 案例 1：`SEO 是啥？`

推荐路由：
1. 本地知识库
2. 官方/权威 Web
3. 实操补充时再看 GitHub 工具

原因：
- 这是概念解释，不是代码实现
- 权威定义和机制比 GitHub repo 更重要
- 当前仓库已有：`内容/AI牛马/概念深度学习-示范-SEO.md`

### 案例 2：`有没有现成 GitHub 项目能做社媒搜索路由？`

推荐路由：
1. GitHub
2. issues / discussions / stars / recent activity
3. Reddit / X / YouTube 补充真实评价

原因：
- 核心问题是“有没有项目”和“项目值不值得用”
- GitHub 先回答“存在性与代码能力”
- 社区再回答“真实体验与坑点”

### 案例 3：`Reddit 上大家怎么评价 Firecrawl / Crawl4AI？`

推荐路由：
1. Reddit
2. GitHub issue / discussion
3. 官方文档 / 博客

原因：
- 用户真正问的是“社区怎么说”
- 这不是官方口径问题

### 案例 4：`小红书上 AI 选题博主都在讲什么？`

推荐路由：
1. XHS 公开信号 / 站外索引 / 可见主页
2. 已登录浏览器会话 / TikHub API / OpenClaw（如可用）
3. B站 / YouTube / 公众号复盘
4. 明确说明平台限制

原因：
- 这是封闭平台问题
- 需要拿到尽可能接近平台原始内容的证据
- 同时必须诚实承认可见性边界

---

## 四、证据评分建议

第一版不一定做成程序，但回答时建议按以下维度给证据排序：

- `relevance`：和问题的直接相关性
- `authority`：来源权威性
- `freshness`：是否足够新
- `specificity`：是否具体、有细节
- `social_signal`：是否反映真实讨论/使用
- `access_reliability`：内容是否可稳定访问与验证

### 不同问题的权重偏好

#### 概念解释
- authority 高
- relevance 高
- freshness 次要

#### 技术实现
- specificity 高
- code evidence 高
- issue/discussion 权重高

#### 趋势/社媒问题
- freshness 高
- social signal 高
- authority 不一定绝对优先

---

## 五、统一输出结构

每次回答都建议按这个顺序：

1. **结论**
2. **最关键的证据来自哪里**
3. **为什么优先这些来源**
4. **还有哪些来源支持/反驳**
5. **不确定性与平台限制**
6. **下一步怎么继续深挖**

技术类补充：
- repo 链接
- stars / activity
- issues / discussions 的关键信号
- 是否适合个人开发者

社媒类补充：
- 账号 / 平台 / 关键词 / 内容句式
- 哪些是公开原始证据
- 哪些是站外替代推断

---

## 六、禁止事项

- 禁止所有问题都默认网页搜索
- 禁止把 GitHub 热度当作质量结论
- 禁止把封闭平台的零散公开结果包装成“完整覆盖”
- 禁止只给结论，不解释为什么选这些信息源
- 禁止忽略本地知识库中已经存在的高质量内容
