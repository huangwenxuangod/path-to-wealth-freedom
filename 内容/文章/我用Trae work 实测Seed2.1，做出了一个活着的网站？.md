Seed2\.1正式发布了，刚好我最近在准备参加这个Trae的AI创造力大赛，于是就直接用Seed2\.1构建了一个网站出来去参赛吧。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MGM4ZTdjZDQzZjdhZDNhZDZkZGNkMGNiYTBmMjY4YWNfOTIyMWQyZjc4OWY2NGVkMTRiMTg1NWVhNGI3MzdmM2RfSUQ6NzY1NDUyNTQ0MzAxNDM4MDcyOV8xNzgyMjY0Mjk3OjE3ODIzNTA2OTdfVjM)

我们先来看看在Code Arena\|WebDev也就是网页端开发上的排名，seed2\.1\-pro能排到第八名，仅次于claude一堆模型和glm\-5\.2，可以说也是挺厉害的了。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZDlhMTFiYTIzMjJiOWYxYmM5ZWNkNGM0MDIzNDliZTZfMjkwOTBhMTMwMTRmM2M3ZTkwMjhiYzNlN2JjYjE2ZTZfSUQ6NzY1NDUyNjEzNDA0NjY5MDU0OV8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

现在国产模型和agent也是越来越厉害了，glm、deepseek、qwen、kimi珠玉在前，workbuddy、trae work这样的agent平台虽然模型不算特别强，但是harness\+营销做的好也让这两个agent平台在国内目前还是遥遥领先。

因此我们用Trae work来测试一下最新的模型seed2\.1，看看它到底是不是真的像发布会时说的那么厉害。

想直接体验就直接去官网trae\.cn，直接下载对应的桌面端版本即可。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YTZlYWRmNDRkMDIyYzlmMzEzMzYzYWE3MTI1OTJkODVfNzAyMTI3OGVkYWJjZjQxMGU4MDU5YWY2MWFmNmEyOGRfSUQ6NzY1NDUzMDE1MDE1OTQ4NTkyM18xNzgyMjY0Mjk3OjE3ODIzNTA2OTdfVjM)

下载了之后打开就是经典的agent式界面，点击下面的模型选择我这里选择的是Doubao\-Seed\-2\.1\-Turbo，跟pro对比起来就是响应速度更快，思考深度略浅一点。但用来跑我这个小demo应该是绰绰有余的。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MmVmMjMzYjY4ODZlZDEwNDhhM2U3ZThkNTQ0Y2IyYTlfYjIzMmEwZGY4ZWVjZTRhMDYxZDM3ZGU2YTBjOWIzODlfSUQ6NzY1NDUyOTc4ODcxNzg0NTQzMl8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

## 项目介绍

项目的雏形在seed2\.1还没出来的时候就已经开始搭建了，就是一个30天赚钱生存挑战记录的网站Alive，做这个的初心就是想让自己push自己更狠一点。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NzRlZDUyN2U4YjhjNWZkYjY3MGJkYWMwMTgzZGU1M2FfZWFiZjliZjI2NWJiZmI4ZTllOTViMDM3YTlmMGEwNmRfSUQ6NzY1NDUzMzgzMDMyOTY5OTI4OF8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

像是国外marc lou大神做的ship or die就是通过交一笔钱去迫使你在30天内构建出来一个app，想法就是类似的。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MTk4NDhiMzI4YjdjNDZmMjU5ZDBmMzUwZGIzNTRhZjhfM2UzYjMxOWI3OTQ1MTEwMjJiNmRhYjI5MDdiNjlkZDNfSUQ6NzY1NDU3MzU2OTU0NDE3ODYxNl8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

目前这个项目还有很多问题，所以我用Seed2\.1试试看能不能让这个产品从一个demo原型，到能跑通核心功能的mvp产品。

## 模型实测

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=M2NmNDFmNWU4NGVmYmU0YjY4YjhjOGFiZmMzMjViZTRfOTBiMGZkYjRlOGRjMzAzNzdlYzQ3ZjFmOWQxM2E0ZWFfSUQ6NzY1NDUzNTIzNDMxODY5OTQ2NV8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

首先我先问了它目前项目存在的问题，可以看到经过5分多钟的思考，它给出了我目前项目存在的一些缺陷，确实很多问题都是真实存在的。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDllYzQ1ZjMzYTA3NzZlYzUzODA0ZDcwYjhjZmVkZjJfOTgwMTlhYThlYTNhZTFhZmNlMGEyNTc4MWFlODE2MDZfSUQ6NzY1NDUzNjA5NzQxODcwOTk5MF8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

接着我让它给我跑出来一个全面的修复方案，搜索之后给出的方案响应速度还是比较快的，告诉我要先用Supabase这个数据库方案，还有一长串的问题和解决方案，其他的问题也一一给出了对应的解决方案。

给出了解决方案之后，真正的应用效果又怎么样呢？我们直接让它去跑一下对应的修复方案。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDU4NTFiYzhmMmY3MTk2ZTA5YjllM2Q3ZTBkYTE0NWNfMTM5NDhmMjIwMzk2YTRmNTc1ZGRkNWIxZjFlMjI2YTVfSUQ6NzY1NDc2MzM2NzU4NDEwNzQ2OF8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

经过一段时间的鏖战，它完全重构了前后端之间的交互逻辑和MVP代码逻辑，同时能自动帮我打开对应的页面，进行了详细的端到端验证和测试，目标先是跑通真实的MVP应用逻辑。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZjFiY2FhZjcxYzVmNmNlYjQ3Zjk5MmFlMzYzMjM3ZWVfNTNkYjdlOGU3YjYyMWIxY2E3MmUxMWRmYjVkZTdjN2VfSUQ6NzY1NDc2MzcwNTk5NzYyNjMxNV8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

具体来说，它做的就是帮我把活着从看到页面，到开始挑战，到每日提交行动的边界情况和核心路径都梳理清楚和实现了，同时UI看起来也还挺ok的。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=Mzg4MDI1ZDc5MGRiNjIwMjY4NWM0YjQzMzQwYzFiNDdfZjY4ZmYxMWFhNzBjYTUxNzBlODA5NjQyYWZiY2U4NmFfSUQ6NzY1NDc2NTI0MDk2MTI3MzAyNV8xNzgyMjY0Mjk4OjE3ODIzNTA2OThfVjM)

## 最后

在模型能力越来越强的当下，用Seed2\.1还是哪个不同的模型都能创造出一些看起来不错的demo，所以当生产的效率越来越高的时候，如何让demo本身真正变得有价值，让别人愿意用，喜欢用，就成为了一个新的课题。

