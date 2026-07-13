# 文章拆短推

一个 [Claude Code](https://claude.ai/code) skill，把文章拆解成可直接发布的推特短推。

**Author:** [@ai_xiaomu](https://x.com/ai_xiaomu)

---

## How It Works

```
给一篇文章路径
    ↓
AI 提取核心观点（5-8个）
    ↓
你选哪些要写
    ↓
每个选题 × 3 个人性视角变体
    ↓
Markdown 文件 → 复制粘贴到 X
```

## Usage

说 `写短推` / `拆推文`，然后给文章路径即可。也可以直接说：

```
帮我把 /path/to/article.md 拆成短推
```

产出保存在 `~/xiaomu-x-creator/tweets/`。

## Skill Structure

```
x-create-short-tweet/
├── SKILL.md    # 完整流程定义
└── README.md
```
