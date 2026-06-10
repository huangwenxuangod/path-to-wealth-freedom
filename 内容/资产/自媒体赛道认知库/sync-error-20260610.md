---
date: 2026-06-10
type: 飞书同步错误记录
target: 无限学习
parent_node_token: Bzpew2oMYiOYnHkpsA3cw6Jfnsh
source_file: 内容/资产/自媒体赛道认知库/认知雷达-20260610-AI职业头像.md
---

# 飞书同步失败记录

同步目标：

- 本地报告：`D:\path-to-wealth-freedom\内容\资产\自媒体赛道认知库\认知雷达-20260610-AI职业头像.md`
- 飞书知识库节点：`Bzpew2oMYiOYnHkpsA3cw6Jfnsh`
- 目标知识库页面：https://iigf5k70ohp.feishu.cn/wiki/Bzpew2oMYiOYnHkpsA3cw6Jfnsh

尝试命令 1：

```powershell
$path = '内容\资产\自媒体赛道认知库\认知雷达-20260610-AI职业头像.md'
$md = Get-Content -Raw $path
lark-cli docs +create --as user --wiki-node 'Bzpew2oMYiOYnHkpsA3cw6Jfnsh' --title '认知雷达-20260610-AI职业头像' --markdown $md
```

失败原因：

```text
Error: bad flag syntax
```

判断：PowerShell 将长 Markdown 内容拆成了命令参数，导致 `lark-cli` 把 frontmatter 当成 flag 解析。

尝试命令 2：

```powershell
lark-cli docs +create --as user --wiki-node 'Bzpew2oMYiOYnHkpsA3cw6Jfnsh' --title '认知雷达-20260610-AI职业头像' --markdown '@内容\资产\自媒体赛道认知库\认知雷达-20260610-AI职业头像.md'
```

CLI 返回：

```json
{
  "ok": false,
  "identity": "user",
  "error": {
    "type": "auth",
    "message": "failed to get access token: need_user_authorization (user: )",
    "hint": "current command requires scope(s): docx:document:create"
  },
  "_notice": {
    "update": {
      "current": "1.0.28",
      "latest": "1.0.48",
      "message": "lark-cli 1.0.48 available, current 1.0.28, run: lark-cli update"
    }
  }
}
```

判断：

- 本地报告已成功入库。
- 飞书同步失败原因是当前 `lark-cli` 用户授权缺少 `docx:document:create` scope，不是 Markdown 内容或 parent node token 问题。
- 后续需要重新完成 `lark-cli` 用户授权，或升级至 1.0.48 后按新版本认证流程授权，再用第二条 `--markdown @file` 命令重试。
