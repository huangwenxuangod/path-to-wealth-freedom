---
title: "用GPT-6 Astra操控Blender玩3D，保姆级教程来了。"
source: "https://mp.weixin.qq.com/s/yK65CvMwzhQqu5_E5EfVVQ"
author:
  - "[[数字生命卡兹克]]"
published:
created: 2026-09-19
description: "小白也能做3D"
tags:
  - "clippings"
---
数字生命卡兹克 数字生命卡兹克 *Sep 8, 2026, 8:17 AM*

Blender，可能就是这次GPT-6 Astra上线后的最大受益者。

大家真的是玩疯了。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqW8ibSDkqdjNYzF4I6ldkVictUJc0WnEm12iaY0CHkVQykYEGNMZeL8YQDrJ4hw93ickLN5NyLq6VdBgVrOqWvic9JRu8tNJv2I9wnY/640?wx_fmt=png&from=appmsg#imgIndex=0)

直接让Blender的下载量都跟着暴增了。。。

我也没想到，3D这个形态，居然以如此离奇的机遇，进入到了大家的视野里。

在我实测GPT-6 Astra那一篇文章下面，有个朋友留了这样一条评论。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/2jjfQoZLoqXrSApRLCe8icSO8GI0LtlmQYzeib4ODibUekfibkV1EkW1rphobHko8GFsh5obBTmAVibibqlPM5aakOCSnRgCUqxj6snwKmvxBQvNw/640?wx_fmt=jpeg&from=appmsg#imgIndex=1)

然后也有很多朋友说，能不能出一期GPT-6 Astra操控Blender的教程，他们也想玩。

说干就干。

所以呢，今天就给大家分享一下我觉得比较适合小白入门的GPT-6 Astra+Blender的玩法。

跟着我一步一步来，你也能从一个完全不懂建模的小白，做出属于自己的第一个3D的blender模型。

OK，直接进正题。

## 一. 前期准备

在正式开始搓模型之前，我们先把需要的东西准备好。

一个能使用GPT-6 Astra的ChatGPT账号，以及桌面端的App。

下载链接：https://chatgpt.com/zh-Hans-CN/download/

安装完成后打开ChatGPT，点击左上角的模式切换按钮，进入Codex。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqXXr10GZ9icj6yAfvymx9MgVrbDhJsg9YnM9SOUWM6vZv6Wvu8yE1aHKaJpBa0NiaRMl3y9EqVNBzL1iaW93oVH7KPvHu298Flj74/640?wx_fmt=png&from=appmsg#imgIndex=2)

然后，点击左侧项目旁边的加号，新建一个本地项目。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqWNjeZUaQHAPL2HIwKrQOsOK5lvNXWVneYvz6GibTHjoeRLzzVmSnibWfgyv8Ke64qWdnCibAjzWpBTX0qn3ZOgcsS8vdniblQNCCQ/640?wx_fmt=png&from=appmsg#imgIndex=3)

然后，直接跟他说，帮我下载和安装好blender。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqXgT17wo4oFGM6zpaiasia19R1HY7lIFKKCM2UGub0v200sKHCfY0rBaRoia8X2UNgHRDDric9uIFV2S2Bz3uyoNQmECn7UaX6UxLA/640?wx_fmt=png&from=appmsg#imgIndex=4)

Codex会根据你的电脑系统，帮你下载对应的安装包。

当然，还有个冷知识，如果你电脑上装了Steam的话，你也可以从Steam里自己手动下载Blender。。。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqUdpmGJCN8AhhzgnHzKANYVicxGRjAYW5Wx7oibhKhbyh5EupTucWiaYkrktl65WmLZibGfI7MDKNp3Lw7zGZQeIjUIiaf4AuRIeibsM/640?wx_fmt=png&from=appmsg#imgIndex=5)

Blender是一款免费、开源的3D创作软件，现在感觉已经替代C4D成了主流了，我还记得18年我刚开始学3D的时候，主流还是C4D+OC渲染器，然后19年20年的时候，Blender异军突起，直到现在，因为开源，又完美的吃到了AI时代所有的红利。

这玩意也基本是个全栈，建模、骨骼、雕刻、材质、灯光、动画和渲染啥的，它基本全都能做。

一打开，它的界面看起来会有点吓人，满屏都是按钮和参数，中间有一个经典的Box。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqVVdMdU9kWY8bfyhlurOxIx8rWCRdlv1QdY8bOFrqA8ib7a2yoeXuh4ib6ROXM8h2KlSwLAoxKKVLGhTGicpibKcwX5Habic2j8UnDc/640?wx_fmt=png&from=appmsg#imgIndex=6)

不过呢，，完全不用慌。

Codex可以直接替我们操作。

我们还需要再安装两个东西。

一个是，Blender官方推出的MCP，这块一定要注意一下，官方已经出了自己的，不要装成社区的三方插件了。

官方地址：https://www.blender.org/lab/mcp-server/

同样可以让codex直接帮你下载。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqURia0PpcvYwTHcwNMSqBib5vOPRD7xwBjX3ia30A23dbqsrryex3icnTy2d29s7o1lOPQHcXlxIsuEnzn74obordoharMia8Vum2G4/640?wx_fmt=png&from=appmsg#imgIndex=7)

还有一个是ChatGPT官方提供的Computer Use插件。

点击左侧的插件，搜索并安装Computer Use。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqWibvm1FJHviboDd9DabPjGeaPTWlib9zUesu3CKxicLibaRHibiam88U2K0Hu4TaicibszCEh4pY5ZVXrU7WaZ4QgqG3hjicwUeLmPEwsfw/640?wx_fmt=png&from=appmsg#imgIndex=8)

接着，记得把权限打开。

点击ChatGPT左下角的头像，进入设置。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqWUic92ibbswP5LceiaRj4z6xM5bRib7dfhMKVJpJUFQmQKmkVw5621L5auRav50MokNyJWT4IbnHxnwIhgsOfHIm1Zba94wsZh79w/640?wx_fmt=png&from=appmsg#imgIndex=9)

然后在左侧找到电脑操控，把任意应用打开。

mac用户还可以打开下面的锁屏操作，这样即使电脑进入锁屏状态，Codex也能继续执行正在进行的任务。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqWCVnuqkicww2ZVNFCF9Zf95zxd8X7GcHYXpDhgr065RsIlib5FSnWwvNPpqJNeOK8rwKNIGEPYH0BbYtibXV0DNfc2DZg6iaRR00U/640?wx_fmt=png&from=appmsg#imgIndex=10)

到这里，需要的东西就全部准备好了。

接下来，正式开始搓模型。

## 二. 开始制作

现在GPT-6 Astra操控Blender，大概有3种方式。

**第一种是Computer Use。**

学人类建模。

操作起来也非常简单。

你只需要大白话告诉GPT使用Computer Use打开Blender，然后把想做的东西描述清楚。

它就会自己找按钮、移动鼠标和输入参数，再一点一点把模型搭出来。

这次，我给它的任务是搭建一座完整的北京的天坛祈年殿。

我给的提示词是下面这个：

@computer-use 使用Blender搭建北京天坛祈年殿的完整精细模型。先搜集资料，以官方资料、实景照片和可靠测绘图为参考，按实际布局和比例重建祈年殿及台基周边。殿身、柱梁、斗拱、门窗、彩绘构件、三重檐屋顶、蓝色琉璃瓦、鎏金宝顶、三层汉白玉台基、栏杆、望柱、台阶、石雕和地面分别建模，保持独立对象，清晰命名，统一比例与材质风格。重点精修屋顶曲线与出檐比例、斗拱层次、梁枋彩绘、瓦片排列及瓦当滴水、石栏雕刻，以及木材、琉璃和汉白玉的表面质感，做到近景观看仍然精细可信。每完成一批资产就渲染检查，不通过就返工。从正面、侧面、俯视及局部特写对照参考资料，检查造型、位置、比例、材质、悬空及穿模问题。先精修一组柱梁、斗拱和屋檐作为质量样板，通过后再扩展到全场。全程通过电脑界面手动点击操作完成建模，不使用代码、脚本或命令行生成模型。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/2jjfQoZLoqWuwiawOwApjK3aCib4m0hGhkB9ianZvg3mPpJSMS44uRicAhfQMclX3r7NKRujsicBUb6e1JVI3jo0Z6oXo5VibphFG7g0h6icZLSurQ/640?wx_fmt=jpeg#imgIndex=11)

发出去以后，后面的事情就可以全部交给它了。

在前前后后历经了大概4个小时。

它终于把天坛祈年殿做了出来。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqUUtZ3WwGNEXrErkbXOmsSyPMibhJRq5Q02V5HdXPib3UFNFzUdbj8jU2dzL9bACxQpt5yUgXgv8no5e3XeGicU7Go52nzMQ4rdOM/640?wx_fmt=png&from=appmsg#imgIndex=12)

效果我觉得还不错。

我还把过程录成了一段加速视频。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_gif/2jjfQoZLoqVvRyXjSVfSCuBbJtISmQ7iaWuetoiaUAuHmwAUO2oiaCibicrN5kO0gGdxkJbeTu8Kv5ia8bvk9YPOlgR7g2lAtcRc9lonK5KBw2TSc/640?wx_fmt=gif&from=appmsg#imgIndex=13)

看着模型一点点搭出来的感觉，是真的非常爽啊。

Computer Use有一个很明显的优势。

直观，并且是完全跟一个建模师一样操作的，人是怎么做的，它就怎么做。

你可以清楚地看到它现在点了什么、改了什么、卡在了哪里。

但它最大的问题，就是贵。。。

就这一座天坛，直接花掉了我200美刀Pro会员将近一半的额度。

有点肉疼。

虽然GPT-6 Astra的Computer Use确实非常强，但对Blender来说，还有两种速度更快、额度也更友好的方法。

**第二种方式，是Blender官方推出的** **MCP** **。**

可以把它理解成GPT和Blender之间的一条专用通道。

MCP可以直接读取Blender里的场景和物体，并通过底层API执行操作。

速度通常会快很多。

我用了一辆摩托车来给大家看看。

我给的提示词是下面这个：

请用Blender的MCP来制作一辆精细、可编辑的2026 Indian Chief VintageSturgis,SDEdition摩托车。先查阅真实车辆资料，自行生成一致的多视角参考图，再开始建模，以真实照片和尺寸为准。先做好整车比例、车架、油箱和挡泥板曲面，再补充V型双缸发动机、辐条轮毂、悬挂、车灯、车把和皮革座椅。主要部件保持独立并清楚命名，添加符合实车的材质。每完成一批资产就渲染并实际查看，不通过就返工，重点检查比例、外形、机械连接和部件穿插。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqVE72h2SPPvSU5nYGxH8IFqXC99CJtV2dh0xyWbIp3myMpiarLQNepGp1UZwT0bXD2CYibGRiaDTMPD72d7EnE8Cus2Soib2vmHg98/640?wx_fmt=png&from=appmsg#imgIndex=14)

生出来的效果是这样的。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqXSMCF7dHRrichFNK57nibMI2YZmyM1h7iaNf8fFI6ALap1KG3UiaOc6lFrQRHGqL3DAnIREAbGeN6FXctJFYaicuWFLibY1czHMDo9g/640?wx_fmt=png&from=appmsg#imgIndex=15)

模型有了，但是不动起来，就还是不太好玩。

所以第二步，我让它继续基于现有模型，制作一段零件组装动画。

我的提示词是：

请基于现有的Chief Vintage Sturgis, SD Edition模型，用Blender的MCP制作一段10秒、30fps的零件组装展示动画，保留现有模型的外观、双色涂装和材质。0—2秒：以车架为基准，将发动机、轮组、前叉、油箱、挡泥板、座椅等主要总成有序悬浮展开，保持清晰的空间对应关系。2—7秒：零件按合理顺序分批、错峰移动到安装位置，逐渐组装成完整摩托车。动作平滑，有自然的加速和减速。7—10秒：镜头缓慢环绕完整车辆，展示车身曲面、发动机、辐条轮毂和材质细节。主要部件保持独立，动画和相机轨迹可编辑。分阶段渲染并实际查看，重点检查运动路径、部件穿插、构图和镜头衔接。

最后做出来的效果，是这样滴。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_gif/2jjfQoZLoqXsLibIb3yqWk33s3dYfLH3Q8ejO5k1dzBJxzJFHibVfiaGBCn52pCvtbXmVKB7J3v9KMVqjUewLInoSTADINAxicMibegddouS6TRg/640?wx_fmt=gif&from=appmsg#imgIndex=16)

这下就有内味了。

如果你还像让它更好看，还可以让GPT-6 Astra，去Blender构建一个场景，这样渲染的效果会更加完整。

不过，在这个过程中，我也碰到了一个问题。

再生成动画视频的时候，MCP的单次运行超时了。。。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqVOg14Bicb2ZnVFhCw5tA40Q2QtbmibXowcXWBc4ZdPibcsdkoKQ5nd4SE9wAFO7UzBHBic1PtDPEjxJBiaUWMGPnbyUL94Ba82P1hE/640?wx_fmt=png&from=appmsg#imgIndex=17)

这也刚好暴露了MCP在处理复杂任务的一个约束。

解决起来也不难。

遇到一些复杂操作，可以尝试把任务拆成更小的步骤，一步步完成。

或者也可以试试接下来的方法。

**第三种方式，通过** **CLI调用Blender，执行** **Python脚本。**

这也是在实际操作中，最常调用的方式。

它和MCP在底层其实非常接近，两种方法都会使用Blender的Python API。

GPT写好代码以后，Blender再通过 `bpy` 创建模型、添加材质，等等完成后续的处理。

区别在于，MCP更像是连接并控制一个正在运行的Blender，CLI则是启动一个Blender进程去执行脚本。

但在其他条件相同的情况下，两种方式最终生成的模型效果，不会产生特别明显的差距。

日常我更推荐大家，使用GPT-6 Astra + Blender MCP + Computer Use来做。

**三. 配合3D生成模型**

现在大家已经看到GPT-6 Astra + Blender来去做的效果了，不过，大家可能会发现，上面的那些东西，基本都是几何体。

这也是AI现在比较擅长干的东西。

但是一旦涉及到生物类型的，就会效果比较差了。

比如说，让AI去复刻一个这样的金克斯。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqWcvicibt1PL7kzAbOzlwPZdA1icrffmw0glgGic1pafSv5Z4gvm4pcDueJiab9TKrkVcqcmz04whcribwBlO9WWYMnkn1D6O7MHOX3M/640?wx_fmt=png&from=appmsg#imgIndex=18)

只能说是毫不相干。。。

这也是目前GPT直接用Blender建模时，一个非常明显的短板。

从前面的天坛和摩托车也能看出来，GPT-6 Astra更擅长建筑、车辆和机械设备这种可以拆成大量规则的几何结构。

而我们给出来的图片，可能确实有点刁难了，因为人物基本就是建模里最复杂的了，跟一些几何体的建模方式完全不一样，我们过去做这种基本的人物的建模，都是用Box大概拉个型，然后基本都是直接手动ZBrush去雕刻出来的，这个真的就是传统的手工艺活，特别是肌肉的走向，跟老艺术家手工雕刻真的没啥区别。

![ZBrush |数字雕刻软件。雕刻与创造| Maxon](https://mmbiz.qpic.cn/mmbiz_jpg/2jjfQoZLoqW1ba2CqNNicIxrQn3OJwowEKmKRe4nPWUplJk2kiaP8o9ib3GKibgsXub1SWsJTTuQNL9hkla4fukicibTlm7ENpgAreAjYdDmp85Ck/640?wx_fmt=webp&from=appmsg#imgIndex=19)

ZBrush |数字雕刻软件。雕刻与创造| Maxon

所以，大家如果现在想复刻一些生物的3D模型，这一步就别用GPT-6 Astra去硬操作Blender了，可以借助专门的AI 3D生成模型。

比如，这么一个手办风格的金克斯的角色图。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqUApfgxRc4A2IzicblV1ZjGn7omDFVyzLWZgyhWyT3vpQeIProGkgRriahcDB71Niar6NBfK98yWCod8ME2zgFnCg3denHZvRHQG8/640?wx_fmt=png&from=appmsg#imgIndex=20)

让GPT-6 Astra操控Tripo AI生成角色3D模型，再把结果导入Blender。

这一版的效果，就明显好了很多。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqUR3GlvnZoVTiaLXgBUoEfY32Wo6zZgL57sJHPdVvZibKqYMzPP8wcdlJQJWASMNVSc8gR4s3j1Mt6lhenODFqicNJPaNUo7XQswc/640?wx_fmt=png&from=appmsg#imgIndex=21)

所以，这种偏生物类型的，用GPT-6 Astra操控AI 3D生成模型，在导入到Blender里，来处理后续所有的流程，就会更加合适一点。

我们再用牛来举个例子，从建模到动画，完整走一遍制作流程。

在传统影视和游戏流程里的建模，一般需要好几个环节。

建模师先对照原画和不同角度的参考图，把角色的比例、轮廓和细节一点一点做出来。

除了外形，还要整理模型的拓扑、展开UV，再制作材质和贴图。

做到这里，才拥有了一个可以使用的静态角色。

如果还想让它动起来，需要继续做骨骼绑定、刷蒙皮权重，让身体各个部位和皮肤能够跟着骨骼自然变形。

之后，才是具体的动画制作，摆出姿势、设置关键帧，再反复调整动作之间的过渡和节奏。

每个环节都得一点点打磨。

真正耗时间的，往往就是这些又琐碎、又枯燥的基础工作。

所以这一次，我们也照着这套流程来。

先上传牛来妈妈的角色原图，然后让它生成一套统一的多视图设定，作为后续建模的参考。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqWTiaFRlNDqkSQR5WEDRIibXg3ic6zo16mibvQTt8lnicumOoZtSl6lbuLWgd2AL5bUB0zkgyr8nryRJviaHU7AI96iaey18oc3TJsQDE/640?wx_fmt=png&from=appmsg#imgIndex=22)

接下来，正式进入Blender的环节，把牛来妈妈的基本轮廓和身体结构做出来。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqXZ567ypmwrU57bD0fKWKL9wSemDN9qtFLQnXBoh9SS0XOf7kxp0ApiamD1cUVodw12bAezE6xcklL7gzeH3ib1w4g5qOJS8JOeg/640?wx_fmt=png&from=appmsg#imgIndex=23)

然后整理UV、制作材质，再给它上色。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqVky6aefbMEkxx11IAvia5x5xUf83X0L7o8ZxliczfugL1HH4LswQbV4tEXJBlY5PluIXql9RLDCjQe4apIevIzH8qsG2mpom7nk/640?wx_fmt=png&from=appmsg#imgIndex=24)

做完以后，感觉眼睛和头部比例还有点问题，又稍微修改了一下。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqVaic6E0michicViaZCsYwMicvFZY0ep4Xp9KSLSW80tiauKiaxDjzz815UYZKibIibceB047UIehu1jREVtGPzAukBBUw48zyNFtNwokGI/640?wx_fmt=png&from=appmsg#imgIndex=25)

静态模型处理的差不多，就可以让它接着绑定骨骼。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqWlBQDp4c9ZoOuiaHCejzfko48QDibY0ylm4VulbQJSEiaMthm8QapbKEibUMEJERTrk5nLco5cFsNdDrbUhapRzbibE2p6FDaysfH8/640?wx_fmt=png&from=appmsg#imgIndex=26)

最后，再来处理场景、表情和动画。

我想的是，可以让他来跳段舞，再根据BGM来喊妈妈和牛来！

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqXhSxPRSsyq6iah0g7kedziaFZDOntMx2GiaEXUmWuKbZsUPicfS8NL4pHaLXbRR83OiacxQoBh064N4LOtZLHPZwy7ZaXreiazJwJd8/640?wx_fmt=png&from=appmsg#imgIndex=27)

最后做出来的效果，是这样的。

虽然属实是有点抽象，但是还蛮好玩的。

而且这套玩法，平时拿来整活也完全用得上。

你可以上传一张自己或者朋友的照片，让AI把它变成一个3D卡通小手办。

再给它编支舞、安排几个搞怪动作。

就很有意思。

## 写在最后

我忽然想起了7年前，我在朋友圈里发的一个3D的作品。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqUSuZ3e2hhz7ib29s9FCB7IBficsp2wMEGLNibW3m0HVWZ0bt0qiacoFZyRBInA2t4U3CBNGh2fButGez2qNFn1XO65HEXnialHsVC4/640?wx_fmt=png&from=appmsg#imgIndex=28)

是根据一个海外的艺术家的图参考，然后我自己一点一点建模贴图然后渲染的。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/2jjfQoZLoqWFu691xepZm2mJ1uj1xYtD3mRZ2sedYia3I4D9gEnlu2zp0cfJ6icqecgx1tuMecAeVhIicgmBQjA10ianiaGDXBiaXiaiaTM884GamXg/640?wx_fmt=jpeg&from=appmsg#imgIndex=29)

这一张图，每天下班以后回家做，做了整整一个月。

那天晚上，用OC渲染了一整个通宵，然后在早上8点多发出来了。

一个月的时光啊，就为了一张图。

现在想想，好像这是一个不可思议的念头了。

创作越来越平权了。

每个人心中有想法，都可以让AI去操控软件，来帮你做出来。

虽然现在还很贵，还比较慢，但是，至少能做出来。

而且趋势一定是越来越便宜的，就像去年，我们想象不到，一个Coding类的长程任务，能做到这么便宜，当年，做一个PPT，甚至都需要20美金。

但，人人都可以做了，却不代表，好作品会涌现。

以后真正拉开差距的，会越来越变成你的想法、审美、判断力，还有那点愿意继续折腾下去的好奇心。

我还挺期待看到，大家都会做些什么出来。

最后。

祝大家，建模愉快。

******以上，既然看到这里了，如果觉得不错，随手点个赞、在看、转发三连吧，如果想第一时间收到推送，也可以给我个星标⭐～谢谢你看我的文章，我们，下次再见。******

\>/ 作者：卡兹克、可达

\>/ 投稿或爆料，请联系邮箱：wzglyay@virxact.com

Codex · Table of Contents