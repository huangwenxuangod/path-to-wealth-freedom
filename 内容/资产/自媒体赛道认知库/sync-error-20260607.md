---
date: 2026-06-07
type: 飞书同步错误记录
target: 无限学习
parent_node_token: Bzpew2oMYiOYnHkpsA3cw6Jfnsh
source_file: 内容/资产/自媒体赛道认知库/认知雷达-20260607-AI求职陪跑.md
---

# 飞书同步失败记录

同步目标：

- 本地报告：`D:\path-to-wealth-freedom\内容\资产\自媒体赛道认知库\认知雷达-20260607-AI求职陪跑.md`
- 飞书知识库节点：`Bzpew2oMYiOYnHkpsA3cw6Jfnsh`
- 目标知识库页面：https://iigf5k70ohp.feishu.cn/wiki/Bzpew2oMYiOYnHkpsA3cw6Jfnsh

尝试命令：

```powershell
$path = '内容\资产\自媒体赛道认知库\认知雷达-20260607-AI求职陪跑.md'
$md = Get-Content -Raw $path
lark-cli docs +create --as user --wiki-node 'Bzpew2oMYiOYnHkpsA3cw6Jfnsh' --title '认知雷达-20260607-AI求职陪跑' --markdown $md
```

第一次尝试误加 `--format json`，CLI 返回 `unknown flag: --format`。

第二次去掉 `--format` 后，CLI 返回：

```json
{
  "ok": false,
  "identity": "user",
  "error": {
    "type": "config",
    "message": "keychain entry not found: lark-cli/appsecret:cli_a9427bc6ed389bc4"
  }
}
```

判断：

- 本地报告已成功入库。
- 飞书同步失败原因是本机 `lark-cli` 凭据/密钥链配置缺失，不是 Markdown 内容或 parent node token 问题。
- 后续需要恢复 `lark-cli` 认证配置后重新执行同步。
