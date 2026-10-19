import type {SlotSpec} from '../../library/warm-desk/Slot';

/**
 * ep27 要用的真实素材。
 * - WORKS / THUMBS：从 out/ 往期成片里切出来的，已经就位。
 * - SLOTS：用户补的录屏和截图（原件在 claude-video/materials/07-暖纸工作台风/01-Opus做视频-完整版/assets/素材清单/），已转成 jpg / 30fps 静音 mp4 放进 public/<file>；清单见 materials/07-暖纸工作台风/01-Opus做视频-完整版/素材清单.md
 */
const F = 'footage/ep27-opus-video-full';

export const HOST = `${F}/host-1.12x.mp4`;

/** 往期爆款片段（各 5 秒，静音，960×540） */
export const WORKS: {file: string; title: string; style: string}[] = [
  {file: `${F}/works/ep23-wheat-chessboard.mp4`, title: '棋盘上的麦粒', style: '暗金文献风'},
  {file: `${F}/works/ep24-birthday-paradox.mp4`, title: '生日悖论', style: '暗金文献风'},
  {file: `${F}/works/ep25-behind-cover.mp4`, title: '躲进掩体，还被打死？', style: '战术屏科普风'},
  {file: `${F}/works/ep20-nvidia-history.mp4`, title: '英伟达 33 年', style: 'Vox 拼贴'},
];

/** 工程里内置的往期视频截帧（缩略图墙） */
export const THUMBS = ['ep03-cc', 'ep09-prompt', 'ep11-mcp', 'ep12-skill', 'ep18-ai-history', 'ep19-apple-history', 'ep20-nvidia-history', 'ep21-nobel-physics', 'ep22-nobel-chemistry', 'ep23-wheat-chessboard', 'ep24-birthday-paradox', 'ep25-behind-cover'].map((e) => `${F}/thumbs/${e}.jpg`);

const S = `${F}/slots`;

/** S08 录屏里标注好「字体太小了，帮我放大」的那一帧（原录屏 18.5 秒，裁出框选区域），放在「截图给它」的对话卡里 */
export const ANNOTATED = `${F}/slots/s08-annotated.jpg`;
export const SLOTS = {
  remotion: {id: 'S01', kind: 'image', need: 'Remotion GitHub 首页截图', file: `${S}/s01-remotion.jpg`, ready: true},
  hyperframes: {id: 'S02', kind: 'image', need: 'HyperFrames GitHub 首页截图', file: `${S}/s02-hyperframes.jpg`, ready: true},
  claudeCode: {id: 'S03', kind: 'image', need: 'Claude Code 终端界面截图（Opus 5.5）', file: `${S}/s03-claude-code.jpg`, ready: true},
  repo: {id: 'S04', kind: 'image', need: 'GitHub 仓库 weilanx-claude-videos 页面截图', file: `${S}/s04-repo.jpg`, ready: true},
  site: {id: 'S05', kind: 'image', need: '网站上那条参考视频（橘猫）的页面截图', file: `${S}/s05-site.jpg`, ready: true},
  distill: {id: 'S06', kind: 'video', need: 'Claude Code 里跑 distill-video Skill 的录屏', file: `${S}/s06-distill.mp4`, note: '原录屏 2–17 秒，3 倍速，5 秒', ready: true},
  newStyle: {id: 'S07', kind: 'video', need: '蒸馏出来的新风格成片（橘猫案卷）', file: `${S}/s07-new-style.mp4`, note: '原片 2.5–12.5 秒，1.5 倍速，6.7 秒', ready: true},
  screenshotFix: {id: 'S08', kind: 'video', need: '在 Studio 截图标注、发给 Agent 修改的录屏', file: `${S}/s08-screenshot-fix.mp4`, note: '原录屏 0–20 秒，2 倍速，10 秒', ready: true},
} satisfies Record<string, SlotSpec>;
