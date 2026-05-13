# HyperFrames AI 动态视频项目

目标：用 HyperFrames + TypeScript + Bun 构建一条真正动态的 AI 视频生产流程，而不是 PPT 式静态分镜合成。

当前阶段：方案重写。

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

## 下一步

先确认新的动态创意方向，再进入代码实现和渲染。

