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

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YTlhNzNmMWEwZThkNzViOGJhY2NhNDhmNDQxNzFmMWVfYUtxd0xBcm11alQxczlBVUhjZ09ObWN1aTJZaW8wQXhfVG9rZW46WFhVMWJFbGlYb2kzMEh4b3ZyUmNFN044bjdjXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

## 中转站

### 服务器

如果只是个用的话，其实在自己的电脑上去进行类似的操作也是可以的，问题是它不能一直开着去使用。

因此我的建议依然是，sub2/new api + 云服务器vps，前者提供的就是将所有的AI token资源聚合成一个api接口统一进行分发的功能，而后者就是用来进行部署和长期运行使用的。

我这里用的是racknerd，唯一的原因就是非常的经济实惠且没有流量焦虑，https://www.racknerd.com/。

我这里通过当时的黑五折扣能直接做到一年七十多左右，选用的是最便宜的1G1核的服务器。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MDU4ZmQ0MWU5M2QwN2NjMmY4YzdjYTI5MDA2MTcyNzRfS3hOeVBTUUxrTDdia2ZkSG4yZmtFZVFmcnlrUEdlellfVG9rZW46RkE4OWJuYnp3b3NoM0N4WExUWGNoS0RsbnZkXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

购买之后会获得对应的服务器ip地址和相应的密码，我们这里直接通过命令+密码登陆进去。

This content is only supported in a Feishu Docs

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MzdiZmQ5NTM0ODVlNjZmZDUyOTRjMmQ3NDY0Y2UzMjVfbWNoNTJDWkpzSEpsTEZvcXdac216dnJjd0JvdnlNVlBfVG9rZW46UmF3aWJNcURXb3B1eDB4TktXZWNKVk85bjhFXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

接着就是在服务器上部署自己的sub2api服务，在此之前可以先更新一下软件源，根据下面的命令。

This content is only supported in a Feishu Docs

部署sub2api的最好方式还是用docker+docker compose进行部署，先确认一下对应的版本。

This content is only supported in a Feishu Docs

如果没有安装的话，就向gpt或者豆包提问，告知一下你当前的情况和怎么进行安装，并给docker设置开机自启，搞定之后再用上面的命令重新确认一下是否已经安装好了。

对于已经安装过的用户来说可能会遇到类似的问题，就是需要选择哪些服务要进行重启，可以直接按Tab+enter退出当前界面即可。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDE3NThjOGYwZTA0ZTBkOGU1NzFkN2UzY2ZkMDBlMDRfVjdYNlg3d2xTOHBlRE9hWFF0cWg2dnowblZqRFl4cEZfVG9rZW46V3ptSGJrWGI5b25Ubk14NVk1NmNPb2M5bkFmXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

### 部署

This content is only supported in a Feishu Docs

一切顺利的话就能看到跑在8080端口，直接输入下面的地址。

This content is only supported in a Feishu Docs

看到这个页面就是已经部署成功了，我们在刚刚部署的的日志中找一下对应的默认邮箱和随机密码，一定要记得修改默认密码！！！

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NDI3M2Q4MGZjYjFiYjU3ZDYzYzQ4MGIxMmNiYWE1YjFfTTB3Qkl6bGdpRzhrUU56bWR0NXRnSkRxMVRxYVBVaDlfVG9rZW46S1V1N2JGZGhJb2VMYmd4QmNJaGNqOUpYbm9kXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

This content is only supported in a Feishu Docs

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YzE3NjVmNTZjNTJlMjI0MDRhZTEwZjFjMTllNzRkOGRfR29taWJPQnNYeWpBYXVqU3RHY2VhM2RpUzhWMFluYmJfVG9rZW46TE82cWJjOGVVb1o4ck94SVhlMmN0TEVEbkhWXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

### 账号池

登陆进来之后有一个详细的使用教程，想要看完比较复杂了，可以跟着我的步骤去一步步实现。

进来之后直接点击账号管理，然后点击更多操作，点击导入。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NzNlMDA0YTNmYzAwOGJiOTFhZGQxOWYzZTgyM2E0MWVfUUpjOWtZVmVoSkMzWFBhY2FWS0lzazRwdGllVjI0NlZfVG9rZW46WDgwWmJFbldBb0VKMFV4cHhYOWNlTlRQbk5iXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

选择我们前面获取到的cpa json文件，直接导入成为新的账号，以此类推进行导入创建。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YzhlYmM0OTVlMWZhNWUzNWVmOGNmYWYzN2JkMGI1NWNfaXJyZDIySEYzc09JUHBTRXpUTG1zUlllSHhSTldrR1RfVG9rZW46SzFQZWIySUk0b2VpVGp4a1Z0MmM1ZkZkbnljXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

接着点击全选复选框，点击批量编辑账号

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NmVmMDMwN2RmZjZiOTVmNjZkOGJkMGJkMGEyZDc2ZjJfTUs1dG5MclNOY1FEdmxpZnhQVzJRUjFiSk1rdEp6MXZfVG9rZW46U21JNGJWeW96bzBSWXh4N0NrcmNhdDJhbnVjXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

在这里面找到模型限制，点击复选框，点击下方同步最新支持模型。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MDFiMzRlMGE5ZmVjNTllMzA1M2Q1NWUwMmY2YWYyYWFfZ0cwUElDZjBLZ0oyeXg5V1lISEpyb292ZzNsaWlubkNfVG9rZW46QVVSNGJrN3NLb2psVmJ4MkhNcmNmaUpSbkNkXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

并发数这里默认是1，可以按照自己的需求进行调整。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MTMzY2YxOTA0ZTM2YjFmN2E0MDQ4NjkzZThkN2IwZWFfM0lLcTM2SEtmUnJDRVZKekZqM24zc2x5TGtZRGpaa1dfVG9rZW46UFhLMGJBV2dKb05YZTl4VHRhOGN1TGR0bjZlXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

分组选择openai，然后直接批量更新即可。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MDFiYmU5NzRkMjNhZTJjMmMzMWU2NTc1MmY0YjcxNjJfUE51WDViUnNUVEI3d1lSR2ZIcnRzSTZ5TGMwQ0Q4Nm1fVG9rZW46WHRCNmJGVXlXbzFDblB4MFBVRWN5OWptbmtkXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

接着来到用户管理这里，作为高贵的管理员，先给自己充一个亿不过分吧doge。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MDRmYjVjMmI0YTVjNTBlYjRkYzY4OWEyYWJjYWIzZjNfZlREN0k0eFlnSFpnaVdiTldkekY1VVhTNU45RDNQYnFfVG9rZW46Q2ZxS2JUdXZ4b2sySUR4WUxXVmNpV1dEbjRkXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

有了钱之后，我们来到API 密钥这里点击创建密钥。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YzlkYjFlN2UzYTc5Y2M3NGMwMTc1YzMzMzczYTJkNzdfRDhIbTVEeTNCSWdOMFM3WGVCZXN6cWx4bjdzemg4NWJfVG9rZW46VDVVcmJuSG91b0VQOFh4Z3d0UGM5UGN2bmxmXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

名字随便填，分组填openAI，额度限制填0，然后直接创建。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YzM2NWU5MDQyYzU2MjVlZmMzNmQwZWEwYzc1NDkyZmFfbE9mUlZzZkk5dHB4SnRhNkdKcHN4UnFEZzB1bXdjczdfVG9rZW46WkdWRmJhTUdzb2NHSEd4SzlDWWNmNXA4bkVnXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

## 配置管理

有了apikey之后呢，接下来就是我们本地环境的配置管理，这里我们选择使用的是ccswitch，你可以理解为本地的配置切换工具。

在 https://github.com/farion1231/cc-switch/blob/main/docs/release-notes/v3.14.1-zh.md下载安装后，点击 导入到 CCS 完成一键导入：

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjY5YTdiZGNjZTdlODVkMzEzYzFkZDBlNTE1MDJhMzVfN1FZWWJOWjh4ckhTbUtRRWVsWktoTEJhb2I2dm84RkFfVG9rZW46QUV2SWJiUG13b1BRb3F4Wm1zUGNUVDFSbm9jXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=OTM2MmRlN2JiODVmZjFhMTc4MWEwYWZiZjNkNjMyMmRfd1dyWXVJRTBvdkNMT0tVV0hCaEtUMWJKMU4xRUFHVjFfVG9rZW46TUcybWI3RnJUb0lzc3h4UE5YeGNmOGttbkRkXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

导入之后就是这样的情况，是不是启用之后就能够在Codex里面直接使用了呢？实测下来发现并不是这样的，我们这里还需要用到一个开源的项目名叫CLIProxyApi，简称CPA。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YTY1NGIyODdkMDNjNWU0Y2JiNjA5ZjQ2YTQwZTVkYjlfRHhLRzVxZWhabEREZzlJdzJlcTJ0bHR1YUIzeW5FOHFfVG9rZW46QW16SWJBUml3b1RxcFh4clJmQmNHRXpHbkxlXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

在ccswitch中点击edit编辑图标，并将原来的代码替换为下面的配置，这个很关键，使用cpa的协议进行代理转发。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=OTU1YTZmZWY2MDMwMjdmYjUzNjNjYTBjNTZjNWI5OWVfMWV1enBPV2RkVGRkbWI0OFYxb3NjWWlacnQyWkJnWTFfVG9rZW46WXQ1VGJET0Fib0h1OFp4eFh5SmN4R0tGbkRnXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

This content is only supported in a Feishu Docs

接着打开系统环境变量编辑，在用户变量中添加CPA_API_KEY为变量名，变量值为你刚刚的API key值，点击保存。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NWI5MDNkODNmYjRjNDllMmZhMzllZjg1NThjNDhiMWRfRHQ0eHFNTDF1TWljRndUVkEyWXdNNUhTaFFmcmh5U2NfVG9rZW46VndEd2JKVWtTb29WSVl4amdFb2NiUW9Ibmx4XzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

现在再尝试用Codex 桌面端或者Codex CLI 去进行对话试试看吧

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZjExODhmZjFmOTMyOTFlOWY4YmI4ZmQyMGZkZTUxNmJfVEFjZW9kQnZla1VkMFJDdEhYNXJUcGMydDlJWmZhOFBfVG9rZW46WU1xQmJaM1lyb1dUeEl4RGdTSWNVRTJmbndkXzE3Nzg2NTc2MDA6MTc3ODY2MTIwMF9WNA)

不仅是Codex，Openclaw，Hermes agent都能用同样的方式直接导入，并且claude code也是照用不误。

  

至此，无限Codex的使用秘籍已经传授完毕了，赶紧去试试吧！