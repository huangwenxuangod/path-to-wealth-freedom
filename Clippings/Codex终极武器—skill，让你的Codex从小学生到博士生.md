---
title: "Codex终极武器—skill，让你的Codex从小学生到博士生"
source: "https://x.com/Saccc_c/status/2059484972361056498"
author:
  - "[[@Saccc_c]]"
published: 2026-05-27
created: 2026-05-27
description: "skill这个名词大家都不陌生，但在Codex App里怎么用skill无限拉高AI的上限？这篇文章将用最简单的语言教会你关于Codex App里skill的一切，让你的Codex彻底进化。我们将依次介绍以下内容：1、内置skill安装使用与推荐2、第三方skill安装方法3、如..."
tags:
  - "clippings"
---
![Image](https://pbs.twimg.com/media/HJS-XtAWcAMm2F0?format=jpg&name=large)

skill这个名词大家都不陌生，但在Codex App里怎么用skill无限拉高AI的上限？

这篇文章将用最简单的语言教会你关于Codex App里skill的一切，让你的Codex彻底进化。

我们将依次介绍以下内容：

1、内置skill安装使用与推荐

2、第三方skill安装方法

3、如何创建属于自己的skill

## 一、内置skill安装使用与推荐

首先我们需要了解官方内置 skill 的安装和使用方式。官方提供的 skill 种类丰富、强大，已经可以满足大部分日常使用需求。

**1、两种安装方式：Plugins 和 Skills**

进入 Codex App 后，点击左上角的 Plugins 即可进入官方扩展市场。这里分为两个板块：Plugins 和 Skills。

![Image](https://pbs.twimg.com/media/HJS-zjPXkAAtoH8?format=jpg&name=large)

Skills 是可复用的任务指令，可以理解为 Codex 的「专项能力」。安装后，当 Codex 遇到对应任务时，就会按照 Skill 中的指引来处理。

Plugins 则可以理解为打包好的能力扩展包，里面通常会包含多个 Skill，也可能提供额外的工具能力或第三方服务连接。

换句话说，安装 skill 是给 Codex 增加某一个具体能力；安装 Plugin 则更像是一次性安装某个场景下的一整套能力。Plugin 中包含的 Skill 也会出现在 Skills 管理页面里，所以你也可以把 Plugin 理解成一种批量安装 Skill 的方式。

![Image](https://pbs.twimg.com/media/HJKL073WYAAeWYM?format=jpg&name=large)

安装方法很简单：在 Plugins 或 Skills 页面搜索具体名称，点击旁边的 “+” 号即可安装。

![Image](https://pbs.twimg.com/media/HJKNFfEXwAAULUq?format=jpg&name=large)

对于skill安装，注意在安装完成后，点击上方的刷新按钮，就可以直接使用。

![Image](https://pbs.twimg.com/media/HJKNR6nWcAAspfT?format=jpg&name=large)

**2、好用的Plugins和Skills推荐**

1️⃣Plugins

- 打工人办公必备：Documents+Spreadsheets+Presentations。对应word、excel、ppt三件套，含金量不必多说
- Vibe Coding必备：GitHub+Vercel+Supabase。GitHub让Codex直接读取你的仓库、处理 PR 和 Issue；Vercel用来部署网站和应用；Supabase负责搞定数据库 + 后端服务
- 视频剪辑：HyperFrames+Remotion。两个纯代码编辑视频的工具，一个基于html，一个基于React，都很好用。我已经用他们制作了不少视频动画，效果很夯
- 两个操作神器：Computer use+Chrome。Computer use可以直接让 Codex操作你的电脑应用，Chrome 允许 Codex 接入你已经登录的浏览器，用来抓取信息、操作已登录的网站

2️⃣Skills

三个默认配置但你必须知道的skill：

Image Gen：调用GPT Image2生成图片，做设计参考图、素材图都很合适

Skill Creator：帮你系统化创建、更新skill

Skill Installer：帮你安装官方/第三方仓库的skill

**3、如何在实战中使用**

安装完成后，可以通过两种方式调用 plugin 和 skill：

1️⃣显式调用：直接在提示词里包含plugin/skill。

plugin调用方法是输入框输入“@”，比如 [@github](https://x.com/@github)；skill调用方法是输入框输入“/”或者“$”，比如 [$imagegen](https://x.com/search?q=%24imagegen&src=cashtag_click)。显示调用的效果如下：

![Image](https://pbs.twimg.com/media/HJKPnT7XoAArfgM?format=jpg&name=large)

2️⃣隐式调用：直接描述你的任务，Codex 会根据任务内容自动匹配并调用合适的 plugin/skill，不需要手动指定。

例如：

> 帮我做一个 Tesla 的宣传片：先生成一张具有科技感的Tesla相关海报作为视频封面，再用动感图表和转场把续航、自动驾驶等核心参数串联成一系列动画，最后以 Logo 酷炫收尾。

在已安装HyperFrames和ImageGen skill的情况下，Codex会直接调用它们来进行视频制作。

## 二、安装下载第三方Skill

除了官方内置的skill，你还可以在Codex App里安装其他好用的第三方skill，方法也很简单。

直接在输入框输入GitHub仓库地址并让Codex帮你装好，Codex会自动调用 skill-installer 这个skill来安装。

默认会安装在全局目录，所有项目通用，例如：

> 帮我安装 <GitHub仓库URL> 这个仓库的 skills

如果你只想在某个项目里使用，就采用项目级安装的方式，告诉 Codex 安装到项目目录下，例如：

> 帮我安装 <GitHub仓库URL> 这个仓库的 skills到当前工作目录下

注意：如果安装后无法使用skill，可以重启Codex App刷新载入。

## 三、如何创建自己的skill

你可以通过两种方式来定制化自己的skill。

**方法一：用skill-creator创建**

直接用内置的skill-creator这个skill来进行创建，Codex会询问你skill的具体内容、触发时机，在充分了解需求后为你生成完整的Skill.md文件。

![Image](https://pbs.twimg.com/media/HJKQk8wXAAAOIBa?format=jpg&name=large)

例如你想创建一个选题skill，你可以这样输入：

> 用 [$skill-creator](https://x.com/search?q=%24skill-creator&src=cashtag_click) 帮我创建一个 X 选题 Skill。激活后，系统自动结合我的账号定位与近期热点，并根据当前输入内容，结构化推荐 5 个选题方向，并阐明各选题的差异化切入角度。

**方法二：从历史对话和实践中提炼skill**

这是我更推荐的一种方式。

你在使用了Codex一段时间后，一定积累了一些有效的工作方式。比如某个任务你反复用同一套流程，并取得不错的效果；或者在一套工作流里你经常纠正Codex 的一些做法。这些都可以沉淀成 Skill。

而且因为这些流程已经经过真实验证，包含你踩过的坑和纠正过的做法，提炼出来的 Skill 往往比从零创建的更稳定、更有效。

比如我最近一直用HyperFrames实践代码生成视频这套流程，一些可复用的工作流就可以提炼成skill：

> 我们在这个项目里做了很多 HyperFrames 视频动画，帮我把其中可复用的通用流程提炼成一个 Skill，包括动画制作、常见报错的处理方法等。