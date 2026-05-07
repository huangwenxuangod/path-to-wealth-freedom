export type Scene = {
  start: number;
  duration: number;
  label: string;
  title: string;
  caption: string;
  keywords: string[];
};

export type VideoContent = {
  creator: string;
  positioning: string;
  hook: string;
  thesis: string;
  videoPath: string | null;
  faceSafeZone: 'center-top' | 'left-top' | 'right-top';
  durationInFrames: number;
  scenes: Scene[];
  cta: string;
};

export const demoContent: VideoContent = {
  creator: '车干',
  positioning: '大学生 AI 实战家',
  hook: '所有人都在用 AI 提速，我反而关掉了它',
  thesis: 'AI 最适合做执行，但判断力不能外包。',
  videoPath: null,
  faceSafeZone: 'center-top',
  durationInFrames: 30 * 15,
  scenes: [
    {
      start: 96,
      duration: 96,
      label: '01 / 反常识开场',
      title: '不是工具越多，成长越快',
      caption: '我曾经以为，只要 AI 用得够多，我就会进步得更快。',
      keywords: ['反常识', '真实经历', '判断力'],
    },
    {
      start: 192,
      duration: 96,
      label: '02 / 个人经历',
      title: 'AI 给了我更多答案，也偷走了我的选择',
      caption: '我让 AI 生成选题、标题、脚本，但越生成越不敢发。',
      keywords: ['选题', '表达', '暴露感'],
    },
    {
      start: 288,
      duration: 84,
      label: '03 / 方法论',
      title: '真正稀缺的是判断后果的能力',
      caption: '能被 AI 加速的是执行，不能被替代的是你愿意承担什么。',
      keywords: ['承担', '取舍', '人格化'],
    },
    {
      start: 372,
      duration: 78,
      label: '04 / 结尾收束',
      title: '把 AI 当发动机，别把方向盘交出去',
      caption: '如果你也在用 AI 做个人 IP，先练判断，再谈提速。',
      keywords: ['AI 原生', '个人 IP', '毕业前 100 万'],
    },
  ],
  cta: '关注我，看一个大学生如何用 AI 从 0 打造个人 IP',
};
