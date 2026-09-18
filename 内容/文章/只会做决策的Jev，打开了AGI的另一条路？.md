最近几天，我的推都被一个叫做Jev的模型刷屏了。

创始人来自TypeSafe AI，就是这个Diogo Almeida。

![Pasted image 20260918152527](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918152527.png)


这个模型到底特别在哪里呢？

简单来说，他不做回答，只做判断。

之前的chatgpt还是claude，都是在解决一个问题，就是解决在真实场景下的问题，因此要模拟人在真实场景的思考，衍生成多步骤的任务执行。

而这个老哥想的是，这个模型只做高频决策，既不能写代码，也不能出文档，更不能和你聊天。

那它到底能解决什么问题呢？

举个例子来说，比如你问豆包，我今天要不要出门，它要先获取之前的记忆，再分析上下文，再看看对应的天气，最后在对话中显示，不出门。这一来一回至少就有好几秒的延迟。

![Pasted image 20260918153436](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918153436.png)

而Jev不一样，它会根据你的内容，同时判断多个命题成立的概率，比如说我要不要出门，实际上就是在做一道要还是不要的选择题。

它会在几百毫秒以内，就返回最高概率的命题，即不出门。

当然这个例子可能举的不是很好，Jev更像是一个兼容各类场景的通用分类器。

这个例子就很能说明问题，这个博主搭建了一个agent系统，用Jev和GPT-6 Astra去玩Minecraft，Astra负责长远规划，而Jev主打高速反应。
![Pasted image 20260918154251](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918154251.png)

用过gpt的都知道，Astra每次思考，都至少要2-3分钟往上，如果只靠它去操作，可能一天快过去了，还没撸到树。

Jev就很好的弥补了这一点，毫秒级别的反应，让博主即使面对多只僵尸的时候，也能轻松拿下。

史蒂夫每走一步，Jev就在后台做判断题，下一步要做什么，是跳跃还是撸树。

如果说Astra是规划的大脑，那Jev就是负责立刻执行的机械手。

现在的模型都想在一次对话中完整实现我的实现过程，模型要思考，要重新返回结果，多步执行后要再输出给我看到。

但如果我根本不需要AI的回复，AI的思考呢？我就想要Jev能以最快的速度解决我想要解决的问题呢？

我只想要用最短的时间告诉我，在这个场景下，我是选择A还是选择B呢？

其他的模型也能做到，但是太慢了，在真实的场景下，人与人的交互就是毫秒级的反应时间，如果你叫我一声大狗，1s内我没叫，你就会失去继续用下去的耐心了。

因此，为了最高效地完成判断，Jev删掉了所有与决策无关的部分，变成了纯粹的输入-决策-输出。

之前在小破站上看到用GPT-6 Astra通关羊了个羊的视频，通关一个羊了个羊要将近一个多小时的时间
![Pasted image 20260918160443|695](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918160443.png)

如果是Jev这个模型去做，速度会快5-20倍，五分钟不到应该就完成了，同时成本低了40-400倍，输出甚至免费，简直是逆天啊。

![Pasted image 20260918161128](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918161128.png)

基于这个思路，大部分的任务场景都只是决策而已。

这个博主就直接用Jev去玩地铁跑酷了，因为就是上下左右的按键判断，Jev接近实时的反应能够轻松的玩起来。
![Pasted image 20260918161440](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918161440.png)

Brouser use的创始人，就直接用它去查询航班，从开始查到最后查询完成，一共才花了7s不到，成本才几分钱。
![Pasted image 20260918161753](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918161753.png)


甚至在广告场景下也是一样，用40s就筛选出了724个对应品牌的实时广告信息，因为广告进来，也只需要判断是还是否。

![Pasted image 20260918162123](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918162123.png)

这真的非常的强大，我之前用Astra 玩贪吃蛇小游戏的时候，就发现它根本做不到高频及时的决策和反馈，但现在，有模型真的能做到了。

如果要粗暴的给Jev和所有其他的模型都分成两类，最好的方法就是它们的训练方法，RLHF和RLCD，前者通过奖励人类的偏好，人喜欢什么，AI就输出什么，就像每次问豆包，都会稳稳地接住你，但是不带来任何的信息增量，甚至经常会出现幻觉。

后者只返回决策和概率，奖励是事实上的正确率，简单来说，0.2的预测就应该是20%发生，1.0的就应该是100%发生。

通过群体效应，带来了其他的模型都没办法实现的确定性，虽然不能保证每一条答案都是正确的，却能更直观的展示人类是否能够相信AI。

所以这个玩意更像是一个即插即用的过滤器，你想要什么，它就能滤出来什么给你

地址：https://typesafe.ai/ 

我在它的官网上申请了白名单资格，但是到现在还没通过，痛啊！

![Pasted image 20260918163817](https://raw.githubusercontent.com/huangwenxuangod/path-to-wealth-freedom/main/assets/Pasted%20image%2020260918163817.png)

总而言之，在AI行业中的所有人都在通过堆参数，加规模训练更智能的模型的时候，只会做决策的Jev，似乎已经打开了AGI的另一条路