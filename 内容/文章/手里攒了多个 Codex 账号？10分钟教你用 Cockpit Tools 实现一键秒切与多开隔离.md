---
title: "多账号玩家必看！手把手带你玩转 Cockpit Tools，一键多开/监控 Codex 配额"
source: "original"
author: "[[车干]]"
published: 2026-05-27
created: 2026-05-27
description: "你是不是也有好几个 Codex 账号，每天在本地手工替换 auth.json、切账号切到崩溃？多账号玩家和白嫖党必备的 AI 账号中控台 Cockpit Tools 保姆级教程，10分钟带你搞定 Codex 多开与配额监控！"
tags:
  - "AI工具"
  - "提效"
  - "Codex"
  - "Cockpit-Tools"
---
![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T095959928Z.png)习惯了薅gpt plus的羊毛之后，手里一直有好几个 Codex 账号，很多时候为了白嫖额度，为了区分工作与个人的账号，每天在本地手动替换 `auth.json`、改配置文件、切Codex账号切到让我崩溃。

你是否也是手里一堆账号，根本就不知道每个号还剩多少配额，什么时候重置？想同时跑两个项目，却没办法让两个不同的账号在不同的 Codex 实例里并行工作？

我研究了一番，发现了这个目前最强的开源 **AI 账号中控台——Cockpit Tools**。

它不仅仅是一个新的 AI 账号管理器 ，而是一个住在你桌面侧的“账号停机坪”和“配额仪表盘”。能够做到一键秒切 Codex 账号、配额可视化监控、多实例隔离多开，还能启动定时任务，完全就是多账号玩家和白嫖党的终极神器。

整个配置过程 10 分钟不到，小白跟着这篇保姆级教程做，就能彻底告别切号焦虑。

---
![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100048126Z.png)## 一、 Cockpit Tools 是什么？它能干什么？

简单来说，**Cockpit Tools 是一个通用的 AI IDE 账号管理工具**。

它能够把原本分散在各个 IDE、命令行或浏览器网页里的“账号状态”和“剩余额度”，全部收拢到一个可视化的桌面面板里。目前它已经深度支持了以 **Codex** 为首的主流平台：

- **核心支持**：Codex, Antigravity, GitHub Copilot, Windsurf, Cursor, Trae, Zed 等等

![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100129812Z.png)
它最核心的四大杀手级功能包括：

1. **一键多账号秒切**：告别繁琐的手工配置替换。在面板里点一下，底层自动更新 `auth.json` 和数据库，瞬间完成切号。
2. **配额与重置时间监控**：Codex 剩余配额、重置时间（Reset Time）、订阅计划类型一目了然，用进度条可视化展示，让你精准调度每一个账号。
3. **多实例并行运行（多开隔离）**：直接**多开 Codex 实例**。比如实例 A 跑项目甲（绑定账号 A），实例 B 跑项目乙（绑定账号 B），两者的用户数据、插件和缓存完全隔离，互不干扰。
4. 本地持久级会话管理：能够做到账号过期依然可以保留原有的会话记录，比如当你切不同的账号的时候，依然保持原有的历史记录和对话记录，**做到让对话无缝衔接**。
---

## 二、 1分钟极速安装与避坑指南

Cockpit Tools 是一款本地桌面应用，数据完全保存在你本地，安全且轻量，下面介绍一下如何在一分钟内极速安装好这款应用。

### 1. 手动下载（推荐）
前往 GitHub Releases 页面下载最新安装包：
🔗 [GitHub Releases 页面](https://github.com/jlcodes99/cockpit-tools/releases)

- **Windows 用户**：下载 `.msi`（推荐）或 `.exe` 安装包，一路下一步安装即可。
- **macOS 用户**：下载 `.dmg` 格式（根据芯片选择 Apple Silicon 或 Intel 版本）。
- **Linux 用户**：下载 `.deb` 格式。

### ⚠️ macOS 用户的“打不开”避坑指南
如果你双击运行提示“App is damaged”（应用已损坏）或“无法验证开发者”，这是 macOS 的安全拦截，不要慌，打开终端输入以下命令回车，输入电脑密码即可完美解决：

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Cockpit Tools.app"
```

---

## 三、 快速上手：保姆级配置流程

第一次启动 Cockpit Tools，建议按照下面的配置，体验最丝滑：

### 第一步：路径自检（Settings）
打开软件，点击左下角的 **Settings（设置）**。检查 Codex 的可执行文件路径（App Path）是否自动识别成功。
*如果识别失败，手动点击浏览，选择你电脑上安装的 Codex 的路径。*

![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100145858Z.png)### 第二步：导入你的 Codex 账号
进入Codex平台的账号管理页面，点击 **Add Account（添加账号）**：

![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100216755Z.png)

- **OAuth 登录**：支持一键跳转浏览器授权登录。
- **本地状态导入**：直接从你当前电脑上已经登录的 Codex 中，一键把当前的登录态 `auth.json` “吸”进 Cockpit Tools 里。
- **手动导入**：直接粘贴你的账号 Token 或 `auth.json`。

![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100229699Z.png)

### 第三步：配额监控大盘（Dashboard）
账号导入后，回到 **Dashboard（总览页）**。
你会看到一张极其舒适的仪表盘：每个 Codex 账号的剩余额度、下一次额度重置的倒计时、当前活跃账号的绿点标识。

![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100239635Z.png)

> **💡 提效小贴士**：在 Settings 中，建议将 **“Codex 自动刷新配额”** 设置为 **5~10 分钟**。这样它会在后台静默刷新，不占用额外性能，又能保证你看到的额度永远是最新的。

---

## 四、 进阶神技：如何实现多实例隔离多开？

![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100318868Z.png)

这是 Cockpit Tools 最强大、也是专业开发者最爱的功能——**多开实例**。

假设你手里有一个“免费额度号”和一个“Plus付费号”，你想同时开两个项目，分别用不同的号跑：

1. **创建实例**：在 Cockpit Tools 侧边栏选择 Codex，点击 **Instances加号图标（多开实例）**!![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100332377Z.png)
2. **分配账号**：为你新建的“实例 2”绑定账号 B，而“默认实例”保持绑定账号 A。![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100343591Z.png)
3. **独立启动**：在实例列表里，点击实例 1 和实例 2 的 **Start图标（启动）**。
![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100353184Z.png)


此时，你会发现电脑上同时打开了两个独立的 Codex 客户端！
- **实例 1**：绑定账号 A，读取项目 A，使用缓存 A。
- **实例 2**：绑定账号 B，读取项目 B，使用缓存 B。

**底层原理**：Cockpit Tools 通过在本地创建隔离的用户数据目录（User Data Directory），从物理上把两个 Codex 的运行时完全隔开。这不仅能无缝衔接账号额度，更是完美解决多项目依赖冲突、账号污染的终极方案。

---
## 五、数据同步：如何实现会话管理和恢复？

很多用户一看到自己的Codex账号打不开了就慌了，第一反应是对话数据全部都不见了，但是又没有办法重新拿回来。

Cockpit Tools中的会话管理功能就解决了这个问题：![](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/20260527T100408007Z.png)

1. **数据本地存储**：所有的对话数据都存储在了本地，可以直接复制到不同的账号实例实现Codex会话同步
2. **数据恢复**：被移除或者删除的会话可以通过恢复会话按钮重新找回，不需要再担心自己的会话数据是否会丢失。
## 六、 懂点底层的安全与隐私（打消你的顾虑）

很多朋友一听要导入自己的 Codex 账号 Token，第一反应是：**这安全吗？我的 Token 会不会被上传？**

作为一款开源工具，Cockpit Tools 的安全设计非常克制和纯粹：

1. **纯本地运行**：它是一个本地桌面客户端，不是云端托管服务。你的所有账号 Token、配置、实例数据都保存在你自己的电脑上，绝不上传任何第三方服务器。
2. **本地存储路径**：
   - `~/.antigravity_cockpit`：保存你的中控台配置、账号索引。
   - `~/.codex`：保存 Codex 官方的本地登录态（如 `auth.json`）。
   - `com.antigravity.cockpit-tools` (App Data)：本地应用缓存。
3. **安全建议**：
   - **关闭不必要的 WebSocket**：中控台默认在本地 `127.0.0.1:19528` 开启了 WebSocket 服务用于插件联动。如果你平时不需要用浏览器插件或外部脚本控制切号，**建议在 Settings 里直接关闭 WebSocket**，减少本地端口暴露。
   - **保护好你的本地文件夹**：不要把上述本地数据存储目录打包分享给他人，因为里面含有你真实的登录 Token。

---

## 七、 总结：多账号玩家的“终极救星”

看完这篇教程，你会发现，**切号和额度焦虑其实是个伪命题**。

通过 Cockpit Tools，你不仅能把手里零散的“白嫖号”和“工作号”统一调度起来，实现配额最大化利用；更能通过**多实例隔离**，让你的 Codex 工作流变得极其优雅和专业。


如果你手里正攒着好几个 AI 账号，我强烈建议你现在就花 10 分钟，把这个中控台搭建起来。

---

