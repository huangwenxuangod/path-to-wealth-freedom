我在使用Codex的时候，总是会遇到作为plus用户的痛苦，就是用了一会就会撞上5小时限额墙，但200$一个月对我来说又有点太贵了，恰巧最近gpt plus的账号池中转非常火，我认真学习了一天，终于搞出了无限制使用的Codex，下面我就来介绍一下这里完整的过程。

无限制使用Codex，简单来说就是将多个gpt plus账号的所有额度统一在一个接口，在我的Codex进行统一管理和调用。

听起来不难，但要落实下来有几大难点: 账号，中转站，配置管理，我将会从这三个方面详细阐述完整的流程。

## 账号

对于前不久出现的gpt账号漏洞，原理很清晰，就是一个土耳其区的gpt代充账号，只有八十五块人民币成本，能给无数个账号开 plus会员。闲鱼上那些二三十块钱一个月的 gpt plus 代充，就是这么来的。更有甚者，已经在源头压价到了几块钱，开10个这样的plus账号还不及一个正版的plus账号贵。

如何找到售卖这些账号的商家呢？有三种方式:

1. 闲鱼: 通过各种复杂的关键词搜索，因为gpt，代充这种过于敏感的词，在闲鱼上已经快被封干净了，但是办法总比困难多，之前gpt-image2模型出来之后，就有相当多的image2作为标题去售卖账号的，本质提供的是一样的服务。
    
2. Github: 看似Github只是一个普通的代码托管网站，但是有大量的相关技术，比如说账号注册，中转网站，代理协议等等项目都在上面开源分享了出来，同时在这些项目下方往往会有各式各样的交流群，讨论群，在这些群组中就会有相当的资源分享出来。
    
3. L站: 含金量最高的网站，基本上各种各样的账号资源和技术实现等等都能在上面看到，唯一的问题就是我的GitHub账号还没满3年，不能成为它的用户，难蚌+1。
    

作为高贵的plus用户，这些帐号大多都是outlook邮箱+卡密/验证码的形式去提供的，有一些账号需要有手机号验证，并且需要提前准备好稳定的网络环境才可以。

一般来说，统一购买的账号可以导出为cpa json文件格式，在后面的sub2api账号导入部分会有很大的用处。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=Zjc3NDkwZGNhNTI5ZmMyNTRjZGZkYjc1NzI3YTA4NDVfbzdpWER2STJvdFN3UmM4clFxWjNKalAyem4xNVRkWmpfVG9rZW46WFhVMWJFbGlYb2kzMEh4b3ZyUmNFN044bjdjXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

## 中转站

### 服务器

如果只是个用的话，其实在自己的电脑上去进行类似的操作也是可以的，问题是它不能一直开着去使用。

因此我的建议依然是，sub2/new api + 云服务器vps，前者提供的就是将所有的AI token资源聚合成一个api接口统一进行分发的功能，而后者就是用来进行部署和长期运行使用的。

我这里用的是racknerd，唯一的原因就是非常的经济实惠且没有流量焦虑，https://www.racknerd.com/。

我这里通过当时的黑五折扣能直接做到一年七十多左右，选用的是最便宜的1G1核的服务器。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MWZkZjYzYzMyZGMzNGIyMGI2MTY5OTlkZDZmYTRhZTlfekU5cUJCeXJiQ2RxNWpTdDQzVzAzT1Fsd1NWWVR4aWNfVG9rZW46RkE4OWJuYnp3b3NoM0N4WExUWGNoS0RsbnZkXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

购买之后会获得对应的服务器ip地址和相应的密码，我们这里直接通过命令+密码登陆进去。

```PowerShell
ssh root@你的服务器ip地址
```

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MDA3MjEzZDQwZjBlODcwZjE0ODdmNzI5NzY3NTQ5YTZfNUJJdmlOek1QYko4cTByQXF1Rnhsa05IMG5NVHI5Z0hfVG9rZW46UmF3aWJNcURXb3B1eDB4TktXZWNKVk85bjhFXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

接着就是在服务器上部署自己的sub2api服务，在此之前可以先更新一下软件源，根据下面的命令。

```PowerShell
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

部署sub2api的最好方式还是用docker+docker compose进行部署，先确认一下对应的版本。

```PowerShell
docker --version
docker compose version
```

如果没有安装的话，就向gpt或者豆包提问，告知一下你当前的情况和怎么进行安装，并给docker设置开机自启，搞定之后再用上面的命令重新确认一下是否已经安装好了。

对于已经安装过的用户来说可能会遇到类似的问题，就是需要选择哪些服务要进行重启，可以直接按Tab+enter退出当前界面即可。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NGRjYWY3YjJlMWI4YjI0NjFiYzg4OGZjZDkyOTg0NzdfV2N6Q0lxNlpzWGZmemFMWGRkSWJJMGJSNUV6ZExUMHhfVG9rZW46V3ptSGJrWGI5b25Ubk14NVk1NmNPb2M5bkFmXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

### 部署

```PowerShell
# 创建部署目录
mkdir -p sub2api-deploy && cd sub2api-deploy

# 下载并运行部署准备脚本
curl -sSL https://raw.githubusercontent.com/Wei-Shaw/sub2api/main/deploy/docker-deploy.sh | bash

# 启动服务
docker compose up -d

# 查看日志
docker compose logs -f sub2api
```

一切顺利的话就能看到跑在8080端口，直接输入下面的地址。

```PowerShell
http://服务器IP:8080
```

看到这个页面就是已经部署成功了，我们在刚刚部署的的日志中找一下对应的默认邮箱和随机密码，一定要记得修改默认密码！！！

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NWU2M2NkYzJjMDU4ZTI0MjI4NmI4NzYxZGIwNTkyYjZfOVh3SEN6YlBMd2ZuZ2dDdzd6ZXdUeGxCUmlXaHEwdnpfVG9rZW46S1V1N2JGZGhJb2VMYmd4QmNJaGNqOUpYbm9kXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

```PowerShell
Email: admin@sub2api.local
Password: ************
```

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ODM0NTMwNjIwMTMxY2NlOTJkZmY4OTlkNDIyMWUzYWJfWUZLRjZlWWg5TlhweDR6dG5CNkpRbVpqZ0JpY05tRGJfVG9rZW46TE82cWJjOGVVb1o4ck94SVhlMmN0TEVEbkhWXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

### 账号池

登陆进来之后有一个详细的使用教程，想要看完比较复杂了，可以跟着我的步骤去一步步实现。

进来之后直接点击账号管理，然后点击更多操作，点击导入。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YmZlNTc4ODUyNzE0N2ZjYjAzMzQ0MmZmODEyY2FlMTlfTWZkTmoxVHNZY09pMG5NaExQT0hIZUFJWEg5Z2diT1BfVG9rZW46WDgwWmJFbldBb0VKMFV4cHhYOWNlTlRQbk5iXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

选择我们前面获取到的cpa json文件，直接导入成为新的账号，以此类推进行导入创建。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NTA3N2VjNjMwNzZlNWRiZGFlZjZhYmYxY2VmMjMwZjlfYTdRT1dYOVFLNHZ2M1p3VnAwZEhPb21SbzVYbXRlQ0JfVG9rZW46SzFQZWIySUk0b2VpVGp4a1Z0MmM1ZkZkbnljXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

接着点击全选复选框，点击批量编辑账号

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGYxZGFmYWYzZjQyYmY0YzdkYjAyZjIxYWJjMjg2NDdfYnlxbld0M0hQYVdKZDljMHRYSnNodXFDMEJHeVBWMURfVG9rZW46U21JNGJWeW96bzBSWXh4N0NrcmNhdDJhbnVjXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

在这里面找到模型限制，点击复选框，点击下方同步最新支持模型。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjljYmE4NTU1NDJiZmZkMmVhNDk0OTQyOTY3M2NmYWRfTUNXUGN1Y0RkdWpCMVdrSzR6TDRMWm1KTjczZjNVWXRfVG9rZW46QVVSNGJrN3NLb2psVmJ4MkhNcmNmaUpSbkNkXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

并发数这里默认是1，可以按照自己的需求进行调整。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MzdlNmY2NWU0YWUwZDAzNWY5ZTg5ZjJiMDczYjg1OTBfemVhWFZkMHd5cFpiOGl6RVVkblV5VnBabHoxelNlWHpfVG9rZW46UFhLMGJBV2dKb05YZTl4VHRhOGN1TGR0bjZlXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

分组选择openai，然后直接批量更新即可。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YjU4Mzc3Y2Y0NTJmYzI1MTg4NTM0YTI2YWY1MzlmMzVfM0l2SVVUOG90dE5ZYUp2TlJzWW9PUjlydHFkeVY4dHhfVG9rZW46WHRCNmJGVXlXbzFDblB4MFBVRWN5OWptbmtkXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

接着来到用户管理这里，作为高贵的管理员，先给自己充一个亿不过分吧doge。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MThjYWRiM2Q4YjNlN2M1NTQ1ZGU3ZTdkMmQ4OGY5ZjJfQzJiMXFkT253MW9lQ2hQemFZM1pSSGFGNzdGYU5SOXVfVG9rZW46Q2ZxS2JUdXZ4b2sySUR4WUxXVmNpV1dEbjRkXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

有了钱之后，我们来到API 密钥这里点击创建密钥。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MDUwN2ZhOWM0NGI3OGFjYzFmYzk4MWE3MDVjNmY2NWFfTDR3ZGU0S1R6bzdiaVZyTUd6VmJwaEZFWEpMeGdZUXNfVG9rZW46VDVVcmJuSG91b0VQOFh4Z3d0UGM5UGN2bmxmXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

名字随便填，分组填openAI，额度限制填0，然后直接创建。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NzBkMjRiOWE4MjI0ZjlmNDU1MGIxYjQ2YzlkMDYwZTlfTUdqRmRXcndjM3dOYXlDWmhpaEdXTnNHM3dIaUlBb3NfVG9rZW46WkdWRmJhTUdzb2NHSEd4SzlDWWNmNXA4bkVnXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

## 配置管理

有了apikey之后呢，接下来就是我们本地环境的配置管理，这里我们选择使用的是ccswitch，你可以理解为本地的配置切换工具。

在 https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v3.14.1-zh.md下载安装后，点击 导入到 CCS 完成一键导入：

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YjA3MGE2YzMxMzUzNzAzNzkyNDNhOTg2OTBhMTM1ZmFfallZcFZTNkhmRTFlQUJWZjFuTzZKck1GbHIwMEd5T1NfVG9rZW46QUV2SWJiUG13b1BRb3F4Wm1zUGNUVDFSbm9jXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NGUxZWU2YmY0ZGY0YWI3NDFmYjUwODA0NDQ3YTIwNTlfY1Z5NktHeWxqRWFtc2d3QjhrMVFlMWJraGdVNzlhVERfVG9rZW46TUcybWI3RnJUb0lzc3h4UE5YeGNmOGttbkRkXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

导入之后就是这样的情况，是不是启用之后就能够在Codex里面直接使用了呢？实测下来发现并不是这样的，我们这里还需要用到一个开源的项目名叫CLIProxyApi，简称CPA。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=N2NkNzUyOGU2OTJjOTg0NDZlNTU2MjM4YzkwN2E5YjNfdWRua2xmckZyUGM0T1N4VTBENDFmeUNiQllzdnpBakhfVG9rZW46QW16SWJBUml3b1RxcFh4clJmQmNHRXpHbkxlXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

在ccswitch中点击edit编辑图标，并将原来的代码替换为下面的配置，这个很关键，使用cpa的协议进行代理转发。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NjM3OTk3OTVlYmIwZDhiMzEyYTMzYjM0ODRlMTE0NGFfME82eGdLbUQ2dkJjMzIzRFoxMk80bnRJUWpKWm5SZUVfVG9rZW46WXQ1VGJET0Fib0h1OFp4eFh5SmN4R0tGbkRnXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

```JSON
model = "gpt-5.5"
model_provider = "cpa"
model_reasoning_effort = "high"

[model_providers.cpa]
name = "CPA"
base_url = "http://服务器IP:8080/v1"
env_key = "CPA_API_KEY"
wire_api = "responses"
```

接着打开系统环境变量编辑，在用户变量中添加CPA_API_KEY为变量名，变量值为你刚刚的API key值，点击保存。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDc0M2JhODQ0NGFmMWIxZjBiMWIwNmI0MmQxN2ZiMzZfOWY5MEJ3TEtFYmhNUzVnalR6SnIyMmlQRmhFSjc5VXdfVG9rZW46VndEd2JKVWtTb29WSVl4amdFb2NiUW9Ibmx4XzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

现在再尝试用Codex 桌面端或者Codex CLI 去进行对话试试看吧

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=OGU1YjhlMWE1MzMzNjU5MWIyMmM4YTA3ZjY3MWZkOGVfNkNmRE5GT1ljVFkyQWlvZVNOY1piWlpHYzU2N0s4dlRfVG9rZW46WU1xQmJaM1lyb1dUeEl4RGdTSWNVRTJmbndkXzE3Nzg2NjYwNTk6MTc3ODY2OTY1OV9WNA)

不仅是Codex，Openclaw，Hermes agent都能用同样的方式直接导入，并且claude code也是照用不误。

  

至此，无限Codex的使用秘籍已经传授完毕了，赶紧去试试吧！