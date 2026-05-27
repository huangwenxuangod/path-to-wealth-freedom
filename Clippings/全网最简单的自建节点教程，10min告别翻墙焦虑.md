---
title: "全网最简单的自建节点教程，10min告别翻墙焦虑"
source: "https://x.com/Saccc_c/status/2046879897683894457"
author:
  - "[[@Saccc_c]]"
published: 2026-04-22
created: 2026-05-27
description: "最近梯子不稳定，还一直涨价，之前一直用的快连和WgetCloud，价格都快翻倍了。我研究了一番，发现了这个最简单的自建节点方法。整个过程10min不到，核心就一个脚本，小白跟着做就能安好。下面是完整教程。1、购买VPS推荐 DMIT（https://www.dmit.io）：线路..."
tags:
  - "clippings"
---
![Image](https://pbs.twimg.com/media/HGfLTsvXYAAOJGu?format=jpg&name=large)

最近梯子不稳定，还一直涨价，之前一直用的快连和WgetCloud，价格都快翻倍了。

我研究了一番，发现了这个最简单的自建节点方法。整个过程10min不到，核心就一个脚本，小白跟着做就能安好。

下面是完整教程。

## 1、购买VPS

推荐 DMIT（[https://www.dmit.io](https://www.dmit.io/)）：线路好、晚高峰稳，最新价$13/月起。

这里我目前用的是DMIT的美西Los Angeles Eyeball 系列最低档，自用足够。

![Image](https://pbs.twimg.com/media/HGa71F1XYAEV7AY?format=jpg&name=large)

下面是购买和初始化准备流程。

第一步，SSH Key选择第一个自动生成，系统选择Ubuntu 24.04，付款后等待2-3min服务初始化

![Image](https://pbs.twimg.com/media/HGa8Nv4XUAEehUN?format=jpg&name=large)

第二步，初始化完成后点击服务详情页的“前往访问”按钮获取 SSH Key，点击下载，会得到一个zip压缩包。

![Image](https://pbs.twimg.com/media/HGe9rH5WEAAOTfc?format=jpg&name=large)

解压zip压缩包，得到的文件夹里有一个 ".pem"私钥文件。**记下它的完整文件路径，后面会用到。（！！！）**

![Image](https://pbs.twimg.com/media/HGa9R3BXsAEdzq-?format=png&name=large)

第三步，**记下服务详情页里显示的VPS IP，后面会用。（！！！）**

![Image](https://pbs.twimg.com/media/HGfI_79WIAArle-?format=jpg&name=large)

## 2、连接VPS

本机终端输入下面两行命令：

```bash
# 将之前记录的私钥路径和VPS IP分别填在对应位置
chmod 600 "你的私钥路径"
ssh -i "你的私钥路径" root@你的VPS_IP
```

第一次连接问 yes/no，输入 yes。

看到 "root@DMIT-xxx:~#" 就是连上了。

![Image](https://pbs.twimg.com/media/HGa_p6VXMAAUebq?format=jpg&name=large)

## 3、搭建节点的前置工作

在已连接上VPS的终端里先后输入下述命令。

- 更新系统 + 装基础工具：

```bash
apt update && apt upgrade -y                # 刷新软件源 + 升级所有已装包
apt install -y curl wget vim ufw fail2ban   # 装后面要用的工具和防火墙
```

- 配置防火墙（只放行 SSH 和节点端口）：

```bash
ufw allow 22/tcp                  # 放行 SSH
ufw allow 443/tcp                 # 放行 Reality 节点（TCP）
ufw --force enable                # 启用防火墙
ufw status verbose                # 查看状态
```

成功配置结果如下：

![Image](https://pbs.twimg.com/media/HGbAsfHXEAAnfz2?format=jpg&name=large)

- 启动 fail2ban（防 SSH 爆破）：

```bash
systemctl enable --now fail2ban      # 开机自启 + 立即启动
fail2ban-client status               # 查看 SSH 监控状态
```

启动成功结果：

![Image](https://pbs.twimg.com/media/HGbCxMDWAAARy8R?format=jpg&name=large)

## 4、一键脚本搭节点

已连上VPS的终端执行：

```bash
wget -P /root -N --no-check-certificate https://raw.githubusercontent.com/mack-a/v2ray-agent/master/install.sh && chmod 700 /root/install.sh && /root/install.sh
```

安装完后长下面这样，输入3（一键无域名Reality），安装 VLESS+reality+uTLS+Vision——目前抗 GFW 最好的协议组合。

![Image](https://pbs.twimg.com/media/HGbDTFkWsAAv-67?format=jpg&name=large)

后续配置项除了以下三项需要填写，其他默认回车即可：

核心安装方式选 1：Xray-core

端口：443

目标域名：[www.python.org](https://www.python.org/)（或其他国内可访问的真实网站）

```bash
# 可参考的域名
www.samsung.com
www.amd.com
academy.nvidia.com
www.java.com
www.oracle.com
www.mysql.com
```

最后全部跑完会得到二维码链接。

![Image](https://pbs.twimg.com/media/HGbF-o1WYAEFcNX?format=jpg&name=large)

## 5、导入客户端

- 电脑端：v2rayN ([https://github.com/2dust/v2rayN/releases/tag/7.20.4](https://github.com/2dust/v2rayN/releases/tag/7.20.4))

根据Windows/Mac选择对应版本

![Image](https://pbs.twimg.com/media/HGf1qAUXUAANIxJ?format=jpg&name=large)

导入方法：

点击配置文件——扫描之前得到的二维码。下方选择“自动配置系统代理”、“V3-绕过大陆”。

![Image](https://pbs.twimg.com/media/HGfJcJ0W0AAxNyl?format=jpg&name=large)

- 手机端：小火箭直接扫码导入

参考链接：

脚本来源：[https://github.com/mack-a/v2ray-agent](https://github.com/mack-a/v2ray-agent)

DMIT参考文档：[https://docs.dmit.io/zh/](https://docs.dmit.io/zh/)

VPS选购指南：[https://www.v2ray-agent.com/archives/1679975663984](https://www.v2ray-agent.com/archives/1679975663984)（觉得DMIT太贵的可以参考这个，节点搭建方法是通用的）