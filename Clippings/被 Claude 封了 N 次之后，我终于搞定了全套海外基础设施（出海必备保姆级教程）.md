---
title: "被 Claude 封了 N 次之后，我终于搞定了全套海外基础设施（出海必备保姆级教程）"
source: "https://x.com/gkxspace/article/2101993381303820704"
author:
  - "[[余温 (@gkxspace)]]"
published: 2026-09-21
created: 2026-10-16
description: "本文章长期更新，长期优化和汇总最优方案，上次更新时间：2026.10.16我已经被 Claude 封过 X 次了，也是(被迫)总结了很多经验，总算是用上了 Claude。那么，我给大家详细讲一讲整个配置流程(时区、IP、代理配置、手机号、支付卡)，让你从此不再被 Claude 封..."
tags:
  - "clippings"
---
![Image](https://pbs.twimg.com/media/HSvDDsoboAAzLCW?format=jpg&name=large)

**本文章长期更新，长期优化和汇总最优方案，上次更新时间：2026.10.16**

我已经被 Claude 封过 X 次了，也是(被迫)总结了很多经验，总算是用上了 Claude。

那么，我给大家详细讲一讲整个配置流程(时区、IP、代理配置、手机号、支付卡)，让你从此不再被 Claude 封号所困！！！

这里要先感谢几位大佬，这套东西融合了很多他们的经验和内容：

[@app\_sail](https://x.com/@app_sail)、[@leo\_xiaolei](https://x.com/@leo_xiaolei)、[@suyuan1711](https://x.com/@suyuan1711)、[@JANEX0609](https://x.com/@JANEX0609)、[@Nemo001ai](https://x.com/@Nemo001ai)。

文章中，我把这次的完整过程写下来。有些操作可能很关键的，有些可能是无用的，但因为谁也不知道 Anthropic 到底因为啥封你，我只能把我做的、从推友那里学到的东西，全部写出来！！！

## ▌先说一个最重要的认知：封号是多方面的因素

Claude 封你，几乎从来不是因为某一条单独的原因。它是把你身上的各种信号加在一起，时区、IP、代理配置、手机号、支付卡、使用行为，累积到阈值，号就没了。

这就是为什么有人裸连机场用了两年没事，有人环境搞得挺干净却几天就被封。

所以我们要做的不是找到某个原因，而是把每个环节的信号都做干净，让自己在风控眼里看起来就是一个普通的、稳定的海外用户。

下面一块一块来。

## ▌设备：封过几次的电脑，先清理，再决定换不换

如果你的设备上被封过很多次账号，那这台设备本身可能已经被标记了。你在上面注册的新号，可能一出生就带着标签。

我的建议分两步。

第一步，先做本地清理。Claude 会在你电脑里留下不少东西，主要是这几处：

1、用户根目录下的 **.claude** 隐藏文件夹 2、macOS 的钥匙串（Keychain）里存的 Claude 凭据，这一步很多人会漏掉，光删 **.claude** 文件夹可能还是不够 3、应用支持目录里的历史会话文件，如果你知道被封账号的 org\_id，可以用它当关键字搜出来一起清掉

不想自己动手的话，直接把这段话丢给你的 Agent："帮我清理这台电脑上 Claude 的本地残留，包括 .claude 目录、Keychain 里的 Claude 凭据、应用支持目录里的历史会话文件，清理前先列出来给我确认。"

如果，你的设备被封过号，有位推友 [@suyuan1711](https://x.com/@suyuan1711) 做了一个专门清设备指纹记录的 Skill，他用这个救回了两三台封过号的 MacBook。我没试过，但如果你的设备已经出问题了，值得一试： [https://github.com/suyuan2022/suyuan-skill/blob/main/claude-cleanup/SKILL.md](https://github.com/suyuan2022/suyuan-skill/blob/main/claude-cleanup/SKILL.md)

如果都不行，还是建议换一换设备。。。

## ▌时区：手机和电脑，都改成台北

有人反编译过 Claude Code 的客户端，发现确实会有时区的检测。

而台北是在 Claude 允许的范围，和北京时间完全一样，日常使用零感知，那就直接改掉。

Mac： 1、系统设置 → 通用 → 日期与时间，关掉"自动设定时区"，手动搜"台北"选上 2、再去 隐私与安全性 → 定位服务 → 系统服务，把"设定时区"关掉

iPhone： 1、设置 → 通用 → 日期与时间，关掉"自动设置"，时区选台北 2、设置 → 隐私与安全性 → 定位服务 → 系统服务，关掉"设定时区"

## ▌手机号：一个真实的美国号

注册和风控都会看手机号归属地。接码平台的号能过注册这一关，但很容易被后续风控标记，强烈建议搞一个长期属于你自己的美国号。

这块我单独写了一篇完整教程，Red Pocket 一年 30 美金，配合 BeeSIM 国行手机也能用，从下单到写卡全流程都在里面（当然，你也可以选择其他卡）：

> Sep 21

照着做就行，这里不重复了。

## ▌网络：影响最大的环节，没有之一

网络和支付卡，是我认为对封号影响最大的两个东西。先说网络。

不要用万人共用的机场，你跟几千人挤同一个IP，里面只要有人搞蒸馏、搞号池，整个 IP 段的风控分都被拉高。

具体方案，我给两条路线，按你的情况选一条。

**路线一：自建 VPS，适合愿意动手的人**

买一台美国的 VPS，自己搭节点，整条链路只有你一个人在用，干净、可控、也便宜。

服务商选 DMIT、搬瓦工这类经过大家长期验证的就行，如果你想做到更稳，可以在 VPS 后面再套一层住宅 IP，这属于加分项。

搬瓦工跳转链接（配置：E-Commerce VPS -> Los Angeles -> USCA\_9，季付）：

[https://bandwagonhost.com](https://bandwagonhost.com/aff.php?aff=84473)

![Image](https://pbs.twimg.com/media/HUukxo1bgAEzCht?format=png&name=large)

购买后的搭建节点教程（直接扔给你的 AI）：[https://x.com/gengdaJ/status/2036803153841328388](https://x.com/gengdaJ/status/2036803153841328388)

分流规则配置教程：[https://x.com/gkxspace/status/2094386340645216468](https://x.com/gkxspace/status/2094386340645216468)

**路线二：想省事直接用** IPEqual

如果你不想折腾服务器，直接用 IPEqual。

它是我目前见过纯净度最高的住宅 IP，把节点和美国住宅 IP 做成了二合一，买一次全都有，不用自己搭任何东西。

用的话推荐直接上 Max 会员，价格差不多就是一台正常 VPS 的钱，如果用量不是特别大的话，买这个就够了。

🔗：[https://www.equaldcdn.com](https://www.equaldcdn.com/?ref=c1270cd15a)

![Image](https://pbs.twimg.com/media/HTYEjwcaIAEwcRD?format=jpg&name=large)

**选完线路，还有三件事必须做对**

线路只是基础，真正让人翻车的往往是配置细节。

一、开 TUN 模式，不要用系统代理。 普通的系统代理模式，会在 macOS 的网络设置里留下一条 127.0.0.1:7890 之类的代理记录，Claude Code 一读就知道你挂着代理。TUN 模式是在系统底层创建虚拟网卡接管流量，系统代理设置保持全空，Claude Code 看到的就是一台直连美国互联网的普通电脑。

配完可以在终端验证一下，跑 **scutil --proxy**，HTTPEnable 和 HTTPSEnable 都是 0，再 **curl** [ipinfo.io](https://ipinfo.io/) 看出口是不是美国 IP，两个都对就没问题了。

二、把历史残留的代理配置清干净。 要检查的地方包括：shell 环境变量、.zshrc / .bashrc 这些启动文件、npm 和 git 的代理配置、**~/.claude/settings.json**、还有所有 anthropic 相关的环境变量。

直接交给 Agent："帮我全面检查这台电脑的代理残留，包括系统代理、环境变量里的 proxy、shell 启动文件、npm 和 git 的代理配置、claude 的 settings.json，以及所有 ANTHROPIC 开头的环境变量，把不干净的列出来给我。"

三、线路断了就让 Claude 断网，绝不自动直连。 这块一定注意，你平时走代理用 Claude，某天节点断了，代理客户端会切到直连，Claude 那边看到的却是你的 IP 从美国瞬移回了国内。

正确的做法是，给 Claude 的流量单独指定线路，这条线路失败时直接拒绝连接，不许自动换节点、更不许直连。检查一下你的分流规则，claude.ai 和 [api.anthropic.com](https://api.anthropic.com/) 这些域名有没有可能落到 DIRECT 上，兜底规则是不是直连。

还有一个同样重要的点，手机和电脑要走同一条已经验证过的线路（如果你需要用到手机的话）。

最终可以用这段命令做个检测（来自 [@app\_sail](https://x.com/@app_sail)）：

任何一处不是空的、不是 0、不是 null，就手动清掉。

```bash
# 1. 系统代理（应该全 0）
scutil --proxy | grep -E "HTTPEnable|HTTPSEnable|SOCKSEnable"

# 2. 当前 shell 环境变量
env | grep -iE "proxy"

# 3. shell 启动文件里有没有硬编码 proxy
grep -iE "proxy" ~/.zshrc ~/.bashrc ~/.profile ~/.zshenv 2>/dev/null

# 4. npm / yarn / pnpm 配置
npm config get proxy
npm config get https-proxy
cat ~/.npmrc 2>/dev/null | grep -i proxy

# 5. Git 配置
git config --global --get http.proxy
git config --global --get https.proxy

# 6. Claude Code 自己的 settings.json
cat ~/.claude/settings.json 2>/dev/null | grep -iE "proxy|base_url|anthropic_"

# 7. 所有 anthropic / claude 相关的环境变量（重点关注 ANTHROPIC_BASE_URL）
env | grep -iE "anthropic|claude"

# 8. Homebrew
brew config | grep -i proxy
```

## ▌邮箱：我是直接新注册一个 Gmail

（如果你没有老邮箱，新邮箱也可以，但肯定老邮箱更好）

我的做法是直接新注册了一个干净的 Gmail，用它注册 Claude，注册完先生了 Pro。不要用那种买来的成品邮箱，如果你有没有被封过的 Gmail 邮箱，也可以直接使用。

当然！！！

如果你有老 Gmail 邮箱更好，如果你没有，也不要选择新注册 outlook 之类，就用 Gmail。

## ▌支付：另一个影响最大的环节

国内的双币信用卡和各种虚拟卡，要么直接付不了，要么付完就进风控名单。

1、最好的情况是你有美国的个人银行卡，或者办一家美国海外公司之后去申请美卡，这是风控眼里最正常的支付方式。

2、美区 PayPal 也可以，绑国内的全币种卡或者港卡等……然后把 PayPal 绑定到美区 Apple ID，同样也可以。

3、如果上面这些你没有，就用 Starryblu，非常牛逼的一张卡，新加坡实体卡，我自己目前也在用，门槛是所有方案里最低的。

3.1、开卡链接在这里：[https://sg.starryblu.com/x/6RtMh9c0](https://t.co/hkE5uGlGUf)，也可以直接下载 Starryblu APP，然后用这个邀请码：MQFK01Q，然后填写问卷开白：[https://docs.qq.com/form/page/DRmhsUEFHbUZhYkx5](https://docs.qq.com/form/page/DRmhsUEFHbUZhYkx5)

3.2、然后等待一两天，开卡完成后买个9.9的就可以(更推荐19.9的，更多的权益)，相当于付个运费，之后就是永久使用，这里有个坑，你在激活并让他们运卡的时候，临时切换一个新加坡IP，然后你就可以成功申请，并且具体邮寄地址填写国内就行。

3.3、这是一张新加坡的卡，购买 Claude 会员时，地址填写新加坡，你可以让 AI 给你一个真实的新加坡住宅地址信息！！！

> Aug 18
> 
> 快冲快冲，兄弟们！Starryblu 这张实体 Mastercard 真的太牛逼了！！！ 几乎零门槛，没有开卡费，一张卡搞定所有海外支付！ 申请通过后有虚拟 Mastercard，也能申请实体卡寄回国内/海外。 1、ChatGPT、Claude、Cursor、X Premium、海外 SaaS，直接绑卡订阅。 2、支持通过 App

缺点是新加坡卡订阅 Claude 走的是新加坡的价格，以 Max 20x 来算，一个月要比正常贵 100 RMB，但如果你没有别的支付方式，多花这点钱换一个能稳定续费、不用每个月提心吊胆的支付渠道。

4、礼品卡，大家可以看这个教程，从 Apple ID 到付款，全程都有截图教程： [https://x.com/zureA255062/status/2103672988524855361](https://x.com/zureA255062/status/2103672988524855361)

5、推友总结的更多的方案：[https://x.com/Nemo001ai/status/2072882143336767816](https://x.com/Nemo001ai/status/2072882143336767816)

## ▌使用行为：环境搞好了，刚开始用也别太嚣张

（大家，不要，一上来，20X，别问为什么，因为我试了两次全...）

1、别一上来就顶配。我是注册完先 Pro，三天后升 Max 5x，，十天左右升 Max 20x。（我觉得直接 Max20 应该也问题不大，但稳点好...）

20x 蹬满的用户是 Anthropic 亏得最狠的用户，还是尽量别一上来拉满......

2、别反复让它干已经明确拒绝的事。因为各种行为 Claude 都是有记录的。

反正原则就一句话，让 Anthropic 觉得这个号是一个正常人在干净地用。

3、关于 KYC，有些推友遇到了，选择自己护照的方式通过(目前还没啥问题)，或者其他渠道的老外的认证。

## ▌补充：

**肉身出不了海那就设备出海（新加坡超稳定方案）：**

[https://x.com/gkxspace/status/2108522433917702540](https://x.com/gkxspace/status/2108522433917702540)

关于Kyc，我目前用下来没有遇到过Kyc，但是如果你有遇到，可以使用中国护照，目前很多朋友用中国护照后也在稳定使用：

[https://x.com/gengdaJ/status/2103049745984037061](https://x.com/gengdaJ/status/2103049745984037061)

## ▌感慨

**好了，这大概就是我折腾大半年的汇总，可以说是包含了全套海外的环境和必备设施。**

拿这一整套配置，应该可以稳定的使用 Claude，而且，这套配置几乎是零门槛的，考虑到了可能会遇到的各种情况。

关注我，之后也会分享更加高质量的内容～

如果大家还有遇到其他问题，可以发到评论区，我会为大家答疑解惑！！！

**本内容长期更新，每次你看到这篇内容，他都会是最新最完善的，也会汇总各种最新的手段和详细方案。**