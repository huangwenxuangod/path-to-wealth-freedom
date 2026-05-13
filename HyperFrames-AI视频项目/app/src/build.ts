import { mkdir, writeFile } from "node:fs/promises";
import { accelerators, composition, floatingTools, narration, orbitTools, pipeline, scriptLines } from "./data";

await mkdir("assets/audio", { recursive: true });
await mkdir("assets/data", { recursive: true });
await mkdir("output", { recursive: true });
await writeFile("assets/audio/narration.txt", narration, "utf8");
await writeFile("assets/data/timeline.json", JSON.stringify({ composition, scriptLines }, null, 2), "utf8");

const floatingToolHtml = floatingTools
  .map(
    (tool, i) =>
      `<div class="tool-cell tool-${i}"><span class="tool-index">${String(i + 1).padStart(2, "0")}</span><span class="tool-name">${tool}</span></div>`,
  )
  .join("\n");

const pipelineHtml = pipeline
  .map(
    (item, i) =>
      `<div class="flow-step step-${i}">
        <span class="flow-index">${String(i + 1).padStart(2, "0")}</span>
        <span class="flow-name">${item}</span>
        <span class="flow-meta">${i === pipeline.length - 1 ? "Loop" : "Stage"}</span>
      </div>`,
  )
  .join("\n");

const systemHtml = orbitTools
  .map(
    (item, i) =>
      `<div class="system-node system-${i}">
        <span class="system-node-index">${String(i + 1).padStart(2, "0")}</span>
        <span class="system-node-name">${item}</span>
      </div>`,
  )
  .join("\n");

const accelHtml = accelerators
  .map(
    (item, i) =>
      `<div class="ledger-row ledger-${i}">
        <span class="ledger-index">${String(i + 1).padStart(2, "0")}</span>
        <span class="ledger-name">${item}</span>
        <span class="ledger-bar"><i></i></span>
      </div>`,
  )
  .join("\n");

const captionHtml = scriptLines.map((line, i) => `<div class="caption cap-${i}">${line.text}</div>`).join("\n");

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      :root {
        --paper: #fafaf8;
        --ink: #0a0a0a;
        --grey-1: #f0f0ee;
        --grey-2: #d4d4d2;
        --grey-3: #737373;
        --accent: #002fa7;
        --accent-rgb: 0, 47, 167;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: var(--paper);
        color: var(--ink);
        font-family: "Inter", Arial, sans-serif;
      }
      #root {
        position: relative;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background:
          linear-gradient(90deg, rgba(10,10,10,.05) 1px, transparent 1px),
          linear-gradient(0deg, rgba(10,10,10,.04) 1px, transparent 1px),
          linear-gradient(180deg, rgba(255,255,255,.58), rgba(255,255,255,.28)),
          var(--paper);
        background-size: 80px 80px, 80px 80px, auto;
      }
      #root::after {
        content: "";
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(10,10,10,.08) .7px, transparent .7px);
        background-size: 7px 7px;
        opacity: .34;
        pointer-events: none;
      }
      .frame-line {
        position: absolute;
        left: 128px;
        width: 1664px;
        height: 1px;
        background: rgba(10,10,10,.14);
        opacity: 0;
      }
      .frame-top { top: 166px; }
      .frame-bottom { top: 914px; }
      .frame-side {
        position: absolute;
        top: 166px;
        width: 1px;
        height: 748px;
        background: rgba(10,10,10,.08);
        opacity: 0;
      }
      .frame-left { left: 128px; }
      .frame-right { left: 1792px; }
      .accent-rail {
        position: absolute;
        left: 128px;
        top: 166px;
        width: 0;
        height: 6px;
        background: var(--accent);
        opacity: 0;
      }
      .scan-band {
        position: absolute;
        top: 166px;
        left: -360px;
        width: 280px;
        height: 748px;
        background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), .12), transparent);
        opacity: .5;
        pointer-events: none;
      }
      .kicker {
        position: absolute;
        left: 128px;
        top: 94px;
        font-family: Consolas, monospace;
        font-size: 22px;
        letter-spacing: .18em;
        color: var(--grey-3);
        opacity: 0;
      }
      .page-no {
        position: absolute;
        right: 132px;
        top: 94px;
        font-family: Consolas, monospace;
        font-size: 22px;
        letter-spacing: .16em;
        color: var(--grey-3);
        opacity: 0;
      }
      .identity {
        position: absolute;
        left: 128px;
        top: 232px;
        font-size: 170px;
        line-height: .92;
        font-weight: 300;
        letter-spacing: -.03em;
        opacity: 0;
      }
      .identity .char {
        display: inline-block;
      }
      .identity-meta {
        position: absolute;
        left: 138px;
        top: 432px;
        display: flex;
        gap: 14px;
        opacity: 0;
      }
      .identity-meta span {
        display: inline-flex;
        align-items: center;
        height: 50px;
        padding: 0 18px;
        border: 1px solid rgba(10,10,10,.14);
        font-size: 20px;
        letter-spacing: .08em;
        color: var(--grey-3);
        background: rgba(255,255,255,.52);
      }
      .intro-note {
        position: absolute;
        left: 136px;
        top: 554px;
        width: 640px;
        padding-top: 18px;
        border-top: 1px solid rgba(10,10,10,.2);
        font-size: 30px;
        line-height: 1.55;
        color: #222;
        opacity: 0;
      }
      .metric-stack {
        position: absolute;
        right: 128px;
        top: 236px;
        width: 560px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        opacity: 0;
      }
      .metric-card {
        min-height: 164px;
        padding: 22px 24px 18px;
        border: 1px solid rgba(10,10,10,.1);
        background: rgba(255,255,255,.58);
      }
      .metric-card.accent {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
      }
      .metric-label {
        display: block;
        font-family: Consolas, monospace;
        font-size: 16px;
        letter-spacing: .14em;
        color: inherit;
        opacity: .72;
      }
      .metric-value {
        display: block;
        margin-top: 16px;
        font-size: 76px;
        line-height: .92;
        font-weight: 300;
        letter-spacing: -.04em;
      }
      .metric-copy {
        display: block;
        margin-top: 10px;
        font-size: 24px;
        line-height: 1.4;
      }
      .headline {
        position: absolute;
        left: 128px;
        width: 900px;
        font-size: 88px;
        line-height: .96;
        font-weight: 300;
        letter-spacing: -.04em;
        opacity: 0;
      }
      .headline-a { top: 242px; }
      .headline-b { top: 238px; }
      .headline-c {
        top: 236px;
        width: 840px;
        font-size: 78px;
      }
      .headline-d { top: 242px; }
      .headline-e { top: 242px; }
      .subline {
        position: absolute;
        left: 136px;
        width: 620px;
        font-size: 28px;
        line-height: 1.62;
        color: #262626;
        opacity: 0;
      }
      .subline-a { top: 536px; }
      .subline-b { top: 534px; }
      .subline-c { top: 536px; }
      .subline-d { top: 536px; }
      .tool-grid {
        position: absolute;
        right: 128px;
        top: 224px;
        width: 760px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }
      .tool-cell {
        display: grid;
        grid-template-columns: 58px 1fr;
        align-items: center;
        min-height: 88px;
        padding: 18px 22px;
        border: 1px solid rgba(10,10,10,.1);
        background: rgba(255,255,255,.64);
        opacity: 0;
      }
      .tool-index,
      .flow-index,
      .system-node-index,
      .ledger-index {
        font-family: Consolas, monospace;
        font-size: 16px;
        letter-spacing: .16em;
        color: var(--grey-3);
      }
      .tool-name {
        font-size: 28px;
        line-height: 1.2;
      }
      .flow-wrap {
        position: absolute;
        left: 128px;
        top: 404px;
        width: 1664px;
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 18px;
      }
      .flow-step {
        position: relative;
        min-height: 214px;
        padding: 22px 22px 20px;
        border-top: 6px solid rgba(var(--accent-rgb), .18);
        border-right: 1px solid rgba(10,10,10,.08);
        border-bottom: 1px solid rgba(10,10,10,.08);
        border-left: 1px solid rgba(10,10,10,.08);
        background: rgba(255,255,255,.6);
        opacity: 0;
      }
      .flow-step::after {
        content: "";
        position: absolute;
        right: -10px;
        top: 50%;
        width: 20px;
        height: 1px;
        background: rgba(10,10,10,.14);
      }
      .flow-step:last-child::after { display: none; }
      .flow-name {
        display: block;
        margin-top: 34px;
        font-size: 48px;
        line-height: 1;
        font-weight: 300;
      }
      .flow-meta {
        position: absolute;
        left: 22px;
        bottom: 22px;
        font-family: Consolas, monospace;
        font-size: 18px;
        letter-spacing: .12em;
        color: var(--grey-3);
      }
      .flow-progress {
        position: absolute;
        left: 128px;
        top: 760px;
        width: 0;
        height: 10px;
        background: var(--accent);
        opacity: 0;
      }
      .system-panel {
        position: absolute;
        right: 128px;
        top: 226px;
        width: 760px;
        height: 572px;
        border: 1px solid rgba(10,10,10,.12);
        background: rgba(255,255,255,.56);
        opacity: 0;
      }
      .system-grid-line {
        position: absolute;
        background: rgba(10,10,10,.08);
        opacity: 0;
      }
      .system-grid-h1 { left: 40px; top: 180px; width: 680px; height: 1px; }
      .system-grid-h2 { left: 40px; top: 392px; width: 680px; height: 1px; }
      .system-grid-v1 { left: 250px; top: 40px; width: 1px; height: 492px; }
      .system-grid-v2 { left: 510px; top: 40px; width: 1px; height: 492px; }
      .system-core {
        position: absolute;
        left: 272px;
        top: 184px;
        width: 216px;
        height: 206px;
        padding: 22px;
        background: var(--accent);
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        opacity: 0;
      }
      .system-core-label {
        font-family: Consolas, monospace;
        font-size: 16px;
        letter-spacing: .16em;
        opacity: .7;
      }
      .system-core-title {
        font-size: 58px;
        line-height: .95;
        font-weight: 300;
        letter-spacing: -.04em;
      }
      .system-core-copy {
        font-size: 18px;
        line-height: 1.45;
        opacity: .86;
      }
      .system-node {
        position: absolute;
        display: grid;
        gap: 10px;
        width: 208px;
        min-height: 110px;
        padding: 18px 20px 16px;
        border: 1px solid rgba(10,10,10,.1);
        background: rgba(250,250,248,.92);
        opacity: 0;
      }
      .system-node-name {
        font-size: 34px;
        line-height: 1.06;
        font-weight: 300;
      }
      .system-0 { left: 42px; top: 56px; }
      .system-1 { left: 512px; top: 56px; }
      .system-2 { left: 42px; top: 406px; }
      .system-3 { left: 512px; top: 406px; }
      .system-link {
        position: absolute;
        background: rgba(var(--accent-rgb), .42);
        opacity: 0;
      }
      .link-0 { left: 249px; top: 150px; width: 76px; height: 1px; }
      .link-1 { left: 435px; top: 150px; width: 78px; height: 1px; }
      .link-2 { left: 249px; top: 461px; width: 76px; height: 1px; }
      .link-3 { left: 435px; top: 461px; width: 78px; height: 1px; }
      .system-note {
        position: absolute;
        left: 40px;
        bottom: 24px;
        font-family: Consolas, monospace;
        font-size: 16px;
        letter-spacing: .12em;
        color: var(--grey-3);
        opacity: 0;
      }
      .ledger-wrap {
        position: absolute;
        right: 128px;
        top: 342px;
        width: 760px;
      }
      .ledger-row {
        display: grid;
        grid-template-columns: 70px 220px 1fr;
        align-items: center;
        min-height: 122px;
        border-bottom: 1px solid rgba(10,10,10,.12);
        opacity: 0;
      }
      .ledger-name {
        font-size: 42px;
        line-height: 1;
        font-weight: 300;
      }
      .ledger-bar {
        position: relative;
        height: 14px;
        background: rgba(10,10,10,.08);
      }
      .ledger-bar i {
        display: block;
        width: 0;
        height: 100%;
        background: var(--accent);
      }
      .analysis-panel {
        position: absolute;
        left: 128px;
        top: 652px;
        width: 700px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        opacity: 0;
      }
      .analysis-card {
        min-height: 128px;
        padding: 18px 18px 16px;
        border: 1px solid rgba(10,10,10,.1);
        background: rgba(255,255,255,.62);
      }
      .analysis-card b {
        display: block;
        font-family: Consolas, monospace;
        font-size: 16px;
        letter-spacing: .14em;
        color: var(--grey-3);
        font-weight: 400;
      }
      .analysis-card span {
        display: block;
        margin-top: 20px;
        font-size: 30px;
        line-height: 1.18;
      }
      .goal-shell {
        position: absolute;
        right: 128px;
        top: 246px;
        width: 760px;
        padding-top: 26px;
        border-top: 1px solid rgba(10,10,10,.16);
        opacity: 0;
      }
      .goal-number {
        font-size: 240px;
        line-height: .88;
        font-weight: 300;
        letter-spacing: -.06em;
        color: var(--accent);
      }
      .goal-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-top: 28px;
      }
      .goal-box {
        min-height: 138px;
        padding: 18px 20px;
        border: 1px solid rgba(10,10,10,.1);
        background: rgba(255,255,255,.58);
      }
      .goal-box b {
        display: block;
        font-family: Consolas, monospace;
        font-size: 16px;
        letter-spacing: .12em;
        color: var(--grey-3);
        font-weight: 400;
      }
      .goal-box span {
        display: block;
        margin-top: 18px;
        font-size: 32px;
        line-height: 1.3;
      }
      .goal-track {
        position: absolute;
        left: 128px;
        top: 760px;
        width: 1664px;
        height: 14px;
        background: rgba(10,10,10,.08);
        opacity: 0;
      }
      .goal-fill {
        width: 0%;
        height: 100%;
        background: var(--accent);
      }
      .cta {
        position: absolute;
        left: 128px;
        top: 260px;
        width: 1480px;
        font-size: 110px;
        line-height: .96;
        letter-spacing: -.05em;
        font-weight: 300;
        opacity: 0;
      }
      .cta-note {
        position: absolute;
        left: 138px;
        top: 616px;
        width: 720px;
        padding-top: 18px;
        border-top: 1px solid rgba(10,10,10,.16);
        font-size: 30px;
        line-height: 1.6;
        color: #222;
        opacity: 0;
      }
      .cta-tag {
        position: absolute;
        right: 128px;
        top: 262px;
        width: 260px;
        height: 260px;
        border: 1px solid rgba(var(--accent-rgb), .24);
        color: var(--accent);
        display: grid;
        place-items: center;
        text-align: center;
        font-family: Consolas, monospace;
        font-size: 26px;
        line-height: 1.5;
        letter-spacing: .12em;
        opacity: 0;
      }
      .caption {
        position: absolute;
        left: 128px;
        bottom: 42px;
        max-width: 1260px;
        min-height: 82px;
        padding: 22px 30px 18px;
        border-top: 4px solid var(--accent);
        background: rgba(250,250,248,.92);
        font-size: 34px;
        line-height: 1.42;
        color: var(--ink);
        opacity: 0;
        z-index: 20;
      }
      audio { display: none; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${composition.id}" data-start="0" data-duration="${composition.duration}" data-width="${composition.width}" data-height="${composition.height}">
      <audio id="narration-audio" src="assets/audio/narration.wav" data-start="0" data-duration="${composition.duration}" data-track-index="100"></audio>
      <div class="frame-line frame-top"></div>
      <div class="frame-line frame-bottom"></div>
      <div class="frame-side frame-left"></div>
      <div class="frame-side frame-right"></div>
      <div class="accent-rail"></div>
      <div class="scan-band"></div>
      <div class="kicker">WENXUAN / AI NATIVE WORKFLOW</div>
      <div class="page-no">16:9 / MVP / 01</div>

      <div class="identity"><span class="char">文</span><span class="char">轩</span></div>
      <div class="identity-meta">
        <span>05 后</span>
        <span>大学生</span>
        <span>AI 实战者</span>
      </div>
      <div class="intro-note">介绍我自己，最重要的不是说我会多少工具，而是我正在把 AI 真正放进内容、知识和验证流程里。</div>
      <div class="metric-stack">
        <div class="metric-card accent">
          <span class="metric-label">POSITION</span>
          <span class="metric-value">AI</span>
          <span class="metric-copy">大学生 AI 实战家</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">STACK</span>
          <span class="metric-value">02</span>
          <span class="metric-copy">Obsidian + 飞书双知识库</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">METHOD</span>
          <span class="metric-value">Flow</span>
          <span class="metric-copy">不是炫技，是系统化输出</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">TARGET</span>
          <span class="metric-value">100</span>
          <span class="metric-copy">毕业前赚到 100 万</span>
        </div>
      </div>

      <div class="headline headline-a">不是收藏工具<br />是把 AI 放进<br />真实流程</div>
      <div class="subline subline-a">当工具开始接入选题、研究、写作和分发，内容就不再是临时发挥，而是可持续的生产系统。</div>
      <div class="tool-grid">${floatingToolHtml}</div>

      <div class="headline headline-b">认知生产流水线</div>
      <div class="subline subline-b">从灵感到结果，每一步都被拆成可以验证、可以复用、可以继续迭代的环节。</div>
      <div class="flow-wrap">${pipelineHtml}</div>
      <div class="flow-progress"></div>

      <div class="headline headline-c">工具开始围绕<br />系统运转</div>
      <div class="subline subline-c">真正有价值的，不是单个工具很酷，而是它们在一个统一工作流里各司其职。</div>
      <div class="system-panel">
        <div class="system-grid-line system-grid-h1"></div>
        <div class="system-grid-line system-grid-h2"></div>
        <div class="system-grid-line system-grid-v1"></div>
        <div class="system-grid-line system-grid-v2"></div>
        <div class="system-link link-0"></div>
        <div class="system-link link-1"></div>
        <div class="system-link link-2"></div>
        <div class="system-link link-3"></div>
        <div class="system-core">
          <span class="system-core-label">CORE</span>
          <span class="system-core-title">AI Native<br />Workflow</span>
          <span class="system-core-copy">A system that turns tools into output.</span>
        </div>
        ${systemHtml}
        <div class="system-note">ONE ACCENT / ONE GRID / ONE SYSTEM</div>
      </div>

      <div class="headline headline-d">普通人的加速器</div>
      <div class="subline subline-d">AI 不是装饰性的技术名词，它应该直接作用在判断、产出和验证上。</div>
      <div class="ledger-wrap">${accelHtml}</div>
      <div class="analysis-panel">
        <div class="analysis-card"><b>OBSERVE</b><span>先理解行业，再决定切入口。</span></div>
        <div class="analysis-card"><b>ANALYZE</b><span>把经验拆成可以复用的流程。</span></div>
        <div class="analysis-card"><b>VERIFY</b><span>用作品和结果去验证机会。</span></div>
      </div>

      <div class="headline headline-e">毕业前赚到 100 万</div>
      <div class="goal-shell">
        <div class="goal-number">0 万</div>
        <div class="goal-meta">
          <div class="goal-box"><b>QUESTION</b><span>普通大学生，能不能靠 AI、技术和持续输出，真正把这条路跑通。</span></div>
          <div class="goal-box"><b>METHOD</b><span>持续公开验证流程，持续展示能力，持续积累内容资产。</span></div>
        </div>
      </div>
      <div class="goal-track"><div class="goal-fill"></div></div>

      <div class="cta">关注我<br />看我怎么用 AI 把路跑通</div>
      <div class="cta-note">我会继续拆解流程、公开验证、把能复用的方法做成真正可执行的系统。</div>
      <div class="cta-tag">FOLLOW<br />THE PROCESS</div>

      ${captionHtml}
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });

      tl.to(".frame-line,.frame-side", { opacity: 1, duration: .9, ease: "power2.out" }, 0);
      tl.to(".accent-rail", { opacity: 1, width: 620, duration: 1.2, ease: "power3.out" }, .12);
      tl.to(".scan-band", { x: 2260, duration: 7.2, ease: "power1.inOut" }, 0);
      tl.fromTo(".kicker,.page-no", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .75, stagger: .08 }, .18);

      tl.fromTo(".identity", { opacity: 0, y: 50, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power4.out" }, .55);
      tl.fromTo(".identity .char", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .75, stagger: .08, ease: "power3.out" }, .6);
      tl.fromTo(".identity-meta span", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, stagger: .08, ease: "power2.out" }, 1.2);
      tl.fromTo(".intro-note", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out" }, 1.45);
      tl.fromTo(".metric-card", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, stagger: .08, ease: "power3.out" }, 1.55);
      tl.to(".identity,.identity-meta,.intro-note,.metric-card", { opacity: 0, y: -24, duration: .65, stagger: .02, ease: "power2.in" }, 6.3);

      tl.fromTo(".headline-a", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: .8, ease: "power4.out" }, 7);
      tl.fromTo(".subline-a", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .65 }, 7.6);
      tl.fromTo(".tool-cell", { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: .06, duration: .45, ease: "power2.out" }, 8);
      tl.to(".tool-cell", { backgroundColor: "rgba(255,255,255,.82)", borderColor: "rgba(0,47,167,.22)", stagger: .06, duration: .5 }, 10.1);
      tl.to(".tool-cell", { x: (i) => (i % 2 === 0 ? -18 : 18), duration: 1.3, stagger: .02, ease: "power1.inOut", yoyo: true, repeat: 1 }, 11.2);
      tl.to(".headline-a,.subline-a,.tool-cell", { opacity: 0, y: -24, duration: .65, stagger: .02, ease: "power2.in" }, 15.2);

      tl.fromTo(".headline-b", { opacity: 0, x: -44 }, { opacity: 1, x: 0, duration: .8, ease: "power4.out" }, 16);
      tl.fromTo(".subline-b", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .65 }, 16.55);
      tl.fromTo(".flow-step", { opacity: 0, y: 26 }, { opacity: 1, y: 0, stagger: .18, duration: .52, ease: "power3.out" }, 17.1);
      tl.to(".flow-progress", { opacity: 1, width: 1664, duration: 8.8, ease: "none" }, 17.4);
      tl.to(".flow-step", { borderTopColor: "rgba(0,47,167,.9)", stagger: 1.22, duration: .2, yoyo: true, repeat: 1 }, 18.2);
      tl.to(".headline-b,.subline-b,.flow-step,.flow-progress", { opacity: 0, y: -22, duration: .65, stagger: .015 }, 27.35);

      tl.fromTo(".headline-c", { opacity: 0, x: -46 }, { opacity: 1, x: 0, duration: .78, ease: "power4.out" }, 28);
      tl.fromTo(".subline-c", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .65 }, 28.55);
      tl.fromTo(".system-panel", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out" }, 28.8);
      tl.fromTo(".system-grid-line,.system-link", { opacity: 0, scaleX: 0, transformOrigin: "left center" }, { opacity: 1, scaleX: 1, stagger: .05, duration: .42, ease: "power3.out" }, 29.1);
      tl.fromTo(".system-core", { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .62, ease: "power3.out" }, 29.45);
      tl.fromTo(".system-node", { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: .1, duration: .45, ease: "power2.out" }, 29.7);
      tl.fromTo(".system-note", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .45 }, 30.4);
      tl.to(".system-node", { x: (i) => (i % 2 === 0 ? 10 : -10), y: (i) => (i < 2 ? -8 : 8), duration: 2.4, stagger: .03, ease: "power1.inOut", yoyo: true, repeat: 1 }, 31.4);
      tl.to(".headline-c,.subline-c,.system-panel,.system-core,.system-node,.system-grid-line,.system-link,.system-note", { opacity: 0, y: -18, duration: .75, stagger: .01 }, 41.2);

      tl.fromTo(".headline-d", { opacity: 0, x: -42 }, { opacity: 1, x: 0, duration: .78, ease: "power4.out" }, 42);
      tl.fromTo(".subline-d", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .65 }, 42.55);
      tl.fromTo(".ledger-row", { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: .16, duration: .48, ease: "power2.out" }, 43.05);
      tl.to(".ledger-0 .ledger-bar i", { width: "88%", duration: 2, ease: "power2.out" }, 43.5);
      tl.to(".ledger-1 .ledger-bar i", { width: "76%", duration: 2, ease: "power2.out" }, 43.8);
      tl.to(".ledger-2 .ledger-bar i", { width: "92%", duration: 2.1, ease: "power2.out" }, 44.1);
      tl.fromTo(".analysis-panel", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .65, ease: "power3.out" }, 45);
      tl.to(".headline-d,.subline-d,.ledger-row,.analysis-panel", { opacity: 0, y: -20, duration: .7, stagger: .015 }, 53.2);

      tl.fromTo(".headline-e", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: .8, ease: "power4.out" }, 54);
      tl.fromTo(".goal-shell", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .68 }, 54.55);
      tl.fromTo(".goal-track", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .55 }, 55);
      tl.to(".goal-fill", { width: "100%", duration: 7.6, ease: "power2.inOut" }, 55.25);
      tl.to({ value: 0 }, { value: 100, duration: 7.2, ease: "power2.out", onUpdate: function() { document.querySelector(".goal-number").textContent = Math.round(this.targets()[0].value) + " 万"; } }, 55.35);
      tl.to(".headline-e,.goal-shell,.goal-track", { opacity: 0, y: -24, duration: .72 }, 63.2);

      tl.fromTo(".cta", { opacity: 0, y: 42, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power4.out" }, 64);
      tl.fromTo(".cta-note", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7 }, 64.7);
      tl.fromTo(".cta-tag", { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .72, ease: "power3.out" }, 64.8);
      tl.to(".accent-rail", { width: 1664, duration: 2.8, ease: "power2.inOut" }, 64.1);

      const captions = ${JSON.stringify(scriptLines)};
      captions.forEach((cap, index) => {
        tl.fromTo(".cap-" + index, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3 }, cap.start + .1);
        tl.to(".cap-" + index, { opacity: 0, y: -8, duration: .26 }, cap.end - .34);
      });

      window.__timelines["main"] = tl;
    </script>
  </body>
</html>`;

await writeFile("index.html", html, "utf8");
