最近在打黑客松的时候，发现几乎所有人都在用image2生成资产图、示意图、海报等等，我在我的codex试了一下，发现cpa默认情况下并不支持图片生成这个路径接口，因此我找到了这个项目，叫做chatgpt2api，它的作用就是在支持sub2api的情况下，实现给中转站加上生图的路径和接口。

它的重要性在于，gpt plus一个账号是有120张生图的额度的，如果不用的话，就非常的可惜，而对于中转站来说，多了调用的额度就是多了更多能薅的收入，同样是非常的重要。

下面我们来详细的介绍一下对应的流程：

## 项目部署

首先我们先要在github上搜索到这个项目，接着在自己的服务器上去进行快速的部署，如果这里还不会的话可以看我上一篇文章的内容。

```PowerShell
git clone git@github.com:basketikun/chatgpt2api.git
cd chatgpt2api
docker compose up -d
```

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=MmFmYjdmZGU3YTFlY2E3MWU0MmMxZWFiMjUzYjZjN2VfMzBsc1pIOWxtaHg3b2ZUSUhWQUZCMEVsUUJ6b2p6SUxfVG9rZW46Q3dIamJRNHpjb3pmZGl4amtYSmM5aTJobldkXzE3NzkyODk5OTE6MTc3OTI5MzU5MV9WNA)

在启动之前要现在这个项目的config.json中设置auth-key，当然也可以直接在docker-compose.yml 中通过 CHATGPT2API_AUTH_KEY 覆盖。

在本地可以直接通过3000端口打开，生图api地址 http://localhost:3000/v1，如果是服务器部署的话，可以根据下面的命令。

```PowerShell
Web 面板：http://your-vps-ip:3000
API 地址：http://your-vps-ip:3000/v1
数据目录：./data
```

打开之后我们能看到类似这样的页面，我们可以将之前在sub2api中的号池导入进来，点击号池管理。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZTZiOTA5NTY4OWEwNzE5NTRiOGNlNzg0OTQ1MjM2NTJfak5yWnNoVmt6d09lbFowSnZsVjhJc29ENUJqOGVqZ21fVG9rZW46WkxsQWJjOEV1b1ZVNzZ4R1JicWNmQ056bjNnXzE3NzkyODk5OTE6MTc3OTI5MzU5MV9WNA)

在号池管理处选择导入，准备将号池全部导入进去。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=ZDU2OGUzMGFmMmUxNjRmZDM3NDNkYTQ3NjAxZDViZGVfZThpT3RqQzg0ekNXNnFvd2Fsd3Z2amYzOGNqRk84U21fVG9rZW46RG9TNWJiWmc5b1ozVVd4bUEwM2NjVHZBbjRkXzE3NzkyODk5OTE6MTc3OTI5MzU5MV9WNA)

可以选择多种方法导入，我之前选择的是sub2api服务器，因为之前都是在同一个服务器去进行部署的，非常的方便。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=YTY4YTlhNzkyODBhZWIyZTkwMWNkNGNiODEyYTY1OTdfQ1djTlh0ajB1R2c4SG5CTDRuOVFNbTRacmFwZVJhU2lfVG9rZW46QTkxS2JZSlZ1bzhDTFV4ZWtvc2NnQ01LblRlXzE3NzkyODk5OTE6MTc3OTI5MzU5MV9WNA)

导入之后，就能在网页中通过prompt调用生图模型，有多少plus账号就是120*对应的数量额度，可以直接生图，同时也可以直接调用对应的api端点进行生图，可以说是非常的方便了。

![](https://iigf5k70ohp.feishu.cn/space/api/box/stream/download/asynccode/?code=NWJmYmU5NmY1MDRkYWVmMTg5ZmJmMjczNjljYWU4MTZfUEpITzNTSERTTm5UVEd6em5hTlJTZFhiTjBFME1HTDhfVG9rZW46VzB4SGJwZVNKbzIxckh4dFV1eGNQbmJFbnhkXzE3NzkyODk5OTE6MTc3OTI5MzU5MV9WNA)

只要有prompt基本上在任何软件都能去实现生图，在任何地方都一样。至此无限生图image2的使用教程已经讲解完毕了，赶紧去试试吧