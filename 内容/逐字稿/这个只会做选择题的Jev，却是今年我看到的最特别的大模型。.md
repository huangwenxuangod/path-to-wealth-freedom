这两天，如果说最火的大模型是什么，那可能只有一个名字。

Jev。

这个模型来自TypeSafe AI，创始人就是这个Diogo Almeida。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqX6jF3nlnib2Ty6oibKvqwZpTb3Y6hA989J00FrWobZKoYPzDTlez82RgDCibtomrqdYbPz1JoEkxicE8vP5RrQRiauzRq83DQMV3rg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=0)

这哥们以前在OpenAI，参与创造了RLHF和InstructGPT，也就是后来让GPT真正学会说人话、最终催生ChatGPT和GPT-4的那一套关键方法的大佬。

然后他在2024年初选择离开了OpenAI，出去创业，在隐身了两年以后，终于掏出了自己的这个全新的模型，Jev。

这玩意，可能是我近一年，看到的确实有一点不一样的东西。

真的，他又激发了很多我对于AI的想象，相信我，这个Jev，跟你过去见到过的所有的大模型，都不一样。

因为，这个模型只会做一件事，那就是：高频决策。

没错，一个2026年9月推出的新模型，没办法跟你聊天，也没办法写代码，甚至连文字都没有办法生成。

只会帮你进行决策和判断，是一个完完全全的通用分类器。

可能听起来还是有点玄乎，不过这两天X上有个案例，我觉得特别适合解释Jev到底是什么。

开发者Marcel Pociot接入Jev做了一个浏览器插件。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqW1JsxSiaVLfgZxVQPJkHcs6vOxIyfrBH4fq4ryKHhBwIbPGOZ2vyluydLapbGWSZfzfIkPjSx8ppISMHuvgJDpsuERjRDf5Ab4/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=1)

作用特别简单。

**就是这个浏览器背后接了Jev，然后用Jev帮你过滤X上那些你压根不想看的东西。**

比如你可以设定好，说我不想看故意引战骗回复的内容，或者说不想看加密货币和NFT，又或者不想看政治争论啥的，都可以。

甚至你可以说：“把那些明显只是为了让我生气、让我回复、让我停下来吵架的内容都折叠掉。”

然后，你就继续正常刷X。

每出现一条新的帖子。

Jev就在后台飞快地判断一次：

**这条东西，有没有命中刚才那些我们不想看的内容分类？**

有的话就直接折叠不显示了，没有命中的话，就正常展现出来。

![Image](https://mmbiz.qpic.cn/mmbiz_jpg/2jjfQoZLoqXYDiapFenB0MLLncoeA6tjWDlKV3XjJl61AAbqqXAYj5oFVhNB2EDpzz3q0Z06896DpULWv2PBQUd9gxLYkkoFOUBeJRzyPqmE/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=2)

而这个判断的速度，平均只需要380毫秒。

也就是在Jev看到帖子的一瞬间，输入帖子，然后完成判断进行输出，是否要折叠，这一切，只发生在380毫秒的时间里面。

过去我们看大模型，如果遇到这种问题，你当然可以让大模型来去做判断，即使你开了JSON Output的话，它也会很慢，甚至如果开了思考的话，那就更慢，可能需要十几秒，甚至是几十秒才能完成一个判断。

但我们其实根本不需要那么多的东西，我们只需要模型以最快的速度，给出Yes或No就可以了。

我们根本不需要它生成任何的内容，它只需要来帮我们做判断。

Jev干的就是这件事。

这就是Jev最奇怪，也最性感的地方。

我们过去看到的大模型，都在努力学习一件事情，也就是怎么更好地回答人类。

Jev直接换了个方向，它想解决的是：

**如果最后真正需要这个答案的，其实只是一段代码呢？**

代码根本不需要你文采飞扬。也不需要你解释半天。

它只想知道：要还是不要、A还是B、继续还是停止等等等等。

**它需要的，是一个能直接执行的判断。**

而且我其实说实话，不只是代码，这个世界中，即使对于我们人类来说，绝大多数的东西，本质上其实也都是决策判断。

这件衣服你要不要买，遇到Boss了你是格挡还是闪避，Token用完了你是重置还是摆烂，要结婚了这个彩礼到底是给还是不给...太多太多了。

很多时候，即使在我们的人生中，我们也根本不需要那么长篇大论的文字或分析，我们只需要一个决策，仅此而已。

所以，Jev奔着这个目标一路狂奔，他们为了最好的完成决策，直接把生成文字给砍掉了。

于是，速度快了20～200倍，近乎逼近实时，当Jev打游戏的话，一秒可以决策10次，并且成本低了40～400倍，0.042美元/百万Token，便宜到离谱（输出Token还是免费的，因为只输出一个决策，那个Token太少了，他们干脆免费了）。

网上的大佬们已经玩疯了。

比如，有人会用它，玩马里奥，因为马里奥本质上也就是按键判断。。。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqU5ibXyMqyicrkxuf5TBOodUTNvfN2NOMlyPQc2Oodv1IBl22UoPk8lQD8423SOX964MmjEA5tWvgoYyuow1FmXFC9z5iaqpgiaVdE/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=3)

效果出奇的好。

有人用它操控浏览器查询航班，一共就花了7秒，全部点完，毕竟，浏览器操控，本质上也是判断决策。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqUTCMheNVtLj10ef71wGWvpxOcbfG8aID5nmgvfr8zO39y0E5uqWUMsEusHfGnL08QxvHKubQWqJALJPusqibzekOTD9SMQ5Sicg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=4)

还有大佬用它搭了一个交易机器人，因为做交易，本质上也是决策，就是买或者卖而已。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqVI5fgtQwP83ZN0ia6svWGXyVec057KvlSQJ4MWaPTrVWc9j5iayFCia1lKteuJociaicLjbHdOmFpgKvysxWBviaRcGEloRFHgW6Rb8/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=5)

还有太多太多了。

Jev这个百毫秒级响应+大批量判断，既有超级实用的场景，也有无数能拓想象力的场景。

这就是他们给自己定义的模型类型，称为System One Model。

System One这个名字，来自丹尼尔·卡尼曼那本特别有名的《思考，快与慢》。

卡尼曼把人的思考粗暴地分成两种。

系统1就是快思考，自动的、直觉的。

比如我问你：1+2等于几？你总不会低头沉思三分钟，然后才给我报个3对吧。

系统2，就是慢思考。

需要一步一步分析的，比如做数学证明，写复杂代码啥的。

现在的GPT、Claude，尤其是各种Reasoning Model，越来越像一套特别强的系统2了。

而Jev赌的则是另外一边，因为他们觉得，这个世界上其实存在着海量根本不需要长篇推理的智能任务。

所以他们重新做了一套模型架构、并行Sampler，还有一种自己叫做RLCD的训练方法。

全称是Reinforcement Learning for Calibrated Decisions。

大概可以翻译成：

**面向校准决策的强化学习。**

就像我们过去说，RLHF优化其实是人类更喜欢哪个回答。

然后RLVR优化的是，这个答案能不能被验证，所以后面数学、代码之类的这两年直接旱地拔葱式的大跃进。

而RLCD想优化的，就是这个决定到底对不对，而且模型嘴里说的“我有90%把握”，到底是不是真的接近90%。

因为如果你真要把AI塞进一个自动化系统里，那概率必须是有意义的。

比如，Jev给出来的置信度 > 0.90，那就可以自动执行。`      0.7 < 置信度 < 0.90，那就交给更强的大模型复核。      置信度 < 0.7，那就交给人来决策。`

所以我觉得在Jev这条路线里面，最重要的词甚至不只是快和便宜，这个“校准”，才是真正的核心。

当你接了Jev让它输出的时候，也可以看到，它的输出，是这样的。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqU9ooJMIQOTs3iaTr6WOsicdkqVBKTpQCNsMkxypOjQ9HSLn2XHmFAecGmiczDYd5F3ib6uHP9nrV9WOV3TWOc4ODfkynNRtocybN8/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=6)

这就很爽了。

而且最骚的是，所有的这些需要判断的问题可以一次性并行问。

比如我扔进去一条AI新闻。

我可以同时问：是不是AI相关？是不是广告？是不是融资？应该归到哪个分类？值不值得推给用户等等等等。

Jev可以一口气把这些判断一起做掉，速度极快，直接起飞。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqUz7m8bQnJD2uw8db0aEWYoTLWTk5zfFS6go0z0YK9p6KjiaXQa7RH6okHPbMFUKAicbDgpXYNyKibUWKu30p5G2gku5wBlnaJiaK0/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=7)

这跟传统LLM一个一个Token往外生成，完全是两种思路。

所以，这玩意本质上有点像：

**一个拥有世界知识和语义理解能力的超级if。**

目前可以在他们的官网上申请资格，应该挺快就能过。

网址在此：https://typesafe.ai/

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqU84zslicgicno1BksLpDiaPoBv9Miae95B6QCTH57BkDv5Lia8glHj4FSD52icWibw0UywpAAUeVedutVaiaQFFrJBfCJjw60ulWpN1jM/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=8)

不过如果你急着测试的话，也可以去一个集合平台vercel上用，他们已经首发接入Jev了。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqVWxyThQKy9BJQnRYiclG8YOJtpsefSSFLc88CHQVUjZVkbz7Fskj7Po5xd3wuK0PLBuiclSjUwyaWJ4ySsCiaAicFJY8E4C9t9wsI/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=9)

我自己也第一时间把AIHOT里面的一些任务判断，都用Jev测了一下。

比如一个非常基础的预筛任务，就是每天几千上万条我监控的内容会被爬下来打分，负责精选的模型是一个稍微大一点贵一点的模型，这样才能保证世界知识充足，品味足够的好。

但是如果我们把这几千上万条信息都扔给这个模型的话，很贵。那所以前面就用一个便宜的模型来做一道预筛，把跟AI没有关的内容全部先剔除掉，这样就能省很多钱了。

所以这个预筛任务特别简单，就是只判断，当前信息跟AI是否相关。

100道的测试题，我让GLM-5.3 Flash、DeepSeek V4.1 Flash、Qwen 3.7 Flash、Jev同时测试了一下。

结果是这样的，还挺意外的。

![Image](https://mmbiz.qpic.cn/mmbiz_png/2jjfQoZLoqW1TbIiaG1a7dhsqoo1vDc3vPAshIbEvYlFEC4NjgfhgoJHJwzCZE2uyRx4dFcptVuzXBYFrBUXkfrmPCOdjB1NBhmibkhnMfrYg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=10)

GLM 5.3 Flash是唯一一个全对的，但是也最慢和最贵。

Jev目前看起来是最综合的，准确性第二+便宜很多，比DeepSeek V4.1 Flash在空闲阶段还要便宜，但是因为国内网络延迟的问题，所以Jev的耗时和反应速度被拉高了。

Qwen 3.7 Flash依然是最便宜性价比最高的，甚至只有Jev的一半，但是精准率跟DeepSeek V4.1一样，差了点。

在另一个同事件聚簇判定的任务上，Jev差不多也维持着第二准确，但这次因为内容量表较大，所以终于变成了速度最快的角色。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqXpBam8X7j55U3qEdJG0tZ5DibsHh0Wib2evuVYaj57s7SI7YMjtQlYialRBAMwhsGvxGthKLC3XmoicVcY9bkpGSiczl0ZH8oJIcXk/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=11)

而如果让它做一个更适合Jev的并行判断任务，比如一个新闻背后，同时有十个问题需要判断并且输出。

那这时候，优势就出来了。

![Image](https://mmbiz.qpic.cn/sz_mmbiz_png/2jjfQoZLoqWgIsAcnibofIyzn4NHX9pyQicVXnIxibFhOMPp86HTvUCDjaSBrZMrcb1PkfQqiayOxErHxEwz1JfvWibc7nLyhXZyJCfrarCk0q84/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=12)

最高的准确率，最快的速度，第二低的成本。

在追求精度的分类和判断场景上，Jev就是目前性价比最高的解，Qwen 3.7 Flash便宜是便宜，但是一旦稍微大一点的活，这个正确率能被拉7个点，这就没法用了。

而且这只是第一代模型，如果几个月后，Jev出到2.0，那我不敢想象，这玩意准确性能高到什么程度，速度又能快到什么程度，以及价格又能便宜到什么程度。

Jev这个名字，脱胎于一个经济学里著名的东西。

杰文斯悖论。

他的提出者，就叫William Stanley Jevons。

19世纪的时候，蒸汽机越来越高效，理论上来说，烧同样的煤，可以干更多的活，那人类是不是会因此少烧煤？

结果刚好反过来，因为蒸汽机效率越来越高，使用煤变得越来越划算，所以，越来越多行业开始用。

最后，整个社会的煤炭消费量反而上升了。

效率提高，单次消耗下降，总消耗却暴涨，这就是杰文斯悖论。

而TypeSafe给模型起这个名字。

意思已经非常明显了，他们赌的就是，智能也会发生杰文斯悖论。

我们现在用的模型越来越贵，价格越来越高。但我们日常中真的需要用到这么高智力的模型吗？是不是有大量的判断和决策，还有事情只需要一个Jev这样的模型，就可以了呢？

但如果有一天，一次拥有相当不错语义理解能力的判断，便宜到接近不要钱的时候，这个世界又会发生什么呢？

**AI，为什么一定要生成东西？**

智能当然可以用来创造。

那，也可以只用来判断。

Jev确实可能代表着Agent时代另外一块特别重要的拼图。

一个我们过去因为ChatGPT太成功。

反而一直没有认真看过的方向。

未来的轮廓。

好像也逐渐清晰了起来。

******以上，既然看到这里了，如果觉得不错，随手点个赞、在看、转发三连吧，如果想第一时间收到推送，也可以给我个星标⭐～谢谢你看我的文章，我们，下次再见。******