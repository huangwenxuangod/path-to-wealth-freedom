# Browser-use Fallback Strategy

> 目标：当 API / Jina / Firecrawl / plain HTTP 无法稳定读取页面时，source-router 必须知道何时切换到 browser-use MCP，并且不能把“计划用浏览器”冒充为“已经抓取成功”。

## 何时使用 browser-use

优先级：API/TikHub/WebAccess 抽取失败后再使用。适用场景：

- 页面需要登录态：X、小红书、抖音、Instagram、视频号、公众号后台可见内容
- 页面是 JS heavy：plain HTTP 只有壳，没有正文
- 需要无限滚动：账号主页、搜索结果页、评论区
- 需要视觉确认：图文封面、按钮状态、验证码/登录提示
- 需要读取 DOM，而不是搜索摘要

## 执行原则

1. 每次浏览器任务先检查 workflow：`browser_list_workflows`。
2. 没有合适 workflow 时，再检查 profile：`browser_list_profiles`。
3. 只有一个 profile 时直接打开；多个 profile 时用 AskUserQuestion 让用户选择。
4. 优先 `browser_eval` 读 DOM，不要先截图。
5. 点击用 `browser_click_element`，坐标点击只作为最后手段。
6. 完成后必须输出 `<strategy>...</strategy>`，再 `browser_close`。

## 标准 DOM 抽取表达式

### 主文本

```js
document.querySelector('main, article, .content, #content')?.innerText || document.body.innerText
```

### 链接

```js
Array.from(document.querySelectorAll('a')).map(a => ({text: a.textContent.trim(), href: a.href})).filter(a => a.text || a.href)
```

### 图片

```js
Array.from(document.images).map(img => img.currentSrc || img.src).filter(Boolean)
```

### 按钮/表单

```js
Array.from(document.querySelectorAll('button, [role=button], input, textarea')).map(e => ({tag: e.tagName, text: e.textContent?.trim(), type: e.type, id: e.id, name: e.name, className: e.className}))
```

## 返回给 source-router 的结构

浏览器抓取结果应整理为：

```json
{
  "url": "...",
  "provider": "browser_use",
  "success": true,
  "title": "document.title",
  "content_text": "...",
  "links": [{"text": "...", "href": "..."}],
  "images": ["..."],
  "captured_at": "ISO time",
  "browser_profile": "...",
  "strategy_used": "..."
}
```

## 平台特殊注意

- X / Twitter：搜索结果和时间线经常需要登录态；优先用 TikHub，失败后 browser-use。
- 小红书/抖音：账号内容优先 TikHub；browser-use 适合验证页面、读公开可见内容，不应作为高频批量爬虫。
- 公众号/视频号：外部搜索弱，登录态和微信内搜索更关键；browser-use 仅适合网页端可见内容。
- Instagram：登录态可能影响可见数量；优先 TikHub，失败后 browser-use。
