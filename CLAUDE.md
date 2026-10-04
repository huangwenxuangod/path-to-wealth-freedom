# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Path to Wealth Freedom** (财富自由之路) is a dual-architecture knowledge base project combining Obsidian local vault + Feishu AI knowledge base. The core mission: documenting the real journey from 0 to ¥1M before graduation using **traffic + affiliate + AI**.

**Philosophy**: "AI for money" — AI is a leverage for making money, not a toy. Everything revolves around one question: *Can this get traffic? Can this make money?*

**Content pillars**:
1. Traffic strategy playbooks (most valuable asset)
2. Project battle logs (GPT resale, cross-border e-commerce, etc.)
3. Deep research reports (offshore companies, compliance, AI tooling)
4. External methodology materials (Clippings/ — 18 English transcripts from MrBeast, Jenny Hoyos, iShowSpeed, etc.)

## Repository Structure

```
内容/
├── 我的/              # Personal notes (~30 files: content creation, traffic tactics)
├── 提示词/            # Prompt templates
├── 文章/              # Articles
└── 逐字稿/            # Transcripts

Clippings/            # Raw English materials (MrBeast strategies, legal channel copying methods, viral hooks)

hyper-studio/         # HyperFrames video projects workspace
├── videos/           # Each video in its own directory (agent-ui-film, astra-snake-latency, etc.)
└── package.json      # Fixed at hyperframes@0.8.40

*.md (root)           # Deep analysis reports (Jev analysis, offshore companies, AI cost-benefit, etc.)

.workbuddy/memory/    # Cross-session memory (MEMORY.md)
.obsidian/            # Obsidian vault configuration
```

## Key Documentation (Reading Order)

**Priority reading when working on traffic/monetization strategy**:
1. `README.md` — Project manifesto, positioning, execution OS (稳健控制模型), core file index
2. Content in `内容/我的/` — Tactical notes on traffic, private domain sales, TikTok affiliate strategies
3. `Clippings/` — Primary source materials for traffic playbooks (English transcripts)

**When working on video projects**:
- Read `hyper-studio/CLAUDE.md` first
- Each video project has its own `CLAUDE.md` in `hyper-studio/videos/<project>/`

**Deep analysis reports** (root *.md files):
- `Jev_横纵分析报告.md` — System One Models analysis
- Other reports on offshore structures, video tools, AI cost-benefit

## HyperFrames Video Workflow

**Tool versions**: Always use `hyperframes@0.8.40` (locked in package.json)

**Commands** (run from hyper-studio/ or specific video directory):
```bash
npm run check      # Validate composition
npm run dev        # Preview with background
npm run render     # Render video
```

**Project isolation**:
- Each video lives in `videos/<name>/` with independent `index.html`, `meta.json`, `DESIGN.md`, `assets/`, `renders/`, `package.json`
- Never reference another project's mutable assets
- Copy assets as needed — each project should be independently portable

**After changes**:
1. Run `npm run check` in the project directory
2. After rendering, verify decode integrity, dimensions, duration, representative frames
3. For transparent output, verify Alpha channel separately

## Content Creation Principles

**From README philosophy**:
- **Traffic-first**: Content is the product. Video/article itself is the product. Never fall in love with a specific product before content proves traffic potential.
- **AI-native thinking**: Default assumption is AI can do it, AI should do it, AI does it first. Human only for decision-making.
- **0-cost path**: Affiliate + supply chain arbitrage (1688 sourcing/dropshipping) + private domain. No inventory.
- **Benchmark-driven**: Find comparables, pixel-perfect replication with one variable changed = "original"

**Execution model (稳健控制模型)**:
- During feedback vacuum periods: Don't brute-force, don't spiral into self-doubt oscillation
- Recognize information buffering phase, maintain system stability, wait for probability inflection point
- As long as the control loop isn't broken, results are just a matter of time

## Knowledge Base Architecture

**Dual system**:
1. **Obsidian (this repo)** — Local thinking, material accumulation, content creation
2. **Feishu AI** — External presentation, knowledge management, paid content

**LLM Wiki mode** (from memory):
- Not traditional RAG (temporary retrieval), but "pre-compiled notes"
- AI organizes, links, indexes when storing materials
- Trigger: User says "编译 wiki" → AI compiles wiki pages with cross-links

## Working with This Codebase

**When asked to analyze traffic strategies**:
- Start with README.md core file index
- Reference Clippings/ for primary source methodology
- Cross-reference with 内容/我的/ tactical notes

**When working on video projects**:
- Always read the project-specific CLAUDE.md first
- Respect the locked hyperframes@0.8.40 version
- Never break project isolation (independent assets per video)

**When creating new analysis reports**:
- Follow existing report structure (see Jev_横纵分析报告.md)
- Use "横纵分析" (horizontal-vertical analysis) framework when applicable
- Include: 一句话定义 (one-line definition), 纵向分析 (vertical/historical), 横向分析 (horizontal/comparative), 信息来源 (sources)

**Memory system**:
- Cross-session memory stored in `.workbuddy/memory/MEMORY.md`
- Current memories: MIT TR AI trends candidate pool, LLM Wiki knowledge base pattern

## Git Workflow

- Main branch: `main`
- Git user: huangwenxuangod
- Repository is version-controlled; all substantive content changes should be committed
- Do not commit to `.gitignore`'d directories (.obsidian, .claude, .workbuddy, .tools, videos/, output/)

## Philosophical Context

**Core mental model (from README execution OS)**:
- **明道若昧，进道若退** (The bright path seems dim, advancing feels like retreating)
- Information theory: Judgment depends on information; feedback vacuum ≠ zero probability
- Control theory: Success depends on building control loops that sense deviation and correct
- Brain protection mechanism becomes obstacle in long-term competition
- System oscillation trap: Over-compensation from lack of feedback causes collapse

**When facing uncertainty**: Don't stop, don't lose rhythm. You're accumulating low-quality information during buffering period. Keep the control loop alive.