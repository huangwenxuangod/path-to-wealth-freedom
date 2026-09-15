# 来源与调研证据

调研日期：2026-09-15。查询、阅读与本地检查已完成；库安装后的运行兼容、渲染性能和媒体输出尚未测试。

## 主要来源

| 编号 | 来源 | 阅读层级 |
|---|---|---|
| S01 | [Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills) | 官方正文与 repo，12 个技能 |
| S02 | [官方 Codex 插件](https://www.remotion.dev/docs/ai/codex-plugin) | 官方正文抽取，本机 marketplace 交叉核对 |
| S03 | [Bun support](https://www.remotion.dev/docs/bun) | 官方正文 |
| S04 | [Tailwind integration](https://www.remotion.dev/docs/tailwind) | 官方正文 |
| S05 | [@remotion/gsap](https://www.remotion.dev/docs/gsap) | 官方正文与 npm metadata |
| S06 | [useGsapTimeline](https://www.remotion.dev/docs/gsap/use-gsap-timeline) | 官方正文，包含 plugins 与 builder 限制 |
| S07 | [Third-party integrations](https://www.remotion.dev/docs/third-party) | 官方正文 |
| S08 | [Transparent videos](https://www.remotion.dev/docs/transparent-videos) | 官方正文 |
| S09 | [Remotion License](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) | 官方原文 |
| S10 | [Magic UI Animated Beam 源码](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/animated-beam.tsx) | 官方源文件全文 |
| S11 | [Magic UI License](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md) | MIT 原文 |
| S12 | [React Bits License](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md) | MIT + Commons Clause 原文 |
| S13 | [Motion for React](https://motion.dev/docs/react) | 官方正文 |
| S14 | [Foundation Motion UI](https://get.foundation/sites/docs/motion-ui.html) | 官方正文 |
| S15 | [React Bits](https://github.com/DavidHDev/react-bits) | 维护者 README |
| S16 | [GSAP standard license](https://gsap.com/community/standard-license/) | 官方正文；官方 skills README 交叉核对 |
| S17 | [LottieFiles motion-design](https://github.com/LottieFiles/motion-design-skill) | README 与核心 SKILL.md |
| S18 | [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 官方核心文件 |
| S19 | [Impeccable](https://github.com/pbakaus/impeccable) | 维护者 README，不代表执行全部命令 |
| S20 | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 维护者 README |
| S21 | [UI Skills Motion 目录](https://www.ui-skills.com/skills/motion) | 目录正文，发现级 |
| S22 | [Motion AI Kit](https://motion.dev/docs/ai-kit)、[安装文档](https://motion.dev/docs/ai-kit-install) | 官方正文 |
| S23 | [IBM Carbon motion](https://carbondesignsystem.com/elements/motion/overview/) | 官方 productive/expressive 分类 |
| S24 | [Emil Kowalski](https://animations.dev/) | 作者站可达，付费课程未完整阅读 |
| S25 | [GSAP 官方 skills](https://github.com/greensock/gsap-skills) | README、gsap-core 核心文件、8 个技能分类 |
| S26 | [Magic UI 官方 skill](https://github.com/magicuidesign/magicui/blob/main/skills/magic-ui/SKILL.md) | 官方核心文件 |
| S27 | [Magic UI MCP](https://magicui.design/docs/mcp) | 官方正文；未安装 MCP |
| S28 | [Motion Primitives](https://github.com/ibelick/motion-primitives) | 维护者 README；官网请求 429 |
| S29 | [Aceternity Background Beams](https://ui.aceternity.com/components/background-beams) | 官方组件页，未逐个审计全部组件 |
| S30 | [Remotion skills repo](https://github.com/remotion-dev/skills) | README、递归目录、markup 核心 skill |
| S31 | [React Bits Pro AI agents](https://pro.reactbits.dev/best-for/ai-coding-agents) | 搜索发现级，未加载付费 skill |
| S32 | [21st motion 目录](https://21st.dev/community/libraries/s/motion) | 搜索发现级 |
| S33 | [React Bits 社区 skill](https://github.com/Philotheephilix/reactbits.dev-skill) | 搜索发现级，不视为官方或已验证 |

## 本地检查

| 命令或文件 | 实际结果 | 状态 |
|---|---|---|
| `pwd` | `/Users/ai1/path-to-wealth-freedom` | exit 0 |
| `bun --version` | `1.3.14` | exit 0 |
| `node --version` | `v26.5.0` | exit 0 |
| `command -v ffmpeg ffprobe` | `/opt/homebrew/bin/ffmpeg`、`/opt/homebrew/bin/ffprobe` | 可找到，未渲染视频 |
| `codex plugin list` | `remotion@openai-api-curated`，`not installed` | exit 0 |
| `codex plugin add --help` | 支持 `PLUGIN@MARKETPLACE` | exit 0 |
| 既有 `agent-ui-film/package.json` | `hyperframes@0.8.40` | 只读 |

已读取用户指定 waza-think、ponytail；参考本地 plugin-creator 核对 Codex 打包结构。已读取旧项目 AGENTS.md、CLAUDE.md、DESIGN.md，保留旧工程约束。

历史记忆只提供“先验证小样片再扩系统”的原则；本机版本、路径和插件状态已重新核实。

## 未取得完整正文的条目

- Motion Primitives 官网返回 HTTP 429，改读维护者 GitHub README，未作运行判断。
- Material 3 页面只返回需 JavaScript 提示，因此具体动作分类引用 IBM Carbon 成功读取的原文。
- skills.sh 入口出现重定向响应，使用官方技能仓库、UI Skills 和检索结果交叉定位。
- 部分旧路径 404 已定位新路径；Magic UI 源码实际在 apps/www/registry，Motion AI 文档在 /docs/ai-kit。
- 目录列出的 skill 不等于已安装、已运行或已验证作者身份；收录范围不代表全球穷尽。

## 版本与材料哈希

以下由本次 npm 查询和原始附件生成。

- npm `remotion`: `4.0.524`
- npm `@remotion/gsap`: `4.0.524`
- npm `react`: `19.3.0`
- npm `tailwindcss`: `4.3.3`
- npm `gsap`: `3.15.0`
- npm `typescript`: `7.0.2`

Source attachment SHA-256: `657c9af878c1771c3b3d8e5d3a45ee688374b75bb9acb001077e1178a845b309`

## Motion skill discovery catalog

Source: S21. Discovery only; not installation or runtime verification.

| Skill | Author shown | Description |
|---|---|---|
| threejs-animation | cloudai-x | Three.js animation guidance for keyframes, skeletal animation, morph targets, and animation blending. |
| text-to-lottie | diffusionstudio | Turn text prompts into polished Lottie animations for motion-heavy UI work. |
| animate | emilkowalski | Build an animation from scratch, making the decisions in the order that determines whether it feels right — should it animate at all, what purpose, which tool, which properties, which curve and duration, how it interrupts, how it exits. Writes the implementation. Use when asked to animate something, add motion, make a component feel alive, or build a transition. For critiquing existing motion use review-animations; for auditing a whole codebase use improve-animations. |
| animate-expo | emilkowalski | Build animations in React Native and Expo, making the decisions in the order that determines whether they feel right — should it animate, which thread it runs on, which properties, spring or timing, how the gesture hands off, how it degrades. Writes the implementation with Reanimated, Gesture Handler, Expo Router and expo-haptics. Use when animating anything in an Expo app, adding gestures, sheets, screen transitions, press feedback or haptics, or fixing motion that stutters on device. For web animation use animate. |
| animation-vocabulary | emilkowalski | Sharpen motion language so animation choices feel deliberate and consistent. |
| apple-design | emilkowalski | Apple's approach to interface design and fluid, physical motion, translated for the web. Use when building or reviewing gesture-driven UI, spring animations, drag/swipe/sheet interactions, momentum and interruptible transitions, translucent materials and depth, typography (optical sizing, tracking, leading), reduced-motion, or the design foundations (feedback, spatial consistency, restraint) behind Apple-style interfaces. |
| find-animation-opportunities | emilkowalski | Find high-conviction opportunities for useful interface motion while rejecting animation that adds noise or slows users down. |
| improve-animations | emilkowalski | Survey a codebase's animation and motion code as a senior motion advisor, then produce prioritized audit and self-contained implementation plans. Read-only on source code - it plans improvements, it does not apply them. Use when the user asks to improve animations, audit motion, make an app feel better, or wants a roadmap of animation fixes rather than a review of a single diff. |
| review-animations | emilkowalski | Review animation quality, timing, and motion consistency with a production-critical eye. |
| figma-implement-motion | figma | Translates Figma motion and animations into production-ready application code. Use when implementing animation/motion from a Figma design — user mentions "implement this motion", "add animation from Figma", "animate this component", provides a Figma URL whose node is animated, or when `get_design_context` returns motion data or instructs you to call `get_motion_context`. |
| figma-shaders | figma | Mandatory prerequisite before create_shader or update_shader. Use when authoring shader effects, shader fills, custom effects, or procedural shader backgrounds in Figma Design. |
| figma-use-motion | figma | Motion / animation context for the `use_figma` MCP tool — animating Figma nodes via manual keyframes, animation styles, easing, and timeline duration. Load alongside figma-use whenever a task involves adding, editing, or inspecting animation on a node. |
| video-interaction-mapper | figma | Analyze a UI screen recording and map interaction states into an annotated Figma Design storyboard with extracted before/after frames. |
| gsap-core | greensock | Official GSAP core API guidance for gsap.to(), from(), easing, stagger, matchMedia, and responsive or reduced-motion animation patterns. |
| gsap-frameworks | greensock | Official GSAP guidance for Vue, Nuxt, Svelte, and SvelteKit lifecycle setup, scoped selectors, and cleanup on unmount. |
| gsap-performance | greensock | Official GSAP performance guidance for compositor-friendly transforms, quickTo, stagger batching, and smooth 60fps animation. |
| gsap-plugins | greensock | Official GSAP plugin guidance for Flip, Draggable, ScrollSmoother, SplitText, SVG tools, CustomEase, and gsap.registerPlugin() usage. |
| gsap-react | greensock | Official GSAP guidance for React and Next.js with useGSAP, refs, gsap.context(), contextSafe callbacks, and SSR-safe cleanup. |
| gsap-scrolltrigger | greensock | Official ScrollTrigger guidance for scroll-linked animation, pinning, scrub, batch triggers, and horizontal containerAnimation patterns. |
| gsap-timeline | greensock | Official GSAP timeline guidance for sequencing, position parameters, labels, nesting, and playback control with gsap.timeline(). |
| gsap-utils | greensock | Official gsap.utils guidance for clamp, mapRange, snap, distribute, selector scoping, and other animation math helpers. |
| 60fps-animation | iart-ai | Web animation performance guidance for avoiding layout thrashing and reaching smooth 60/120fps motion with compositor-friendly techniques. |
| accessible-animation | iart-ai | Tiered reduced-motion patterns for CSS, GSAP, Framer Motion, Lenis, and other web animation systems. |
| ascii-animation | iart-ai | This skill should be used when the user asks to "make an ASCII animation", "build a terminal/CLI intro or loader", "convert an image or video to ASCII art", "add an ASCII shader/post-effect to a canvas or Three.js scene", "create retro/hacker text-character motion", or "animate text characters with a brightness ramp". Covers generative ASCII fields, image/video/3D-to-ASCII, and animated character art for both web and terminal. |
| glassmorphism | iart-ai | This skill should be used when the user asks to "add a glassmorphism effect", "frosted glass UI", "Apple liquid glass style", "frosted blur card", "translucent glass panel animation", "make a frosted nav bar", "build a glass modal/dialog", "animate a glass card on hover", or "add a refracting liquid-glass hero". Covers frosted translucent panels with backdrop-filter blur, edge/specular highlights, SVG liquid-glass refraction, motion on hover/scroll/enter, and accessible reduced-transparency fallbacks. |
| gsap-web | iart-ai | GSAP guidance for code-driven web motion, including timelines, ScrollTrigger, SplitText, Flip, and smooth-scroll synchronization. |
| lottie-animation | iart-ai | Lottie and dotLottie integration guidance for playback control, interactivity, runtime theming, and cross-platform export workflows. |
| micro-interaction | iart-ai | UI motion guidance for hover and press feedback, toggles, toasts, drawers, modals, list transitions, and shared-element interactions. |
| page-transition-animation | iart-ai | Page and route transition patterns using the View Transitions API and Framer Motion, including reliable Next.js App Router exits. |
| svg-animation | iart-ai | SVG animation techniques for stroke draw-on effects, path morphing, motion paths, animated icons, gradients, and filters. |
| fixing-motion-performance | ibelick | Audit and fix animation performance issues including layout thrashing, compositor properties, scroll-linked motion, and blur effects. Use when animations stutter, transitions jank, or reviewing CSS/JS animation performance. |
| refine-live | Jakubantalik | Iteratively refine UI in live sessions with a focus on motion, polish, and interaction detail. |
| transitions-dev | Jakubantalik | Production-ready CSS transition patterns for web apps, with drop-in snippets for cards, modals, dropdowns, panels, and page transitions. |
| transitions-polish | Jakubantalik | Polish and refine existing motion against the transitions.dev motion-token scale — duration, distance, scale, blur, easing, and when each token applies. |
| better-ui | jakubkrehel | Design engineering principles for making interfaces feel polished. Use when building UI components, reviewing frontend code, implementing animations, hover states, shadows, borders, micro-interactions, enter/exit animations, or any visual detail work. Triggers on UI polish, design details, "make it feel better", "feels off", stagger animations, border radius, optical alignment, image outlines, box shadows. |
| brag | latent-spaces | Turn a finished project into a short shareable launch video with motion, music, and copy. |
| animation-on-scroll | MengTo | Use when you need scroll-driven motion that feels intentional instead of noisy or overdone. |
| animation-systems | MengTo | Use when building a coherent animation system instead of one-off motion tweaks. |
| gsap | MengTo | Use when implementing motion with GSAP and you want practical animation structure and sequencing guidance. |
| gsap-scrolltrigger-storytelling | MengTo | Use when building scroll-based storytelling sections with GSAP ScrollTrigger. |
| marquee-loop | MengTo | Use when building looping marquees that need steady rhythm, spacing, and performance awareness. |
| masked-reveal | MengTo | Use when revealing content with masked motion, clipped transitions, or layered entrances. |
| matterjs | MengTo | Use when building physics-driven interactions and layout behaviors with Matter.js. |
| progressive-blur | MengTo | Use when applying blur transitions or layered depth effects that need to feel smooth and controlled. |
| threejs | MengTo | Use when building 3D scenes, interactions, or WebGL-backed interface moments in Three.js. |
| scroll-world | oso95 | Build an immersive scroll-scrubbed 3D world landing page for any brand with Higgsfield-generated scenes, seamless camera clips, and a portable scroll-scrub engine. |
| animate | pbakaus | Enhance UX with purposeful animation and micro-interactions that support usability and delight. |
| delight | pbakaus | Add personality and memorable moments through thoughtful interaction details and emotional UX touches. |
| overdrive | pbakaus | Push interfaces into high-impact territory with advanced animation, shaders, and ambitious interaction systems. |
| animate-ui | PrototyperAI | Prototyper UI animation conventions for writing, reviewing, or debugging transition code, overlay enter/exit, press feedback, and prefers-reduced-motion. |
| 12-principles-of-animation | raphaelsalaja | Apply Disney's 12 animation principles to web interfaces to make motion feel natural, organic, and human. |
| mastering-animate-presence | raphaelsalaja | Audit Motion and Framer Motion exit/presence patterns with practical fixes for AnimatePresence usage. |
| morphing-icons | raphaelsalaja | Build icon components that morph between SVG shapes with smooth, line-based transformation. |
| pseudo-elements | raphaelsalaja | Audit CSS pseudo-elements and View Transitions usage for hover effects, decorative layers, and transitions. |
| to-spring-or-not-to-spring | raphaelsalaja | Audit animation timing choices to decide when springs versus easing curves produce better motion. |
| remotion-best-practices | remotion-dev | Domain-specific knowledge base for building videos with Remotion and React. |
| interaction-design | wshobson | Design and implement microinteractions, motion design, transitions, and user feedback patterns for delightful user experiences. |

Catalog entries: 57
