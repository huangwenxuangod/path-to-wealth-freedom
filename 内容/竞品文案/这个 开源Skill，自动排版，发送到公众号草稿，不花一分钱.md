---
title: "这个 开源Skill，自动排版，发送到公众号草稿，不花一分钱"
source: "https://x.com/lxfater/status/2037047059384328315"
author:
  - "[[铁锤人]]"
published: 2026-01-27
created: 2026-03-26
description: "Grok is a free AI assistant designed by xAI to maximize truth and objectivity. Grok offers real-time search, image generation, trend analysis, and more."
tags:
  - "clippings"
---
你是不是想发公众号，但是排版起来很麻烦。

然后你没有发，就在 X 上发，就被别人搬运了。

别人轻松靠你的文章赚个几千块。

> Jan 27
> 
> 我操，立马被搬运了，我自己的都发不出来

没关系我也经历过，所以我特地花时间研究一下，如何解决这个问题。

你可能以为要很多钱，部署很难，但其实只要一句话，你的 OpenClaw，Claude code 就能安装上这个 Skill。

话不多说，下面演示

1. 在任何支持 Agent Skill 的软件，安装这个 Skill
2. 解决你不会配置的难题
3. 演示如何排版发送到公众号

## 安装Skill

我们的这个 Skill 也是推友的作品，算是一个生态的产品，但今天要讲白嫖的思路，所以先给人家打个广告。

> Mar 23

安装这个 Skill 很简单，就是在任何支持 Skill 的软件输入下面一句话

```markdown
请帮我安装 md2wechat 并验证可用。按这个顺序执行：
1. 运行：curl -fsSL https://github.com/geekjourneyx/md2wechat-skill/releases/download/v2.0.4/install.sh | bash
2. 运行：npx skills add https://github.com/geekjourneyx/md2wechat-skill --skill md2wechat
3. 运行：export PATH="$HOME/.local/bin:$PATH"
4. 运行：md2wechat version --json
5. 运行：md2wechat config init
6. 运行：md2wechat capabilities --json
如果某一步失败，请直接告诉我失败原因和下一步修复命令，不要省略命令。
```

很快就安装完毕了

但是为了是能够自动将草稿发送到微信公众号，我们还需要下面的两个密钥：

![Image](https://pbs.twimg.com/media/HEUIeptaYAEF5ft?format=jpg&name=large)

## 获取微信的密钥

1\. 转移到 [https://developers.weixin.qq.com/platform?tab1=basicInfo&tab2=dev](https://developers.weixin.qq.com/platform?tab1=basicInfo&tab2=dev)

![Image](https://pbs.twimg.com/media/HEUIw7-bAAA1FlO?format=jpg&name=large)

2\. 登陆后按照下面步骤获取变量

![Image](https://pbs.twimg.com/media/HEUI1kPawAAjCYD?format=jpg&name=large)

如何配置这两个变量呢？ 一句话 WECHAT APPID：xxx，WECHAT\_SECRET：xx，帮我配置一下。 AI 就自动弄好了

## 如何排版发布公众号？

直接输入：使用AI模式html，上传图片后，更新图片地址，发布到草稿

当然，也可以使用 API 模式，这个时候就要支持作者付款了。

下面显示如何操作

![Image](https://pbs.twimg.com/media/HEUI6BhbYAAnk6q?format=jpg&name=large)

最后，成功推送文章草稿

![Image](https://pbs.twimg.com/media/HEUI-9AbAAAeB7f?format=jpg&name=large)

这个时候进去，改改标题，改改封面就能发布，给大家看看效果

![Image](https://pbs.twimg.com/media/HEUJBYabYAIMYLG?format=jpg&name=large)

这套流程是我目前用得最好的流程，不需要安装各种环境，成功率极高。

## 结束

好了，今天的的分享到此为止，希望对大家有帮助。

也可以关注我的公众号，我会分享更多类似的内容。 里面也有 AI 社群。

![Image](https://pbs.twimg.com/media/HEUJZp-asAAgZBQ?format=jpg&name=large)