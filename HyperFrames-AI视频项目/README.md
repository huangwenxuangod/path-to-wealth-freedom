# HyperFrames AI 动态视频项目

目标：用 HyperFrames + TypeScript + Bun 构建一条真正动态的 AI 视频生产流程，而不是 PPT 式静态分镜合成。

当前阶段：MVP 已跑通，流程与标准开始沉淀。

## 核心原则

1. **动态优先**
   - 画面必须由时间轴驱动。
   - 不再用静态 PNG/PPT 分镜作为主要画面。
   - 每个视觉元素都应该有进入、运动、变化、退出。

2. **HyperFrames 原生**
   - 最终 composition 必须是 HTML/CSS/JS。
   - 动画必须可被 HyperFrames seek。
   - 避免依赖 `requestAnimationFrame`、`Date.now()`、`performance.now()` 这类实时钟。

3. **TypeScript + Bun 统一构建**
   - 所有脚本使用 `bun` 执行。
   - 所有数据、时间轴、字幕、配音、构建、渲染集中管理。
   - 不再散落 PowerShell、临时 SVG、临时 PNG 拼接脚本。

4. **工程可复用**
   - 这不是只做一条视频。
   - 目标是沉淀成一个可复用的 AI 视频生成 Skill。

5. **高级感优先于花哨感**
   - 动态不是乱飞。
   - 画面要像“系统在运行”，不是“元素在表演”。
   - 所有视觉决策都优先服从秩序、层级、留白和节奏。

## 新目录结构

```text
HyperFrames-AI视频项目/
├── README.md
├── docs/
│   ├── 00-research.md
│   ├── 01-requirements.md
│   ├── 02-creative-direction.md
│   ├── 03-architecture.md
│   ├── 04-motion-system.md
│   └── 05-execution-plan.md
├── app/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── data/
│   │   │   ├── identity.ts
│   │   │   ├── script.ts
│   │   │   └── timeline.ts
│   │   ├── composition/
│   │   │   ├── index.ts
│   │   │   ├── styles.ts
│   │   │   ├── motion.ts
│   │   │   └── scenes.ts
│   │   ├── pipeline/
│   │   │   ├── build.ts
│   │   │   ├── tts.ts
│   │   │   ├── captions.ts
│   │   │   ├── preview.ts
│   │   │   └── render.ts
│   │   └── types.ts
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   │       ├── audio/
│   │       ├── data/
│   │       └── media/
│   └── output/
│       ├── wenxuan-intro-dynamic.mp4
│       ├── wenxuan-intro-dynamic.srt
│       └── previews/
└── skill/
    └── SKILL.md
```

## 当前已验证方向

- 人设：文轩，05 后，大学生，AI 实战者。
- 题材：个人介绍，不露脸，16:9 横屏。
- 旁白：自然年轻男声。
- 目标：展示能力，验证流程，沉淀成可复用方法。
- 画面策略：动态系统片，不做 PPT 翻页感。
- 风格策略：参考 `guizang-ppt-skill` 提炼出的 Swiss 极简高级风，使用单一 accent、强网格、轻字重、直角结构。

## 当前用户确认

- 显示名：文轩。
- 主题：个人介绍。
- 比例：16:9 横屏。
- 目标：展示能力，验证 AI 视频生产流程。
- 出镜：完全不露脸。
- 旁白：自然年轻男声。
- 内容来源：基于知识库提炼。
- 工具名可以出现：Obsidian、飞书、Codex、Claude Code 等。
- 可以出现目标：毕业前赚到 100 万。
- CTA：关注我，看我怎么用 AI 把路跑通。

## 当前产物

- 视频：`app/output/wenxuan-dynamic.mp4`
- 字幕：`app/output/wenxuan-dynamic.srt`
- 构建入口：`app/src/build.ts`
- 旁白入口：`app/src/tts.ts`
- 字幕入口：`app/src/captions.ts`

## 文档索引

- [00-research](D:\path-to-wealth-freedom\HyperFrames-AI视频项目\docs\00-research.md)
- [01-requirements](D:\path-to-wealth-freedom\HyperFrames-AI视频项目\docs\01-requirements.md)
- [02-creative-direction](D:\path-to-wealth-freedom\HyperFrames-AI视频项目\docs\02-creative-direction.md)
- [03-architecture](D:\path-to-wealth-freedom\HyperFrames-AI视频项目\docs\03-architecture.md)
- [04-motion-system](D:\path-to-wealth-freedom\HyperFrames-AI视频项目\docs\04-motion-system.md)
- [05-execution-plan](D:\path-to-wealth-freedom\HyperFrames-AI视频项目\docs\05-execution-plan.md)
- [06-production-standard](D:\path-to-wealth-freedom\HyperFrames-AI视频项目\docs\06-production-standard.md)

## 下一步

以后默认按以下顺序推进：

1. 先确认人设、时长、比例、旁白、CTA。
2. 先写视觉与结构方案，不直接开做画面。
3. 再用 `TypeScript + Bun` 统一生成 composition、字幕、音频和渲染。
4. 每次都跑 lint / validate / render / 关键帧检查。
5. 所有有效经验回写到 `docs/06-production-standard.md`。
